//best-308/src/models/user.model.ts

import { Schema, model } from 'mongoose';
import { User as UserType } from '../types/user';

// Define the User schema
const userSchema = new Schema<UserType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  address: { type: String, required: true },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],  // Added wishlist field with reference to Product
}, 
{
  timestamps: true
});

const User = model<UserType>('User', userSchema, 'user');
export default User;
