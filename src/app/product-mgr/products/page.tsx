"use client";
import React, { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  description: string;
  sex: string;
  category: string;
  salePrice: number;
  total_stock: { S: number; M: number; L: number };
  available_stock: { S: number; M: number; L: number };
  sizes:string[];
  colors:string[];
}

interface Category {
  _id: string;
  name: string;
}

type InitialProductState = Omit<Partial<Product>, 'total_stock' | 'available_stock'> & {
  total_stock: { S: number; M: number; L: number };
  available_stock: { S: number; M: number; L: number };
  sizes: string[]; // Fixed array with S, M, L
  colors: string[]; // Dynamic array provided by the user
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // State for categories
  const [newProduct, setNewProduct] = useState<InitialProductState>({
    name: '',
    description: '',
    sex: '',
    category: '', // This will now be the category id
    salePrice: 0,
    total_stock: { S: 0, M: 0, L: 0 },
    available_stock: { S: 0, M: 0, L: 0 },
    sizes: ['S', 'M', 'L'], // Fixed sizes
    colors: [], // User-defined colors
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsResponse = await fetch('/api/product');
        const productsData = await productsResponse.json();
        const categoriesResponse = await fetch('/api/product/category'); // Endpoint to fetch categories
        const categoriesData = await categoriesResponse.json();

        if (productsResponse.ok && categoriesResponse.ok) {
          setProducts(productsData);
          setCategories(categoriesData); // Set categories
        } else {
          setError('Error fetching products or categories');
        }
      } catch (error) {
        setError('An error occurred while fetching products or categories');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Send the category name instead of the ID
      const categoryName = categories.find(
        (cat) => cat._id === newProduct.category
      )?.name;
  
      const response = await fetch('/api/admin/product/adddel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          category: categoryName, // Use category name
        }),
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
          sizes: ['S', 'M', 'L'],
          colors: [],
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
  

  const handleAddColor = (color: string) => {
    setNewProduct((prev) => ({
      ...prev,
      colors: [...prev.colors, color],
    }));
  };

  const handleRemoveColor = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
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
      <h1 className="text-3xl font-bold mb-4">Products Management</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Current Products</h2>
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
                <div className="flex items-center">
                  <label className="w-32">{size} Size:</label>
                  <input
                    type="number"
                    value={editingProduct.total_stock[size]}
                    onChange={(e) => updateEditingProductTotalStock(size, Number(e.target.value))}
                    className="border p-2 w-20"
                  />
                  <span className="ml-2">Total</span>
                  <input
                    type="number"
                    value={editingProduct.available_stock[size]}
                    onChange={(e) => updateEditingProductAvailableStock(size, Number(e.target.value))}
                    className="border p-2 w-20 ml-4"
                  />
                  <span className="ml-2">Available</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Update Stock
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
        <form onSubmit={handleAddProduct}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-2">Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="border p-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border p-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2">Price</label>
              <input
                type="number"
                value={newProduct.salePrice}
                onChange={(e) => setNewProduct({ ...newProduct, salePrice: Number(e.target.value) })}
                className="border p-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2">Sex</label>
              <select
                value={newProduct.sex}
                onChange={(e) => setNewProduct({ ...newProduct, sex: e.target.value })}
                className="border p-2"
                required
              >
                <option value="">Select Sex</option>
                <option value="unisex">Unisex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-2">Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="border p-2"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-col mt-4">
            <label className="mb-2">Colors</label>
            <div className="flex flex-wrap items-center gap-2">
              {newProduct.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span className="bg-gray-200 px-3 py-1 rounded">{color}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Enter a color and press Enter"
              className="border p-2 mt-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  handleAddColor(e.currentTarget.value.trim());
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
          <div className="flex gap-4 mt-4">
            {(['S', 'M', 'L'] as const).map((size) => (
              <div key={size} className="flex flex-col w-32">
                <label className="mb-2">{size} Size Total Stock</label>
                <input
                  type="number"
                  value={newProduct.total_stock[size]}
                  onChange={(e) => updateNewProductTotalStock(size, Number(e.target.value))}
                  className="border p-2"
                  required
                />
                <label className="mt-2">{size} Size Available Stock</label>
                <input
                  type="number"
                  value={newProduct.available_stock[size]}
                  onChange={(e) => updateNewProductAvailableStock(size, Number(e.target.value))}
                  className="border p-2"
                  required
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;
