// lib/mongodb.ts
import mongoose, { Connection } from 'mongoose';
import { Db, GridFSBucket } from 'mongodb';

const MONGO_URI = 'mongodb://root:rpassword@localhost:27017/e-commerce?authSource=admin';

declare global {
    var _mongooseConnectionPromise: Promise<Connection> | undefined;
    var _gridFSBucket: GridFSBucket | undefined;
}

let connectionPromise: Promise<Connection>;
let gridFSBucket: GridFSBucket;

if (!global._mongooseConnectionPromise) {
    global._mongooseConnectionPromise = mongoose.connect(MONGO_URI).then((mongooseInstance) => {
        console.log('Connected to MongoDB');

        // Initialize GridFSBucket
        gridFSBucket = new mongoose.mongo.GridFSBucket(mongooseInstance.connection.db as Db, {
            bucketName: 'product_images',
        });
        global._gridFSBucket = gridFSBucket;

        return mongooseInstance.connection;
    }).catch((err) => {
        console.error('MongoDB connection error:', err);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        throw err;
    });
}

// Assign the connection promise and bucket globally
connectionPromise = global._mongooseConnectionPromise;
gridFSBucket = global._gridFSBucket!;

export { connectionPromise as default, gridFSBucket };
