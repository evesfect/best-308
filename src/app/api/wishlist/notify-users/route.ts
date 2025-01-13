import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import Product from '@/models/product.model';

export async function POST(req: Request) {
    try {
        const { productId } = await req.json();
        console.log('Received notification request for productId:', productId);

        if (!productId) {
            return NextResponse.json({
                error: 'Product ID is required'
            }, { status: 400 });
        }

        // Use relative URL instead of environment variable
        const getUsersResponse = await fetch(`http://localhost:3000/api/wishlist/get-users?productId=${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        const userData = await getUsersResponse.json();
        console.log('Received user data:', userData);

        if (!userData.emails || userData.emails.length === 0) {
            console.log('No emails found in userData');
            return NextResponse.json({
                message: 'No users found with this product in wishlist'
            }, { status: 404 });
        }

        const emails = userData.emails;
        console.log('Preparing to send emails to:', emails);

        await connectionPromise;

        // Find the product to get its name
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ 
                error: 'Product not found' 
            }, { status: 404 });
        }

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'ecommercebest308@gmail.com',
                pass: 'heac mosf eurq nppd',
            },
        });

        // Prepare the email details
        const mailOptions = emails.map(email => ({
            to: email,
            subject: 'Product Discount Alert!',
            html: `
                <p>Hello!</p>
                <p>Great news! The product "${product.name}" in your wishlist is now on discount!</p>
                <p>Don't miss out on this great deal - check it out now!</p>
                <a href="http://localhost:3000/products/${productId}">View Product</a>
            `,
        }));

        // Send emails in parallel
        await Promise.all(mailOptions.map(options => transporter.sendMail(options)));

        return NextResponse.json({
            message: 'Discount notification emails sent successfully.'
        }, { status: 200 });

    } catch (error) {
        console.error("Error sending discount notification:", error);
        return NextResponse.json(
            { error: "Failed to send discount notifications" },
            { status: 500 }
        );
    }
}