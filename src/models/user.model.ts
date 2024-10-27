import { Schema, model } from 'mongoose';
import { User as UserType } from '../types/user';  // Import the User type from the types folder

// Define the User schema
const userSchema = new Schema<UserType>({
    _id: { type: Schema.Types.ObjectId, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    address:{type: String, required:true },
}, {
    timestamps: true
});

const User = model<UserType>('User', userSchema, "user");
export default User;
