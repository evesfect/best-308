import { NextResponse } from "next/server";
import connectionPromise from '@/lib/mongodb';
import Wishlist from '@/models/wishlist.model';
import User from '@/models/user.model';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    console.log('=== GET USERS DEBUG ===');
    console.log('1. Received productId:', productId);

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectionPromise;
    console.log('2. Database connected');

    // Find wishlist items
    const wishlistItems = await Wishlist.find({
      "items.productId": productId,
    });
    console.log('3. Found wishlist items:', JSON.stringify(wishlistItems, null, 2));

    if (!wishlistItems.length) {
      console.log('No wishlist items found');
      return NextResponse.json(
        { message: "No users found for the provided product ID." },
        { status: 404 }
      );
    }

    // Get unique user IDs from wishlist items
    const userIds = [...new Set(wishlistItems.map(item => item.userId))];
    console.log('4. Unique User IDs:', userIds);

    // Find users with these IDs
    const users = await User.find({
      _id: { $in: userIds }
    }, 'email'); // Only fetch email field
    console.log('5. Found users:', JSON.stringify(users, null, 2));

    // Extract emails
    const emails = users.map(user => user.email).filter(Boolean);
    console.log('6. Final extracted emails:', emails);

    if (!emails.length) {
      return NextResponse.json(
        { message: "No valid emails found for users." },
        { status: 404 }
      );
    }

    return NextResponse.json({ emails }, { status: 200 });

  } catch (error) {
    console.error("Error fetching wishlist users:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist users", details: (error as Error).message },
      { status: 500 }
    );
  }
}
