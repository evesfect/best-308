import { Schema,model} from 'mongoose';
import { Order as OrderType } from '../types/order';

const orderSchema = new Schema<OrderType>({
    products: { 
        type: Map,
        of: Number,
        required: true
    },
    user_id: { type: Schema.Types.ObjectId, required: true },
    address: { type: String, required: true },
    completed: {type: Boolean, required: true},
    date: {type: Date,required: true}
},{
    timestamps : true
});


export const Order = model<OrderType>('Order', orderSchema, 'order');
export default Order;
