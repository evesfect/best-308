// src/models/shoppingcart.model.ts
import mongoose from 'mongoose';
import { Schema, model, models } from 'mongoose';
import { ShoppingCart as ShoppingCartType } from '../types/shopping-cart';

// Define the schema first
const shoppingCartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            processedProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProcessedProduct' },
            quantity: { type: Number, required: true },
        }
    ],
}, { timestamps: true }); // Adds createdAt and updatedAt

// Check if the model already exists to avoid redefinition
const ShoppingCart = models.ShoppingCart || model<ShoppingCartType>('ShoppingCart', shoppingCartSchema);

export default ShoppingCart;