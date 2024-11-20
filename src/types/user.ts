import { ObjectId } from 'mongodb';
import { Document, Types } from 'mongoose';
import { Product } from './product'; // Assuming you have a `product.ts` type defined

// Define the User type/interface for TypeScript
export interface User extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: string;
  address: string;
  resetToken?: string; // Optional reset token for password recovery
  tokenExpiration?: Date; // Expiration date for reset token
  isEmailVerified: boolean; // Email verification status
  emailVerificationToken?: string; // Optional email verification token
  createdAt?: Date; // Automatically added by Mongoose
  updatedAt?: Date; // Automatically added by Mongoose
  wishlist: Array<ObjectId | Product>; // Wishlist containing product references

}
