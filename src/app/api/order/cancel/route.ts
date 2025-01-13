import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectionPromise from "@/lib/mongodb";
import Order from "@/models/order.model"; // Assuming Order model is defined
import ProcessedProduct from "@/models/processed-product.model";
import Product from "@/models/product.model";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Received cancellation request:", body);

        if (!body || !body.order) {
            return NextResponse.json(
                { message: "Invalid request body. Order is required." },
                { status: 400 }
            );
        }

        const order = body.order;

        // Ensure database connection
        await connectionPromise;

        // Fetch the order
        const existingOrder = await Order.findById(order._id);

        if (!existingOrder) {
            return NextResponse.json(
                { message: "Order not found." },
                { status: 404 }
            );
        }

        if (existingOrder.status === "cancelled") {
            return NextResponse.json(
                { message: "Order is already cancelled." },
                { status: 400 }
            );
        }

        // Update order status to cancelled
        existingOrder.status = "cancelled";
        await existingOrder.save();
        console.log("Order status updated to cancelled:", existingOrder._id);

        // Adjust stock for each processed product in the order
        const processedProducts = order.products;
        for (const [processedProductId, quantity] of Object.entries(processedProducts)) {
            // Fetch the processed product
            const processedProduct = await ProcessedProduct.findById(processedProductId);
            console.log("processedProduct:",processedProduct);
            if (!processedProduct) {
                console.error(`ProcessedProduct not found for ID: ${processedProductId}`);
                continue;
            }

            // Fetch the associated product
            const product = await Product.findById(processedProduct.productId);
            if (!product) {
                console.error(`Product not found for ID: ${processedProduct.productId}`);
                continue;
            }

            // Update stock for the specific size
            const size = processedProduct.size;
            console.log("got:",product.available_stock.get(size));
            if (!product.available_stock.get(size)) {
                console.error(
                    `Size ${size} not found in available_stock for Product ID: ${product._id}`
                );
                continue;
            }

            product.available_stock.set(size,product.available_stock.get(size) + quantity); // Increase stock
            await product.save();
            console.log(
                `Updated stock for Product ID: ${product._id}, Size: ${size}, Quantity: ${quantity}`
            );
        }

        return NextResponse.json(
            { message: "Order cancelled successfully", order: existingOrder },
            { status: 200 }
        );
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { message: "Error cancelling order", error: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}