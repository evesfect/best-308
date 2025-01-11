import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';

// Import the refund model
import Refund from '@/models/refund.model';

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
