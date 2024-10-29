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
      const response = await axios.get('/api/admin/sales/stats'); // Create this API endpoint
      setStats(response.data);
    };
    fetchStats();
  }, []);

  const goToPrice = () =>{
    router.push('/sales-mgr/price')
  }


  const goToInvoices= () =>{
    router.push('/sales-mgr/invoices')
  }

  const goToGraph = () =>{
    router.push('/sales-mgr/graph')
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 space-y-20">
      <h1 className="text-3xl font-bold mb-6">Product Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Total Sales</h2>
          <p className="text-3xl mt-2">{stats?.sales || 0}</p>
        </div>
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl mt-2">{stats?.users || 0}</p>
        </div>
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Total Money Made</h2>
          <p className="text-3xl mt-2">{stats?.money || 0}</p>
        </div>
      </div>

      {/* Buttons for navigation */}
      <div className=" flex items-center justify-center space-x-4">
        <button
          onClick={goToGraph}
          className="p-10 bg-blue-500 text-white rounded shadow w-48 text-lg font-bold" // Set a fixed width
        >
          Graph
        </button>
        <button
          onClick={goToPrice}
          className="p-10 bg-green-500 text-white rounded shadow w-48 text-lg font-bold" // Set a fixed width
        >
          Discount
        </button>
        <button
          onClick={goToInvoices}
          className="p-10 bg-yellow-500 text-white rounded shadow w-48 text-lg font-bold" // Set a fixed width
        >
          Invoices
        </button>
      </div>
    </div>
  );
};

export default ProductMgrMainPage;
