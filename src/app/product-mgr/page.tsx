'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const ProductMgrMainPage = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const response = await axios.get('/api/admin/product/stats'); // Create this API endpoint
      setStats(response.data);
    };
    fetchStats();
  }, []);

  const goToComments = () =>{
    router.push('/product-mgr/comments')
  }

  const goToDeliveries = () =>{
    router.push('/product-mgr/deliveries')
  }

  const goToInvoices= () =>{
    router.push('/product-mgr/invoices')
  }

  const goToProducts = () =>{
    router.push('/product-mgr/products')
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 space-y-20">
      <h1 className="text-3xl font-bold mb-6">Product Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-3xl mt-2">{stats?.products || 0}</p>
        </div>
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl mt-2">{stats?.users || 0}</p>
        </div>
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Total Deliveries</h2>
          <p className="text-3xl mt-2">{stats?.delivery || 0}</p>
        </div>
      </div>

      {/* Buttons for navigation */}
      <div className=" flex items-center justify-center space-x-4">
        <button
          onClick={goToComments}
          className="p-10 bg-blue-500 text-white rounded shadow w-48 text-lg font-bold" // Set a fixed width
        >
          Comments
        </button>
        <button
          onClick={goToDeliveries}
          className="p-10 bg-green-500 text-white rounded shadow w-48 text-lg font-bold" // Set a fixed width
        >
          Deliveries
        </button>
        <button
          onClick={goToInvoices}
          className="p-10 bg-yellow-500 text-white rounded shadow w-48 text-lg font-bold" // Set a fixed width
        >
          Invoices
        </button>
        <button
          onClick={goToProducts}
          className="p-10 bg-purple-500 text-white rounded shadow w-48 text-lg font-bold" // Set a fixed width
        >
         Products
        </button>
      </div>
    </div>
  );
};

export default ProductMgrMainPage;
