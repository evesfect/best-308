import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectionPromise from '@/lib/mongodb'
import User from '@/models/user.model'

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

    const { email } = await req.json();

    // Validate email
    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    await connectionPromise;
    console.log("Using Model",User);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'No user found with this email address.' }, { status: 404 });
    }

    // Generate a reset token and expiration time
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = new Date(Date.now() + 1000 * 60 * 60); // Token expires in 1 hour

    // Update user with reset token and expiration
    await User.updateOne(
      { email },
      { $set: { resetToken, tokenExpiration } }
    );

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email provider
      auth: {
        user: 'ecommercebest308@gmail.com',
        pass: 'heac mosf eurq nppd',
      },
    });

    // Construct reset URL
    const resetUrl = `http://localhost:3000/auth/reset-password?token=${resetToken}&email=${email}`;
    

    // Send email
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Please click the link below to reset it:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json({ message: 'Password reset email sent.' }, { status: 200 });
  } catch (error) {
    console.error('Error during password recovery:', error);
    return NextResponse.json({ message: 'Failed to send recovery email.' }, { status: 500 });
  }
}
