"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ApotekerNavbar from "@/components/ApotekerNavbar";

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("SEMUA");
  const [activePaymentFilter, setActivePaymentFilter] = useState("SEMUA");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Gagal mengambil data pesanan");
        }
        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data pesanan");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "MENUNGGU":
        return "bg-yellow-100 text-yellow-800";
      case "DIPROSES":
        return "bg-blue-100 text-blue-800";
      case "DIKIRIM":
        return "bg-purple-100 text-purple-800";
      case "SELESAI":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusBadgeClass = (status) => {
    return status === "DIBAYAR" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch = activeFilter === "SEMUA" || order.approval_status === activeFilter;
    const paymentMatch = activePaymentFilter === "SEMUA" || order.payment_status === activePaymentFilter;
    return statusMatch && paymentMatch;
  });

  const statusCounts = {
    SEMUA: orders.length,
    MENUNGGU: orders.filter((order) => order.approval_status === "MENUNGGU").length,
    DIPROSES: orders.filter((order) => order.approval_status === "DIPROSES").length,
    DIKIRIM: orders.filter((order) => order.approval_status === "DIKIRIM").length,
    SELESAI: orders.filter((order) => order.approval_status === "SELESAI").length,
  };

  const paymentStatusCounts = {
    SEMUA: orders.length,
    PENDING: orders.filter((order) => order.payment_status === "PENDING").length,
    DIBAYAR: orders.filter((order) => order.payment_status === "DIBAYAR").length,
  };

  return (
    <ApotekerNavbar>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manajemen Pesanan</h1>
            <div className="flex space-x-2">
              <div className="relative">
                <button
                  className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    // Export functionality can be added here
                    alert("Fitur ekspor belum tersedia");
                  }}
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : (
            <>
              {/* Status Tabs */}
              <div className="mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    {Object.entries({
                      SEMUA: "Semua Pesanan",
                      MENUNGGU: "Menunggu",
                      DIPROSES: "Diproses",
                      DIKIRIM: "Dikirim",
                      SELESAI: "Selesai",
                    }).map(([status, label]) => (
                      <button
                        key={status}
                        onClick={() => setActiveFilter(status)}
                        className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${activeFilter === status ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                      >
                        {label}
                        <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${activeFilter === status ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-800"}`}>{statusCounts[status]}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Secondary Filter - Payment Status */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {Object.entries({
                    SEMUA: "Semua",
                    PENDING: "Menunggu Pembayaran",
                    DIBAYAR: "Sudah Dibayar",
                  }).map(([status, label]) => (
                    <button
                      key={status}
                      onClick={() => setActivePaymentFilter(status)}
                      className={`px-4 py-2 text-sm font-medium rounded-full ${activePaymentFilter === status ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    >
                      {label}
                      <span className="ml-1 text-xs">({paymentStatusCounts[status]})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">Tidak ada pesanan yang sesuai dengan filter</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pelanggan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pembayaran</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pesanan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.order_date)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.nama_lengkap}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {order.total_amount.toLocaleString("id-ID")}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(order.payment_status)}`}>{order.payment_status}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.approval_status)}`}>{order.approval_status}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link href={`/apoteker/pesanan/${order.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                                Detail
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Summary Cards */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { status: "MENUNGGU", label: "Pesanan Menunggu", color: "yellow" },
                  { status: "DIPROSES", label: "Sedang Diproses", color: "blue" },
                  { status: "DIKIRIM", label: "Sedang Dikirim", color: "purple" },
                  { status: "SELESAI", label: "Pesanan Selesai", color: "green" },
                ].map((item) => (
                  <div key={item.status} className={`bg-white rounded-lg shadow p-4 border-l-4 border-${item.color}-500`} onClick={() => setActiveFilter(item.status)}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`h-12 w-12 rounded-full bg-${item.color}-100 flex items-center justify-center`}>
                          <span className={`text-${item.color}-600 font-bold text-lg`}>{statusCounts[item.status]}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{item.label}</h3>
                        <p className="text-xs text-gray-500">Klik untuk melihat</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ApotekerNavbar>
  );
}
