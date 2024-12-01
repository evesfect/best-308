"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ConfirmationPage = () => {
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedInvoiceUrl = localStorage.getItem('invoiceUrl');
    if (storedInvoiceUrl) {
      setInvoiceUrl(storedInvoiceUrl);
      // Clean up localStorage
      localStorage.removeItem('invoiceUrl');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your invoice has been sent to your email.
        </p>
        
        {invoiceUrl && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Invoice Preview</h3>
            <iframe
              src={invoiceUrl}
              className="w-full h-96 border border-gray-300 rounded-md mb-6"
            />
          </div>
        )}

        <Link 
          href="/" 
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;