"use client";
import React, { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { 
  FileUp, LogOut, Send, MessageCircle, ShoppingCart, 
  HelpCircle, UserCircle, Loader2, Info, Menu, 
  ChevronRight, Phone, ChevronDown, Clock
} from "lucide-react";
import { createQuestionAction, logOutAction } from "@/app/pasien/dashboard/lib/action";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ChatbotUI from "@/components/ChatbotUI";
import AnsweredQuestions from "./AnsweredQuestions";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center px-6 py-3 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30"
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

const initialState = {
  message: "",
};

export default function PatientDashboard({ username, questions }) {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Header Navigation */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md">
              <UserCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 text-sm">
                {username ? `Halo, ${username}` : 'Pasien Dashboard'}
              </span>
              <span className="text-xs text-blue-600">Pasien</span>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 rounded-full hover:bg-blue-50 transition">
                  <Menu className="h-6 w-6 text-blue-600" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader className="border-b pb-4 mb-4">
                  <SheetTitle className="text-blue-600">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={openWhatsApp}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition"
                  >
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Konsultasi Online</span>
                  </button>
                  <a
                    href="/pasien/toko"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition"
                  >
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Toko Kesehatan</span>
                  </a>
                  <button
                    onClick={() => document.getElementById('question')?.focus()}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition"
                  >
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Tanya Dokter</span>
                  </button>
                  <form action={formActionLogout} className="w-full">
                    <button
                      type="submit"
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-blue-50 text-blue-700 transition-all duration-200"
                >
                  <span className="text-sm font-medium">Layanan Kesehatan</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border border-blue-100 shadow-lg">
                <DropdownMenuItem
                  onClick={openWhatsApp}
                  className="flex items-center space-x-2 p-3 hover:bg-blue-50 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <span>Konsultasi Online</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="flex items-center space-x-2 p-3 hover:bg-blue-50 cursor-pointer"
                >
                  <a href="/pasien/toko">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                    <span>Toko Kesehatan</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => document.getElementById('question')?.focus()}
                  className="flex items-center space-x-2 p-3 hover:bg-blue-50 cursor-pointer"
                >
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  <span>Tanya Dokter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <form action={formActionLogout}>
              <button
                type="submit"
                className="flex items-center space-x-2 px-3 py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Main Tabs */}
        <Tabs defaultValue="pertanyaan" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="pertanyaan" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
              <HelpCircle className="h-4 w-4 mr-2" />
              Pertanyaan
            </TabsTrigger>
            <TabsTrigger value="terjawab" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
              <MessageCircle className="h-4 w-4 mr-2" />
              Pertanyaan Terjawab
            </TabsTrigger>
            <TabsTrigger value="riwayat" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
              <Clock className="h-4 w-4 mr-2" />
              Riwayat Pertanyaan
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pertanyaan" className="space-y-8">
            {/* Question Form */}
            <Card className="overflow-hidden border-blue-100 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-blue-800 flex items-center">
                    <HelpCircle className="mr-3 text-blue-600 h-5 w-5" />
                    Ajukan Pertanyaan
                  </CardTitle>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100 rounded-full h-8 w-8">
                        <Info className="h-4 w-4" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[80vh]">
                      <div className="p-6">
                        <DrawerHeader className="px-0">
                          <DrawerTitle className="text-blue-800 text-xl">Panduan Mengajukan Pertanyaan</DrawerTitle>
                        </DrawerHeader>
                        <div className="mt-4 space-y-4">
                          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                              <Info className="h-5 w-5 mr-2 text-blue-600" />
                              Cara Bertanya dengan Baik
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                              <li>Jelaskan gejala atau masalah kesehatan Anda secara detail</li>
                              <li>Sertakan riwayat penyakit yang relevan</li>
                              <li>Unggah dokumen medis atau foto yang mendukung pertanyaan</li>
                              <li>Gunakan bahasa yang jelas dan mudah dipahami</li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-6">
                          <DrawerClose asChild>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                              Tutup
                            </Button>
                          </DrawerClose>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
                <CardDescription className="text-blue-600 mt-1">
                  Dokter kami akan menjawab pertanyaan Anda dalam 1x24 jam
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <form action={formAction} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FileUp className="h-4 w-4 mr-2 text-blue-500" />
                      Unggah Dokumen
                    </label>
                    <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                      <input
                        type="file"
                        id="file"
                        name="file"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition cursor-pointer"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Unggah file gambar, PDF, atau dokumen medis (Maks. 5MB)
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2 text-blue-500" />
                      Pertanyaan Anda
                    </label>
                    <textarea
                      id="question"
                      name="question"
                      placeholder="Tulis pertanyaan Anda secara detail... Jelaskan gejala, durasi, dan riwayat kesehatan yang relevan."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition text-sm placeholder-gray-400 shadow-sm"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <SubmitButton />
                  </div>
                </form>
                
                {state.message && (
                  <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-4 animate-fadeIn">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-green-800 font-medium">Pertanyaan Anda berhasil dikirim!</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Dokter akan membalas dalam 1x24 jam. Anda akan menerima notifikasi saat ada balasan.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="terjawab">
            <Card className="border-purple-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-purple-800 flex items-center">
                    <MessageCircle className="mr-3 text-purple-600 h-5 w-5" />
                    Pertanyaan Terjawab
                  </CardTitle>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3">
                    Total: {questions?.filter(q => q.jawaban?.length > 0).length || 0} Pertanyaan
                  </Badge>
                </div>
                <CardDescription className="text-purple-600 mt-1">
                  Lihat semua pertanyaan Anda yang telah dijawab oleh dokter
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <AnsweredQuestions questions={questions} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="riwayat">
            <Card className="border-green-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b border-green-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-green-800 flex items-center">
                    <Clock className="mr-3 text-green-600 h-5 w-5" />
                    Riwayat Pertanyaan
                  </CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3">
                    Total: {questions?.length || 0} Pertanyaan
                  </Badge>
                </div>
                <CardDescription className="text-green-600 mt-1">
                  Lihat semua pertanyaan yang pernah Anda ajukan
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <AnsweredQuestions questions={questions} showAll />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Floating Chatbot Button */}
        <ChatbotUI />
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Layanan Kesehatan</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-100 hover:text-white transition">Konsultasi Online</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white transition">Toko Kesehatan</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white transition">Tanya Dokter</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Informasi</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-100 hover:text-white transition">Tentang Kami</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white transition">Kebijakan Privasi</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white transition">Syarat & Ketentuan</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Kontak</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-blue-100">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span>support@kesehatan.id</span>
                </li>
                <li className="flex items-center text-blue-100">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+62 812 3456 7890</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-400 mt-8 pt-6 text-center text-blue-100">
            <p>© {new Date().getFullYear()} Health Tech. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}