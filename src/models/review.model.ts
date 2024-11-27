import mongoose, { Schema, model } from 'mongoose';
import { Review as ReviewType } from '../types/review';

const reviewSchema = new Schema<ReviewType>({
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference to User
    product_id: { type: Schema.Types.ObjectId, required: true, ref: 'Product' }, // Reference to Product
    approved: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema, "review");
export default Review;
