import { Schema, model } from 'mongoose';
import { Review as ReviewType } from '../types/review';

const reviewSchema = new Schema<ReviewType>({
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference to User
    product_id: { type: Schema.Types.ObjectId, required: true, ref: 'Product' }, // Reference to Product
}, {
    timestamps: true
});

export const Review = model<ReviewType>('Review', reviewSchema, 'review');
export default Review;
