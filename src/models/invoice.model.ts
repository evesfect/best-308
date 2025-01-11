import { Schema, model, models } from 'mongoose';

const invoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true },
  date: { type: Date, required: true },
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  items: { type: Array, required: true },
  totalAmount: { type: Number, required: true },
  pdfBuffer: { type: Buffer, required: true },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  collection: 'invoice', // Specifies the collection name
});

// Use the existing model if it exists, otherwise compile a new one
export const Invoice = models.Invoice || model('Invoice', invoiceSchema, 'invoice');
export default Invoice;
