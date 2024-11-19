"use client";


import TopBar from '../../../../components/StaticTopBar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

interface Stock {
  S: number;
  M: number;
  L: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  salePrice: string;
  total_stock: Stock;
  available_stock: Stock;
  imageId: string;
  selectedSize: string;
  selectedColor: string;
  sizes: string[];
  colors: string[];
}

// Add Toast interface
interface Toast {
  message: string;
  type: 'success' | 'error';
}

// Add Toast component
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


const ShoppingPage = () => {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [order, setOrder] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: { size: string; color: string };
  }>({});
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [query, category, order]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/product', {
        params: { query, category, order, sex: 'female' },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (productId: string, type: 'size' | 'color', value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [type]: value,
      },
    }));
  };

  const addToCart = async (productId: string, size: string, color: string) => {
    const selected = selectedOptions[productId];
  
    if (!selected || !size || !color) {
      setToast({ message: "Please select a size and color before adding to cart.", type: "error" });
      return;
    }
  
    if (!session || !session.user) {
      // Handle non-logged-in user cart
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItemIndex = localCart.findIndex(
        (item: any) => item.productId === productId && item.size === size && item.color === color
      );
  
      if (existingItemIndex > -1) {
        localCart[existingItemIndex].quantity += 1;
      } else {
        localCart.push({ productId, size, color, quantity: 1 });
      }
  
      localStorage.setItem("cart", JSON.stringify(localCart));
      setToast({ message: "Item added to cart.", type: "success" });
      return;
    }
  
    // Handle logged-in user cart (existing logic)
    try {
      const userId = session.user.id;
      const response = await axios.post("/api/cart/add-to-cart", {
        userId,
        productId,
        size,
        color,
      });
  
      if (response.status === 200) {
        setToast({ message: "Product added to cart successfully!", type: "success" });
      } else {
        setToast({ message: `Failed to add to cart: ${response.data.error}`, type: "error" });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setToast({ message: "An error occurred while adding the product to the cart. Please try again.", type: "error" });
    }
  };
  

  const renderProduct = (product: Product) => {
    const selected = selectedOptions[product._id] || { size: '', color: '' };
  
    return (
      <div key={product._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <Image
          src={`/api/images/${product.imageId}`} // Use the image API route
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="mt-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-500">{product.description}</p>
          <p className="mt-2 text-gray-700 font-semibold">Category: {product.category}</p>
          <p className="mt-1 text-xl font-bold text-blue-600">Price: ${product.salePrice}</p>
  
          {/* Size Selection */}
          <div className="mt-2">
            <label 
              htmlFor={`size-${product._id}`} 
              className="block text-sm font-medium text-gray-700"
            >
              Size
            </label>
            <select
              id={`size-${product._id}`}
              value={selected.size}
              onChange={(e) => handleSelectionChange(product._id, 'size', e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Size</option>
              {product.sizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
  
          {/* Color Selection */}
          <div className="mt-2">
            <label 
              htmlFor={`color-${product._id}`} 
              className="block text-sm font-medium text-gray-700"
            >
              Color
            </label>
            <select
              id={`color-${product._id}`}
              value={selected.color}
              onChange={(e) => handleSelectionChange(product._id, 'color', e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Color</option>
              {product.colors.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
  
          <button
            onClick={() => addToCart(product._id, selected.size, selected.color)}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  };
  

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <div style={{ height: '120px' }} />

      {/* Search and Filter Section */}
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="jacket">Jacket</option>
            <option value="shirt">Shirt</option>
            <option value="shoes">Shoes</option>
            <option value="pants">Pants</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="ml-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Order By</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <p className="text-center text-xl font-semibold">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map(renderProduct)
            ) : (
              <p className="text-center text-xl font-semibold">No products found</p>
            )}
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
  );
};

export default ShoppingPage;
