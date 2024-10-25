'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);


  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded shadow">
              <h2 className="text-xl font-semibold">Total Products</h2>
              <p className="text-3xl mt-2">{stats?.products || 0}</p>
            </div>
            <div className="p-6 bg-white rounded shadow">
              <h2 className="text-xl font-semibold">Total Users</h2>
              <p className="text-3xl mt-2">{stats?.users || 0}</p>
            </div>
            <div className="p-6 bg-white rounded shadow">
              <h2 className="text-xl font-semibold">Total Orders</h2>
              <p className="text-3xl mt-2">{stats?.orders || 0}</p>
            </div>
          </div>
    </div>
  );
};

export default AdminDashboard;
