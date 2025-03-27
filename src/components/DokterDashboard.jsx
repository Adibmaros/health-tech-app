"use client";

import React, { useActionState, useState, useEffect } from "react";
import { FileUp, LogOut, Send, MessageCircle, ShoppingCart, HelpCircle, UserCircle, FileText, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createJawaban, logOutAction } from "@/app/dokter/dashboard/lib/action";
import { toast } from "sonner"; // Assuming you're using shadcn/ui toast

const initialState = {
  message: "",
  success: false,
};

export default function DokterDashboard({ username, questions: initialQuestions }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (prevState, formData) => {
    setIsSubmitting(true);
    try {
      const result = await createJawaban(prevState, formData);
      
      if (result.success) {
        // Remove the answered question from the list
        setQuestions(prevQuestions => 
          prevQuestions.filter(q => q.id !== selectedQuestion.id)
        );
        
        // Close the dialog
        setSelectedQuestion(null);
        
        // Show success toast
        toast.success("Pertanyaan berhasil dijawab!", {
          description: "Pertanyaan telah dihapus dari daftar.",
        });
      } else {
        // Handle potential error
        toast.error("Gagal mengirim jawaban", {
          description: result.message || "Silakan coba lagi.",
        });
      }
      
      return result;
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi.",
      });
      return { success: false, message: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const [state, formAction] = useActionState(handleSubmit, initialState);
   const [stateLogout, formActionLogout] = useActionState(logOutAction, initialState);

  const openWhatsApp = () => {
    const adminPhone = "+6281368859389";
    const message = `Halo, saya ingin berkonsultasi lebih lanjut.`;
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Answer Submission Button Component
  const SubmitAnswerButton = () => (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 
        bg-green-600 text-white rounded-full 
        hover:bg-green-700 transition
        focus:outline-none focus:ring-2 
        focus:ring-green-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? (
        <>
          <CheckCircle2 className="mr-2 h-5 w-5 animate-spin" />
          Mengirim...
        </>
      ) : (
        <>
          <Send className="mr-2 h-5 w-5" />
          Kirim Jawaban
        </>
      )}
    </Button>
  );

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header Navigation */}
      <header className="bg-green-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-2">
            <UserCircle className="h-8 w-8" />
            <span className="font-semibold hidden sm:inline">{username}</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-4">
            <button onClick={openWhatsApp} className="hover:bg-green-500/10 p-2 rounded-full transition hover:cursor-pointer group relative" title="Konsultasi">
              <MessageCircle className="h-6 w-6" />
            </button>
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
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Pertanyaan Pasien
            <span className="ml-3 text-sm text-gray-600">({questions.length} pertanyaan)</span>
          </h2>

          {questions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Tidak ada pertanyaan baru saat ini.</div>
          ) : (
            questions.map((question) => (
              <div key={question.id} className="border-b py-4 hover:bg-green-50 transition cursor-pointer" onClick={() => setSelectedQuestion(question)}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 line-clamp-2">{question.question}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(question.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {question.file_path && (
                    <a href={question.file_path} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800" onClick={(e) => e.stopPropagation()}>
                      <FileText className="h-6 w-6" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Answer Modal */}
        {selectedQuestion && (
          <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Jawab Pertanyaan</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedQuestion.question}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(selectedQuestion.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {selectedQuestion.file_path && (
                    <div className="mt-3 flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <a href={selectedQuestion.file_path} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                        Lihat Dokumen Terlampir
                      </a>
                    </div>
                  )}
                </div>

                <form action={formAction} className="space-y-4">
                  {/* Hidden input for question_id */}
                  <input type="hidden" name="question_id" value={selectedQuestion.id} />
                  <div>
                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                      Jawaban
                    </label>
                    <textarea
                      id="answer"
                      name="answer"
                      placeholder="Tulis jawaban Anda di sini..."
                      rows={6}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm 
        focus:border-green-300 focus:ring focus:ring-green-200 
        focus:ring-opacity-50 text-sm"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex justify-end">
                    <SubmitAnswerButton />
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}