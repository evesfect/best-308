import { ObjectId } from 'mongodb';

// Define the Review interface for TypeScript
export interface Review {
    _id: ObjectId;       // Unique identifier for the review
    comment: string;     // Review comment text
    rating: number;      // Rating for the product, e.g., from 1 to 5
    user: string;        // ID of the user who made the review
    product_id: string;  // ID of the product being reviewed
}
