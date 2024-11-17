import { Schema, model, Types, models } from 'mongoose';
import { ShoppingCart as ShoppingCartType } from '../types/shopping-cart';

const shoppingCartSchema = new Schema<ShoppingCartType>(
  {
    userId: { type: Types.ObjectId, required: true },
    items: [
      {
        processedProductId: { type: Types.ObjectId, ref: 'ProcessedProduct', required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const ShoppingCart = models.ShoppingCart || model<ShoppingCartType>('ShoppingCart', shoppingCartSchema, 'shoppingCart');
export default ShoppingCart;
