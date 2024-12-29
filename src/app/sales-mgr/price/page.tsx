"use client";
import React, { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  salePrice: number;
}

const UpdatePricePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [discountRate, setDiscountRate] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const handleUpdatePrice = async () => {
    if (!selectedProduct) {
      setMessage("Please select a product");
      return;
    }

    if (discountRate === null && newPrice === null) {
      setMessage("Please enter either a discount rate or a new price");
      return;
    }

    try {
      const body: Record<string, any> = { productId: selectedProduct._id };
      if (discountRate !== null) body.discountRate = discountRate;
      if (newPrice !== null) body.newPrice = newPrice;

      const response = await fetch(`/api/admin/sales/price`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(
          discountRate !== null
            ? `Discount applied! New price: $${data.newPrice.toFixed(2)}`
            : `Price updated to: $${data.newPrice.toFixed(2)}`
        );
        setSelectedProduct({ ...selectedProduct, salePrice  : data.newPrice });
      } else {
        setMessage(data.message || "Failed to update price");
      }
    } catch (error) {
      setMessage("An error occurred while updating the price");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Update Product Price</h1>

      <select
        onChange={(e) =>
          setSelectedProduct(products.find((p) => p._id === e.target.value) || null)
        }
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">Select a product</option>
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name} - ${product.salePrice.toFixed(2)}
          </option>
        ))}
      </select>

      <label className="w-full text-gray-700">
        Enter discount rate (%)
        <div className="relative w-full">
          <input
            type="number"
            value={discountRate || ""}
            onChange={(e) =>
              setDiscountRate(e.target.value ? parseFloat(e.target.value) : null)
            }
            placeholder="Discount rate (e.g., 20)"
            className="w-full p-2 border border-gray-300 rounded-md pr-8"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            %
          </span>
        </div>
      </label>

      <label className="w-full text-gray-700">
        Enter new price ($)
        <input
          type="number"
          value={newPrice || ""}
          onChange={(e) =>
            setNewPrice(e.target.value ? parseFloat(e.target.value) : null)
          }
          placeholder="New price (e.g., 49.99)"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </label>

      <button
        onClick={handleUpdatePrice}
        className="w-full p-2 bg-blue-600 text-white rounded-md"
      >
        Update Price
      </button>

      {message && <p className="text-center text-gray-700">{message}</p>}
    </div>
  );
};

export default UpdatePricePage;
