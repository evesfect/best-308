import { ObjectId} from 'mongoose';

// Define the User type/interface for TypeScript
export interface ShoppingCart {
    userId: ObjectId;
    _id?: ObjectId;
    items: [
      {
        processedProductId: ObjectId;
      },
    ];
    updatedAt?: Date;
  }