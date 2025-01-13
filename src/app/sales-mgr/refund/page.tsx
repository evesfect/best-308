"use client"
import React, { Ref, useEffect, useState } from 'react';

interface Refund {
    _id: string;
    order_id: string; 
    user_id: string; 
    products: { [productId: string]: number }; 
    reason: string; 
    status: string; 
    requestDate: Date; 
    refundAmount: number; 
  }

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
      <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white transition-opacity duration-500
      ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
        {message}
      </div>
  );
};

const OrderManagement: React.FC = () => {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds= async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sales/refund');
      if (!response.ok) {
        throw new Error(`Failed to fetch refunds: ${response.statusText}`);
      }
      const data: Refund[] = await response.json();
      setRefunds(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRefundStatus = async (refundId: string, newStatus: Refund['status']) => {
    try {
      const response = await fetch(`/api/admin/sales/refund`, {
        method: 'POST', // Send POST request to update status
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: refundId,
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      if (response.ok) {
        setToast({ message: "Refund status updated successfully!", type: "success" });
        fetchRefunds(); // Refresh refunds
      } else {
        const data = await response.json();
        setToast({ message: `Failed to update status: ${data.message || response.statusText}`, type: "error" });
      }
      fetchRefunds(); // This will refresh the orders automatically
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading refunds...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Refund Management</h1>
      <div className="max-w-7xl mx-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Products</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">User</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Reason</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((refund) => (
              <tr key={refund._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{refund._id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {Object.entries(refund.products).map(([productId, quantity]) => (
                    <div key={productId}>
                      Product ID: {productId}, Quantity: {quantity}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">{refund.user_id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{refund.reason}</td>
                <td className='px-4 py-2 text-sm text-gray-800'>{refund.refundAmount}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{refund.status}</td>
                <td className="px-4 py-2 text-sm">
                  <select
                    value={refund.status}
                    onChange={(e) => updateRefundStatus(refund._id, e.target.value as Refund['status'])}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default OrderManagement;
