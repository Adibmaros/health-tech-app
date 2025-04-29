'use client';
// app/pasien/toko/checkout/CheckoutForm.jsx

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { cartAtom } from '@/lib/atom';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle, FileText, CreditCard } from 'lucide-react';

// Toast component - simple implementation for notifications
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center ${bgColor} text-white px-4 py-3 rounded-md shadow-lg`}>
      <Icon className="h-5 w-5 mr-2" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        &times;
      </button>
    </div>
  );
};

export default function CheckoutForm() {
  const [cart, setCart] = useAtom(cartAtom);
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    no_telp: '',
    email: '',
    alamat: '',
  });
  const [paymentProof, setPaymentProof] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [paymentPreviewUrl, setPaymentPreviewUrl] = useState('');
  const [prescriptionPreviewUrl, setPrescriptionPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [requiresPrescription, setRequiresPrescription] = useState(false);

  const totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Check if any item in the cart requires a prescription
  useEffect(() => {
    // Fix the check to properly identify items requiring prescription
    const hasItemRequiringPrescription = cart.items.some(item => 
      item.requiresPrescription === true || item.requires_prescription === true
    );
    setRequiresPrescription(hasItemRequiringPrescription);
  }, [cart.items]);

  // Jika keranjang kosong, redirect kembali ke halaman toko
  useEffect(() => {
    if (cart.items.length === 0 && typeof window !== 'undefined') {
      router.push('/pasien/toko');
    }
  }, [cart.items, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (file) {
      if (name === 'bukti_bayar') {
        setPaymentProof(file);
        const fileUrl = URL.createObjectURL(file);
        setPaymentPreviewUrl(fileUrl);
      } else if (name === 'resep') {
        setPrescription(file);
        const fileUrl = URL.createObjectURL(file);
        setPrescriptionPreviewUrl(fileUrl);
      }
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    if (!paymentProof) {
      setErrorMessage('Bukti pembayaran harus diunggah');
      setIsSubmitting(false);
      return;
    }

    if (requiresPrescription && !prescription) {
      setErrorMessage('Resep dokter harus diunggah untuk obat yang memerlukan resep');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData for file upload
      const formDataWithFile = new FormData();
      
      // Add customer info
      Object.keys(formData).forEach(key => {
        formDataWithFile.append(`customer[${key}]`, formData[key]);
      });
      
      // Add payment proof file
      formDataWithFile.append('bukti_bayar', paymentProof);
      
      // Add prescription file if required
      if (requiresPrescription && prescription) {
        formDataWithFile.append('resep', prescription);
      }
      
      // Add cart items
      cart.items.forEach((item, index) => {
        formDataWithFile.append(`items[${index}][product_id]`, item.productId);
        formDataWithFile.append(`items[${index}][quantity]`, item.quantity);
        formDataWithFile.append(`items[${index}][unit_price]`, item.price);
        // Use the appropriate property name based on what's available
        const needsPrescription = item.requiresPrescription === true || item.requires_prescription === true;
        formDataWithFile.append(`items[${index}][requires_prescription]`, needsPrescription);
      });
      
      formDataWithFile.append('totalAmount', totalAmount);
      
      console.log('Sending checkout data with file upload');

      // Kirim data ke API route dengan FormData untuk mendukung upload file
      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: formDataWithFile, // Tidak perlu set Content-Type, browser akan menetapkannya
      });

      const result = await response.json();
      console.log('API response:', result);

      if (response.ok) {
        // Reset cart
        setCart({ items: [] });
        
        // Clean up the preview URLs
        if (paymentPreviewUrl) {
          URL.revokeObjectURL(paymentPreviewUrl);
        }
        if (prescriptionPreviewUrl) {
          URL.revokeObjectURL(prescriptionPreviewUrl);
        }
        
        // Show success toast and redirect
        showToast('Pesanan berhasil dibuat!', 'success');
        
        // Use the redirect URL from the API response or fall back to the default
        if (result.redirect) {
          // Small delay to ensure the user sees the success message
          setTimeout(() => {
            router.push(result.redirect);
          }, 1000);
        } else {
          // Fall back to the default success page
          setTimeout(() => {
            router.push(`/pasien/toko/checkout/success?orderId=${result.order.id}`);
          }, 1000);
        }
      } else {
        // Tampilkan pesan error dari API
        setErrorMessage(result.message || 'Terjadi kesalahan saat memproses pesanan.');
        showToast(result.message || 'Terjadi kesalahan saat memproses pesanan.', 'error');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setErrorMessage('Terjadi masalah saat menghubungkan ke server.');
      showToast('Terjadi masalah saat menghubungkan ke server.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return null; // Return null while redirecting
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ show: false, message: '', type: '' })} 
        />
      )}
      
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Informasi Pengiriman</h2>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}
          
          {requiresPrescription && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md flex items-start">
              <FileText className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>
                Pembelian ini memerlukan resep dokter. Mohon unggah resep dokter yang valid.
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                <input
                  type="tel"
                  name="no_telp"
                  value={formData.no_telp}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
            
            {/* Payment Instructions Section */}
            <div className="mb-6">
              <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                <h3 className="text-md font-medium text-blue-700 flex items-center mb-2">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Informasi Pembayaran
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Silakan transfer pembayaran ke salah satu rekening berikut:
                </p>
                <div className="space-y-3">
                  <div className="grid grid-cols-5 text-sm">
                    <div className="col-span-1 font-medium">Bank BCA</div>
                    <div className="col-span-4">: 1234567890 a.n. Klinik Apotek Sehat</div>
                  </div>
                  <div className="grid grid-cols-5 text-sm">
                    <div className="col-span-1 font-medium">Bank BNI</div>
                    <div className="col-span-4">: 0987654321 a.n. Klinik Apotek Sehat</div>
                  </div>
                  <div className="grid grid-cols-5 text-sm">
                    <div className="col-span-1 font-medium">Bank Mandiri</div>
                    <div className="col-span-4">: 2468013579 a.n. Klinik Apotek Sehat</div>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-3">
                  *Jumlah yang ditransfer harus sesuai dengan total pesanan.
                  Pesanan akan diproses setelah pembayaran diverifikasi.
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bukti Pembayaran</label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  id="bukti_bayar"
                  name="bukti_bayar"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              {paymentPreviewUrl && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="relative h-40 w-40 border rounded-md overflow-hidden">
                    <img 
                      src={paymentPreviewUrl} 
                      alt="Preview bukti pembayaran" 
                      className="object-cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                *Unggah bukti transfer dalam format gambar (JPG, PNG)
              </p>
            </div>
            
            {requiresPrescription && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Resep Dokter</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="resep"
                    name="resep"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
                {prescriptionPreviewUrl && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="relative h-40 w-40 border rounded-md overflow-hidden">
                      <img 
                        src={prescriptionPreviewUrl} 
                        alt="Preview resep dokter" 
                        className="object-cover"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  *Unggah resep dokter dalam format gambar (JPG, PNG) dan pastikan foto jelas, foto yang tidak jelas akan kami batalkan pesanannya
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white py-2 px-4 rounded-md font-medium w-full hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  <span>Memproses...</span>
                </>
              ) : (
                'Konfirmasi Pesanan'
              )}
            </button>
          </form>
        </div>
      </div>
      
      <div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
          
          <div className="border-b pb-4 mb-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm mb-2">
                <div className="flex items-center">
                  <span>{item.name} x {item.quantity}</span>
                  {(item.requiresPrescription || item.requires_prescription) && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full">
                      Resep
                    </span>
                  )}
                </div>
                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}