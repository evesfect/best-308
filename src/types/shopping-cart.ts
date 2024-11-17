import { ObjectId } from 'mongoose';

// Define the ShoppingCart type/interface for TypeScript
export interface ShoppingCart {
  userId: ObjectId;
  _id?: ObjectId;
  items: {
    processedProductId: ObjectId; // Reference to the product
    size: string; // Added size field
    color: string; // Added color field
    quantity: number; // Added quantity field
  }[];
  updatedAt?: Date; // Optional updatedAt field
  createdAt?: Date; // Optional createdAt field for timestamps
}
