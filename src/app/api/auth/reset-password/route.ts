import { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

let client: MongoClient;

async function connectToDatabase() {
  if (!client) {
    client = await MongoClient.connect('mongodb+srv://root:rpassword@cluster0.rz8bd.mongodb.net/e-commerce?retryWrites=true&w=majority', {
      maxPoolSize: 10,
    });
  }
  return client.db();
}

export async function POST(req: Request) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json({ message: 'Invalid input.' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('user');

    // Find the user with the token and email
    const user = await usersCollection.findOne({ email, resetToken: token });

    if (!user || user.tokenExpiration < new Date()) {
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12);

    // Update user password and clear reset token
    await usersCollection.updateOne(
      { email },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", tokenExpiration: "" },
      }
    );

    return NextResponse.json({ message: 'Password reset successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ message: 'Failed to reset password.' }, { status: 500 });
  }
}
