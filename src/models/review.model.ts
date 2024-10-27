import mongoose, { Schema, Document } from 'mongoose';

// Define the Mongoose Review schema
const reviewSchema = new Schema({
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    user: { type: String, required: true },
    product_id: { type: String, required: true },
},{
    timestamps : true
});

// Define the Review interface for TypeScript with Document
export interface IReview extends Document {
    comment: string;
    rating: number;
    user: string;
    product_id: string;
}

export const ReviewModel = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema, 'review');
