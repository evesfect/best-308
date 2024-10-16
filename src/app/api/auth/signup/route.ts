import { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

let client: MongoClient;

async function connectToDatabase() {
  if (!client) {
    client = await MongoClient.connect('mongodb://root:rpassword@localhost:27017/e-commerce?authSource=admin', {
      maxPoolSize: 10,
    });
  }
  return client.db();
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, password, username } = data;

    // Check if all fields are provided
    if (!email || !password || !username) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Connect to the database
    const db = await connectToDatabase();
    const usersCollection = db.collection('user');

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists.' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create a new user
    const newUser = {
      email,
      password: hashedPassword,
      username,
      role: 'user', // You can customize the default role here
    };

    // Insert the new user into the database
    await usersCollection.insertOne(newUser);

    return NextResponse.json({ message: 'User created successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Error during user signup:', error);
    return NextResponse.json({ message: 'Failed to create user.' }, { status: 500 });
  }
}
