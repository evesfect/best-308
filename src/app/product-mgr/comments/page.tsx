"use client";
import React, { useEffect, useState } from "react";

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
  approved: boolean;
  productName?: string;
}

const ProductSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"search" | "unapproved">("search");
  const [unapprovedComments, setUnapprovedComments] = useState<Comment[]>([]);

  // Fetch products based on the search term
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/product?query=${searchTerm}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        setError(data.message || "Error fetching products");
      }
    } catch (error) {
      setError("An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch approved comments for a selected product
  const fetchApprovedComments = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/product/comments?product_id=${productId}`);
      const data = await response.json();

      if (response.ok) {
        const approvedComments = data.filter((comment: Comment) => comment.approved);
        setComments(approvedComments);
      } else {
        setError(data.message || "Error fetching comments");
      }
    } catch (error) {
      setError("An error occurred while fetching comments");
    } finally {
      setLoading(false);
    }
  };

  // Fetch unapproved comments for the admin tab
  const fetchAllComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/product/comments");
      const data = await response.json();
      
      if (response.ok) {
        const unapproved = data.filter((comment: Comment) => !comment.approved);
      
        interface CommentWithProductName extends Comment {
          productName: string;
        }
      
        // Fetch product details for each comment
        const unapprovedWithProductNames: CommentWithProductName[] = await Promise.all(
          unapproved.map(async (comment: Comment): Promise<CommentWithProductName> => {
        const productResponse: Response = await fetch(`/api/product?id=${comment.product_id}`);
        const product: Product = await productResponse.json();
        return {
          ...comment,
          productName: product?.name || "Unknown Product",
        };
          })
        );
      
        setUnapprovedComments(unapprovedWithProductNames);
      } else {
        setError(data.message || "Error fetching comments");
      }
        } catch (error) {
      setError("An error occurred while fetching comments");
        } finally {
      setLoading(false);
        }
      };
      

      // Handle approving a comment
      const approveComment = async (commentId: string): Promise<void> => {
        setLoading(true);
        setError(null);
    try {
      const response = await fetch(`/api/admin/product/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: commentId }),
      });
  
      if (response.ok) {
        setUnapprovedComments((prev) => prev.filter((comment) => comment._id !== commentId));
      } else {
        const data = await response.json();
        setError(data.message || "Error approving comment");
      }
    } catch (error) {
      setError("An error occurred while approving the comment");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle deleting a comment
  const deleteComment = async (commentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/product/comments?id=${commentId}`, { method: "DELETE" });

      if (response.ok) {
        setUnapprovedComments((prev) => prev.filter((comment) => comment._id !== commentId));
      } else {
        const data = await response.json();
        setError(data.message || "Error deleting comment");
      }
    } catch (error) {
      setError("An error occurred while deleting the comment");
    } finally {
      setLoading(false);
    }
  };

  // Fetch unapproved comments when admin tab is active
  useEffect(() => {
    if (activeTab === "unapproved") {
      fetchAllComments();
    }
  }, [activeTab]);

  const renderTabs = () => (
    <div className="flex w-full mb-4">
      <button
        onClick={() => setActiveTab("search")}
        className={`flex-1 p-2 ${activeTab === "search" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
      >
        Product Search
      </button>
      <button
        onClick={() => setActiveTab("unapproved")}
        className={`flex-1 p-2 ${activeTab === "unapproved" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
      >
        Unapproved Comments
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      {renderTabs()}

      {activeTab === "search" && (
        <>
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

          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="w-full bg-gray-100 p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold">Products</h2>
            {products.length > 0 ? (
              <ul className="space-y-4 mt-2">
                {products.map((product) => (
                  <li key={product._id} className="border-b border-gray-300 pb-2">
                    <h3
                      onClick={() => {
                        setSelectedProduct(product);
                        fetchApprovedComments(product._id);
                      }}
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

          {selectedProduct && (
            <div className="w-full bg-white p-4 rounded-md shadow mt-4">
              <h2 className="text-lg font-semibold">Comments for {selectedProduct.name}</h2>
              {comments.length > 0 ? (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li key={comment._id} className="border-b border-gray-300 pb-2">
                      <p className="text-gray-800">{comment.comment}</p>
                      <p className="text-gray-500 text-sm">Rating: {comment.rating}</p>
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
                <p className="text-gray-500">No comments found for this product</p>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === "unapproved" && (
        <div className="w-full bg-white p-4 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-4">Unapproved Comments</h2>
          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {unapprovedComments.length > 0 ? (
  <ul className="space-y-4">
    {unapprovedComments.map((comment) => (
      <li key={comment._id} className="p-3 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-gray-800">{comment.comment}</p>
        <p className="text-gray-600 text-sm">Rating: {comment.rating}</p>
        <p className="text-gray-500 text-sm">
          Product: <span className="font-semibold">{comment.productName}</span>
        </p>
        <button
          onClick={() => approveComment(comment._id)}
          className="mt-2 px-3 py-1 text-sm bg-green-500 text-white rounded"
        >
          Approve
        </button>
        <button
          onClick={() => deleteComment(comment._id)}
          className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded ml-2"
        >
          Delete
        </button>
      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-500">No unapproved comments</p>
)}

        </div>
      )}
    </div>
  );
};

export default ProductSearch;
