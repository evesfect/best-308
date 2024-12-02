import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CartItem } from '@/types/cart';
declare module 'jspdf' {
  interface jsPDF {
      autoTable: (options: any) => jsPDF;
  }
}

interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  customerDetails: {
    name: string;
    email: string;
    address?: string;
  };
  items: CartItem[];
  totalAmount: number;
}

export const generateInvoicePDF = (data: InvoiceData): Buffer => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(20);
    doc.text('BEST 308 E-COMMERCE', doc.internal.pageSize.width / 2, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('INVOICE', doc.internal.pageSize.width / 2, 30, { align: 'center' });

    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${data.invoiceNumber}`, 20, 50);
    doc.text(`Date: ${data.date.toLocaleDateString()}`, 20, 60);

    // Add customer details
    doc.text('Bill To:', 20, 80);
    doc.text(data.customerDetails.name, 20, 90);
    doc.text(data.customerDetails.email, 20, 100);
    if (data.customerDetails.address) {
      doc.text(data.customerDetails.address, 20, 110);
    }

    // Create table for items
    const tableData = data.items.map(item => [
      item.name,
      item.size,
      item.color,
      item.quantity.toString(),
      `$${parseFloat(item.salePrice).toFixed(2)}`,
      `$${(parseFloat(item.salePrice) * item.quantity).toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 120,
      head: [['Product', 'Size', 'Color', 'Qty', 'Price', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [66, 66, 66] }
    });

    // Add total
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.text(`Total Amount: $${data.totalAmount.toFixed(2)}`, 150, finalY + 20);

    // Add footer
    doc.setFontSize(10);
    doc.text('Thank you for shopping with us!', doc.internal.pageSize.width / 2, finalY + 40, { align: 'center' });
    doc.text('For any questions, please contact support at ecommercebest308@gmail.com', 
      doc.internal.pageSize.width / 2, finalY + 50, { align: 'center' });

    // Convert to Buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
  } catch (error: any) {
    console.error('Error generating invoice:', error);
    throw new Error(`PDF Generation Error: ${error.message}`);
  }
};