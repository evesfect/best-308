import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface RefundButtonProps {
  orderId: string;
  userId: string;
  productId: string;
  quantity: number;
  userEmail: string;
  purchaseDate: string;
  onRefundSubmitted: () => void;
  isRefundRequested: boolean; // New prop to indicate refund status
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
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white transition-opacity duration-500 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      {message}
    </div>
  );
};

const RefundButton: React.FC<RefundButtonProps> = ({
  orderId,
  userId,
  productId,
  quantity,
  userEmail,
  purchaseDate,
  onRefundSubmitted,
  isRefundRequested, // New prop
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setResponse(null);

    try {
      const result = await axios.post('/api/refundtest', {
        order_id: orderId,
        user_id: userId,
        products: { [productId]: quantity },
        user_email: userEmail,
        reason,
      });

      setResponse(result.data);
      setToast({ message: 'Refund request submitted successfully!', type: 'success' });
      setIsModalOpen(false);
      onRefundSubmitted(); // Notify parent that refund is submitted
    } catch (error) {
      console.error('Refund request error:', error);
      setToast({ message: 'Failed to submit refund request.', type: 'error' });
      setError('Failed to submit refund request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRefundable = () => {
    const purchaseDateTime = new Date(purchaseDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return purchaseDateTime > thirtyDaysAgo;
  };

  if (isRefundRequested) {
    return (
      <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed">
        Refund Requested
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={!isRefundable()}
        className={`px-4 py-2 text-white rounded text-sm ${
          isRefundable()
            ? 'bg-orange-400 hover:bg-orange-500 cursor-pointer'
            : 'bg-gray-300 cursor-not-allowed opacity-50'
        }`}
      >
        {isRefundable() ? 'Request Refund' : 'Refund Period Expired'}
      </button>

      {isModalOpen && isRefundable() && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Request Refund</h2>
            <p className="mb-4">Quantity: {quantity}</p>
            <textarea
              className="w-full p-2 border rounded mb-4"
              placeholder="Please provide a reason for the refund..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {response && (
              <pre className="bg-gray-100 p-2 mb-4 rounded text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !reason.trim()}
                className="px-4 py-2 bg-orange-400 text-white rounded disabled:bg-gray-400"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default RefundButton;
