import { ObjectId } from 'mongodb';
import { Role } from './roles';

// Define the User type/interface for TypeScript
export interface User {
    _id: ObjectId;
    username: string;
    email: string;
    password: string; // Hashed password
    role: Role;
    address: string
}
