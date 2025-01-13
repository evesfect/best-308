import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import nodemailer from 'nodemailer';

// Import the refund model
import Refund from '@/models/refund.model';
import ProcessedProduct from "@/models/processed-product.model";
import Product from "@/models/product.model";
import User from '@/models/user.model';

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
      return NextResponse.json({ message: 'Invalid refund ID' }, { status: 400 });
    }

    const existingRefund = await Refund.findById(refundId);

    if (!existingRefund) {
      return NextResponse.json({ message: 'Refund request not found' }, { status: 404 });
    }

    // Fetch user details
    const user = await User.findById(existingRefund.user_id);
    if (!user || !user.email) {
      console.error('User not found or no email available for user_id:', existingRefund.user_id);
      return NextResponse.json({ message: 'User email not found' }, { status: 404 });
    }

    existingRefund.status = body.status;
    existingRefund.updatedAt = new Date();

    const updatedRefund = await existingRefund.save();

    // Configure email transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ecommercebest308@gmail.com',
        pass: 'heac mosf eurq nppd',
      },
    });

    // Send email notification
    try {
      const emailSubject = `Refund Request ${body.status.charAt(0).toUpperCase() + body.status.slice(1)}`;
      let emailContent = '';

      if (body.status === 'approved') {
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4CAF50;">Your Refund Request Has Been Approved</h1>
            <p>Dear ${user.username},</p>
            <p>We're pleased to inform you that your refund request has been approved. The refund will be processed according to your original payment method.</p>
            <p><strong>Refund Reference:</strong> ${updatedRefund._id}</p>
            <p><strong>Status:</strong> Approved</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p>The refund amount will be credited to your original payment method within 5-7 business days.</p>
            <p>Thank you for your patience and understanding.</p>
            <p>Best regards,<br>BEST Store</p>
          </div>
        `;
      } else if (body.status === 'rejected') {
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f44336;">Update on Your Refund Request</h1>
            <p>Dear ${user.username},</p>
            <p>We regret to inform you that your refund request has been declined.</p>
            <p><strong>Refund Reference:</strong> ${updatedRefund._id}</p>
            <p><strong>Status:</strong> Rejected</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p>If you have any questions about this decision or need further clarification, please don't hesitate to contact our customer support team.</p>
            <p>Best regards,<br>BEST Store</p>
          </div>
        `;
      }

      if (emailContent) {
        await transporter.sendMail({
          from: '"ecommercebest>',
          to: user.email,
          subject: emailSubject,
          html: emailContent,
        });
        console.log('Refund status email sent successfully to:', user.email);
      }
    } catch (emailError) {
      console.error('Error sending refund status email:', emailError);
      // Continue processing even if email fails
    }

    // Update stock if refund is approved
    if (body.status === 'approved') {
      console.log('Refund approved. Updating stock quantities...');
      const products = updatedRefund.products;
      for (const [processedProductId] of products.entries()) {
        const processedProduct = await ProcessedProduct.findById(processedProductId);
        if (!processedProduct) {
          console.error(`ProcessedProduct not found for ID: ${processedProductId}`);
          continue;
        }

        const product = await Product.findById(processedProduct.productId);
        if (!product) {
          console.error(`Product not found for ID: ${processedProduct.productId}`);
          continue;
        }

        const quantity = processedProduct.quantity;
        const size = processedProduct.size;
        
        product.available_stock.set(size, product.available_stock.get(size) + quantity);
        await product.save();
        console.log(`Updated stock for Product ID: ${product._id}, Size: ${size}, Quantity: ${quantity}`);
      }
    }

    return NextResponse.json(
      { message: 'Refund status updated successfully', refund: updatedRefund },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { message: 'Error updating refund status', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
