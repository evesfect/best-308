//Should see invoices in given date range, save and dowload them as pdf's"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  date: string;
  customerDetails: {
    name: string;
    email: string;
    address: string;
  };
  items: Array<any>;
  totalAmount: number;
}

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { startDate?: string; endDate?: string } = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get("/api/invoice/view", { params });
      setInvoices(response.data);
    } catch (err) {
      setError("Failed to fetch invoices. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const response = await axios.get(`/api/invoice/${invoiceId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Failed to download invoice:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
            <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
                type="date"
                value={startDate}
                onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const formattedDate = selectedDate.toISOString().split("T")[0]; // yyyy-mm-dd
                setStartDate(formattedDate);
                }}
                className="block w-full border border-gray-300 rounded-md p-2"
            />
            <p className="text-gray-500 mt-1">
                Selected Date: {startDate ? new Date(startDate).toLocaleDateString("en-GB") : "Not selected"}
            </p>
            </div>
            <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
                type="date"
                value={endDate}
                onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const formattedDate = selectedDate.toISOString().split("T")[0]; // yyyy-mm-dd
                setEndDate(formattedDate);
                }}
                className="block w-full border border-gray-300 rounded-md p-2"
            />
            <p className="text-gray-500 mt-1">
                Selected Date: {endDate ? new Date(endDate).toLocaleDateString("en-GB") : "Not selected"}
            </p>
            </div>
        </div>
        <button
            onClick={fetchInvoices}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
            Filter Invoices
        </button>
        </div>


      {loading && <p className="text-gray-500">Loading invoices...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-4">
        {invoices.map((invoice) => (
          <li
            key={invoice._id}
            className="bg-white border border-gray-200 rounded-md shadow p-4"
          >
            <div
              onClick={() =>
                setExpandedInvoiceId(
                  expandedInvoiceId === invoice._id ? null : invoice._id
                )
              }
              className="cursor-pointer flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg">Invoice #{invoice.invoiceNumber}</h3>
                <p className="text-sm text-gray-600">
                  Date: {new Date(invoice.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Customer: {invoice.customerDetails.name}</p>
              </div>
              <div>
                <span className="text-blue-500">
                  {expandedInvoiceId === invoice._id ? "Hide Details" : "View Details"}
                </span>
              </div>
            </div>
            {expandedInvoiceId === invoice._id && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Details:</h4>
                <p>Email: {invoice.customerDetails.email}</p>
                <p>Address: {invoice.customerDetails.address}</p>
                <p>Total Amount: ${invoice.totalAmount.toFixed(2)}</p>
                <ul className="list-disc pl-5">
                  {invoice.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} - {item.size} - {item.color} x{item.quantity} - $
                      {item.salePrice}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => downloadInvoice(invoice._id, invoice.invoiceNumber)}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Download PDF
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {!loading && invoices.length === 0 && (
        <p className="text-gray-500">No invoices found.</p>
      )}
    </div>
  );
};

export default InvoicesPage;
