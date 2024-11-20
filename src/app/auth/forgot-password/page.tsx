// src/app/auth/forgot-password/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Libre_Baskerville } from 'next/font/google';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send recovery email.');
      }

      setMessage('Recovery email sent. Please check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send recovery email.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="relative w-full h-[600px]">
        <Image
          src="/images/signin-signup.jpg"
          alt="Forgot Password Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="absolute w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className={`text-4xl font-bold text-center mb-6 text-gray-900 ${libreBaskerville.className}`}>
          Forgot Password
        </h1>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Send Recovery Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
