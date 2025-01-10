import { ObjectId } from 'mongodb';

export interface Refund {
    _id: ObjectId;
    order_id: ObjectId;
    user_id: ObjectId;
    products: Map<ObjectId, number>;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: Date;
    processedDate?: Date;
    refundAmount: number;
}