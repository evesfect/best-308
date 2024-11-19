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
    <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={handleForgotPassword} className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold text-center mb-4">Forgot Password</h1>
        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div>
          <label className="block text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white mt-4 py-2 rounded hover:bg-blue-600"
        >
          Send Recovery Email
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
