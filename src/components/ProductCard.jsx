// src/app/apoteker/products/components/ProductCard.js
"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk ${product.name}?`)) {
      try {
        setIsDeleting(true);
        await axios.delete(`/api/products/${product.id}`);
        alert("Produk berhasil dihapus!");
        router.refresh(); // Refresh halaman untuk memperbarui daftar produk
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Gagal menghapus produk. Silakan coba lagi.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-200">
            <span className="text-gray-400">Tidak ada gambar</span>
          </div>
        )}
        
        {/* Badge untuk produk yang memerlukan resep */}
        {product.requires_prescription && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Perlu Resep
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-blue-600 font-medium mb-2">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
        <div className="flex justify-between mb-3">
          <p className="text-gray-600 text-sm">
            Stok: {product.stock}
          </p>
          {product.requires_prescription && (
            <p className="text-yellow-600 text-sm font-medium">
              Butuh Resep Dokter
            </p>
          )}
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex space-x-2">
          <Link
            href={`/apoteker/products/${product.id}/edit`}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors flex-1 text-center"
          >
            Edit
          </Link>
          <button
            className={`bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors flex-1 ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}