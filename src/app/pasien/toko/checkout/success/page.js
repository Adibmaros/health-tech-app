// app/pasien/toko/checkout/success/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If no order ID is present, redirect back to the shop
    if (!orderId) {
      router.push("/pasien/toko");
      return;
    }

    fetchOrderDetails(orderId);
  }, [orderId, router]);

  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();
      setOrderDetails(data.order);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Tidak dapat memuat detail pesanan. Silakan periksa riwayat pesanan Anda.");
    } finally {
      setLoading(false);
    }
  };

  // Format date to Indonesian format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-green-500 w-16 h-16" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h1>
          <p className="text-gray-600">Terima kasih telah berbelanja di toko kami.</p>
        </div>

        {loading ? (
          <div className="text-center py-8 flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
            <p>Memuat detail pesanan...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
              <p>{error}</p>
            </div>
            <Link href="/pasien/toko" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors">
              Kembali ke Toko
            </Link>
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Detail Pesanan</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="mb-2">
                  <span className="font-medium">ID Pesanan:</span> {orderId}
                </p>
                {orderDetails && (
                  <>
                    <p className="mb-2">
                      <span className="font-medium">Tanggal Pesanan:</span> {formatDate(orderDetails.created_at)}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Nama:</span> {orderDetails.nama_lengkap}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Alamat Pengiriman:</span> {orderDetails.alamat}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Total Pembayaran:</span> Rp {orderDetails.total_amount?.toLocaleString("id-ID") || "0"}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Status Pesanan:</span> <span className="text-green-500 font-semibold">Menunggu Konfirmasi</span>
                    </p>

                    {orderDetails.bukti_bayar && (
                      <div className="mt-4">
                        <p className="font-medium mb-2">Bukti Pembayaran:</p>
                        <div className="w-full max-w-xs border rounded-md overflow-hidden">
                          <img src={orderDetails.bukti_bayar} alt="Bukti pembayaran" className="w-full h-auto" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {orderDetails && orderDetails.order_items && orderDetails.order_items.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Item Pesanan</h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-1">Produk</th>
                          <th className="text-center py-2 px-1">Jumlah</th>
                          <th className="text-right py-2 px-1">Harga</th>
                          <th className="text-right py-2 px-1">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails.order_items.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 last:border-b-0">
                            <td className="py-2 px-1">{item.product?.name || `Produk #${item.product_id}`}</td>
                            <td className="py-2 px-1 text-center">{item.quantity}</td>
                            <td className="py-2 px-1 text-right">Rp {item.unit_price?.toLocaleString("id-ID")}</td>
                            <td className="py-2 px-1 text-right">Rp {(item.unit_price * item.quantity)?.toLocaleString("id-ID")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Informasi Penting</h2>
              <div className="bg-blue-50 p-4 rounded-md text-blue-800">
                <p className="mb-2">• Pesanan Anda akan segera diproses oleh tim kami.</p>
                <p className="mb-2">• Konfirmasi pesanan telah dikirim ke email Anda (jika Anda memberikan alamat email).</p>
                <p>• Untuk pertanyaan lebih lanjut, silakan hubungi layanan pelanggan kami.</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <Link href="/pasien/toko" className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition-colors">
                Kembali ke Toko
              </Link>
              {/* <Link href="/pasien/pesanan" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors">
                Lihat Pesanan Saya
              </Link> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
