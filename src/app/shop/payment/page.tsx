"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CartItem } from '@/types/cart';
import {Order} from '@/models/order.model';

interface PaymentFormData {
  address: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const PaymentPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [formData, setFormData] = useState<PaymentFormData>({
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [invoice, setInvoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get cart data from localStorage
    const storedCart = localStorage.getItem("checkoutCart");
    const storedTotal = localStorage.getItem("checkoutTotal");
    
    if (!storedCart || !storedTotal) {
      router.push("/shop/cart");
      return;
    }

    setCartItems(JSON.parse(storedCart));
    setTotalAmount(parseFloat(storedTotal));
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.address) {
      setError('Please provide a delivery address');
      setLoading(false);
      return;
    }

    try {
      // Generate invoice first
      const invoiceResponse = await axios.post("/api/invoice/generate", {
        items: cartItems,
        totalAmount: totalAmount,
        customerDetails: {
          name: session?.user?.name,
          email: session?.user?.email,
          address: formData.address,
        }
      }, { responseType: 'blob' });

      // Create URL for invoice preview
      const invoiceUrl = URL.createObjectURL(new Blob([invoiceResponse.data]));

            // Generate the new order
            const productMap = cartItems.reduce((acc, item) => {
              acc[item._id] = item.quantity; // Map product ID to its quantity
              return acc;
            }, {} as { [key: string]: number });
      
            const orderResponse = await axios.post("/api/order", {
              products: productMap, // Transformed product map
              user_id: session?.user?.id,
              address: formData.address,
              completed: false, // Initially set to incomplete
              date: new Date(), // Current date
              status: "processing", // Default status
            });
      
            if (orderResponse.status === 201) {
              console.log("Order created successfully:", orderResponse.data.order);
            } else {
              console.error("Failed to create order:", orderResponse.data.message);
              setError(orderResponse.data.message || "Failed to create order.");
              return;
            }
      

      // Remove each item from cart if user is logged in
      if (session?.user?.id) {
        for (const item of cartItems) {
          try {
            await axios.delete("/api/cart/remove-item", {
              data: {
                userId: session.user.id,
                processedProductId: item._id
              }
            });
          } catch (error) {
            console.error(`Error removing item ${item._id} from cart:`, error);
          }
        }
      }

      // Clear local storage
      localStorage.removeItem('checkoutCart');
      localStorage.removeItem('checkoutTotal');
      localStorage.removeItem('cart');
      localStorage.removeItem('redirectCart');

      // Store invoice URL for confirmation page
      localStorage.setItem('invoiceUrl', invoiceUrl);

      router.push('/shop/confirmation');
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Payment Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Make Payment'}
          </button>
        </form>

        {invoice && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Invoice Preview</h3>
            <iframe
              src={invoice}
              className="w-full h-96 border border-gray-300 rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;