// pages/RevenueChart.tsx
"use client";

import React, { useState, useEffect } from "react";
import LineChart from "@/components/LineChart";

const RevenueChartPage = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
  
      const response = await fetch(`/api/admin/sales/graph?${params.toString()}`);
      const data = await response.json();
  
      console.log("API response data:", data); // Debug log for received data
  
      if (!data || !Array.isArray(data.chartData) || data.chartData.length === 0) {
        console.error("No data available for chart.");
        setChartData(null);
        return;
      }
  
      const labels = data.chartData.map((entry: any) => entry.date);
      const netRevenue = data.chartData.map((entry: any) => entry.netRevenue);
  
      setChartData({
        labels,
        datasets: [
          {
            label: "Net Revenue",
            data: netRevenue,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch revenue data:", error);
      setChartData(null);
    }
  };
  
  

  const handleFilter = () => {
    fetchRevenueData();
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Revenue Over Time",
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Revenue Chart</h1>
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md p-2"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Filter
        </button>
      </div>
      {chartData ? (
  <>
    {console.log("Rendering LineChart with data:", chartData)} {/* Debug */}
    <LineChart
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Revenue Over Time" },
        },
      }}
    />
  </>
) : (
  <p className="text-gray-500">No data available for the selected date range.</p>
)}

    </div>
  );
};

export default RevenueChartPage;
