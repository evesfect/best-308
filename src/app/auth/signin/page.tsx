"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignInPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl: '/',
        });

        if (result?.error) {
            setError('Invalid email or password');
        } else {
            window.location.href = result?.url || '/';
        }
    };

    const goToShoppingPage = () => {
        router.push('/shop/browse'); // Navigate to the shopping page
    };

    const goToSignUpPage = () => {
        router.push('/auth/signup'); // Navigate to the sign-up page (adjust the path as necessary)
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Sign In</h1>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleSignIn} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
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
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Sign in
                </button>
                <button
                    type="button"
                    onClick={goToShoppingPage}
                    className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-300 mt-4"
                >
                    Go to Shopping
                </button>
                <button
                    type="button"
                    onClick={goToSignUpPage}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 mt-4"
                >
                    Sign up
                </button>
            </form>
        </div>
    );
};

export default SignInPage;
