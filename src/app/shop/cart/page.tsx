"use client";

import { useState } from 'react';

interface CartItem {
  _id: string;
  name: string;
  price: string;
  quantity: number;
  imageUrl: string;
}

const ShoppingCartPage = () => {
  // Cart items state (you can replace this with your actual cart data fetching logic)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      _id: '1',
      name: 'Faux Suede Bomber Jacket',
      price: '59.99',
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      _id: '2',
      name: 'Slim Fit Shirt',
      price: '29.99',
      quantity: 2,
      imageUrl: 'https://via.placeholder.com/150',
    },
  ]);

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item._id !== id));
  };

  // Handle order cart
  const handleOrder = () => {
    alert('Order placed successfully!'); // Replace with actual order handling
    // Clear the cart after ordering
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="container mx-auto py-12 px-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Your Shopping Cart</h1>

        {/* Cart Items */}
        {cartItems.length > 0 ? (
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

            {/* Order Button */}
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
