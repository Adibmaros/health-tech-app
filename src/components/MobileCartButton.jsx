'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAtom } from 'jotai';
import { cartAtom } from '@/lib/atom';

const MobileCartButton = ({ cartId }) => {
  const [cart] = useAtom(cartAtom);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Count total items in cart
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Toggle cart visibility
  const toggleCart = () => {
    const cartElement = document.getElementById(cartId);
    if (cartElement) {
      if (cartElement.classList.contains('hidden')) {
        cartElement.classList.remove('hidden');
      } else {
        cartElement.classList.add('hidden');
      }
    }
  };

  // Hide/show button based on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (totalItems === 0) return null;

  return (
    <button
      onClick={toggleCart}
      className={`lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
    >
      <ShoppingCart size={22} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs font-bold h-6 w-6 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default MobileCartButton;