import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'; // Use next-auth's getToken to check for the session

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If there is no token, redirect to the login page with a message parameter
  if (!token) {
    const loginUrl = new URL('/auth/signin', req.url);
    loginUrl.searchParams.set('message', 'login_required');
    return NextResponse.redirect(loginUrl);
  }

  // If the user is not an admin, redirect to an unauthorized page
  if (token.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Apply middleware to all /admin routes
};
