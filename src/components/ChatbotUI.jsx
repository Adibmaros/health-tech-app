"use client"

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, X } from "lucide-react";

const HEALTH_KNOWLEDGE_BASE = [
  {
    keywords: ["demam", "panas", "pilek", "flu"],
    response: "Untuk demam ringan, disarankan: \n- Istirahat yang cukup\n- Minum banyak cairan\n- Konsumsi obat penurun panas seperti paracetamol\n- Jika suhu di atas 39°C atau berlangsung lebih dari 3 hari, segera konsultasi dokter",
  },
  {
    keywords: ["sakit perut", "mual", "diare", "muntah"],
    response:
      "Untuk gangguan pencernaan, disarankan: \n- Hindari makanan pedas dan berminyak\n- Konsumsi makanan yang mudah dicerna\n- Minum air putih yang cukup\n- Gunakan obat anti-diare jika diperlukan\n- Jika berlangsung lebih dari 2 hari, segera periksa ke dokter",
  },
  {
    keywords: ["pusing", "pening", "kepala", "migrain"],
    response:
      "Untuk keluhan pusing, disarankan: \n- Istirahat yang cukup\n- Hindari aktivitas yang membuat kepala lebih pening\n- Konsumsi air putih yang cukup\n- Lakukan relaksasi atau meditasi ringan\n- Jika pusing sangat mengganggu, segera konsultasi dokter",
  },
  {
    keywords: ["batuk", "batuk-batuk", "pilek", "tenggorokan sakit"],
    response:
      "Untuk gangguan pernapasan ringan, disarankan: \n- Minum air hangat dengan madu\n- Gunakan obat batuk yang sesuai\n- Istirahat yang cukup\n- Hindari udara dingin\n- Gunakan masker jika perlu\n- Jika batuk berlangsung lebih dari seminggu, konsultasi dokter",
  },
  {
    keywords: ["alergi", "gatal", "ruam", "kulit merah"],
    response:
      "Untuk mengatasi gejala alergi, disarankan: \n- Hindari pemicu alergi\n- Gunakan obat anti-alergi seperti antihistamin\n- Gunakan losion kalamin untuk meredakan gatal\n- Kompres dingin pada area yang gatal\n- Jika reaksi alergi parah atau meluas, segera ke dokter",
  },
  {
    keywords: ["nyeri sendi", "nyeri otot", "capek", "lelah"],
    response:
      "Untuk mengatasi nyeri sendi dan otot, disarankan: \n- Istirahat yang cukup\n- Kompres hangat atau dingin pada area yang sakit\n- Lakukan peregangan ringan\n- Konsumsi obat pereda nyeri seperti ibuprofen\n- Hindari gerakan yang berlebihan\n- Jika nyeri berlanjut, konsultasi dokter",
  },
  {
    keywords: ["insomnia", "sulit tidur", "gangguan tidur"],
    response:
      "Untuk mengatasi gangguan tidur, disarankan: \n- Tetapkan jadwal tidur yang teratur\n- Hindari penggunaan elektronik sebelum tidur\n- Ciptakan lingkungan tidur yang nyaman\n- Lakukan relaksasi sebelum tidur\n- Hindari konsumsi kafein di malam hari\n- Jika insomnia berkepanjangan, konsultasi dokter",
  },
  {
    keywords: ["stres", "cemas", "depresi", "tekanan mental"],
    response:
      "Untuk mengatasi gangguan mental, disarankan: \n- Lakukan meditasi atau teknik relaksasi\n- Berbicara dengan teman atau keluarga\n- Jaga pola makan dan tidur yang teratur\n- Lakukan aktivitas fisik ringan\n- Pertimbangkan konsultasi dengan psikolog atau psikiater\n- Hindari konsumsi alkohol dan obat-obatan terlarang",
  },
  {
    keywords: ["sakit gigi", "nyeri gigi", "gigi berlubang"],
    response:
      "Untuk mengatasi sakit gigi, disarankan: \n- Gunakan obat pereda nyeri gigi\n- Berkumur dengan air garam hangat\n- Hindari makanan atau minuman dingin/panas\n- Gunakan benang gigi untuk membersihkan sela gigi\n- Segera ke dokter gigi untuk pemeriksaan\n- Jaga kebersihan mulut dengan menggosok gigi secara teratur",
  },
  {
    keywords: ["mata merah", "iritasi mata", "sakit mata"],
    response:
      "Untuk mengatasi masalah mata, disarankan: \n- Hindari mengucek mata\n- Kompres mata dengan air dingin\n- Gunakan obat tetes mata yang sesuai\n- Istirahatkan mata dari layar elektronik\n- Gunakan kacamata pelindung jika perlu\n- Jika mata terus merah atau nyeri, segera ke dokter mata",
  },
  {
    keywords: ["darah tinggi", "hipertensi", "tekanan darah"],
    response:
      "Untuk mengelola tekanan darah tinggi, disarankan: \n- Kurangi konsumsi garam\n- Lakukan diet sehat\n- Olahraga teratur\n- Hindari stres\n- Kontrol berat badan\n- Rutin memeriksakan tekanan darah\n- Konsumsi obat sesuai resep dokter\n- Hindari rokok dan alkohol",
  },
];

export default function ChatbotUI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Halo! Bagaimana saya bisa membantu Anda?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const getBotResponse = (userInput) => {
    for (let entry of HEALTH_KNOWLEDGE_BASE) {
      if (entry.keywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
        return entry.response;
      }
    }
    return "Maaf, saya tidak mengerti. Silakan konsultasikan dengan dokter untuk informasi lebih lanjut.";
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    const userMessage = { text: input, sender: "user" };
    const botMessage = { text: getBotResponse(input), sender: "bot" };
    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  const handleClickOutside = (event) => {
    if (chatRef.current && !chatRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div>
      {/* Chat Icon Button */}
      <Button
        className="fixed bottom-4 right-4 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={24} />
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div ref={chatRef} className="fixed bottom-16 right-4 w-80 bg-white shadow-2xl rounded-lg border border-gray-200 transition-transform transform scale-100">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Chat Konsultasi Kesehatan</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="h-60 overflow-y-auto border p-2 rounded bg-gray-100">
                {messages.map((msg, index) => (
                  <p key={index} className={`text-sm p-1 ${msg.sender === "bot" ? "text-gray-600" : "text-blue-600 text-right"}`}>
                    {msg.text}
                  </p>
                ))}
              </div>
              <input
                type="text"
                className="w-full p-2 mt-2 border rounded-md"
                placeholder="Ketik pesan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSendMessage}>
                Kirim
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
