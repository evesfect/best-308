import { ObjectId } from 'mongodb';

export interface Category{
    _id:ObjectId;
    name:string;
    image:string;    
} 