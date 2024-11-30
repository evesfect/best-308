import { NextResponse } from 'next/server';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';
import { sendEmail } from '@/utils/emailUtil';
import { CartItem } from '@/types/cart';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    console.log('=== Invoice Generation Started ===');
    
    // Log the raw request
    const rawBody = await req.json();
    console.log('Request body received:', rawBody);

    const { items, totalAmount, customerDetails } = rawBody;

    // Validate required fields
    if (!items || !Array.isArray(items)) {
      console.error('Invalid or missing items array');
      return NextResponse.json({ error: 'Invalid items data' }, { status: 400 });
    }

    if (typeof totalAmount !== 'number') {
      console.error('Invalid or missing totalAmount:', totalAmount);
      return NextResponse.json({ error: 'Invalid total amount' }, { status: 400 });
    }

    if (!customerDetails?.email) {
      console.error('Missing customer email:', customerDetails);
      return NextResponse.json({ error: 'Customer email is required' }, { status: 400 });
    }

    // Generate invoice number
    const invoiceNumber = `INV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    console.log('Generated invoice number:', invoiceNumber);

    const date = new Date();
    console.log('Invoice date:', date);

    // Log invoice data before PDF generation
    console.log('Preparing PDF generation with data:', {
      invoiceNumber,
      date,
      customerDetails,
      itemCount: items.length,
      totalAmount
    });

    try {
      // Generate PDF
      const pdfBuffer = generateInvoicePDF({
        invoiceNumber,
        date,
        customerDetails,
        items,
        totalAmount,
      });
      console.log('PDF generated successfully, buffer size:', pdfBuffer.length);

      // Attempt to send email
      console.log('Attempting to send email to:', customerDetails.email);
      await sendEmail({
        to: customerDetails.email,
        subject: `Invoice #${invoiceNumber} for your order`,
        html: `
          <h1>Thank you for your order!</h1>
          <p>Your invoice is attached to this email.</p>
          <p>Order Details:</p>
          <ul>
            ${items.map((item: CartItem) => `
              <li>${item.name} - ${item.size} - ${item.color} x${item.quantity} - $${item.salePrice}</li>
            `).join('')}
          </ul>
          <p>Total Amount: $${totalAmount.toFixed(2)}</p>
        `,
      });
      console.log('Email sent successfully');

      // Return PDF
      console.log('=== Invoice Generation Completed Successfully ===');
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=invoice-${invoiceNumber}.pdf`,
        },
      });
    } catch (innerError) {
      console.error('Inner operation failed:', innerError);
      throw innerError; // Re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error('=== Invoice Generation Failed ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to generate invoice',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}