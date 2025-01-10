import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';

// Import the Order model
import Refund from '@/models/refund.model';

export async function GET(req: NextRequest) {
  try {
    // Establish database connection
    await connectionPromise;
    console.log("Database connected successfully");

    const db = mongoose.connection.db;
    if (!db) {
      console.error("Database connection is undefined");
      return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
    }

    // Check if the 'order' collection exists
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    if (!collections.some(c => c.name === 'refund')) {
      console.error("The 'order' collection does not exist in the database");
      return NextResponse.json({ message: 'Order collection not found' }, { status: 500 });
    }

    // Fetch all orders
    const refund = await Refund.find();
    console.log("refund fetched:", refund.length);

    if (refund.length === 0) {
      console.log("No orders found in the database.");
    }

    // Respond with the fetched orders
    return NextResponse.json(refund);

  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: 'Error fetching orders', error: error.toString() }, { status: 500 });
  }
}

interface StatusUpdateRequest {
    _id: string;
    status: 'pending' | 'approved' | 'rejected';
  }
  
  export async function POST(req: Request) {
    try {
      // Log the incoming request body for debugging
      const body: StatusUpdateRequest = await req.json();
      console.log('Received status update request:', body);
  
      // Validate basic request structure
      if (!body) {
        console.error('No request body received');
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
      }
  
      if (!body._id) {
        console.error('Order ID is missing');
        return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
      }
  
      if (!body.status) {
        console.error('Status is missing');
        return NextResponse.json({ message: 'Status is required' }, { status: 400 });
      }
  
      // Ensure connection to database
      await connectionPromise;
  
      // Validate the status value
      const validStatuses: StatusUpdateRequest['status'][] = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(body.status)) {
        console.error('Invalid status');
        return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
      }
  
      // Convert ID to MongoDB ObjectId
      let refundId;
      try {
        refundId = new mongoose.Types.ObjectId(body._id);
      } catch (idError) {
        console.error('Invalid order ID format', idError);
        return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
      }
  
      // Find the order by ID
      const existingRefund = await Refund.findById(refundId);
  
      if (!existingRefund) {
        console.error('Order not found', body._id);
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }
  
      // Update the order status
      existingRefund.status = body.status;
      existingRefund.lastModified = new Date(); // Update lastModified field
  
      const updatedOrder = await existingRefund.save();
  
      return NextResponse.json(
        { message: 'Order status updated successfully', order: updatedOrder },
        { status: 200 }
      );
  
    } catch (error) {
      // Log the full error for server-side debugging
      console.error('Unexpected error in order status update:', error);
  
      return NextResponse.json(
        { message: 'Error updating order status', error: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  }
