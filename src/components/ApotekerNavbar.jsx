// src/components/ApotekerNavbar.jsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, UserCircle, ShoppingCart, FileText, Package } from "lucide-react";
import { useFormState } from "react-dom";
import { logOutAction } from "@/app/dokter/dashboard/lib/action";

const initialState = {
  message: "",
  success: false,
};

export default function ApotekerNavbar({ children, username = "Apoteker" }) {
  const pathname = usePathname();
  const [stateLogout, formAction] = useFormState(logOutAction, initialState);

  // Fungsi untuk menentukan apakah menu aktif berdasarkan path
  const isActive = (path) => {
    return pathname.startsWith(path) ? "bg-blue-700" : "";
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header Navigation */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-2">
            <UserCircle className="h-8 w-8" />
            <span className="font-semibold hidden sm:inline">{username}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-6">
            <Link href="/apoteker/dashboard" className={`hover:bg-blue-500/10 p-2 rounded-full transition group relative ${isActive("/apoteker/dashboard")}`}>
              <FileText className="h-6 w-6" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">Dashboard</span>
            </Link>
            <Link href="/apoteker/pesanan" className={`hover:bg-blue-500/10 p-2 rounded-full transition group relative ${isActive("/apoteker/pesanan")}`}>
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">Pesanan</span>
            </Link>
            <Link href="/apoteker/products" className={`hover:bg-blue-500/10 p-2 rounded-full transition group relative ${isActive("/apoteker/products")}`}>
              <Package className="h-6 w-6" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">Produk</span>
            </Link>
            <form action={formAction}>
              <button type="submit" className="hover:bg-red-500/10 p-2 rounded-full transition group relative text-red-100 hover:text-red-200 cursor-pointer" title="Keluar">
                <LogOut className="h-6 w-6" />
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">Keluar</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}