import { Schema, model, models } from 'mongoose';
import { Product as ProductType } from '../types/product';  // Import the TypeScript type

const productSchema = new Schema<ProductType>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
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
}, {
    timestamps: true
});

const Product = models.Product || model<ProductType>('Product', productSchema, 'product');
export default Product;
