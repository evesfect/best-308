import { Schema,model} from 'mongoose';
import { Order as OrderType } from '../types/order';

// Define the Mongoose Review schema
const orderSchema = new Schema<OrderType>({
    products: { type: String, required: true },
    user_id: { type: String, required: true },
    address: { type: String, required: true },
    completed: {type: Boolean, required: true}
},{
    timestamps : true
});


export const Order = model<OrderType>('Order', orderSchema, 'order');
export default Order;
