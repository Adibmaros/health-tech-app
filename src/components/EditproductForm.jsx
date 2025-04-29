// components/products/EditProductForm.jsx
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EditProductForm = ({ product }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(product.image_url || null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    requires_prescription: product.requires_prescription || false, // Menambahkan field requires_prescription
    image: null,
    currentImageUrl: product.image_url || ""
  });

  // Format tanggal untuk ditampilkan
  const createdAt = new Date(product.created_at).toLocaleString("id-ID");
  const updatedAt = new Date(product.updated_at).toLocaleString("id-ID");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({
      ...formData,
      image: file
    });

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData object for multipart/form-data submission
      const submitData = new FormData();
      submitData.append("id", formData.id);
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("stock", formData.stock);
      submitData.append("requires_prescription", formData.requires_prescription);
      submitData.append("currentImageUrl", formData.currentImageUrl);
      
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      // Send request to API
      const response = await fetch("/api/products/update", {
        method: "POST",
        body: submitData,
        // Note: Don't set Content-Type header when using FormData
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      // Redirect back to products list on success
      router.push("/apoteker/products");
      router.refresh(); // Refresh server components
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Gagal memperbarui produk. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={formData.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
            ID Produk
          </label>
          <input 
            value={formData.id} 
            type="text" 
            disabled 
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" 
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Produk
          </label>
          <input 
            value={formData.name} 
            onChange={handleChange}
            type="text" 
            name="name" 
            id="name" 
            placeholder="Masukkan nama produk" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          value={formData.description}
          onChange={handleChange}
          name="description"
          id="description"
          rows="3"
          placeholder="Masukkan deskripsi produk"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Harga (Rp)
          </label>
          <input
            value={formData.price}
            onChange={handleChange}
            type="number"
            name="price"
            id="price"
            placeholder="Masukkan harga produk"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stok
          </label>
          <input 
            value={formData.stock} 
            onChange={handleChange}
            type="number" 
            name="stock" 
            id="stock" 
            placeholder="Masukkan jumlah stok" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
      </div>

      {/* Field untuk status resep */}
      <div className="bg-white rounded-md shadow-sm p-4 border border-gray-200">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="requires_prescription"
            name="requires_prescription"
            checked={formData.requires_prescription}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="requires_prescription" className="ml-2 block text-sm font-medium text-gray-700">
            Produk memerlukan resep dokter
          </label>
        </div>
        
        {formData.requires_prescription && (
          <div className="mt-3 bg-yellow-50 p-3 rounded-md border border-yellow-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Produk ini akan ditampilkan dalam kategori "Perlu Resep" dan pelanggan akan diminta untuk mengunggah resep dokter saat checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Gambar Produk
        </label>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Pilih File
          </button>
          <span className="text-sm text-gray-500">
            {formData.image ? formData.image.name : "Belum ada file yang dipilih"}
          </span>
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleImageChange}
          name="image" 
          id="image" 
          accept="image/*" 
          className="hidden" 
        />

        {previewImage && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Preview Gambar:</p>
            <div className="relative h-48 w-48 border border-gray-200 rounded p-1">
              <Image 
                src={previewImage} 
                alt="Preview produk" 
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="created_at" className="block text-sm font-medium text-gray-700 mb-1">
            Dibuat Pada
          </label>
          <input 
            value={createdAt} 
            type="text" 
            disabled 
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" 
          />
        </div>

        <div>
          <label htmlFor="updated_at" className="block text-sm font-medium text-gray-700 mb-1">
            Diperbarui Pada
          </label>
          <input 
            value={updatedAt} 
            type="text" 
            disabled 
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" 
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Link 
          href="/apoteker/products" 
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Batal
        </Link>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;