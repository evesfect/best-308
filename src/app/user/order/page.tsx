"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ObjectId } from "mongodb";
import OrderList from "./orderList";
import OrderDetails from "./orderDetails";
import OrderSkeleton from "./orderSkeleton";
import { Order } from "@/types/order";
import { Product } from "@/types/product";

interface UserOrdersProps {
  userId: ObjectId;
}

const UserOrders: React.FC<UserOrdersProps> = ({ userId }) => {
  const { data: session } = useSession();
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [orderedProducts, setOrderedProducts] = useState<Map<string, Product>>(new Map());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const orderResponse = await axios.get("/api/users/orders", {
          params: { user_id: userId },
        });

        const userOrders: Order[] = Array.isArray(orderResponse.data.userOrders)
          ? orderResponse.data.userOrders
          : [];
        setOrderData(userOrders);

        const productIds = Array.from(
          new Set(userOrders.flatMap((order) => Object.keys(order.products)))
        );

        const productMap = new Map<string, Product>();
        await Promise.all(
          productIds.map(async (productId) => {
            try {
              const productResponse = await axios.get("/api/product-from-processed", {
                params: {id: productId},
              });
              console.log(productId);
              productMap.set(productId as string, productResponse.data);
            }
            catch (error) {
              if (axios.isAxiosError(error) && error.response) {
                console.warn(`Product with ID ${productId} not found or error occurred. Status: ${error.response.status}`);
              } else {
                console.error(`Unexpected error fetching product with ID ${productId}:`, error);
              }
              return 0;
              }
          })
        );

        setOrderedProducts(productMap);
        console.log("Ordered Products:",orderedProducts);
        if (userOrders.length > 0) {
          setSelectedOrder(userOrders[0]);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [userId]);

  if (loading) {
    return <OrderSkeleton />;
  }

  return (
    <div className="flex w-full gap-5">
      {!loading && orderData.length === 0 ? (
        <div className="flex flex-col justify-center items-center w-full mt-20">
          <img
            src="/icons/delivery.svg"
            alt="No orders icon"
            className="mb-4"
            width={64}
            height={64}
          />
        <p className="text-xl text-gray-600">You haven&#39;t placed any orders yet!</p>
        <p className="text-sm text-gray-500">Start shopping to see your orders here.</p>
      </div>
      ) : (
        <>
          {/* Left Side: Order List */}
          <div className="w-1/3 bg-white">
            <OrderList
              orders={orderData}
              selectedOrder={selectedOrder}
              onSelectOrder={setSelectedOrder}
              orderedProducts={orderedProducts}
              userId={userId.toString()}
              userEmail={session?.user?.email || ''}
            />
          </div>

          {/* Right Side: Order Details */}
          <div className="flex-1 bg-white">
            {selectedOrder ? (
              <OrderDetails order={selectedOrder} orderedProducts={orderedProducts} />
            ) : (
              <p className="text-gray-500 p-6">Select an order to view details.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserOrders;