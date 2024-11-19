"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg px-8 py-10">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Reset Password</h1>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your new password"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Confirm your new password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
