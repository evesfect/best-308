///best-308/src/types/user.ts

import { ObjectId} from 'mongodb';
import { Document, Types } from 'mongoose';
import { Role } from './roles';

// Define the User type/interface for TypeScript
export interface User extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    role: string;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
  
    // Define addToCart method
    addToCart: (productId: string) => Promise<void>;
  }