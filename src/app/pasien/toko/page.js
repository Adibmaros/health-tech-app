"use client";

import React, { useState } from "react";
import { ShoppingCart, ExternalLink, Filter, Search, X } from "lucide-react";

// Sample product data (you would typically fetch this from a database)
const healthProducts = [
  {
    id: 1,
    name: "Vitamin C Supplement",
    description: "Meningkatkan sistem kekebalan tubuh",
    price: 85000,
    category: "Vitamin",
    imageUrl: "/api/placeholder/300/300",
    affiliateLink: "https://www.tokopedia.com/vitamin-c-supplement",
  },
  {
    id: 2,
    name: "Masker Medis Hijau",
    description: "Masker kesehatan berkualitas tinggi",
    price: 45000,
    category: "Alat Pelindung",
    imageUrl: "/api/placeholder/300/300",
    affiliateLink: "https://www.tokopedia.com/masker-medis-hijau",
  },
  {
    id: 3,
    name: "Suplemen Vitamin D",
    description: "Menjaga kesehatan tulang dan sistem imun",
    price: 120000,
    category: "Vitamin",
    imageUrl: "/api/placeholder/300/300",
    affiliateLink: "https://www.tokopedia.com/vitamin-d-supplement",
  },
  {
    id: 4,
    name: "Hand Sanitizer Gel",
    description: "Membunuh 99.9% kuman",
    price: 25000,
    category: "Kebersihan",
    imageUrl: "/api/placeholder/300/300",
    affiliateLink: "https://www.tokopedia.com/hand-sanitizer-gel",
  },
  {
    id: 5,
    name: "Alat Ukur Tekanan Darah",
    description: "Digital dengan akurasi tinggi",
    price: 250000,
    category: "Alat Kesehatan",
    imageUrl: "/api/placeholder/300/300",
    affiliateLink: "https://www.tokopedia.com/tensi-digital",
  },
  {
    id: 6,
    name: "Multivitamin Lengkap",
    description: "Nutrisi lengkap untuk keseharian",
    price: 150000,
    category: "Vitamin",
    imageUrl: "/api/placeholder/300/300",
    affiliateLink: "https://www.tokopedia.com/multivitamin-lengkap",
  },
];

const categories = ["Semua", "Vitamin", "Alat Pelindung", "Kebersihan", "Alat Kesehatan"];

export default function HealthStorePage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter products based on category and search term
  const filteredProducts = healthProducts.filter((product) => (selectedCategory === "Semua" || product.category === selectedCategory) && product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Handle filter selection and close modal
  const handleFilterSelect = (category) => {
    setSelectedCategory(category);
    setIsFilterModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-6">
      <div className="container mx-auto">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 flex items-center">
            <ShoppingCart className="mr-2 sm:mr-3 text-blue-600 h-6 w-6 sm:h-8 sm:w-8" />
            Toko Kesehatan
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Temukan produk kesehatan terbaik untukmu</p>
        </header>

        {/* Search and Filter */}
        <div className="mb-6 flex space-x-2">
          <div className="relative flex-grow">
            <input type="text" placeholder="Cari produk kesehatan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button onClick={() => setIsFilterModalOpen(true)} className="inline-flex items-center px-3 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Modal */}
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-6 w-11/12 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-800">Filter Produk</h2>
                <button onClick={() => setIsFilterModalOpen(false)} className="text-gray-600 hover:text-gray-800">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterSelect(category)}
                    className={`w-full text-left p-3 rounded-lg ${selectedCategory === category ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-100"} transition`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <img src={product.imageUrl} alt={product.name} className="w-full h-28 sm:h-48 object-cover" />
              <div className="p-3 sm:p-5">
                <h3 className="text-sm sm:text-xl font-semibold text-blue-800 mb-1 sm:mb-2">{product.name}</h3>
                <p className="text-xs sm:text-base text-gray-600 mb-2 sm:mb-4">{product.description}</p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <span className="text-sm sm:text-lg font-bold text-blue-600">Rp {product.price.toLocaleString()}</span>
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-full text-xs sm:text-base hover:bg-blue-600 transition"
                  >
                    Beli
                    <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-white rounded-xl">
            <p className="text-base sm:text-xl text-gray-500">Tidak ada produk yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
