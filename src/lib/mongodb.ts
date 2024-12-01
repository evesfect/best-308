import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

const MONGO_URI = "mongodb+srv://root:rpassword@cluster0.rz8bd.mongodb.net/e-commerce?retryWrites=true&w=majority";

if (!process.env.MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable');
}

declare global {
    var mongooseConnection: Promise<typeof mongoose> | undefined;
    var gridFSBucket: GridFSBucket | undefined;
}

let gridFSBucket: GridFSBucket | undefined;

if (!global.mongooseConnection) {
    global.mongooseConnection = mongoose
        .connect(MONGO_URI)
        .then((mongooseInstance) => {
            console.log("MongoDB connected successfully");

            if (!global.gridFSBucket) {
                global.gridFSBucket = new GridFSBucket(mongooseInstance.connection.db, {
                    bucketName: 'product_images', // Updated bucket name
                });
                console.log("GridFSBucket initialized with bucketName: product_images");
            }

            return mongooseInstance;
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB:", err);
            throw err;
        });
}

gridFSBucket = global.gridFSBucket;

export { gridFSBucket };
export default global.mongooseConnection;
