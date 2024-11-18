"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface CartItem {
  _id: string;
  name: string;
  salePrice: string;
  quantity: number;
  imageId: string;
  size: string; // Include size in cart item
}

const ShoppingCartPage = () => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0); // Track total price
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!session || !session.user || !session.user.id) return;

      try {
        setLoading(true);
        setError(null);
        const userId = session.user.id;
        const response = await axios.get(`/api/cart/view-cart?userId=${userId}`);
        setCartItems(response.data.cart);
        calculateTotalPrice(response.data.cart); // Update total price
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Failed to load cart items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [session]);

  // Function to calculate total price
  const calculateTotalPrice = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + parseFloat(item.salePrice) * item.quantity, 0);
    setTotalPrice(total);
  };

  // Function to remove item from cart
  const removeFromCart = async (itemId: string) => {
    try {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
      calculateTotalPrice(
        cartItems.filter((item) => item._id !== itemId)
      );
  
      await axios.delete('/api/cart/remove-item', {
        data: { userId: session?.user?.id, processedProductId: itemId },
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Failed to remove item from cart. Please try again.");
    }
  };
  

  // Function to handle quantity update
  const updateQuantity = async (itemId: string, change: number) => {
    const updatedItems = cartItems.map((item) =>
      item._id === itemId
        ? { ...item, quantity: item.quantity + change }
        : item
    );
  
    const updatedItem = updatedItems.find((item) => item._id === itemId);
  
    if (updatedItem && updatedItem.quantity <= 0) {
      await removeFromCart(itemId); // Call remove endpoint if quantity becomes 0
    } else {
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems);
  
      try {
        await axios.post('/api/cart/update-quantity', {
          userId: session?.user?.id,
          processedProductId: itemId,
          quantity: updatedItem?.quantity,
        });
      } catch (error) {
        console.error("Error updating quantity:", error);
        alert("Failed to update quantity. Please try again.");
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="container mx-auto py-12 px-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Your Shopping Cart
        </h1>

        {status === 'loading' ? (
          <p className="text-center text-xl text-gray-500">Loading session...</p>
        ) : loading ? (
          <p className="text-center text-xl text-gray-500">Loading your cart...</p>
        ) : error ? (
          <p className="text-center text-xl text-red-500">{error}</p>
        ) : cartItems.length > 0 ? (
          <>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={`/api/images/${item.imageId}`}
                      alt={item.name}
                      width={300}
                      height={300}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">Price: ${item.salePrice}</p>
                      <p className="text-gray-500">Size: {item.size}</p>
                    </div>
                  </div>
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      -
                    </button>
                    <p className="text-gray-500 font-bold">{item.quantity}</p>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right text-lg font-semibold">
              Total Price: ${totalPrice.toFixed(2)}
            </div>
          </>
        ) : (
          <p className="text-center text-xl text-gray-500">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;
