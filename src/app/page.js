"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, ShoppingCart, FileText, Stethoscope, Clock, Shield, ArrowRight, Sticker } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Stethoscope className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-800">Health Tech</h1>
        </div>
        <nav className="flex items-center space-x-4">
          {/* Dokter Login Button */}
          <Link href="/dokter/login" className="flex items-center px-4 py-2 text-green-600 hover:bg-green-50 rounded-full transition">
            <Sticker className="mr-2 h-4 w-4" />
            Login Dokter
          </Link>

          {/* Patient Login and Register Buttons */}
          <Link href="/pasien/login" className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-full transition">
            Login
          </Link>
          <Link href="/pasien/register" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            Daftar
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-blue-900 mb-6 leading-tight">Solusi Kesehatan Digital Terpadu</h2>
          <p className="text-gray-600 mb-8 text-lg">Health Tech memberikan akses mudah dan cepat ke layanan kesehatan modern. Konsultasi online, rekam medis digital, dan toko produk kesehatan dalam satu aplikasi.</p>
          <div className="flex space-x-4">
            <Link href="/pasien/register" className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="#layanan" className="flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition">
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <img src="/api/placeholder/500/400" alt="Health Tech Dashboard" className="rounded-xl shadow-2xl" />
        </div>
      </main>

      {/* Layanan Section */}
      <section id="layanan" className="container mx-auto px-4 py-16 bg-white rounded-xl shadow-lg">
        <h3 className="text-3xl font-bold text-center text-blue-900 mb-12">Layanan Kami</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Konsultasi Rekam Medis */}
          <div className="bg-blue-50 p-6 rounded-xl text-center hover:shadow-xl transition">
            <MessageCircle className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h4 className="text-xl font-semibold mb-3 text-blue-900">Konsultasi Rekam Medis</h4>
            <p className="text-gray-600 mb-4">Konsultasi langsung dengan dokter, simpan dan kelola rekam medis digital Anda.</p>
            <Link href="/pasien/login" className="text-blue-600 hover:underline flex items-center justify-center">
              Mulai Konsultasi <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Toko Kesehatan */}
          <div className="bg-blue-50 p-6 rounded-xl text-center hover:shadow-xl transition">
            <ShoppingCart className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h4 className="text-xl font-semibold mb-3 text-blue-900">Toko Kesehatan</h4>
            <p className="text-gray-600 mb-4">Berbagai produk kesehatan berkualitas, dari obat-obatan hingga alat medis.</p>
            <Link href="/toko" className="text-blue-600 hover:underline flex items-center justify-center">
              Kunjungi Toko <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* AI Chatbot */}
          <div className="bg-blue-50 p-6 rounded-xl text-center hover:shadow-xl transition">
            <Stethoscope className="mx-auto h-12 w-12 text-purple-600 mb-4" />
            <h4 className="text-xl font-semibold mb-3 text-blue-900">AI Chatbot Kesehatan</h4>
            <p className="text-gray-600 mb-4">Dapatkan informasi kesehatan cepat dan akurat dari chatbot pintar kami.</p>
            <Link href="/pasien/dashboard" className="text-blue-600 hover:underline flex items-center justify-center">
              Tanya AI <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-blue-900 mb-12">Mengapa Memilih Health Tech?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Clock className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h4 className="text-xl font-semibold mb-3">Cepat & Mudah</h4>
            <p className="text-gray-600">Akses layanan kesehatan kapan pun dan di mana pun tanpa antrian panjang.</p>
          </div>
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h4 className="text-xl font-semibold mb-3">Rekam Medis Digital</h4>
            <p className="text-gray-600">Simpan dan kelola riwayat kesehatan Anda secara aman dan terorganisir.</p>
          </div>
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-purple-600 mb-4" />
            <h4 className="text-xl font-semibold mb-3">Keamanan Terjamin</h4>
            <p className="text-gray-600">Data kesehatan Anda dilindungi dengan teknologi enkripsi mutakhir.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">Mulai Perjalanan Kesehatan Digital Anda</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Bergabunglah dengan ribuan pengguna yang telah merasakan kemudahan layanan kesehatan digital bersama Health Tech.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/pasien/register" className="px-8 py-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition">
              Daftar Sekarang
            </Link>
            <Link href="/pasien/login" className="px-8 py-3 border border-white text-white rounded-full hover:bg-blue-700 transition">
              Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Health Tech. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
