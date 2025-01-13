import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';

// Import the refund model
import Refund from '@/models/refund.model';
import ProcessedProduct from "@/models/processed-product.model";
import Product from "@/models/product.model";

export async function GET(req: NextRequest) {
  try {
    await connectionPromise;
    console.log("Database connected successfully");

    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    console.log("Query parameters:", { startDate, endDate });

    let filter = {};

    if (startDate || endDate) {
      if (startDate && isNaN(Date.parse(startDate))) {
        return NextResponse.json({ message: 'Invalid startDate format. Use ISO 8601 format.' }, { status: 400 });
      }
      if (endDate && isNaN(Date.parse(endDate))) {
        return NextResponse.json({ message: 'Invalid endDate format. Use ISO 8601 format.' }, { status: 400 });
      }
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return NextResponse.json({ message: 'startDate cannot be after endDate.' }, { status: 400 });
      }

      filter = {
        requestDate: {
          ...(startDate ? { $gte: new Date(`${startDate}T00:00:00.000Z`) } : {}),
          ...(endDate ? { $lte: new Date(`${endDate}T23:59:59.999Z`) } : {}),
        },
      };
      

      console.log("Constructed filter for query:", filter);
    }

    const refunds = await Refund.find(filter).sort({ requestDate: 1 });

    console.log("Refund fetched count:", refunds.length);
    refunds.forEach(refund => console.log("Fetched refund requestDate:", refund.requestDate));

    if (refunds.length === 0) {
      console.log("No refunds found for the given date range.");
    }

    return NextResponse.json(refunds);

  } catch (error) {
    console.error("Error fetching refunds:", error);
    return NextResponse.json({ message: 'Error fetching refunds', error: (error as Error).toString() }, { status: 500 });
  }
}


interface StatusUpdateRequest {
    _id: string;
    status: 'pending' | 'approved' | 'rejected';
  }

export async function POST(req: Request) {
  try {
    const body: StatusUpdateRequest = await req.json();
    console.log('Received status update request:', body);

    if (!body || !body._id || !body.status) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    await connectionPromise;

    const validStatuses: StatusUpdateRequest['status'][] = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
    }

    let refundId;
    try {
      refundId = new mongoose.Types.ObjectId(body._id);
    } catch {
      return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
    }

    const existingRefund = await Refund.findById(refundId);

    if (!existingRefund) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    existingRefund.status = body.status;
    existingRefund.updatedAt = new Date();

    const updatedOrder = await existingRefund.save();
    console.log('Updated refund order:', updatedOrder);

    if (body.status === 'approved') {
      console.log('Refund approved. Updating stock quantities...');

      const products = updatedOrder.products;
      for (const [processedProductId] of products.entries()) {
        // Fetch ProcessedProduct
        const processedProduct = await ProcessedProduct.findById(processedProductId);
        const quantity = processedProduct.quantity;
        const size = processedProduct.size;
        if (!processedProduct) {
          console.error(`ProcessedProduct not found for ID: ${processedProductId}`);
          continue;
        }

        // Fetch Product using productId from ProcessedProduct
        const product = await Product.findById(processedProduct.productId);
        console.log("product:",product);
        console.log("processedProduct:",processedProduct);

        if (!product) {
          console.error(`Product not found for ID: ${processedProduct.productId}`);
          continue;
        }

        product.available_stock.set(size, product.available_stock.get(size) + quantity);
        // Save the updated product
        await product.save();
        console.log(`Updated stock for Product ID: ${product._id}, Size: ${size}, Quantity: ${quantity}`);
      }
    }

    return NextResponse.json(
        { message: 'Order status updated successfully', order: updatedOrder },
        { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
        { message: 'Error updating order status', error: error instanceof Error ? error.message : String(error) },
        { status: 500 }
    );
  }
}
