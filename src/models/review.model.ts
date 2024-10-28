import { Schema, model, Types } from 'mongoose';
import { Review as ReviewType } from '../types/review';

// Define the Mongoose Review schema
const reviewSchema = new Schema<ReviewType>({
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    user_id: { type: Schema.Types.ObjectId, required: true },
    product_id: { type: Schema.Types.ObjectId, required: true },
},{
    timestamps : true
});


export const Review = model<ReviewType>('Review', reviewSchema, 'review');
export default Review;
