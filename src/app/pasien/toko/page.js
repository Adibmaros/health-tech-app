// src/app/toko/page.js
"use client";

import React, { useState, useEffect } from "react";
import ProductCardOrder from "@/components/ProductCardOrder";
import CartSummary from "@/components/CartSummary";
import MobileCartButton from "@/components/MobileCartButton";

// Convert to client component to handle tab switching properly
const TokoKesehatanPage = ({ products }) => {
  const [activeTab, setActiveTab] = useState("regular");
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products on client side
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  const filterProducts = (products) => {
    if (!searchTerm) return products;
    return products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())));
  };

  // Memisahkan produk berdasarkan status resep dan filter pencarian
  const regularProducts = filterProducts(allProducts.filter((product) => !product.requires_prescription));
  const prescriptionProducts = filterProducts(allProducts.filter((product) => product.requires_prescription));

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header dengan Shadow dan Gradient */}
        <div className="sticky top-0 z-20">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl shadow-lg">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6">
              <h1 className="text-2xl md:text-3xl font-bold text-center text-white">Toko Kesehatan</h1>
            </div>
          </div>

          {/* Search Bar dengan Shadow */}
          <div className="bg-white shadow-md rounded-b-xl p-4 mb-6">
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Cari obat, vitamin, atau alat kesehatan..."
                className="w-full p-3 rounded-lg text-gray-800 border border-gray-200 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Product List */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 lg:mb-0">
              <div className="flex items-center justify-between mb-4 flex-wrap">
                <h2 className="text-lg font-semibold text-gray-800">Produk Tersedia</h2>
                <div className="flex items-center space-x-2 mt-2 sm:mt-0"></div>
              </div>

              {/* Tab untuk switch antara produk regular dan produk yang membutuhkan resep */}
              <div className="mb-4 border-b border-gray-200">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                  <li className="mr-2" role="presentation">
                    <button
                      className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === "regular" ? "border-blue-500 text-blue-600" : "border-transparent hover:text-gray-600 hover:border-gray-300"}`}
                      onClick={() => setActiveTab("regular")}
                      type="button"
                      role="tab"
                    >
                      Produk Bebas
                    </button>
                  </li>
                  <li className="mr-2" role="presentation">
                    <button
                      className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === "prescription" ? "border-blue-500 text-blue-600" : "border-transparent hover:text-gray-600 hover:border-gray-300"}`}
                      onClick={() => setActiveTab("prescription")}
                      type="button"
                      role="tab"
                    >
                      Produk dengan Resep
                    </button>
                  </li>
                </ul>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {/* Regular Products Section */}
                  <div className={activeTab === "regular" ? "" : "hidden"} role="tabpanel">
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {regularProducts.length > 0 ? (
                        regularProducts.map((product) => <ProductCardOrder key={product.id} product={product} />)
                      ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">{searchTerm ? "Tidak ada produk yang sesuai dengan pencarian Anda." : "Tidak ada produk bebas yang tersedia saat ini."}</div>
                      )}
                    </div>
                  </div>

                  {/* Prescription Products Section */}
                  <div className={activeTab === "prescription" ? "" : "hidden"} role="tabpanel">
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {prescriptionProducts.length > 0 ? (
                        prescriptionProducts.map((product) => <ProductCardOrder key={product.id} product={product} requiresPrescription={true} />)
                      ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">{searchTerm ? "Tidak ada produk yang sesuai dengan pencarian Anda." : "Tidak ada produk resep yang tersedia saat ini."}</div>
                      )}
                    </div>

                    {prescriptionProducts.length > 0 && (
                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-700">
                          <span className="font-semibold">Catatan:</span> Produk ini memerlukan resep dokter. Mohon unggah resep dokter saat checkout atau tunjukkan saat pengambilan.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cart Summary - Desktop & Tablet */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-32">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Button - Mobile Only */}
      <MobileCartButton cartId="mobile-cart" />

      {/* Mobile Cart Summary (Hidden on large screens) */}
      <div id="mobile-cart" className="hidden lg:hidden pt-6 pb-24">
        <CartSummary />
      </div>
    </div>
  );
};

// Need to provide a way to get the static props since we're converting to client component
export default function TokoWrapper() {
  return <TokoKesehatanPage />;
}
