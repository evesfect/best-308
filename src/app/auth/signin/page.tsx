"use client";

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';
import { Libre_Baskerville } from 'next/font/google';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if both email and password fields are filled
    if (!email || !password) {
      setError('Please fill in both the email and password fields.');
      return;
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/',
    });

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
      window.location.href = result?.url || '/';
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="relative w-full h-[600px]">
        <Image
          src="/images/signin-signup.jpg"
          alt="Sign In Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="absolute w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className={`text-4xl font-bold text-center mb-6 text-gray-900 ${libreBaskerville.className}`}>
          Sign In
        </h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input
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
      </div>
    </div>
  );
};

export default SignInPage;