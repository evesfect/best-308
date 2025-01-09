import React from "react";
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

const OrderList: React.FC<OrderListProps> = ({
  orders,
  selectedOrder,
  onSelectOrder,
  orderedProducts,
  userId,
  userEmail,
}) => {
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
                className={`p-4 bg-opacity-95 border border-gray-200 rounded-lg cursor-pointer  ${
                  selectedOrder?._id === order._id
                    ? "bg-blue-200"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div onClick={() => onSelectOrder(order)}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        order.status === "processing" ? "bg-red-100 text-red-600 border border-red-600"
                          : order.status === "in-transit" ? "bg-yellow-100 text-yellow-600 border border-yellow-600"
                          : order.status === "delivered" ? "bg-green-100 text-green-600 border border-green-600"
                        : "bg-gray-100 text-gray-100"
                      }`}
                    >
                      {order.status === "processing" ? "Processing" 
                        : order.status === "in-transit" ? "In-Transit"
                        : order.status === "delivered" ? "Delivered"
                        : "Unknown"
                      }
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium">
                    Total Price: ${orderPrice.toFixed(2)}
                  </p>
                </div>
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
                            onRefundSubmitted={() => {
                              // Optionally refresh the orders list
                            }}
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
    </div>
  );
};

export default OrderList;