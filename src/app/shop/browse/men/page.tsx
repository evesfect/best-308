"use client";

import TopBar from '../../../../components/StaticTopBar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
  imageUrl: string;
  slug: string;
}

const ShoppingPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [order, setOrder] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [query, category, order]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/product', {
        params: { query, category, order },
      });
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error('Invalid data format from API');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product._id}`);
  };
  return (
      <div className="min-h-screen bg-white">
        <TopBar />
        <div style={{ height: '120px' }} />

        {/* Search and Filter Section */}
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            {/* Search and filter components */}
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
                          {/* Make only the image clickable */}
                          <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-t-lg cursor-pointer"
                              onClick={() => handleProductClick(product)}
                          />
                          <div className="mt-4">
                            {/* Make only the product name clickable */}
                            <h3
                                className="text-lg font-semibold cursor-pointer"
                                onClick={() => handleProductClick(product)}
                            >
                              {product.name}
                            </h3>
                            <p className="text-gray-500">{product.description}</p>
                            <p className="mt-2 text-gray-700 font-semibold">
                              Category: {product.category}
                            </p>
                            <p className="mt-1 text-xl font-bold text-blue-600">
                              Price: ${product.price}
                            </p>
                            <div className="mt-2">
                              <p className="text-sm">
                                Stock: S({product.available_stock.S}), M({product.available_stock.M}), L({product.available_stock.L})
                              </p>
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