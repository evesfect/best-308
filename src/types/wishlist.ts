

import { ObjectId } from 'mongoose';

export interface WishlistItem {
  productId: ObjectId;
  size: string;
  color: string;
}

export interface Wishlist {
  _id?: ObjectId;
  userId: ObjectId;
  items: WishlistItem[];
  updatedAt?: Date;
  createdAt?: Date;
}



