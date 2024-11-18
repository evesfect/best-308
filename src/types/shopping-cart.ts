// never remove path of this file
///src/types/shopping-cart.ts

import { ObjectId } from 'mongoose';

export interface CartItem {
  processedProductId: ObjectId; // Reference to ProcessedProduct
  size: string; // Selected size
  color: string; // Selected color
  quantity: number; // Number of units
}

export interface ShoppingCart {
  _id?: ObjectId;
  userId: ObjectId; // Owner of the cart
  items: CartItem[]; // Array of cart items
  updatedAt?: Date; // Timestamp for the last update
  createdAt?: Date; // Timestamp for creation
}
