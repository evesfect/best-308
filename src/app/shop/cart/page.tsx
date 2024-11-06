"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface CartItem {
  _id: string;
  name: string;
  price: string;
  quantity: number;
  imageUrl: string;
}

const ShoppingCartPage = () => {
  const { data: session, status } = useSession(); // Access the session
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!session || !session.user || !session.user.id) return; // Wait until session is loaded

      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const userId = session.user.id;
        const response = await axios.get(`/api/cart/view-cart?userId=${userId}`);
        setCartItems(response.data.cart);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Failed to load cart items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [session]);

  const removeFromCart = async (id: string) => {
    try {
      setCartItems(cartItems.filter(item => item._id !== id));
      await axios.delete(`/api/cart/remove-item`, { data: { userId: session?.user?.id, productId: id } });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError("Failed to remove item from cart. Please try again.");
    }
  };

  const handleOrder = async () => {
    try {
      alert('Order placed successfully!');
      setCartItems([]); // Clear cart after placing order
      await axios.post('/api/cart/checkout', { userId: session?.user?.id });
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place order. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="container mx-auto py-12 px-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Your Shopping Cart</h1>

        {status === 'loading' ? (
          <p className="text-center text-xl text-gray-500">Loading session...</p>
        ) : loading ? (
          <p className="text-center text-xl text-gray-500">Loading your cart...</p>
        ) : error ? (
          <p className="text-center text-xl text-red-500">{error}</p>
        ) : cartItems.length > 0 ? (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center space-x-4">
                  <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">Price: ${item.price}</p>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleOrder}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Order Cart
            </button>
          </div>
        ) : (
          <p className="text-center text-xl text-gray-500">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;
