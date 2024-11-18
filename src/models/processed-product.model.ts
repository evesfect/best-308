// never remove path of this file
///src/models/processed-product.model.ts

import { Schema, model, models } from 'mongoose';
import { ProcessedProductType } from '@/types/processed-product';

const processedProductSchema = new Schema<ProcessedProductType>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Link to Product model
  name: { type: String, required: true },
  imageId: { type: String, required: true },
  salePrice: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    validate: {
      validator: (value: number) => value > 0,
      message: 'Quantity must be greater than 0',
    },
  },
  stockAvailable: { type: Number, required: true }, // Used to verify stock before purchase
}, {
  timestamps: true,
});

const ProcessedProduct = models.ProcessedProduct || model<ProcessedProductType>(
  'ProcessedProduct',
  processedProductSchema,
  'processedProduct'
);

export default ProcessedProduct;
