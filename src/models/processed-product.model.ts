import {Schema, model, models} from 'mongoose';
import {ProcessedProductType } from '@/types/processed-product';

const processedProductSchema = new Schema<ProcessedProductType>({
    name: { type: String, required: true },
    imageId: { type: String, required: true },
    salePrice: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    productId: {type: String, required: false}
}, {
    timestamps: true
});

const ProcessedProduct = models.ProcessedProduct || model<ProcessedProductType>('ProcessedProduct', processedProductSchema,'processedProduct');
export default ProcessedProduct;