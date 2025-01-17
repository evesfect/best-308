import React from "react";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OrderDetailsProps {
  order: Order;
  orderedProducts: Map<string, Product>;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, orderedProducts }) => {

  const router = useRouter();

  const orderPrice = Object.entries(order.products).reduce(
    (sum, [productId, quantity]) => {
      const product = orderedProducts.get(productId);
      const price = product ? product.salePrice : 0;
      return sum + price * quantity;
    },
    0
  );

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gray-100 bg-opacity-95 border border-gray-200 rounded-lg shadow-lg">
      {/* Header Section */}
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      {/* Delivery Date and Status */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-lg font-semibold text-gray-800">Date:</p>
          <p className="text-lg text-gray-600">
            {new Date(order.date).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded text-lg font-medium bg-opacity-95 ${
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

      {/* Delivery Address */}
      <div className="mb-4">
        <p className="text-lg font-semibold text-gray-800">Address:</p>
        <p className="text-gray-600 text-sm">{order.address}</p>
      </div>

      {/* Total Price */}
      <div className="mb-4">
        <p className="text-lg font-semibold text-gray-800">Total Price:</p>
        <p className="text-lg text-gray-600">${orderPrice.toFixed(2)}</p>
      </div>

      {/* Product Section */}
      <h3 className="text-xl font-semibold mb-4">Products</h3>
      <ul className="space-y-4">
        {Object.entries(order.products).map(([productId, quantity]) => {
          const product = orderedProducts.get(productId);
          return (
            <li
              key={productId}
              className="p-4 rounded-lg shadowed-lg bg-opacity-95 border border-gray-300 flex items-start space-x-4"
              onClick = {() => router.push(`/product/${productId}`)}
            >
              <Image
                src={`/api/images/${product?.imageId}`}
                alt={product?.name}
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex flex-col space-y-1">
                <p className="text-gray-800 font-medium">
                  {product?.name}
                </p>
                <p className="text-sm text-gray-600">
                  Quantity: {quantity}
                </p>
                <p className="text-sm text-gray-600">
                  Price: ${product?.salePrice.toFixed(2)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Bottom Spacer */}
      <div className="mt-auto pt-6 border-t border-gray-300">
        <p className="text-center text-gray-600 text-sm">
          Thank you for your order!
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;

