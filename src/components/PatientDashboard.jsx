"use client";

import React, { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FileUp, LogOut, Send, MessageCircle, ShoppingCart, HelpCircle, UserCircle, Loader2, Info, Menu } from "lucide-react";
import { createQuestionAction, logOutAction } from "@/app/pasien/dashboard/lib/action";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ChatbotUI from "@/components/ChatbotUI";
import AnsweredQuestions from "./AnsweredQuestions";

// Komponen Tombol Submit
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 
        bg-blue-600 text-white rounded-full 
        hover:bg-blue-700 transition
        focus:outline-none focus:ring-2 
        focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Mengirim...
        </>
      ) : (
        <>
          <Send className="mr-2 h-5 w-5" />
          Kirim Pertanyaan
        </>
      )}
    </button>
  );
}

// State Awal untuk Form
const initialState = {
  message: "",
};

// Komponen Utama Dashboard Pasien
export default function PatientDashboard({username,questions}) {
  const [state, formAction] = useActionState(createQuestionAction, initialState);
  const [stateLogout, formActionLogout] = useActionState(logOutAction, initialState);

  const openWhatsApp = () => {
    const adminPhone = "+6281368859389";

    const message = `Halo, saya ingin melakukan konsultasi:
  
  🩺 Jenis Konsultasi:
  - [Silakan pilih: Kesehatan Umum/Gejala Penyakit/Produk Kesehatan/Lainnya]
  
  📝 Detail Konsultasi:
  - Keluhan/Pertanyaan Saya:
  - Sudah Berapa Lama:
  - Riwayat Kesehatan Terkait:
  
  💡 Informasi Tambahan:
  - Nama Lengkap:
  - Usia:
  - Jenis Kelamin:
  
  Terima kasih atas perhatiannya.`;

    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header Navigation */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-2">
            <UserCircle className="h-8 w-8" />
            <span className="font-semibold hidden sm:inline">
              {username ? `Halo, ${username}` : 'Pasien Dashboard'}
            </span>
            <span className="font-semibold sm:hidden">
              {username ? `${username}` : 'Pasien'}
            </span>
          </div>

          {/* Mobile Menu for Smaller Screens */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 rounded-md hover:bg-blue-500 transition">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                {/* menu items */}
                <div className="flex flex-col space-y-4 mt-4">
                  <button onClick={openWhatsApp} className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg transition duration-200 ease-in-out">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 hover:text-blue-600">Konsultasi WhatsApp</span>
                  </button>

                  <a href="/pasien/toko" className="flex items-center space-x-2 p-2 hover:bg-blue-50 rounded-lg transition duration-200 ease-in-out">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 hover:text-blue-600">Toko Online</span>
                  </a>

                  <form action={formActionLogout} className="w-full">
                    <button
                      type="submit"
                      className="w-full flex items-center space-x-2 p-2 hover:bg-red-50 rounded-lg 
        text-red-600 hover:text-red-700 transition duration-200 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer "
                    >
                      <LogOut className="h-5 w-5 " />
                      <span>Logout</span>
                    </button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center space-x-4">
            <button onClick={openWhatsApp} className="hover:bg-blue-500/10 p-2 rounded-full transition hover:cursor-pointer group relative" title="Konsultasi WhatsApp">
              <MessageCircle className="h-6 w-6" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">Konsultasi</span>
            </button>
            <a href="/pasien/toko" className="hover:bg-blue-500/10 p-2 rounded-full transition group relative" title="Toko Online">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">Toko</span>
            </a>
            <form action={formActionLogout}>
              <button type="submit" className="hover:bg-red-500/10 p-2 rounded-full transition group relative text-red-600 hover:text-red-700 cursor-pointer" title="Logout">
                <LogOut className="h-6 w-6" />
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">Logout</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-1 gap-6 lg:gap-8">
          {/* Form Pertanyaan */}
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-800 flex items-center">
                <HelpCircle className="mr-2 sm:mr-3 text-blue-600 h-5 w-5 sm:h-6 sm:w-6" />
                Ajukan Pertanyaan
              </h2>

              {/* Drawer Guidelines */}
              <Drawer>
                <DrawerTrigger asChild>
                  <button className="text-blue-600 hover:bg-blue-100 hover:cursor-pointer p-2 rounded-full transition">
                    <Info className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="overflow-y-auto max-h-[90vh]">
                    <DrawerHeader>
                      <DrawerTitle>Panduan Mengajukan Pertanyaan</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 space-y-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Cara Bertanya dengan Baik</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                          <li>Jelaskan gejala atau masalah kesehatan Anda secara detail</li>
                          <li>Sertakan riwayat penyakit yang relevan</li>
                          <li>Unggah dokumen medis atau foto yang mendukung pertanyaan</li>
                          <li>Gunakan bahasa yang jelas dan mudah dipahami</li>
                        </ul>
                      </div>
                    </div>
                    <div className="p-4">
                      <DrawerClose asChild>
                        <Button className="w-full hover:cursor-pointer">Tutup</Button>
                      </DrawerClose>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            <form action={formAction} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Unggah Dokumen
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="block w-full text-sm text-gray-500
                    file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4
                    file:rounded-full file:border-0
                    file:text-xs sm:file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 hover:cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                  Pertanyaan
                </label>
                <textarea
                  id="question"
                  name="question"
                  placeholder="Tulis pertanyaan Anda di sini..."
                  rows={4}
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-300 focus:ring focus:ring-blue-200 
                    focus:ring-opacity-50 text-sm"
                  required
                />
              </div>

              <div className="flex justify-end">
                <SubmitButton />
              </div>
            </form>

            {state.message && (
              <div className="mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm sm:text-base">✅ Pertanyaan Anda berhasil dikirim! Dokter akan segera membalas.</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Rata-rata waktu respons: 1x24 jam. Anda akan menerima notifikasi saat dokter membalas pertanyaan Anda.</p>
              </div>
            )}
          </div>

          {/* Health Chatbot */}
          <ChatbotUI />
        </div>

        {/* Pertanyaan Terjawab Section with Increased Top Margin */}
        <div className="mt-8 lg:mt-10">
          <AnsweredQuestions questions={questions} />
        </div>
      </div>
    </div>
  );
}