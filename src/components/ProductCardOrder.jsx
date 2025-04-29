'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { cartAtom } from '@/lib/atom';
import { StarIcon, Plus, Check, ShoppingCart, Heart, X } from 'lucide-react';

const ProductCardOrder = ({ product, requiresPrescription = false }) => {
  const [cart, setCart] = useAtom(cartAtom);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isInCart = cart.items.some(item => item.productId === product.id);

  const addToCart = () => {
    setCart((prevCart) => {
      // Cek apakah produk sudah ada di keranjang
      const existingItem = prevCart.items.find(item => item.productId === product.id);
      
      if (existingItem) {

        return {
          ...prevCart,
          items: prevCart.items.map(item => 
            item.productId === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        };
      } else {
        // Jika belum ada, tambahkan produk baru
        return {
          ...prevCart,
          items: [...prevCart.items, {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url,
            quantity: 1,
            requires_prescription: product.requires_prescription
          }]
        };
      }
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const rating = 4; // Fixed rating
  const ratingCount = 50; // Fixed rating count
  
  // Use a deterministic approach for discount instead of random
  const hasDiscount = product.price > 50000 && product.id % 2 === 0; // Even product IDs get discount
  const discountedPrice = hasDiscount ? Math.floor(product.price * 0.85) : product.price;
  
  return (
    <>
      <div 
        className="rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {/* Badge jika memerlukan resep */}
          {product.requires_prescription && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs py-1 px-2 rounded-md font-medium z-10">
              Butuh Resep
            </div>
          )}
          
          {/* Badge jika diskon */}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs py-1 px-2 rounded-md font-medium z-10">
              Hemat 15%
            </div>
          )}
          
          {/* Tombol favorit */}
          {!hasDiscount && (
            <button 
              onClick={toggleFavorite}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm z-10"
            >
              <Heart 
                size={16} 
                className={`${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
              />
            </button>
          )}
          
          {/* Gambar Produk - Opens modal */}
          <div 
            className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={openModal}
          >
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                width={120}
                height={120}
                className="object-contain max-h-full w-auto transform transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-3 flex-grow flex flex-col">
          {/* Rating */}
          <div className="flex items-center mb-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  size={12}
                  className={i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({ratingCount})</span>
          </div>
          
          {/* Nama Produk - Opens modal */}
          <h3 
            className="font-medium text-sm text-gray-800 line-clamp-2 mb-1 hover:text-blue-600 transition-colors cursor-pointer"
            onClick={openModal}
          >
            {product.name}
          </h3>
          
          {/* Deskripsi pendek (opsional) */}
          {product.description && (
            <p className="text-xs text-gray-500 line-clamp-1 mb-2">
              {product.description.substring(0, 50)}
            </p>
          )}
          
          {/* Harga dan Tombol */}
          <div className="flex items-center justify-between mt-auto">
            <div>
              {hasDiscount && (
                <p className="text-xs text-gray-400 line-through">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
              )}
              <p className="font-semibold text-sm text-gray-800">
                Rp {discountedPrice.toLocaleString('id-ID')}
              </p>
            </div>
            
            {/* Tombol Tambah Keranjang */}
            <button
              onClick={addToCart}
              className={`flex items-center justify-center ${
                isInCart 
                  ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              } p-2 rounded-lg transition duration-200`}
              aria-label={isInCart ? "Tambah lagi" : "Tambah ke keranjang"}
            >
              {isInCart ? (
                <Check size={16} />
              ) : (
                isHovered ? (
                  <ShoppingCart size={16} />
                ) : (
                  <Plus size={16} />
                )
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Detail Produk</h3>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  {product.image_url ? (
                    <div className="relative h-72 w-full">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-72 w-full flex items-center justify-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
                  
                  {/* Badges Section */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.requires_prescription && (
                      <span className="bg-red-100 text-red-700 text-xs py-1 px-2 rounded-md font-medium">
                        Memerlukan Resep Dokter
                      </span>
                    )}
                    {product.stock > 0 ? (
                      <span className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded-md font-medium">
                        Stok Tersedia ({product.stock})
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 text-xs py-1 px-2 rounded-md font-medium">
                        Stok Habis
                      </span>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          size={16}
                          className={i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({ratingCount} ulasan)</span>
                  </div>
                  
                  {/* Price */}
                  <div className="mb-4">
                    {hasDiscount && (
                      <p className="text-sm text-gray-400 line-through">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-gray-800">
                      Rp {discountedPrice.toLocaleString('id-ID')}
                    </p>
                    {hasDiscount && (
                      <p className="text-sm text-green-600 font-medium">
                        Hemat 15% (Rp {(product.price - discountedPrice).toLocaleString('id-ID')})
                      </p>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Deskripsi Produk</h4>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                  
                  {/* Add to cart button */}
                  <div className="mt-auto space-y-3">
                    <button
                      onClick={() => {
                        addToCart();
                        // Optional: close the modal after adding to cart
                        // closeModal();
                      }}
                      className={`w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg ${
                        isInCart
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white font-medium transition duration-200`}
                    >
                      {isInCart ? (
                        <>
                          <Check size={18} />
                          <span>Tambah Lagi</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          <span>Tambah ke Keranjang</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={toggleFavorite}
                      className="w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition duration-200"
                    >
                      <Heart size={18} className={isFavorite ? "text-red-500 fill-red-500" : ""} />
                      <span>{isFavorite ? 'Dihapus dari Favorit' : 'Tambah ke Favorit'}</span>
                    </button>
                    
                    {product.requires_prescription && (
                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-700">
                          <span className="font-semibold">Catatan:</span> Produk ini memerlukan resep dokter. 
                          Mohon unggah resep dokter saat checkout atau tunjukkan saat pengambilan.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCardOrder;