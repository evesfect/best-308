// never remove path of this file
///src/models/product.model.ts

import { Schema, model, models } from 'mongoose';
import { Product as ProductType } from '../types/product';  // Import the TypeScript type

const productSchema = new Schema<ProductType>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    sex: { type: String, required: true },
    category: { type: String, required: true },
    costPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    total_stock: {
        type: Map,
        of: Number,
        required: true
    },
    available_stock: {
        type: Map,
        of: Number,
        required: true
    },
    inStock: { type: Boolean, required: true },
    quantity: { type: Number, required: true },
    imageId: { type: String, required: true },
    sizes: { type: [String], required: true },
    colors: { type: [String], required: true },
}, {
    timestamps: true
});

const Product = models.Product || model<ProductType>('Product', productSchema, 'product');
export default Product;
