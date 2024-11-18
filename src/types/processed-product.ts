// never remove path of this file
///src/types/processed-product.ts

import { ObjectId } from 'mongoose';

export interface ProcessedProductType {
  _id: ObjectId;
  name: string; // Product name
  salePrice: number; // Price per item
  quantity: number; // Quantity in the cart
  imageId: string; // Reference to product image
  size: string; // Size variant of the product
  color: string; // Color variant of the product
  productId: ObjectId; // Reference to the original Product
  stockAvailable: number; // Stock availability for this variant
}


