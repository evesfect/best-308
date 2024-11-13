// src/models/processed-product.model.ts
import mongoose from 'mongoose';

const processedProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageId: { type: String, required: true },
    salePrice: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true },
}, { timestamps: true }); // Adds createdAt and updatedAt


// Check if the model already exists to avoid redefinition
const ProcessedProduct = mongoose.models.ProcessedProduct || mongoose.model('ProcessedProduct', processedProductSchema);

export default ProcessedProduct;