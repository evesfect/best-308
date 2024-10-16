"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, username: email }), // Add username or any other data you want to capture
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up.');
      }

      // On successful signup, redirect to login or homepage
      router.push('/auth/signin');
    } catch (err) {
      setError('Failed to sign up. Please try again.');
    }
  };


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sign Up</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSignUp} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
