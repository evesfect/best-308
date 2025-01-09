import React, { useState } from 'react';
import axios from 'axios';

interface RefundButtonProps {
    orderId: string;
    userId: string;
    productId: string;
    quantity: number;
    onRefundSubmitted: () => void;
}

const RefundButton: React.FC<RefundButtonProps> = ({ 
    orderId, 
    userId, 
    productId,
    quantity,
    onRefundSubmitted 
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [response, setResponse] = useState<any>(null);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        setResponse(null);

        try {
            const result = await axios.post('/api/refundtest', {
                order_id: orderId,
                user_id: userId,
                products: { [productId]: quantity },
                reason
            });

            setResponse(result.data);
            setIsModalOpen(false);
            onRefundSubmitted();
        } catch (error) {
            console.error('Refund request error:', error);
            setError('Failed to submit refund request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
                Request Refund
            </button>

            {isModalOpen && (
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
                                className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RefundButton;