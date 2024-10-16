"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold">Welcome to Our E-commerce Store</h1>
        <p className="mt-4 text-xl">Discover the best products at unbeatable prices</p>
        <div className="mt-8">
          
            <button
              onClick={() => router.push('/shop/browse')}
              className="bg-white text-blue-600 py-3 px-8 rounded-lg shadow-lg font-bold hover:bg-gray-200 transition duration-300"
            >
              Start Shopping
            </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Shop with Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Wide Selection of Products</h3>
              <p className="text-gray-600">Explore a diverse range of products to meet all your needs.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Fast and Free Shipping</h3>
              <p className="text-gray-600">Get your products delivered to your doorstep quickly and with no extra cost.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">24/7 Customer Support</h3>
              <p className="text-gray-600">Our team is available around the clock to assist you with any inquiries.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Info Section */}
      <div className="py-12 bg-white">
        <div className="max-w-lg mx-auto text-center">
          {session ? (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Welcome back, {session.user?.name}!</h2>
              <p className="text-gray-700 mb-4">Email: {session.user?.email}</p>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">You are not signed in</h2>
              <button
                onClick={() => signIn()}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
