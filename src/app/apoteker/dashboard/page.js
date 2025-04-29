"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ApotekerNavbar from "@/components/ApotekerNavbar";

export default function ApotekerDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    newOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Gagal mengambil data pesanan");
        }
        const data = await response.json();
        setOrders(data.orders);

        // Filter out completed orders for the main display
        const unfinishedOrders = data.orders.filter((order) => order.approval_status !== "SELESAI");
        setActiveOrders(unfinishedOrders);

        // Calculate statistics
        const newOrdersCount = data.orders.filter((order) => order.approval_status === "MENUNGGU").length;
        const processingOrdersCount = data.orders.filter((order) => order.approval_status === "DIPROSES").length;
        const completedOrdersCount = data.orders.filter((order) => order.approval_status === "SELESAI").length;

        setStats({
          newOrders: newOrdersCount,
          processingOrders: processingOrdersCount,
          completedOrders: completedOrdersCount,
        });
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

  return (
    <ApotekerNavbar>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">Dashboard Apoteker</h1>

        {/* Dashboard stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Pesanan Baru</h2>
            <div className="text-3xl font-bold text-yellow-600">{stats.newOrders}</div>
            <p className="text-gray-500 mt-2">Perlu verifikasi resep</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Sedang Diproses</h2>
            <div className="text-3xl font-bold text-blue-600">{stats.processingOrders}</div>
            <p className="text-gray-500 mt-2">Perlu penyiapan obat</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Pesanan Selesai</h2>
            <div className="text-3xl font-bold text-green-600">{stats.completedOrders}</div>
            <p className="text-gray-500 mt-2">Bulan ini</p>
          </div>
        </div>

        {/* Pesanan yang perlu diproses */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Manajemen Pesanan Aktif</h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasien</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Obat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pembayaran</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pesanan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          Tidak ada pesanan aktif saat ini
                        </td>
                      </tr>
                    ) : (
                      activeOrders.map((order) => (
                        <tr key={order.id} className={order.approval_status === "MENUNGGU" ? "bg-yellow-50" : ""}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.order_date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.nama_lengkap}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_items?.length || 0} item</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(order.payment_status)}`}>{order.payment_status}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.approval_status)}`}>{order.approval_status}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link href={`/apoteker/pesanan/${order.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                              Kelola
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ApotekerNavbar>
  );
}
