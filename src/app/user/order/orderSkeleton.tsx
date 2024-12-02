import React from "react";

const OrderSkeleton: React.FC = () => (
  <div className="p-4 space-y-2">
    {[1, 2, 3].map((key) => (
      <div
        key={key}
        className="animate-pulse p-4 bg-gray-200 dark:bg-gray-700 rounded-lg"
      >
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

export default OrderSkeleton;
