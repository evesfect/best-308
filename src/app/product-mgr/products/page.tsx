"use client";
import React, { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  description: string;
  sex: string;
  category: string;
  price: number;
  total_stock: { S: number; M: number; L: number };
  available_stock: { S: number; M: number; L: number };
}

// Define a type for the initial state that ensures stock objects are fully initialized
type InitialProductState = Omit<Partial<Product>, 'total_stock' | 'available_stock'> & {
  total_stock: { S: number; M: number; L: number };
  available_stock: { S: number; M: number; L: number };
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<InitialProductState>({
    name: '',
    description: '',
    sex: '',
    category: '',
    price: 0,
    total_stock: { S: 0, M: 0, L: 0 },
    available_stock: { S: 0, M: 0, L: 0 },
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/product');
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

    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/product/adddel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();
      if (response.ok) {
        setProducts((prevProducts) => [...prevProducts, data.product]);
        // Reset form
        setNewProduct({
          name: '',
          description: '',
          sex: '',
          category: '',
          price: 0,
          total_stock: { S: 0, M: 0, L: 0 },
          available_stock: { S: 0, M: 0, L: 0 },
        });
      } else {
        setError(data.message || 'Error adding product');
      }
    } catch (error) {
      setError('An error occurred while adding the product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/product/adddel?id=${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter(product => product._id !== productId));
      } else {
        setError(data.message || 'Error deleting product');
      }
    } catch (error) {
      setError('An error occurred while deleting the product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/admin/product/updatestock', {
        method: 'POST', // Changed from PUT to POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: editingProduct._id,
          total_stock: editingProduct.total_stock,
          available_stock: editingProduct.available_stock
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Update the product in the list
        setProducts((prevProducts) => 
          prevProducts.map(product => 
            product._id === editingProduct._id ? data.product : product
          )
        );
        // Reset editing state
        setEditingProduct(null);
      } else {
        setError(data.message || 'Error updating stock');
      }
    } catch (error) {
      setError('An error occurred while updating stock');
    } finally {
      setLoading(false);
    }
  };

  // Type-safe helper functions for new product
  const updateNewProductTotalStock = (size: keyof Product['total_stock'], value: number) => {
    setNewProduct((prev) => ({
      ...prev,
      total_stock: {
        ...prev.total_stock,
        [size]: value
      }
    }));
  };

  const updateNewProductAvailableStock = (size: keyof Product['available_stock'], value: number) => {
    setNewProduct((prev) => ({
      ...prev,
      available_stock: {
        ...prev.available_stock,
        [size]: value
      }
    }));
  };

  // Type-safe helper functions for editing product
  const updateEditingProductTotalStock = (size: keyof Product['total_stock'], value: number) => {
    setEditingProduct((prev) => prev ? {
      ...prev,
      total_stock: {
        ...prev.total_stock,
        [size]: value
      }
    } : null);
  };

  const updateEditingProductAvailableStock = (size: keyof Product['available_stock'], value: number) => {
    setEditingProduct((prev) => prev ? {
      ...prev,
      available_stock: {
        ...prev.available_stock,
        [size]: value
      }
    } : null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Products Management</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Existing Products</h2>
        {products.length > 0 ? (
          <ul className="space-y-4">
            {products.map((product) => (
              <li key={product._id} className="border-b py-2">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <p className="text-gray-600">ID: {product._id}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit Stock
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Total Stock: S:{product.total_stock.S} M:{product.total_stock.M} L:{product.total_stock.L}
                  <br />
                  Available Stock: S:{product.available_stock.S} M:{product.available_stock.M} L:{product.available_stock.L}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No products available.</p>
        )}
      </div>

      {/* Stock Editing Modal/Form */}
      {editingProduct && (
        <form onSubmit={handleUpdateStock} className="bg-white rounded-lg shadow p-4 mt-4">
          <h2 className="text-xl font-semibold mb-2">Edit Stock for {editingProduct.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['S', 'M', 'L'] as const).map((size) => (
              <React.Fragment key={size}>
                <div>
                  <label className="block text-sm font-medium">Total Stock ({size})</label>
                  <input
                    type="number"
                    value={editingProduct.total_stock[size]}
                    onChange={(e) => updateEditingProductTotalStock(size, parseInt(e.target.value) || 0)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Available Stock ({size})</label>
                  <input
                    type="number"
                    value={editingProduct.available_stock[size]}
                    onChange={(e) => updateEditingProductAvailableStock(size, parseInt(e.target.value) || 0)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="flex space-x-2 mt-4">
            <button 
              type="submit" 
              className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600"
            >
              Update Stock
            </button>
            <button 
              type="button"
              onClick={() => setEditingProduct(null)}
              className="bg-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <form onSubmit={handleAddProduct} className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <input
              type="text"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Sex</label>
            <input
              type="text"
              value={newProduct.sex}
              onChange={(e) => setNewProduct({ ...newProduct, sex: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              type="text"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </div>

        <h3 className="mt-4 text-lg font-semibold">Stock Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['S', 'M', 'L'] as const).map((size) => (
            <React.Fragment key={size}>
              <div>
                <label className="block text-sm font-medium">Total Stock ({size})</label>
                <input
                  type="number"
                  value={newProduct.total_stock[size]}
                  onChange={(e) => updateNewProductTotalStock(size, parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Available Stock ({size})</label>
                <input
                  type="number"
                  value={newProduct.available_stock[size]}
                  onChange={(e) => updateNewProductAvailableStock(size, parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
            </React.Fragment>
          ))}
        </div>

        <button type="submit" className="mt-4 bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AdminProducts;