import { Schema, model, models } from 'mongoose';
import { Product as ProductType } from '../types/product';  // Import the TypeScript type

const productSchema = new Schema<ProductType>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
}, {
    timestamps: true  // Automatically manages createdAt and updatedAt
});

// Check if the 'Product' model exists, otherwise define it
const Product = models.Product || model<ProductType>('Product', productSchema, 'product');
export default Product;
