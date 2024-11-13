// best-308/src/models/shoppingcart.model.ts

import { Schema, model, Types } from 'mongoose';
import { ShoppingCart as ShoppingCartType } from '../types/shopping-cart';

// Define the ShoppingCart schema
const ShoppingCartSchema = new Schema<ShoppingCartType>({
  userId: { type: Types.ObjectId, required: true }, // Reference to User
  items: [
    {
      processedProductId: { type: Types.ObjectId, ref: 'ProcessedProduct', required: true }, // Reference to ProcessedProduct
    },
  ],
  updatedAt: { type: Date, default: Date.now }, // Track the last update
});

// Define the model
const ShoppingCart = model('ShoppingCart', ShoppingCartSchema, 'shoppingcart');
export default ShoppingCart;
