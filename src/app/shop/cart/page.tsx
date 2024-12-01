// /shop/cart

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


// Define the Toast interface
interface Toast {
  message: string;
  type: 'success' | 'error';
}

// Define the CartItem interface
interface CartItem {
  _id: string;
  name: string;
  salePrice: string;
  quantity: number;
  imageId: string;
  size: string; // Include size in cart item
  color: string; // Include color in cart item
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
      // Save the current cart to localStorage to persist it across login
      localStorage.setItem("redirectCart", JSON.stringify(cartItems));
  
      // Navigate to the login page with a redirect parameter
      router.push("/auth/signin?redirect=/shop/cart");
      return;
    }
  
    // Merge localStorage cart with the server-side cart after login
    const localCart = JSON.parse(localStorage.getItem("redirectCart") || "[]");
  
    if (localCart.length > 0) {
      try {
        await axios.post("/api/cart/merge-cart", {
          userId: session.user.id,
          items: localCart,
        });
  
        // Clear the local cart after merging
        localStorage.removeItem("redirectCart");
  
        // Refresh the cart page after successful merge
        router.push("/shop/cart");
      } catch (error) {
        console.error("Error merging cart:", error);
        setToast({ message: "Failed to merge your cart. Please try again.", type: "error" });
        return;
      }
    }
  
    // Navigate to the checkout page for logged-in users
    router.push("/shop/checkout");
  };



  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center"> 

      <div className="container mx-auto py-12 px-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Your Shopping Cart
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
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">Price: ${item.salePrice}</p>
                      <p className="text-gray-500">Size: {item.size}</p>
                      <p className="text-gray-500">Color: {item.color}</p>
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
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">
                  Total Price: ${totalPrice.toFixed(2)}
                </div>
                <button 
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  onClick={handleOrderNow}
                >
                  <span>Order Now</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-xl text-gray-500">Your cart is empty.</p>
        )}
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ShoppingCartPage;
