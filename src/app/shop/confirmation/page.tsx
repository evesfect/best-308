"use client";

import Link from 'next/link';

const ConfirmationPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your invoice has been sent to your email.
        </p>
        <Link 
          href="/shop/browse/all" 
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;