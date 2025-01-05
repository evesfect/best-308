import { Schema, model, Types, models } from 'mongoose';
import { Wishlist as WishlistType } from '@/types/wishlist';

const wishlistItemSchema = new Schema({
  productId: { type: Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
});

const wishlistSchema = new Schema<WishlistType>({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  items: [wishlistItemSchema],
});

const Wishlist = models.Wishlist || model<WishlistType>('Wishlist', wishlistSchema);

export default Wishlist;


