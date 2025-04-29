'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { cartAtom } from '@/lib/atom';
import { ShoppingBag, RefreshCw, Truck, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CartSummary = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  
  const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert('Keranjang belanja Anda kosong.');
      return;
    }
    console.log(cart.items);
    
    // Arahkan ke halaman checkout
    router.push('/pasien/toko/checkout');
  };
  
  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
      setCart({ items: [] });
    }
  };

  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    }));
  };

  const removeItem = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.productId !== productId)
    }));
  };
  
  if (totalItems === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 text-center">
          <div className="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Keranjang Kosong</h3>
          <p className="text-gray-500 text-sm">Silahkan tambahkan produk ke keranjang Anda</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingBag className="h-5 w-5 text-blue-100 mr-2" />
            <h3 className="font-medium text-white">Keranjang Anda</h3>
          </div>
          <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
            {totalItems} item
          </span>
        </div>
      </div>
      
      {/* Mobile Toggle (Visible on mobile only) */}
      <div 
        className="lg:hidden border-b border-gray-100 p-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium text-gray-700">
          {isExpanded ? 'Sembunyikan Detail' : 'Lihat Detail Keranjang'}
        </span>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      
      {/* Cart Items (Always visible on desktop, toggleable on mobile) */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="max-h-64 overflow-y-auto p-3 border-b border-gray-100">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center py-2 border-b border-gray-100 last:border-0">
              <div className="w-12 h-12 bg-gray-50 rounded-md flex items-center justify-center mr-3 overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
              </div>
              
              <div className="flex items-center ml-2">
                <button
                  onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="ml-2 text-gray-400 hover:text-red-500 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Cart Summary */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center">
              <Truck size={14} className="mr-2 text-gray-500" />
              <span className="text-gray-600">Ekspedisi</span>
            </div>
            <span className="font-medium text-gray-700">JNT Express</span>
          </div>
          
          <div className="border-t border-gray-200 my-2 pt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Ongkos Kirim</span>
              <span className="font-medium">Rp 10.000</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-2 pt-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Total Pembayaran</span>
              <span className="font-bold text-gray-800">Rp {(totalAmount + 10000).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
            aria-label="Reset keranjang"
            title="Reset keranjang"
          >
            <RefreshCw size={18} />
          </button>
          
          <button
            onClick={handleCheckout}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors duration-200"
          >
            <ShoppingBag size={18} />
            Checkout Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;