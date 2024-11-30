import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://root:rpassword@cluster0.rz8bd.mongodb.net/e-commerce?retryWrites=true&w=majority";

if (!process.env.MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

declare global {
  var mongooseConnection: Promise<typeof mongoose> | undefined;
}

if (!global.mongooseConnection) {
  global.mongooseConnection = mongoose.connect(MONGO_URI).then((mongooseInstance) => {
    console.log("MongoDB connected successfully");
    return mongooseInstance;
  }).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  });
}

export default global.mongooseConnection;
