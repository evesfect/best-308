// src/app/auth/signin/page.tsx

"use client";

import { useState, useRef } from 'react';
import { signIn, useSession, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';
import { Libre_Baskerville } from 'next/font/google';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const SignInPage = () => {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Remove required attribute validation and handle it manually
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password fields.');

      return;
    }

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/',
      });

      console.log('Sign in successful:', result);

      if (result?.error) {
        // Handle different error cases based on the error message from the backend
        if (result.error === 'USER_NOT_FOUND') {
          setError('No account found with this email address.');
        } else if (result.error === 'INCORRECT_PASSWORD') {
          setError('The password you entered is incorrect. Please try again.');
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        const updatedSession = await getSession();
        console.log('Updated session:', updatedSession);
        
        const localCart = localStorage.getItem('cart');
        console.log('Local cart data:', localCart);
        
        if (localCart && updatedSession?.user?.id) {
          const cartItems = JSON.parse(localCart);
          console.log('Parsed cart items:', cartItems);
          console.log('User ID from session:', updatedSession.user.id);

          // Add each item to cart individually
          for (const item of cartItems) {
            try {
              const response = await fetch('/api/cart/add-to-cart', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: updatedSession.user.id,
                  productId: item.productId,
                  size: item.size,
                  color: item.color,
                  quantity: item.quantity || 1
                }),
              });

              console.log(`Add to cart response for item ${item.productId}:`, response.status);
              const responseData = await response.json();
              console.log(`Add to cart response data for item ${item.productId}:`, responseData);

              if (!response.ok) {
                throw new Error(responseData.error || 'Failed to add item to cart');
              }
            } catch (error) {
              console.error(`Error adding item ${item.productId} to cart:`, error);
            }
          }

          // Clear local cart after all items have been added
          localStorage.removeItem('cart');
          console.log('Local cart cleared');
        }
        
        window.location.href = result?.url || '/';
      }
    } catch (error) {
      console.error('Error during sign in process:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  };

  useEffect(() => {
    if (message === 'login_required') {
      alert('You need to log in to access this page.');
    }
  }, [message]);

  const goToSignUpPage = () => {
    router.push('/auth/signup');
  };

  const goToForgotPasswordPage = () => {
    router.push('/auth/forgot-password');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="relative w-full h-[600px]">
        <Image
          src="/images/signin-signup.jpg"
          alt="Sign In Background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="absolute w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className={`text-4xl font-bold text-center mb-6 text-gray-900 ${libreBaskerville.className}`}>
          Sign In
        </h1>
        {error && <p className="text-red-600 mb-4 text-center" role="alert">{error}</p>}
        <form onSubmit={handleSignIn} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={goToSignUpPage}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 mt-4"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={goToForgotPasswordPage}
            className="text-blue-600 hover:underline"
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
