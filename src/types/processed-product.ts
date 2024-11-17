    import { ObjectId } from 'mongoose';

    // Define the Product interface for TypeScript
    export interface ProcessedProductType {
        _id: ObjectId;
        name: string;
        salePrice: number;
        quantity: number;
        imageId: string;
        size: string;
        color: string;
        productId: string;
    }

