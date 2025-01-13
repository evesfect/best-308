"use client";

import React, { useEffect, useState } from 'react';

interface Order {
  _id: string;
  products: Record<string, number>;
  user_id: string;
  address: string;
  completed: boolean;
  date: string;
  status: 'processing' | 'in-transit' | 'delivered';
  totalPrice: number; // Add totalPrice attribute
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/product/orders');
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }
      const data: Order[] = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/admin/product/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: orderId,
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      fetchOrders();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Order Management</h1>
      <div className="max-w-7xl mx-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Products</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">User</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Address</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Total Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{order._id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {Object.entries(order.products).map(([productId, quantity]) => (
                    <div key={productId}>
                      Product ID: {productId}, Quantity: {quantity}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">{order.user_id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{order.address}</td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">{order.status}</td>
                <td className="px-4 py-2 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value as Order['status'])}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="processing">Processing</option>
                    <option value="in-transit">In-Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
