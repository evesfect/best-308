'use client'
import React, { useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  image: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/product/category");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.name) {
      setError("Both name and image are required.");
      return;
    }

    setError(null);
    try {
      const response = await fetch("/api/admin/product/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      const addedCategory: Category = await response.json();
      setCategories([...categories, addedCategory]);
      setNewCategory({ name: "", image: "" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteCategory = async (id: string) => {
    setError(null);
  
    try {
      const response = await fetch(`/api/admin/product/categories/${id}`, {
        method: "DELETE", 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }
  
      setCategories(categories.filter((category) => category._id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-md shadow">
  <h2 className="text-lg font-semibold mb-4 text-center">Category Management</h2>
  {loading && <p className="text-gray-500">Loading...</p>}
  {error && <p className="text-red-500">{error}</p>}

  {/* List of Categories */}
  {categories.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <div
          key={category._id}
          className="p-3 bg-gray-50 border border-gray-200 rounded-md flex flex-col items-center justify-center"
        >
          <img
            src={`/api/images/${category.image}`}
            alt={category.name}
            className="w-16 h-16 object-cover rounded-full mb-2"
          />
          
          <button
            onClick={() => deleteCategory(category._id)}
            className="mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 text-center">No categories found</p>
  )}

  {/* Add Category Form */}
  <div className="mt-6">
    <h3 className="text-md font-semibold mb-2 text-center">Add New Category</h3>
    <div className="flex flex-wrap justify-center items-center gap-4">
      <input
        type="text"
        placeholder="Category Name"
        value={newCategory.name}
        onChange={(e) =>
          setNewCategory({ ...newCategory, name: e.target.value })
        }
        className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Image URL"
        value={newCategory.image}
        onChange={(e) =>
          setNewCategory({ ...newCategory, image: e.target.value })
        }
        className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        onClick={addCategory}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add
      </button>
    </div>
  </div>
</div>
  );
};

export default CategoryManagement;
