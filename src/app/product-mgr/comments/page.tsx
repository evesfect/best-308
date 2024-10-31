"use client"
import React, { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
}

interface Comment {
  _id: string;
  comment: string;
  rating: number;
  product_id: string;
  user_id: string;
}

const ProductSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle product search
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/product?query=${searchTerm}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        setError(data.message || 'Error fetching products');
      }
    } catch (error) {
      setError('An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments for selected product
  const fetchComments = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/product/comments?product_id=${productId}`);
      const data = await response.json();

      if (response.ok) {
        setComments(data);
      } else {
        setError(data.message || 'Error fetching comments');
      }
    } catch (error) {
      setError('An error occurred while fetching comments');
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting a product to view comments
  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    fetchComments(product._id);
  };

  // Handle deleting a comment
  const deleteComment = async (commentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/product/comments?id=${commentId}`, { method: 'DELETE' });
      if (response.ok) {
        setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
      } else {
        const data = await response.json();
        setError(data.message || 'Error deleting comment');
      }
    } catch (error) {
      setError('An error occurred while deleting the comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Product Search</h1>

      {/* Search box */}
      <div className="flex w-full gap-2">
        <input
          type="text"
          placeholder="Search for products by name, description, or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md"
        />
        <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Search
        </button>
      </div>

      {/* Display loading and error messages */}
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Product results */}
      <div className="w-full bg-gray-100 p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold">Products</h2>
        {products.length > 0 ? (
          <ul className="space-y-4 mt-2">
            {products.map((product) => (
              <li key={product._id} className="border-b border-gray-300 pb-2">
                <h3
                  onClick={() => selectProduct(product)}
                  className="text-blue-600 cursor-pointer hover:underline text-lg font-medium"
                >
                  {product.name}
                </h3>
                <p className="text-gray-700">{product.description}</p>
                <p className="text-gray-500 text-sm">Category: {product.category}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No products found</p>
        )}
      </div>

      {/* Comments for selected product */}
      {selectedProduct && (
        <div className="w-full bg-white p-4 rounded-md shadow mt-6">
          <h2 className="text-lg font-semibold mb-2">Comments for {selectedProduct.name}</h2>
          {comments.length > 0 ? (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment._id} className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-gray-800">{comment.comment}</p>
                  <p className="text-gray-600 text-sm">Rating: {comment.rating}</p>
                  <p className="text-black-600 text-sm">UserID: {comment.user_id}</p> 
                  <button
                    onClick={() => deleteComment(comment._id)}
                    className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded"
                  >
                    Delete Comment
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No comments available for this product.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
