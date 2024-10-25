import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Retrieve the token from the request using next-auth's getToken method
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token, redirect to login page
  if (!token) {
    console.log('No token found. Redirecting to /auth/signin');
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Define role-based access control pages
  const productManagerPages = ['/product-mgr'];
  const salesManagerPages = ['/sales-mgr'];
  
  // Retrieve the user's role from the token
  const userRole = token.role; // Ensure the token has the role
  
  console.log(`User role: ${userRole}`);
  console.log(`Accessing path: ${req.nextUrl.pathname}`);

  // Restrict Product Manager access
  if (productManagerPages.some(page => req.nextUrl.pathname.startsWith(page)) && userRole !== 'product_manager') {
    console.log('Unauthorized access to Product Manager pages');
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // Restrict Sales Manager access
  if (salesManagerPages.some(page => req.nextUrl.pathname.startsWith(page)) && userRole !== 'sales_manager') {
    console.log('Unauthorized access to Sales Manager pages');
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // If authorized, allow the request to proceed
  return NextResponse.next();
}

// Apply the middleware to the specified routes and all their subroutes
export const config = {
  matcher: ['/product-mgr/:path*', '/sales-mgr/:path*'], // Ensures all subpaths are matched
};
