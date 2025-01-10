import { Schema, model, Types, models } from 'mongoose';
import { Wishlist as WishlistType } from '@/types/wishlist';

const wishlistItemSchema = new Schema({
  productId: { type: Types.ObjectId, ref: 'Product', required: true },
  size: String,     // Optional field without required
  color: String,    // Optional field without required
}, { 
  _id: false        // Prevents creating separate IDs for each item
});

const wishlistSchema = new Schema<WishlistType>({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  items: [wishlistItemSchema]
}, {
  timestamps: true
});

// Delete existing model if it exists (in development)
if (process.env.NODE_ENV === 'development' && models.Wishlist) {
  delete models.Wishlist;
}

const Wishlist = models.Wishlist || model<WishlistType>('Wishlist', wishlistSchema);

export default Wishlist;


