// src/app/apoteker/products/page.js
import React from "react";
import Link from "next/link";
import { getAllPrdoducts } from "./libs/data";
import ProductCard from "@/components/ProductCard";
import { PlusCircle, Search } from "lucide-react";
import ApotekerNavbar from "@/components/ApotekerNavbar";

export const dynamic = "force-dynamic"; // Agar halaman selalu dirender ulang untuk mendapatkan data terbaru

export default async function ProductsPage() {
  const products = await getAllPrdoducts();

  return (
    <ApotekerNavbar>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-800 mb-4 md:mb-0">Daftar Produk</h1>

            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <div className="relative">
                <input type="text" placeholder="Cari produk..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <Link href="/apoteker/products/tambah" className="inline-flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                <PlusCircle className="h-5 w-5 mr-2" />
                Tambah Produk
              </Link>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Belum ada produk yang tersedia</p>
              <Link href="/apoteker/products/tambah" className="inline-block mt-4 text-blue-600 hover:text-blue-800">
                Tambahkan produk pertama Anda
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">Total: {products.length} produk</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ApotekerNavbar>
  );
}
