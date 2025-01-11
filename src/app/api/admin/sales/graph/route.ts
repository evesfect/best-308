import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectionPromise from '@/lib/mongodb';
import Invoice from '@/models/invoice.model';
import Refund from '@/models/refund.model';

export async function GET(req: NextRequest) {
    try {
      await connectionPromise;
      console.log("Database connected successfully");
  
      const url = new URL(req.url);
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');
  
      console.log("Query parameters:", { startDate, endDate });
  
      let filter0 = {};
      let filter1 = {};
  
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
  
        filter0 = {
          date: {
            ...(startDate ? { $gte: new Date(`${startDate}T00:00:00Z`) } : {}),
            ...(endDate ? { $lte: new Date(`${endDate}T23:59:59Z`) } : {}),
          },
        };

        filter1 = {
            requestDate: {
              ...(startDate ? { $gte: new Date(`${startDate}T00:00:00Z`) } : {}),
              ...(endDate ? { $lte: new Date(`${endDate}T23:59:59Z`) } : {}),
            },
          };
      }
  
      const invoices = await Invoice.find(filter0).sort({ date: 1 });
      const refunds = await Refund.find(filter1).sort({ requestDate: 1 });
  
      console.log(`Invoices fetched: ${invoices.length}, Refunds fetched: ${refunds.length}`);
  
      const totalRevenue = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.totalAmount.toFixed(2)), 0);
      const totalRefunds = refunds.reduce((sum, refund) => sum + parseFloat(refund.refundAmount.toFixed(2)), 0);
  
      const revenueData = invoices.map((invoice) => ({
        date: invoice.date.toISOString().split('T')[0],
        revenue: parseFloat(invoice.totalAmount.toFixed(2)),
      }));
  
      const refundData = refunds.map((refund) => ({
        date: refund.requestDate.toISOString().split('T')[0],
        refund: parseFloat(refund.refundAmount.toFixed(2)),
      }));
  
      const combinedData: { [key: string]: { revenue: number; refunds: number } } = {};
      revenueData.forEach((entry) => {
        combinedData[entry.date] = { revenue: entry.revenue, refunds: 0 };
      });
  
      refundData.forEach((entry) => {
        if (!combinedData[entry.date]) {
          combinedData[entry.date] = { revenue: 0, refunds: entry.refund };
        } else {
          combinedData[entry.date].refunds += entry.refund;
        }
      });
  
      const chartData = Object.entries(combinedData).map(([date, values]) => ({
        date,
        netRevenue: values.revenue - values.refunds,
      }));
  
      console.log("Final chart data:", chartData);
  
      const summary = {
        totalRevenue: totalRevenue.toFixed(2),
        totalRefunds: totalRefunds.toFixed(2),
        netRevenue: (totalRevenue - totalRefunds).toFixed(2),
      };
  
      return NextResponse.json({ chartData, summary });
    } catch (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json(
        { message: 'Error fetching data', error: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  }
  