// /shop/cart

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types/cart';
import StaticTopBar from "@/components/StaticTopBar";
import colorMap from "@/types/ColorMap";
import styles from "@/styles/ProductItem.module.css";




// Define the Toast interface
interface Toast {
  message: string;
  type: 'success' | 'error';
}

// Toast component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white transition-opacity duration-500
      ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      {message}
    </div>
  );
};

const ShoppingCartPage = () => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0); // Track total price
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!session || !session.user) {
        // Handle non-logged-in users
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const response = await axios.post('/api/cart/view-cart', { localCart });
        setCartItems(response.data.cart);
        calculateTotalPrice(response.data.cart);
        return;
      }
  
      // Handle logged-in users
      try {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const userId = session.user.id;
        const response = await axios.post('/api/cart/view-cart', { userId, localCart });
        setCartItems(response.data.cart);
        calculateTotalPrice(response.data.cart);
      
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Failed to load cart items. Please try again later.');
        
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
  const removeFromCart = (productId: string, size: string, color: string) => {
    if (!session || !session.user) {
      // Handle non-logged-in users using localStorage
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
  
      const updatedCart = localCart.filter(
        (item: any) => !(item.productId === productId && item.size === size && item.color === color)
      );
  
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart); // Update UI with new local cart
      setToast({ message: "Item removed from local cart.", type: "success" });
      return;
    }
  
    // Handle logged-in users via API
    (async () => {
      try {
        const response = await axios.delete("/api/cart/remove-item", {
          data: { userId: session.user.id, processedProductId: productId },
        });
    
        if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== productId)
        );
        setToast({ message: "Item removed from server cart.", type: "success" });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setToast({ message: "Failed to remove item from cart. Please try again.", type: "error" });
      }
    })();
  };
  

  // Function to handle quantity update
  const updateQuantity = async (productId: string, size: string, color: string, change: number) => {
    if (!session || !session.user) {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
  
      
  
      const updatedCart = localCart
        .map((item: any) => {
          if (item._id === productId && item.size === size && item.color === color) {
            const updatedQuantity = Math.max(item.quantity + change, 0); // Prevent negative quantity
            return { ...item, quantity: updatedQuantity };
          }
          return item;
        })
        .filter((item: any) => item.quantity > 0); // Remove items with quantity <= 0
  
  
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save the updated cart
      setCartItems(updatedCart); // Reflect changes in the UI
      calculateTotalPrice(updatedCart); // Recalculate total price
      setToast({ message: "Quantity updated in local cart.", type: "success" });
      return;
    }
  
    // Handle logged-in users via API
    try {
      const currentItem = cartItems.find(
        (item) => item._id === productId && item.size === size && item.color === color
      );
  
      if (!currentItem) {
        setToast({ message: "Item not found in cart.", type: "error" });
        return;
      }
  
      const newQuantity = Math.max(currentItem.quantity + change, 0); // Increment or decrement
  
      const response = await axios.post("/api/cart/update-quantity", {
        userId: session.user.id,
        processedProductId: productId,
        quantity: newQuantity,
      });
  
      if (response.status === 200) {
        const updatedCart = cartItems.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        );
  
        setCartItems(updatedCart.filter((item) => item.quantity > 0)); // Remove items with quantity <= 0
        calculateTotalPrice(updatedCart); // Update total price
        setToast({ message: "Quantity updated successfully in server cart.", type: "success" });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      setToast({ message: "Failed to update quantity. Please try again.", type: "error" });
    }
  };
  
  
  
  

  const handleOrderNow = async () => {
    if (!session || !session.user) {
      console.log("Saving cart to localStorage:", cartItems);
      console.log("Cart items:", cartItems);
      console.log("moving on to login");
    
      localStorage.setItem("redirectCart", JSON.stringify(cartItems));

      router.push("/auth/signin?redirect=/shop/cart");
      return;
    }
  
    // Store cart data before navigation
    localStorage.setItem("checkoutCart", JSON.stringify(cartItems));
    localStorage.setItem("checkoutTotal", totalPrice.toString());
    
    router.push("/shop/payment");
  };



  return (
      <>
        <StaticTopBar></StaticTopBar>
        {Array.from({ length: 6 }).map((_, index) => (
            <br key={index} />
        ))}
        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-12 px-6">
          <div className="container mx-auto flex space-x-6">
            {/* Products Section */}
            <div className="w-3/4 bg-white shadow-md rounded-lg p-6">
              <h1 className="text-3xl font-bold mb-8 text-black-600">
                Shopping Cart
              </h1>
              {cartItems.length > 0 ? (
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
                                  className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div>
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <p className="text-gray-600">Price: ${item.salePrice}</p>
                                <p className="text-gray-500">Size: {item.size}</p>
                                <div className="flex items-center space-x-2 ">
                                  <p className="text-gray-500">Color: {item.color}</p>
                                  <div className={`${styles.colorOption}`}
                                       style={{backgroundColor: (item.color && colorMap[item.color.toLowerCase()]) || 'white'}}></div>
                                </div>


                              </div>
                            </div>
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-4">
                              <button
                                  onClick={() => updateQuantity(item._id, item.size, item.color, -1)}
                                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                              >
                                -
                              </button>
                              <p className="text-gray-500 font-bold">{item.quantity}</p>
                              <button
                                  onClick={() => updateQuantity(item._id, item.size, item.color, 1)}
                                  className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
                              >
                                +
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>
                  </>
              ) : (
                  <p className="text-center text-xl text-gray-500">Your cart is empty.</p>
              )}
            </div>

            {/* Summary Section */}
            <div className="w-1/4 bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Summary</h2>
              <div className="text-lg text-gray-600 mb-4">
                <p>
                  Total Items:{" "}
                  <span className="font-semibold">
        {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      </span>
                </p>
                <p>
                  Total Price:{" "}
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </p>
              </div>
              <button
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex justify-center items-center space-x-2"
                  onClick={handleOrderNow}
              >
                <span>Order Now</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                  <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a 1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                  />
                </svg>
              </button>
              {/* Returns Section */}
              <div className="mt-4 text-sm text-gray-600 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Returns</h3>
                <p>
                  You can make a return request within <strong>30 days</strong> of the delivery date. We provide a free
                  pickup service at your home.
                </p>
              </div>
              {/* Payment Methods Section */}
              <div className="mt-4 text-sm text-gray-600 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Payment Methods</h3>
                <p>We accept all major credit cards.</p>
              </div>
              {/* Privacy Section */}
              <div className="mt-4 text-sm text-gray-600 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Privacy</h3>
                <p>Your personal information is protected and handled securely. We do not share your data with third
                  parties without your consent.</p>
              </div>
            </div>

          </div>
          {toast && (
              <Toast
                  message={toast.message}
                  type={toast.type}
                  onClose={() => setToast(null)}
              />
          )}
        </div>
      </>
  );
};

export default ShoppingCartPage;
