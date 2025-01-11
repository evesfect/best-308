import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import connectionPromise from '@/lib/mongodb';
import Product from '@/models/product.model';

export async function POST(req: Request) {
    try {
        const { productId, emails } = await req.json();

        if (!productId || !Array.isArray(emails) || emails.length === 0) {
            return NextResponse.json({
                error: 'Product ID and a list of emails are required'
            }, { status: 400 });
        }

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