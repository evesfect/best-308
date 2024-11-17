  import { Schema, model, Types, models } from 'mongoose';
  import { ShoppingCart as ShoppingCartType } from '../types/shopping-cart';

  const shoppingCartSchema = new Schema<ShoppingCartType>({
    userId: { type: Types.ObjectId, required: true }, // Reference to User
    items: [
      {
        processedProductId: { type: Types.ObjectId, ref: 'ProcessedProduct', required: true }, // Correct reference to ProcessedProduct
      },
    ],
    updatedAt: { type: Date, default: Date.now } // Track the last update
  });

  // Register the model correctly
  const ShoppingCart = models.ShoppingCart || model<ShoppingCartType>('ShoppingCart', shoppingCartSchema, 'shoppingCart');
  export default ShoppingCart;
