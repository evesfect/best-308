import { NextRequest, NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import Invoice from '@/models/invoice.model';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectionPromise;

    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: 'Invoice ID is required' }, { status: 400 });
    }

    console.log(`Fetching invoice with ID: ${id}`);

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }

    if (!invoice.pdfBuffer) {
      return NextResponse.json({ message: 'Invoice PDF not found' }, { status: 404 });
    }

    console.log(`Invoice found: ${invoice.invoiceNumber}`);

    return new NextResponse(invoice.pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`,
      },
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { message: 'Failed to fetch invoice', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
