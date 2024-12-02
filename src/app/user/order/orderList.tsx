import React from "react";
import { Order } from "@/types/order";
import { Product } from "@/types/product";

interface OrderListProps {
  orders: Order[];
  selectedOrder: Order | null;
  onSelectOrder: (order: Order) => void;
  orderedProducts: Map<string, Product>;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  selectedOrder,
  onSelectOrder,
  orderedProducts,
}) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <ul className="space-y-2">
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
                key={order._id}
                className={`p-4 bg-opacity-95 border border-gray-200 rounded-lg cursor-pointer  ${
                  selectedOrder?._id === order._id
                    ? "bg-blue-200 dark:bg-blue-900"
                    : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                onClick={() => onSelectOrder(order)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
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
                <p className="text-gray-800 dark:text-white font-medium">
                  Total Price: ${orderPrice.toFixed(2)}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default OrderList;