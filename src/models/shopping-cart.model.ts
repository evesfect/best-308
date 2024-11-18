// never remove path of this file
///src/models/shopping-cart.model.ts

import { Schema, model, Types, models } from 'mongoose';
import { ShoppingCart as ShoppingCartType } from '@/types/shopping-cart';

const cartItemSchema = new Schema(
  {
    processedProductId: { type: Types.ObjectId, ref: 'ProcessedProduct', required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      validate: {
        validator: (value: number) => value > 0,
        message: 'Quantity must be greater than 0',
      },
    },
  },
  { _id: false } // Prevent Mongoose from auto-generating _id for sub-documents
);

const shoppingCartSchema = new Schema<ShoppingCartType>(
  {
    userId: { type: Types.ObjectId, required: true }, // Link to the user
    items: [cartItemSchema], // Embedded array of cart items
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const ShoppingCart = models.ShoppingCart || model<ShoppingCartType>(
  'ShoppingCart',
  shoppingCartSchema,
  'shoppingCart'
);

export default ShoppingCart;
