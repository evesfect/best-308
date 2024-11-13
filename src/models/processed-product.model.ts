import { Schema, model, models } from 'mongoose';
import { ProcessedProduct as ProcessedProductType } from '../types/processed-product';

const ProcessedProductSchema = new Schema<ProcessedProductType>({
    name: { type: String, required: true },
    imageId: { type: String, required: true },
    salePrice : { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true }
}, {
    timestamps: true
});

const ProcessedProduct = models.ProcessedProduct || model<ProcessedProductType>('ProcessedProduct', ProcessedProductSchema, 'processedproduct');
export default ProcessedProduct;
