import { Schema, model, models } from 'mongoose';
import { Refund as RefundType } from '../types/refund';

const refundSchema = new Schema<RefundType>({
    order_id: { type: Schema.Types.ObjectId, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    products: {
        type: Map,
        of: Number,
        required: true,
    },
    reason: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    requestDate: { type: Date, default: Date.now },
    processedDate: { type: Date },
    refundAmount: { type: Number, required: true }
}, {
    timestamps: true
});

export const Refund = models.Refund || model<RefundType>('Refund', refundSchema);
export default Refund;
