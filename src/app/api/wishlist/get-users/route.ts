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

    // Find all wishlist items containing the productId
    const wishlistItems = await Wishlist.find({ 
      products: productId 
    }).select('userId');

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
