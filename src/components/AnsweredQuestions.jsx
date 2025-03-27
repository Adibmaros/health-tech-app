"use client";

import React, { useState } from "react";
import { Check, Image as ImageIcon } from "lucide-react";

export default function AnsweredQuestions({ questions }) {
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-[90%] max-h-[90%] flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Full size" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-800 flex items-center mb-4">
          <Check className="mr-2 sm:mr-3 text-green-600 h-5 w-5 sm:h-6 sm:w-6" />
          Pertanyaan Terjawab
        </h2>

        {questions.length === 0 ? (
          <p className="text-gray-600 text-center">Belum ada pertanyaan yang terjawab.</p>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div 
                key={question.id} 
                className="border rounded-lg p-4 hover:bg-blue-50 transition"
              >
                <div 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer"
                  onClick={() => setExpandedQuestionId(
                    expandedQuestionId === question.id ? null : question.id
                  )}
                >
                  <div className="flex-grow pr-4 w-full">
                    <div className="flex justify-between items-start">
                      <div className="pr-2">
                        <p className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                          {question.question}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-2">
                          {new Date(question.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        {/* Render file preview indicator */}
                        {question.file_path && (
                          <div 
                            className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(question.file_path);
                            }}
                          >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            <span className="text-xs sm:text-sm">Lihat Gambar</span>
                          </div>
                        )}
                      </div>
                      <span className={`
                        px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap
                        ${question.jawaban.length > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'}
                      `}>
                        {question.jawaban.length > 0 ? 'Terjawab' : 'Menunggu'}
                      </span>
                    </div>
                  </div>
                </div>

                {expandedQuestionId === question.id && question.jawaban.length > 0 && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Jawaban Dokter:</h3>
                    <p className="text-gray-700 text-xs sm:text-sm">{question.jawaban[0].message}</p>
                    <p className="text-[10px] sm:text-sm text-gray-500 mt-2">
                      Dijawab pada: {new Date(question.jawaban[0].created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}