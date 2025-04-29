// AddProductPage.js
"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ApotekerNavbar from "@/components/ApotekerNavbar";

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image_url: "",
    requires_prescription: false, // Tambahkan field untuk status resep
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validasi input
      if (!product.name || !product.price || !product.stock || !product.description || !imageFile) {
        throw new Error("Semua field harus diisi");
      }

      // Upload image first
      const formData = new FormData();
      formData.append("file", imageFile);

      console.log("Mengunggah gambar...");
      let image_url;

      try {
        const uploadResponse = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Response upload:", uploadResponse.data);
        image_url = uploadResponse.data.url;

        if (!image_url) {
          throw new Error("URL gambar tidak ditemukan dalam respon");
        }
      } catch (uploadErr) {
        console.error("Error saat upload gambar:", uploadErr);
        console.error("Response data:", uploadErr.response?.data);
        throw new Error(uploadErr.response?.data?.error || "Gagal mengunggah gambar produk");
      }

      // Create product with image URL
      console.log("Membuat produk dengan data:", {
        ...product,
        image_url,
      });

      try {
        const response = await axios.post("/api/products", {
          ...product,
          price: parseInt(product.price),
          stock: parseInt(product.stock),
          image_url,
          requires_prescription: Boolean(product.requires_prescription), // Pastikan tipe data boolean
        });

        console.log("Produk berhasil dibuat:", response.data);
        alert("Produk berhasil ditambahkan!");
        router.push("/apoteker/products"); // Sesuaikan dengan route yang benar
      } catch (productErr) {
        console.error("Error saat membuat produk:", productErr);
        console.error("Response data:", productErr.response?.data);
        throw new Error(productErr.response?.data?.error || "Gagal menyimpan data produk");
      }
    } catch (err) {
      console.error("Error keseluruhan:", err);
      setError(err.message || "Terjadi kesalahan saat menambahkan produk");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ApotekerNavbar>
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nama Produk
                  </label>
                  <input type="text" id="name" name="name" value={product.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Masukkan nama produk" required />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Harga (Rp)
                  </label>
                  <input type="number" id="price" name="price" value={product.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Contoh: 50000" min="0" required />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stok
                  </label>
                  <input type="number" id="stock" name="stock" value={product.stock} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Jumlah stok" min="0" required />
                </div>

                {/* Field untuk status resep */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requires_prescription"
                    name="requires_prescription"
                    checked={product.requires_prescription}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requires_prescription" className="ml-2 block text-sm font-medium text-gray-700">
                    Produk memerlukan resep dokter
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Gambar Produk
                  </label>
                  <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded border border-gray-300" />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    rows="6"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Masukkan deskripsi produk"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Info box when prescription is required */}
            {product.requires_prescription && (
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">Produk ini akan ditampilkan dalam kategori "Perlu Resep" dan pelanggan akan diminta untuk mengunggah resep dokter saat checkout.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button type="button" onClick={() => router.back()} className="mr-2 bg-gray-200 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-300">
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? "Menyimpan..." : "Simpan Produk"}
              </button>
            </div>
          </form>
        </div>
      </ApotekerNavbar>
    </>
  );
}
