"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import ApotekerNavbar from "@/components/ApotekerNavbar";

export default function OrderDetailPage({ params }) {
  // Gunakan React.use untuk unwrap params
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [stockReduced, setStockReduced] = useState(false);
  const router = useRouter();

  // Fungsi untuk menghasilkan URL WhatsApp
  const generateWhatsAppUrl = (order) => {
    try {
      // Format nomor telepon ke format internasional (menghilangkan 0 di awal dan tambahkan 62)
      let phoneNumber = order.no_telp;
      if (phoneNumber.startsWith("0")) {
        phoneNumber = "62" + phoneNumber.substring(1);
      }

      // Buat teks untuk daftar produk yang dibeli
      let productList = "";
      order.order_items.forEach((item, index) => {
        const productName = item.product ? item.product.name : "Produk tidak tersedia";
        const quantity = item.quantity;
        const price = item.unit_price ? (item.unit_price * quantity).toLocaleString("id-ID") : "0";

        productList += `${index + 1}. ${productName} (${quantity} pcs) - Rp ${price}\n`;
      });

      // Format pesan lengkap
      const message = `
*PEMBERITAHUAN PENGIRIMAN PESANAN*
      
Halo ${order.nama_lengkap},
      
Pesanan Anda dengan ID #${order.id} sedang dalam proses pengiriman.
*Detail Pesanan:*
${productList}
*Total:* Rp ${order.total_amount.toLocaleString("id-ID")}
Pesanan akan segera tiba di alamat:
${order.alamat}
Jika ada pertanyaan, silakan hubungi kami.
Terima kasih telah berbelanja!
Salam Sehat,
Tim Apotek HealthMed
`;

      // Enkode pesan untuk URL
      const encodedMessage = encodeURIComponent(message);

      // Generate URL untuk WhatsApp
      return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    } catch (error) {
      console.error("Error generating WhatsApp URL:", error);
      return null;
    }
  };

  // Fungsi untuk mengurangi stok produk
  const reduceProductStock = async () => {
    try {
      if (!order || !order.order_items || order.order_items.length === 0) {
        console.error("No order items found to reduce stock");
        return;
      }

      // Buat array berisi item pesanan dengan ID produk dan jumlahnya
      const itemsToReduce = order.order_items.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
      }));

      // Kirim permintaan ke API untuk mengurangi stok
      const response = await fetch(`/api/products/reduce-stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          items: itemsToReduce,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengurangi stok produk");
      }

      const data = await response.json();
      console.log("Stock reduced successfully:", data);
      setStockReduced(true);
      return true;
    } catch (err) {
      console.error("Error reducing product stock:", err);
      alert("Terjadi kesalahan saat mengurangi stok produk");
      return false;
    }
  };

  // Fungsi untuk memeriksa kondisi stok
  const checkAndReduceStock = async (currentOrder) => {
    if (currentOrder && currentOrder.approval_status === "DIKIRIM" && currentOrder.payment_status === "DIBAYAR" && !stockReduced) {
      // Kurangi stok dan tandai sebagai sudah dikurangi
      await reduceProductStock();
    }
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) {
          throw new Error("Gagal mengambil detail pesanan");
        }
        const data = await response.json();
        setOrder(data.order);

        // Cek apakah pesanan sudah berstatus "DIKIRIM" dan "DIBAYAR"
        // Jika iya, langsung generate WhatsApp URL dan cek stok
        if (data.order.approval_status === "DIKIRIM" && data.order.payment_status === "DIBAYAR") {
          const url = generateWhatsAppUrl(data.order);
          setWhatsappUrl(url);
          console.log("WhatsApp URL generated on initial load:", url);

          // Cek status stok
          await checkAndReduceStock(data.order);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil detail pesanan");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  // Tambahkan useEffect untuk mendengarkan perubahan pada order
  useEffect(() => {
    if (order) {
      checkAndReduceStock(order);
    }
  }, [order]);

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

  const updateOrderStatus = async (status) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approval_status: status }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengupdate status pesanan");
      }

      const data = await response.json();
      setOrder(data.order);

      // Check if API returns WhatsApp URL
      if (data.whatsappUrl) {
        setWhatsappUrl(data.whatsappUrl);
        console.log("WhatsApp URL from API:", data.whatsappUrl);
        alert(`Status pesanan berhasil diubah menjadi ${status}. Anda bisa mengirim notifikasi WhatsApp kepada pelanggan.`);
      } else if (status === "DIKIRIM" && data.order.payment_status === "DIBAYAR") {
        // Generate WhatsApp URL jika tidak disediakan oleh API tapi kondisi terpenuhi
        const url = generateWhatsAppUrl(data.order);
        setWhatsappUrl(url);
        console.log("WhatsApp URL generated locally:", url);
        alert(`Status pesanan berhasil diubah menjadi ${status}. Anda bisa mengirim notifikasi WhatsApp kepada pelanggan.`);

        // Cek dan kurangi stok
        await checkAndReduceStock(data.order);
      } else {
        alert(`Status pesanan berhasil diubah menjadi ${status}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengupdate status pesanan");
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const updatePaymentStatus = async (status) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_status: status }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengupdate status pembayaran");
      }

      const data = await response.json();
      setOrder(data.order);

      // Check if API returns WhatsApp URL
      if (data.whatsappUrl) {
        setWhatsappUrl(data.whatsappUrl);
        console.log("WhatsApp URL from API:", data.whatsappUrl);
        alert(`Status pembayaran berhasil diubah menjadi ${status}. Anda bisa mengirim notifikasi WhatsApp kepada pelanggan.`);
      } else if (status === "DIBAYAR" && data.order.approval_status === "DIKIRIM") {
        // Generate WhatsApp URL jika tidak disediakan oleh API tapi kondisi terpenuhi
        const url = generateWhatsAppUrl(data.order);
        setWhatsappUrl(url);
        console.log("WhatsApp URL generated locally:", url);
        alert(`Status pembayaran berhasil diubah menjadi ${status}. Anda bisa mengirim notifikasi WhatsApp kepada pelanggan.`);

        // Cek dan kurangi stok
        await checkAndReduceStock(data.order);
      } else {
        alert(`Status pembayaran berhasil diubah menjadi ${status}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengupdate status pembayaran");
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
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

  const sendWhatsAppNotification = () => {
    if (!whatsappUrl) {
      // Jika URL tidak ada, coba generate baru
      if (order && order.approval_status === "DIKIRIM" && order.payment_status === "DIBAYAR") {
        const url = generateWhatsAppUrl(order);
        if (url) {
          console.log("Generated new WhatsApp URL:", url);
          setWhatsappUrl(url);
          window.open(url, "_blank");
        } else {
          alert("Gagal membuat URL notifikasi WhatsApp");
        }
      } else {
        alert("URL notifikasi WhatsApp tidak tersedia. Pastikan status pesanan DIKIRIM dan pembayaran DIBAYAR.");
      }
    } else {
      console.log("Opening WhatsApp with URL:", whatsappUrl);
      // Use direct window.open to avoid potential browser security issues
      try {
        const newWindow = window.open(whatsappUrl, "_blank");
        // Check if window opened successfully
        if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
          alert("Tidak dapat membuka WhatsApp. Pastikan popup tidak diblokir oleh browser Anda.");
        }
      } catch (error) {
        console.error("Error opening WhatsApp URL:", error);
        alert("Gagal membuka WhatsApp. Error: " + error.message);
      }
    }
  };

  if (loading) {
    return (
      <ApotekerNavbar>
        <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
          <div className="text-lg">Memuat data...</div>
        </div>
      </ApotekerNavbar>
    );
  }

  if (error) {
    return (
      <ApotekerNavbar>
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-3xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        </div>
      </ApotekerNavbar>
    );
  }

  if (!order) {
    return (
      <ApotekerNavbar>
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-3xl mx-auto bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">Pesanan tidak ditemukan</div>
        </div>
      </ApotekerNavbar>
    );
  }

  // Ensure order_items exists and is an array
  const orderItems = order.order_items || [];

  // Cek jika ada produk yang memerlukan resep dokter
  const requiresPrescription = orderItems.some((item) => item.product && item.product.requires_prescription);

  // Debug info for WhatsApp URL
  console.log("Current order status:", order.approval_status);
  console.log("Current payment status:", order.payment_status);
  console.log("Current WhatsApp URL:", whatsappUrl);
  console.log("Stock reduced status:", stockReduced);
  console.log("Show WhatsApp button:", order.approval_status === "DIKIRIM" && order.payment_status === "DIBAYAR");

  return (
    <ApotekerNavbar>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/apoteker/pesanan" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Daftar Pesanan
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Detail Pesanan #{order.id}</h1>
            {/* Status labels section */}
            <div className="flex space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusBadgeClass(order.payment_status)}`}>{order.payment_status}</div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.approval_status)}`}>{order.approval_status}</div>
              {stockReduced && <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Stok Dikurangi</div>}
            </div>
          </div>

          {/* WhatsApp notification button - Fixed */}
          {order.approval_status === "DIKIRIM" && order.payment_status === "DIBAYAR" && (
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Kirim Notifikasi ke Pelanggan</h2>
                  <p className="text-gray-600 text-sm mt-1">Beritahu pelanggan bahwa pesanannya sedang dalam pengiriman</p>
                </div>
                <button onClick={sendWhatsAppNotification} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Kirim Notifikasi WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* Timeline section */}
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Status Pesanan</h2>
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`flex flex-col items-center ${
                    order.approval_status === "MENUNGGU" || order.approval_status === "DIPROSES" || order.approval_status === "DIKIRIM" || order.approval_status === "SELESAI" ? "text-indigo-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.approval_status === "MENUNGGU" || order.approval_status === "DIPROSES" || order.approval_status === "DIKIRIM" || order.approval_status === "SELESAI" ? "bg-indigo-100" : "bg-gray-100"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-xs mt-1">Menunggu</span>
                </div>
                <div className={`flex-1 h-1 ${order.approval_status === "DIPROSES" || order.approval_status === "DIKIRIM" || order.approval_status === "SELESAI" ? "bg-indigo-500" : "bg-gray-200"}`}></div>
                <div className={`flex flex-col items-center ${order.approval_status === "DIPROSES" || order.approval_status === "DIKIRIM" || order.approval_status === "SELESAI" ? "text-indigo-600" : "text-gray-400"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${order.approval_status === "DIPROSES" || order.approval_status === "DIKIRIM" || order.approval_status === "SELESAI" ? "bg-indigo-100" : "bg-gray-100"}`}
                  >
                    2
                  </div>
                  <span className="text-xs mt-1">Diproses</span>
                </div>
                <div className={`flex-1 h-1 ${order.approval_status === "DIKIRIM" || order.approval_status === "SELESAI" ? "bg-indigo-500" : "bg-gray-200"}`}></div>
                <div className={`flex flex-col items-center ${order.approval_status === "DIKIRIM" || order.approval_status === "SELESAI" ? "text-indigo-600" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.approval_status === "DIKIRIM" || order.approval_status === "SELESAI" ? "bg-indigo-100" : "bg-gray-100"}`}>3</div>
                  <span className="text-xs mt-1">Dikirim</span>
                </div>
                <div className={`flex-1 h-1 ${order.approval_status === "SELESAI" ? "bg-indigo-500" : "bg-gray-200"}`}></div>
                <div className={`flex flex-col items-center ${order.approval_status === "SELESAI" ? "text-indigo-600" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.approval_status === "SELESAI" ? "bg-indigo-100" : "bg-gray-100"}`}>4</div>
                  <span className="text-xs mt-1">Selesai</span>
                </div>
              </div>

              {/* Status update buttons */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => updateOrderStatus("MENUNGGU")}
                  disabled={order.approval_status === "MENUNGGU" || updatingStatus}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    order.approval_status === "MENUNGGU"
                      ? "bg-yellow-500 text-white"
                      : order.approval_status === "MENUNGGU" || updatingStatus
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-500 hover:text-white"
                  }`}
                >
                  Menunggu
                </button>
                <button
                  onClick={() => updateOrderStatus("DIPROSES")}
                  disabled={order.approval_status === "DIPROSES" || updatingStatus}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    order.approval_status === "DIPROSES" ? "bg-blue-500 text-white" : order.approval_status === "DIPROSES" || updatingStatus ? "bg-gray-200 cursor-not-allowed" : "bg-blue-100 text-blue-800 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  Diproses
                </button>
                <button
                  onClick={() => updateOrderStatus("DIKIRIM")}
                  disabled={order.approval_status === "DIKIRIM" || updatingStatus}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    order.approval_status === "DIKIRIM"
                      ? "bg-purple-500 text-white"
                      : order.approval_status === "DIKIRIM" || updatingStatus
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-purple-100 text-purple-800 hover:bg-purple-500 hover:text-white"
                  }`}
                >
                  Dikirim
                </button>
                <button
                  onClick={() => updateOrderStatus("SELESAI")}
                  disabled={order.approval_status === "SELESAI" || updatingStatus}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    order.approval_status === "SELESAI"
                      ? "bg-green-500 text-white"
                      : order.approval_status === "SELESAI" || updatingStatus
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-green-100 text-green-800 hover:bg-green-500 hover:text-white"
                  }`}
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer information */}
            <div className="bg-white rounded-lg shadow overflow-hidden md:col-span-1">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Informasi Pelanggan</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 text-sm">Nama</span>
                    <p className="font-medium">{order.nama_lengkap}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">No. Telp</span>
                    <p className="font-medium">{order.no_telp}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Email</span>
                    <p className="font-medium">{order.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Alamat</span>
                    <p className="font-medium">{order.alamat}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Tanggal Pesanan</span>
                    <p className="font-medium">{formatDate(order.order_date)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment proof */}
            <div className="bg-white rounded-lg shadow overflow-hidden md:col-span-2">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Bukti Pembayaran</h2>
                {order.bukti_bayar ? (
                  <div className="flex flex-col items-center">
                    <div className="max-w-sm">
                      <img src={order.bukti_bayar} alt="Bukti Pembayaran" className="w-full h-auto rounded-lg shadow" />
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => updatePaymentStatus("DIBAYAR")}
                        disabled={order.payment_status === "DIBAYAR" || updatingStatus}
                        className={`px-6 py-2 rounded-md text-sm font-medium ${order.payment_status === "DIBAYAR" || updatingStatus ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
                      >
                        Konfirmasi Pembayaran
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 italic">Bukti pembayaran belum diunggah</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prescription section */}
          {requiresPrescription && (
            <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Resep Dokter</h2>
                {order.resep_dokter ? (
                  <div className="flex flex-col items-center">
                    <div className="max-w-lg">
                      <img src={order.resep_dokter} alt="Resep Dokter" className="w-full h-auto rounded-lg shadow" />
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-500">
                      <p>Resep dokter untuk obat yang memerlukan resep</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 italic">Resep dokter tidak tersedia</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Order items section */}
          {/* Order items section */}
          <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Produk yang Dipesan</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resep</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderItems.length > 0 ? (
                      orderItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {item.product && item.product.image_url && <img src={item.product.image_url} alt={item.product.name} className="h-10 w-10 object-cover rounded" />}
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">{item.product ? item.product.name : "Produk tidak tersedia"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {item.unit_price ? item.unit_price.toLocaleString("id-ID") : "0"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {item.unit_price ? (item.unit_price * item.quantity).toLocaleString("id-ID") : "0"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.product && item.product.requires_prescription ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Perlu Resep</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          Tidak ada item dalam pesanan ini
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-medium">
                        Total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">Rp {order.total_amount.toLocaleString("id-ID")}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ApotekerNavbar>
  );
}
