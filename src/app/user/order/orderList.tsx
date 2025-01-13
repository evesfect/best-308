import React, { useState } from "react";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import RefundButton from "./refundButton";

interface OrderListProps {
  orders: Order[];
  selectedOrder: Order | null;
  onSelectOrder: (order: Order) => void;
  orderedProducts: Map<string, Product>;
  userId: string;
  userEmail: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white transition-opacity duration-500 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
};

const OrderList: React.FC<OrderListProps> = ({
  orders,
  selectedOrder,
  onSelectOrder,
  orderedProducts,
  userId,
  userEmail,
}) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const [refundRequested, setRefundRequested] = useState<Set<string>>(new Set()); // Track requested refunds

  const handleCancelOrder = async (order: Order) => {
    try {
      const response = await fetch(`/api/order/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel order: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Order canceled successfully:", data);

      setToast({ message: "Order canceled successfully!", type: "success" });
    } catch (error) {
      console.error("Error canceling order:", error);
      setToast({ message: "Failed to cancel order. Please try again.", type: "error" });
    }
  };

  const handleRefundSubmitted = (productId: string) => {
    setRefundRequested((prev) => new Set(prev).add(productId)); // Mark refund as requested
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const orderPrice = Object.entries(order.products).reduce(
              (sum, [productId, quantity]) => {
                const product = orderedProducts.get(productId);
                const price = product ? product.salePrice : 0;
                return sum + price * quantity;
              },
              0
            );

            return (
              <li
                key={order._id.toString()}
                className={`p-4 bg-opacity-95 border border-gray-200 rounded-lg cursor-pointer ${
                  selectedOrder?._id === order._id
                    ? "bg-blue-200"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div onClick={() => onSelectOrder(order)}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        order.status === "processing"
                          ? "bg-red-100 text-red-600 border border-red-600"
                          : order.status === "in-transit"
                          ? "bg-yellow-100 text-yellow-600 border border-yellow-600"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-600 border border-green-600"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-600 border border-red-600"
                          : "bg-gray-100 text-gray-100"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium">Total Price: ${orderPrice.toFixed(2)}</p>
                </div>
                {order.status === "processing" && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleCancelOrder(order)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
                {order.status === "delivered" && (
                  <div className="mt-2">
                    {Object.entries(order.products).map(([productId, quantity]) => {
                      const product = orderedProducts.get(productId);
                      return (
                        <div key={productId} className="flex items-center justify-between py-2">
                          <div>
                            <span className="font-medium">{product?.name}</span>
                            <span className="text-gray-600 ml-2">x{quantity}</span>
                          </div>
                          <RefundButton
                            orderId={order._id.toString()}
                            userId={userId}
                            productId={productId}
                            quantity={quantity}
                            userEmail={userEmail}
                            purchaseDate={new Date(order.date).toISOString()}
                            onRefundSubmitted={() => handleRefundSubmitted(productId)}
                            isRefundRequested={refundRequested.has(productId)} // Pass refund requested state
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default OrderList;
