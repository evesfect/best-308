"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash } from 'react-bootstrap-icons';
import StaticTopBar from "@/components/StaticTopBar";

interface WishlistItem {
  _id: string;
  productId: string;
  size?: string;
  color?: string;
  product: {
    name: string;
    description: string;
    salePrice: string;
    imageId: string;
    category: string;
  };
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

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

const WishlistPage = () => {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<Toast | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchWishlistItems();
  }, [session]);

  const fetchWishlistItems = async () => {
    if (!session?.user?.id) {
      router.push('/auth/signin?redirect=/wishlist');
      return;
    }

    try {
      const response = await axios.get('/api/wishlist/view-wishlist');
      setWishlistItems(response.data.items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setToast({ 
        message: "Failed to load wishlist items", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await axios.delete('/api/wishlist/remove-from-wishlist', {
        data: { productId }
      });
      setWishlistItems(prevItems => prevItems.filter(item => item.productId !== productId));
      setToast({ message: "Item removed from wishlist", type: "success" });
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      setToast({ message: "Failed to remove item", type: "error" });
    }
  };

  const addToCart = async (item: WishlistItem) => {
    try {
      if (!session?.user?.id) {
        router.push('/auth/signin');
        return;
      }

      const cartData: any = {
        userId: session.user.id,
        productId: item.productId,
        quantity: 1
      };

      if (item.size) cartData.size = item.size;
      if (item.color) cartData.color = item.color;

      await axios.post('/api/cart/add-to-cart', cartData);
      setToast({ message: "Item added to cart", type: "success" });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToast({ message: "Failed to add item to cart", type: "error" });
    }
  };

  if (loading) {
    return (
        <>
          <StaticTopBar></StaticTopBar>
          <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <p className="text-xl font-semibold">Loading wishlist...</p>
          </div>
        </>

    );
  }

  return (
      <>
        <StaticTopBar></StaticTopBar>
        {Array.from({ length: 2 }).map((_, index) => (
            <br key={index} />
        ))}
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
          <div className="container mx-auto py-12 px-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
              Your Wishlist
            </h1>

            {wishlistItems.length > 0 ? (
                <div className="space-y-6">
                  {wishlistItems.map((item) => (
                      <div
                          key={item._id}
                          className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex items-center space-x-4">
                          <Image
                              src={`/api/images/${item.product.imageId}`}
                              alt={item.product.name}
                              width={300}
                              height={300}
                              className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="text-lg font-semibold">{item.product.name}</h3>
                            <p className="text-gray-600">Price: ${item.product.salePrice}</p>
                            {item.size && <p className="text-gray-500">Size: {item.size}</p>}
                            {item.color && <p className="text-gray-500">Color: {item.color}</p>}
                            <p className="text-gray-500">Category: {item.product.category}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <button
                              onClick={() => addToCart(item)}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                          >
                            Add to Cart
                          </button>
                          <button
                              onClick={() => removeFromWishlist(item._id)}
                              className="text-red-500 hover:text-red-600 transition"
                          >
                            <Trash size={20}/>
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <div className="text-center">
                  <p className="text-xl text-gray-500 mb-4">Your wishlist is empty.</p>
                  <button
                      onClick={() => router.push('/shop/browse/best-sellers')}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Browse Products
                  </button>
                </div>
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
      </>

  );
};

export default WishlistPage;