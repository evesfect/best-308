"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

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
  price: string;
  total_stock: Stock;
  available_stock: Stock;
  imageUrl: string; // Assume you have an image URL in your product data
}

const ShoppingPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, [query, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products', {
        params: { query, category },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-blue-600 py-12 text-center text-white">
        <h1 className="text-4xl font-bold">Welcome to Our Shop</h1>
        <p className="mt-2">Explore our latest products and find your style!</p>
      </div>

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
            {/* Add more categories here */}
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <p className="text-center text-xl font-semibold">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-500">{product.description}</p>
                    <p className="mt-2 text-gray-700 font-semibold">Category: {product.category}</p>
                    <p className="mt-1 text-xl font-bold text-blue-600">Price: ${product.price}</p>
                    <div className="mt-2">
                      <p className="text-sm">Stock: S({product.available_stock.S}), M({product.available_stock.M}), L({product.available_stock.L})</p>
                    </div>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xl font-semibold">No products found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingPage;