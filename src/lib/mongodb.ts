import { MongoClient } from 'mongodb';

const uri = 'mongodb://root:rpassword@localhost:27017/e-commerce?authSource=admin';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    if (!(global as any)._mongoClientPromise) {
        client = new MongoClient(uri);
        (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
} else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;
