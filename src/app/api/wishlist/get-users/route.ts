import { NextResponse } from "next/server";
import connectionPromise from '@/lib/mongodb';
import Wishlist from '@/models/wishlist.model';

export async function GET(request: Request) {
  try {
    // Get productId from URL search params
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectionPromise;

    // Query for wishlist items that contain the productId in the items array
    const wishlistItems = await Wishlist.find({
      "items.productId": productId, // Query inside the items array
    }).select('userId'); // Only return the userId field

    if (!wishlistItems.length) {
      return NextResponse.json(
          { message: "No users found for the provided product ID." },
          { status: 404 }
      );
    }

    // Extract user IDs from the wishlist items
    const userIds = wishlistItems.map(item => item.userId);

    return NextResponse.json({ userIds }, { status: 200 });

  } catch (error) {
    console.error("Error fetching wishlist users:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist users" },
      { status: 500 }
    );
  }
}
