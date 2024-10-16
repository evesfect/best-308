"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import './shoppingpage.css'; // Import the CSS file

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
}

const ShoppingPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch products when the component loads or when query/category changes
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
    <div className="shopping-page">
      <h1>Shopping Page</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="jacket">Jacket</option>
          <option value="shirt">Shirt</option>
          <option value="shoes">Shoes</option>
          {/* Add more categories here as needed */}
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Category: {product.category}</p>
                <p>Price: ${product.price}</p>
                <p>Stock: S({product.available_stock.S}), M({product.available_stock.M}), L({product.available_stock.L})</p>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingPage;
