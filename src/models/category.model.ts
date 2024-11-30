import mongoose, { Schema, model, models } from 'mongoose';
import { Category as CategoryType } from '../types/category';

const categorySchema = new Schema<CategoryType>({
    name: {type: String, required: true},
    image: {type: String, required: true}
},  {
    timestamps:true
});

const Category = models.Category || model('Category', categorySchema, 'category');
export default Category;