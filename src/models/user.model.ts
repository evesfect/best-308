//best-308/src/models/user.model.ts

import {Schema, model, models} from 'mongoose';
import { User as UserType } from '../types/user';

// Define the User schema
const userSchema = new Schema<UserType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
  },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, required: true },
  address: { type: String, required: true },
  resetToken: { type: String, required: false },
  tokenExpiration: { type: Date, required: false },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, required: false },
},
{
  timestamps: true,
});

const User = models.User || model<UserType>('User', userSchema, 'user');
export default User;
