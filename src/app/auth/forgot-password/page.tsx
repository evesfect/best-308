"use client";

import { useState } from 'react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-700">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg px-8 py-10">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Forgot Password</h1>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300 font-semibold"
          >
            Send Recovery Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
