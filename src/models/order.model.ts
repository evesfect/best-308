import { Schema, model, models } from 'mongoose';
import { Order as OrderType } from '../types/order';

const orderSchema = new Schema<OrderType>({
    products: {
        type: Map,
        of: Number,
        required: true,
    },
    user_id: { type: Schema.Types.ObjectId, required: true },
    address: { type: String, required: true },
<<<<<<< HEAD
    completed: { type: Boolean, required: true },
    date: { type: Date, required: true },
    status: { type: String, required: true },
}, {
    timestamps: true,
=======
    completed: {type: Boolean, required: true},
    date: {type: Date,required: true},
    status: {type: String, required: true},
},{
    timestamps : true
>>>>>>> e5a8bb878888451ef8259815aa1b809d956b90a6
});

// Use the existing model if it exists, otherwise compile a new one
export const Order = models.Order || model<OrderType>('Order', orderSchema, 'order');
export default Order;
