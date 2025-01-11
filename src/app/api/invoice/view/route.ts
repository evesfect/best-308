import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import Invoice from '@/models/invoice.model';

export async function GET(req: NextRequest) {
  try {
    await connectionPromise;
    console.log("Database connected successfully");

    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    console.log("Query parameters:", { startDate, endDate });

    let filter = {};

    // Check if both dates are provided and valid
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
      
        // Correct filter construction for the `date` field
        filter = {
          date: {
            ...(startDate ? { $gte: new Date(startDate) } : {}),
            ...(endDate ? { $lte: new Date(endDate) } : {}),
          },
        };
      }
      

    // Fetch invoices based on the filter
    const invoices = await Invoice.find(filter).sort({ createdAt: 1 });
    console.log("Invoices fetched:", invoices.length);

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { message: 'Error fetching invoices', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
