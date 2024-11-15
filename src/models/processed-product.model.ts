// src/models/processed-product.model.ts
import mongoose from 'mongoose';
import { Schema, model, models } from 'mongoose';
import { ProcessedProduct as ProcessedProductType } from '../types/processed-product';

const processedProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageId: { type: String, required: true },
    salePrice: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true },
}, { timestamps: true }); // Adds createdAt and updatedAt


const ProcessedProduct = models.ProcessedProduct || model<ProcessedProductType>('ProcessedProduct', processedProductSchema);

export default ProcessedProduct;