import { ObjectId } from 'mongodb';

export interface Order {
    _id: ObjectId;
    products: Map<ObjectId, number>;
    user_id: ObjectId;
    address : string;
    completed: boolean;
    date: Date;
<<<<<<< HEAD
    status:string;
=======
    status: string;
>>>>>>> e5a8bb878888451ef8259815aa1b809d956b90a6
}
