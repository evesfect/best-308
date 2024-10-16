import mongoose, { Connection } from 'mongoose';

const MONGO_URI = 'mongodb://root:rpassword@localhost:27017/e-commerce?authSource=admin';


declare global {
    // eslint-disable-next-line no-var
    var _mongooseConnectionPromise: Promise<Connection> | undefined;
}

let connectionPromise: Promise<Connection>;

if (!global._mongooseConnectionPromise) {
    global._mongooseConnectionPromise = mongoose.connect(MONGO_URI).then((mongooseInstance) => {
        console.log('Connected to MongoDB');
        return mongooseInstance.connection;
    }).catch((err) => {
        console.error('MongoDB connection error:', err);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);  // Exit the process if in production and the connection fails
        }
        throw err;  // Ensure error bubbles up in non-production environments
    });
}

// Set the connection promise to the global variable
connectionPromise = global._mongooseConnectionPromise;

export default connectionPromise;

