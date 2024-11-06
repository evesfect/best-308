import { Schema, model } from 'mongoose';
import { User as UserType } from '../types/user';

// Define the User schema
const userSchema = new Schema<UserType>({
  _id: { type: Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  address: { type: String, required: true },
  shoppingCart: { type: [Schema.Types.ObjectId], ref: 'Product', required: false },
  wishlist: { type: [Schema.Types.ObjectId], ref: 'Product', required: false }
}, 
{
  timestamps: true
});

// Add the addToCart method to the schema
userSchema.methods.addToCart = async function (productId: string) {
  this.shoppingCart.push(productId);
  await this.save();
};

const User = model<UserType>('User', userSchema, "user");
export default User;
