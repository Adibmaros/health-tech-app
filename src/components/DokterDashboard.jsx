"use client";

import React, { useActionState, useState, useEffect } from "react";
import { FileUp, LogOut, Send, MessageCircle, ShoppingCart, HelpCircle, UserCircle, FileText, Download, CheckCircle2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { createJawaban, logOutAction } from "@/app/dokter/dashboard/lib/action";
import { toast } from "sonner"; // Assuming you're using shadcn/ui toast

const initialState = {
  message: "",
  success: false,
};

// Enhanced medical record data with more comprehensive information
const enhancedMedicalRecords = [
  {
    id: "RM001",
    name: "Ahmad Rasyid",
    age: 45,
    gender: "Laki-laki",
    date: "2025-03-12",
    diagnosis: "Hipertensi Grade 1",
    symptoms: "Sakit kepala, pusing, tekanan darah 150/90 mmHg",
    medicalHistory: "Riwayat hipertensi keluarga, merokok 20 batang/hari, kolesterol tinggi",
    physicalExam: "TD: 150/90 mmHg, HR: 85x/menit, RR: 16x/menit, Suhu: 36.7°C, BB: 78 kg, TB: 170 cm, IMT: 27 kg/m²",
    labResults: "Kolesterol total: 245 mg/dL, LDL: 160 mg/dL, HDL: 38 mg/dL, Trigliserida: 180 mg/dL, Gula darah puasa: 110 mg/dL",
    treatment: "Amlodipine 5mg 1x sehari, diet rendah garam, olahraga teratur 30 menit/hari 5x seminggu",
    notes: "Disarankan untuk pemantauan tekanan darah setiap hari di rumah, mengurangi konsumsi natrium, dan berhenti merokok",
    nextVisit: "2025-04-12",
  },
  {
    id: "RM002",
    name: "Siti Nurhaliza",
    age: 32,
    gender: "Perempuan",
    date: "2025-03-15",
    diagnosis: "Diabetes Mellitus Tipe 2",
    symptoms: "Poliuria, polidipsi, penurunan berat badan, gula darah puasa 180 mg/dL",
    medicalHistory: "Riwayat keluarga DM, obesitas sejak remaja, gestational diabetes saat hamil anak pertama",
    physicalExam: "TD: 130/80 mmHg, HR: 78x/menit, RR: 18x/menit, Suhu: 36.5°C, BB: 85 kg, TB: 162 cm, IMT: 32.4 kg/m²",
    labResults: "GDS: 238 mg/dL, GDP: 180 mg/dL, HbA1c: 8.5%, Kolesterol total: 210 mg/dL, Kreatinin: 0.9 mg/dL, Mikroalbuminuria (+)",
    treatment: "Metformin 500mg 2x sehari, diet rendah karbohidrat, monitor gula darah 3x sehari, edukasi pengelolaan diabetes",
    notes: "Pasien membutuhkan konseling gizi lebih lanjut, disarankan untuk bergabung dengan support group diabetes",
    nextVisit: "2025-04-05",
  },
  {
    id: "RM003",
    name: "Budi Santoso",
    age: 28,
    gender: "Laki-laki",
    date: "2025-03-18",
    diagnosis: "Gastritis Akut",
    symptoms: "Nyeri ulu hati, mual, muntah, tidak nafsu makan",
    medicalHistory: "Riwayat konsumsi NSAID untuk nyeri lutut, stres kerja tinggi, pola makan tidak teratur",
    physicalExam: "TD: 120/70 mmHg, HR: 88x/menit, RR: 16x/menit, Suhu: 36.8°C, BB: 65 kg, TB: 175 cm, IMT: 21.2 kg/m², Nyeri tekan epigastrium (+), Defans muskuler (-)",
    labResults: "Darah lengkap: Hb 13.5 g/dL, Leukosit 9.800/μL, Trombosit 250.000/μL, Rapid test H. pylori (+)",
    treatment: "Omeprazole 20mg 2x sehari, Sucralfate 3x sehari, hindari makanan pedas dan asam, berhenti konsumsi NSAID",
    notes: "Dianjurkan makan dalam porsi kecil tapi sering, manajemen stres, dan tidur cukup",
    nextVisit: "2025-03-25",
  },
  {
    id: "RM004",
    name: "Dewi Lestari",
    age: 35,
    gender: "Perempuan",
    date: "2025-03-20",
    diagnosis: "Migrain tanpa Aura",
    symptoms: "Nyeri kepala berdenyut unilateral, fotofobia, fonofobia, mual",
    medicalHistory: "Migrain sejak usia 16 tahun, memburuk saat menstruasi, riwayat keluarga migrain dari pihak ibu",
    physicalExam: "TD: 110/70 mmHg, HR: 76x/menit, RR: 16x/menit, Suhu: 36.6°C, BB: 58 kg, TB: 160 cm, IMT: 22.7 kg/m², Pemeriksaan neurologis dalam batas normal",
    labResults: "CT Scan kepala: tidak ditemukan kelainan struktural",
    treatment: "Sumatriptan 50mg saat serangan, Propranolol 40mg 1x sehari sebagai profilaksis, hindari pemicu migrain",
    notes: "Disarankan untuk mencatat diary migrain, identifikasi pemicu, teknik relaksasi, dan manajemen stres",
    nextVisit: "2025-04-20",
  },
  {
    id: "RM005",
    name: "Agus Widodo",
    age: 52,
    gender: "Laki-laki",
    date: "2025-03-22",
    diagnosis: "Osteoarthritis Lutut Bilateral",
    symptoms: "Nyeri lutut, kaku sendi terutama pagi hari, pembengkakan, krepitasi, kesulitan naik tangga",
    medicalHistory: "Atlet sepak bola semasa muda, cedera lutut 15 tahun lalu, obesitas",
    physicalExam: "TD: 135/85 mmHg, HR: 80x/menit, RR: 18x/menit, Suhu: 36.7°C, BB: 92 kg, TB: 172 cm, IMT: 31.1 kg/m², ROM lutut terbatas, krepitasi (+), pembengkakan minimal",
    labResults: "X-ray lutut: penyempitan ruang sendi, osteofit, sklerosis subkondral",
    treatment: "Paracetamol 500mg 3x sehari, Glucosamine 500mg 2x sehari, fisioterapi 2x seminggu, latihan penguatan otot quadriceps",
    notes: "Dianjurkan penurunan berat badan, penggunaan alat bantu jalan jika diperlukan, dan evaluasi untuk injeksi hyaluronic acid",
    nextVisit: "2025-04-22",
  },
  {
    id: "RM006",
    name: "Rina Marlina",
    age: 27,
    gender: "Perempuan",
    date: "2025-03-25",
    diagnosis: "Sinusitis Akut",
    symptoms: "Nyeri wajah, kongesti nasal, rinorea purulen, sakit kepala, demam ringan",
    medicalHistory: "Rinitis alergi, septum deviasi ringan, sering mengalami ISPA",
    physicalExam: "TD: 110/70 mmHg, HR: 84x/menit, RR: 18x/menit, Suhu: 37.8°C, BB: 53 kg, TB: 158 cm, IMT: 21.2 kg/m², Nyeri tekan sinus maksilaris dan frontalis bilateral, Rinorea purulen",
    labResults: "Darah lengkap: Leukosit 12.500/μL dengan dominasi neutrofil, Endoskopi nasal: edema mukosa, sekret purulen dari meatus media",
    treatment: "Amoxicillin 500mg 3x sehari selama 7 hari, pseudoephedrine 30mg 3x sehari, salin nasal spray 3x sehari, analgesik",
    notes: "Disarankan istirahat cukup, humidifier di rumah, kompres hangat area wajah, dan evaluasi jika tidak ada perbaikan dalam 72 jam",
    nextVisit: "2025-04-01",
  },
  {
    id: "RM007",
    name: "Hadi Purnomo",
    age: 63,
    gender: "Laki-laki",
    date: "2025-03-27",
    diagnosis: "PPOK Gold III, Eksaserbasi Akut",
    symptoms: "Sesak napas bertambah, batuk produktif sputum purulen, wheezing, penurunan toleransi aktivitas",
    medicalHistory: "Perokok 45 pack-years, berhenti 2 tahun lalu, riwayat TB paru 20 tahun lalu, 3x rawat inap karena eksaserbasi PPOK",
    physicalExam: "TD: 145/85 mmHg, HR: 96x/menit, RR: 24x/menit, Suhu: 37.2°C, BB: 58 kg, TB: 170 cm, IMT: 20.1 kg/m², SpO2: 92% udara ruangan, Wheezing difus, ronkhi basah halus di basal paru bilateral",
    labResults: "Darah lengkap: Leukosit 14.200/μL, X-ray toraks: hiperinflasi, peningkatan corakan bronkovaskuler, Spirometri: FEV1 45% prediksi, FEV1/FVC: 0.62, AGD: pH 7.38, pO2 68 mmHg, pCO2 45 mmHg",
    treatment: "Salbutamol nebulizer 4x sehari, Ipratropium bromide nebulizer 4x sehari, Metilprednisolon 40mg IV, Azithromycin 500mg 1x sehari, LABA + ICS (Seretide inhaler) 2x sehari, oksigen 2L/menit",
    notes: "Direncanakan untuk program rehabilitasi paru setelah eksaserbasi teratasi, vaksinasi influenza dan pneumokokus, dan edukasi pencegahan eksaserbasi",
    nextVisit: "2025-04-10",
  },
  {
    id: "RM008",
    name: "Maya Safitri",
    age: 24,
    gender: "Perempuan",
    date: "2025-03-30",
    diagnosis: "Dermatitis Atopik",
    symptoms: "Ruam kulit gatal, eritema, kulit kering bersisik terutama di fleksor ekstremitas, eksoriasi akibat garukan",
    medicalHistory: "Asma sejak kecil, rinitis alergi, riwayat keluarga atopi, eksaserbasi saat stres dan perubahan cuaca",
    physicalExam: "TD: 110/70 mmHg, HR: 72x/menit, RR: 16x/menit, Suhu: 36.5°C, BB: 52 kg, TB: 158 cm, IMT: 20.8 kg/m², Lesi eritematosa dengan likenifikasi di fossa antekubiti, poplitea, dan leher, Eksoriasi multipel",
    labResults: "IgE total: 850 IU/mL (meningkat), Eosinofil: 8%, Patch test alergen umum: positif terhadap nikel dan parfum",
    treatment: "Hydrocortisone cream 1% untuk wajah 2x sehari, Mometasone furoate 0.1% untuk tubuh 2x sehari selama 7 hari, Cetirizine 10mg 1x sehari, pelembab kulit bebas pewangi 3x sehari",
    notes: "Edukasi tentang skincare routine, hindari pemicu seperti sabun berbahan dasar deterjen, pakaian wol, dan alergen yang diketahui, shower pendek dengan air hangat",
    nextVisit: "2025-04-15",
  },
  {
    id: "RM009",
    name: "Doni Kurniawan",
    age: 41,
    gender: "Laki-laki",
    date: "2025-04-02",
    diagnosis: "Hernia Nukleus Pulposus L4-L5",
    symptoms: "Nyeri punggung bawah menjalar ke kaki kanan, parestesi, kelemahan otot ekstensor hallucis longus kanan, nyeri bertambah saat batuk/mengejan",
    medicalHistory: "Pekerja angkat beban berat, riwayat trauma punggung 5 tahun lalu, degenerative disc disease",
    physicalExam: "TD: 130/80 mmHg, HR: 76x/menit, RR: 16x/menit, Suhu: 36.7°C, BB: 82 kg, TB: 178 cm, IMT: 25.9 kg/m², SLR test positif pada 30° kanan, Kekuatan motorik ekstensor hallucis longus kanan 4/5, Sensibilitas berkurang dermatom L5 kanan",
    labResults: "MRI lumbosakral: herniasi diskus L4-L5 lateral kanan dengan kompresi akar saraf L5, EMG/NCV: radiculopathy L5 kanan",
    treatment: "Pregabalin 75mg 2x sehari, Meloxicam 15mg 1x sehari, fisioterapi fokus pada core strengthening dan Williams flexion exercise, tirah baring saat nyeri akut",
    notes: "Disarankan konsultasi dengan dokter bedah saraf untuk evaluasi operatif jika tidak ada perbaikan dalam 6 minggu, hindari aktivitas mengangkat beban berat, edukasi postur dan ergonomik",
    nextVisit: "2025-04-16",
  },
  {
    id: "RM010",
    name: "Indah Pertiwi",
    age: 29,
    gender: "Perempuan",
    date: "2025-04-05",
    diagnosis: "Anemia Defisiensi Besi",
    symptoms: "Fatigue, pucat, pusing, palpitasi, rambut rontok, kuku rapuh",
    medicalHistory: "Menorrhagia, vegetarian, 2x persalinan dalam 3 tahun terakhir, perdarahan gastrointestinal (-)",
    physicalExam: "TD: 100/60 mmHg, HR: 92x/menit, RR: 18x/menit, Suhu: 36.6°C, BB: 48 kg, TB: 160 cm, IMT: 18.8 kg/m², Konjungtiva pucat, Koilonychia (+), Murmur sistolik grade 2/6 di apex",
    labResults: "Hb: 9.5 g/dL, MCV: 72 fL, MCH: 24 pg, MCHC: 28 g/dL, Serum iron: 30 μg/dL, TIBC: 450 μg/dL, Ferritin: 8 ng/mL, Feses darah samar (-)",
    treatment: "Ferrous sulfate 300mg 1x sehari, Vitamin C 500mg 1x sehari (untuk meningkatkan absorbsi besi), diet tinggi zat besi (daging merah, sayuran hijau, kacang-kacangan)",
    notes: "Disarankan evaluasi untuk pengobatan menorrhagia, suplementasi multivitamin, edukasi pola makan, pemeriksaan ulang darah lengkap dan profil besi dalam 1 bulan",
    nextVisit: "2025-05-05",
  },
  {
    id: "RM011",
    name: "Rudi Hermawan",
    age: 38,
    gender: "Laki-laki",
    date: "2025-04-07",
    diagnosis: "Asma Bronkial Persisten Sedang",
    symptoms: "Sesak napas, batuk, wheezing, chest tightness, gejala nokturnal 2-3x seminggu, mempengaruhi aktivitas sehari-hari",
    medicalHistory: "Asma sejak usia 10 tahun, alergi tungau debu, riwayat rhinitis alergi, keluarga dengan riwayat atopi",
    physicalExam: "TD: 120/75 mmHg, HR: 85x/menit, RR: 20x/menit, Suhu: 36.7°C, BB: 70 kg, TB: 172 cm, IMT: 23.7 kg/m², SpO2: 95% udara ruangan, Wheezing ekspiratori bilateral, perpanjangan fase ekspirasi",
    labResults: "Spirometri: FEV1 70% prediksi, FEV1/FVC: 0.72, reversibilitas (+) setelah bronkodilator, Eosinofil darah: 6%, IgE total: 450 IU/mL, Skin prick test: positif terhadap tungau debu, kecoa, dan serbuk sari",
    treatment: "Ventolin inhaler PRN saat serangan, Flutiform (fluticasone/formoterol) inhaler 2x sehari, Montelukast 10mg 1x sehari malam, edukasi teknik inhaler",
    notes: "Dianjurkan untuk penggunaan peak flow meter di rumah, sanitasi rumah untuk mengurangi alergen, vaksinasi influenza tahunan, dan pembuatan action plan asma",
    nextVisit: "2025-05-07",
  },
  {
    id: "RM012",
    name: "Laras Wati",
    age: 31,
    gender: "Perempuan",
    date: "2025-04-08",
    diagnosis: "Dislipidemia",
    symptoms: "Asimptomatik, ditemukan pada pemeriksaan kesehatan rutin",
    medicalHistory: "Obesitas, riwayat keluarga penyakit jantung koroner, hipertensi (-), diabetes (-), merokok (-)",
    physicalExam: "TD: 125/75 mmHg, HR: 78x/menit, RR: 16x/menit, Suhu: 36.5°C, BB: 78 kg, TB: 158 cm, IMT: 31.2 kg/m², Xanthelesma (-), Xanthoma (-), Arcus kornea (-)",
    labResults: "Kolesterol total: 255 mg/dL, LDL: 180 mg/dL, HDL: 38 mg/dL, Trigliserida: 200 mg/dL, Gula darah puasa: 95 mg/dL, SGOT/SGPT: normal, eGFR: normal",
    treatment: "Simvastatin 20mg 1x sehari malam, diet rendah lemak jenuh dan kolesterol, tinggi serat, olahraga aerobik minimal 150 menit/minggu",
    notes: "Dianjurkan penurunan berat badan minimal 5-10%, penambahan konsumsi ikan berlemak 2x seminggu, dan evaluasi risiko kardiovaskular dengan skor Framingham",
    nextVisit: "2025-05-08",
  },
  {
    id: "RM013",
    name: "Joko Widodo",
    age: 48,
    gender: "Laki-laki",
    date: "2025-04-10",
    diagnosis: "Konjungtivitis Bakterial Bilateral",
    symptoms: "Mata merah, sekret purulen, gatal, sensasi benda asing, perlengketan kelopak mata saat bangun tidur",
    medicalHistory: "Riwayat kontak dengan penderita konjungtivitis di tempat kerja, penggunaan lensa kontak (-), riwayat alergi mata (-)",
    physicalExam: "TD: 130/80 mmHg, HR: 76x/menit, RR: 16x/menit, Suhu: 37.1°C, BB: 68 kg, TB: 170 cm, IMT: 23.5 kg/m², Injeksi konjungtiva bilateral, Sekret purulen, Pemeriksaan funduskopi dalam batas normal",
    labResults: "Pewarnaan Gram dan kultur sekret mata: Staphylococcus aureus",
    treatment: "Tetes mata Levofloxacin 0.5% 5x sehari, kompres hangat 4x sehari, pembersihan kelopak mata dengan salin",
    notes: "Edukasi mengenai pencegahan penularan (cuci tangan, tidak berbagi handuk/bantal, hindari menyentuh mata), kontrol jika tidak ada perbaikan dalam 3 hari",
    nextVisit: "2025-04-17",
  },
  {
    id: "RM014",
    name: "Sinta Dewi",
    age: 36,
    gender: "Perempuan",
    date: "2025-04-11",
    diagnosis: "Urolitiasis (Batu Saluran Kemih)",
    symptoms: "Nyeri kolik pinggang kanan, hematuria, disuria, frekuensi berkemih meningkat",
    medicalHistory: "Riwayat batu ginjal 3 tahun lalu, konsumsi air putih kurang, diet tinggi protein hewani dan garam, riwayat keluarga nefrolitiasis",
    physicalExam: "TD: 140/85 mmHg, HR: 88x/menit, RR: 18x/menit, Suhu: 37.0°C, BB: 65 kg, TB: 165 cm, IMT: 23.9 kg/m², Nyeri ketok CVA kanan (+), Nyeri tekan suprapubik (-)",
    labResults: "Urinalisis: eritrosit 25-30/lpb, leukosit 5-10/lpb, kristal kalsium oksalat (+), USG abdomen: tampak batu 6mm di ureter kanan distal, hidronefrosis ringan ginjal kanan, CT-scan non-kontras: batu ureter kanan 6mm dengan atenuasi 950 HU",
    treatment: "Tamsulosin 0.4mg 1x sehari, Ketorolac 30mg IV (rescue), analgesik oral, hidrasi adekuat (2-3 liter/hari), sitrat kalium 10 mEq 3x sehari",
    notes: "Dianjurkan untuk evaluasi metabolik 24-jam urin setelah batu keluar, modifikasi diet sesuai jenis batu, screening keluarga, dan strategi pencegahan jangka panjang",
    nextVisit: "2025-04-25",
  },
  {
    id: "RM015",
    name: "Eko Susanto",
    age: 55,
    gender: "Laki-laki",
    date: "2025-04-12",
    diagnosis: "Dispepsia Fungsional",
    symptoms: "Nyeri ulu hati, kembung, mual, sendawa, cepat kenyang, tidak ada penurunan berat badan signifikan",
    medicalHistory: "Stres kerja tinggi, pola makan tidak teratur, konsumsi kopi >4 cangkir/hari, merokok 10 batang/hari, riwayat gastritis",
    physicalExam: "TD: 135/85 mmHg, HR: 76x/menit, RR: 16x/menit, Suhu: 36.6°C, BB: 76 kg, TB: 175 cm, IMT: 24.8 kg/m², Nyeri tekan epigastrium ringan, Tanda peritoneal (-), Organomegali (-)",
    labResults: "Darah lengkap: dalam batas normal, Fungsi hati dan ginjal: normal, Test H. pylori (urea breath test): negatif, Endoskopi: gastritis ringan tanpa ulkus atau massa, biopsi (-) keganasan",
    treatment: "Lansoprazole 30mg 1x sehari, Domperidone 10mg 3x sehari sebelum makan, diet kecil sering rendah lemak dan asam, hindari kafein, alkohol, dan makanan pedas",
    notes: "Dianjurkan teknik manajemen stres, berhenti merokok, modifikasi gaya hidup, dan evaluasi jika ada red flags (penurunan BB bermakna, disfagia, anemia, massa)",
    nextVisit: "2025-04-26",
  },
];

export default function DokterDashboard({ username, questions: initialQuestions }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("pertanyaan");
  const [filteredRecords, setFilteredRecords] = useState([...enhancedMedicalRecords]);
  const [searchId, setSearchId] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (searchId) {
      const filtered = enhancedMedicalRecords.filter(record => 
        record.id.toLowerCase().includes(searchId.toLowerCase()) ||
        record.name.toLowerCase().includes(searchId.toLowerCase())
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords([...enhancedMedicalRecords]);
    }
  }, [searchId]);

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

  const handleFilterChange = (e) => {
    setSearchId(e.target.value);
  };

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
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">Konsultasi</span>
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
        <Tabs defaultValue="pertanyaan" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="pertanyaan">Pertanyaan Pasien</TabsTrigger>
            <TabsTrigger value="rekam-medis">Rekam Medis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pertanyaan">
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
          </TabsContent>
          
          <TabsContent value="rekam-medis">
            <div className="bg-white rounded-xl shadow-xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-bold text-green-800 mb-4 md:mb-0">
                  Rekam Medis Pasien
                  <span className="ml-3 text-sm text-gray-600">({filteredRecords.length} rekam medis)</span>
                </h2>
                
                <div className="relative w-full md:w-64">
                  <Input
                    type="text"
                    placeholder="Cari berdasarkan ID atau nama..."
                    value={searchId}
                    onChange={handleFilterChange}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {filteredRecords.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Tidak ada rekam medis yang ditemukan.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Umur</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kelamin</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-green-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.age}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.gender}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.diagnosis}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button
                              variant="outline"
                              className="text-green-600 hover:text-green-800 hover:bg-green-50"
                              onClick={() => {
                                setSelectedRecord(record);
                              }}
                            >
                              Detail
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

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

        {/* Medical Record Detail Modal */}
        {selectedRecord && (
          <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl text-green-800">
                  Detail Rekam Medis: {selectedRecord.id}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Patient Information */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-green-700">Informasi Pasien</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nama</p>
                      <p className="font-medium">{selectedRecord.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Umur</p>
                      <p className="font-medium">{selectedRecord.age} tahun</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jenis Kelamin</p>
                      <p className="font-medium">{selectedRecord.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Pemeriksaan</p>
                      <p className="font-medium">{selectedRecord.date}</p>
                    </div>
                  </div>
                </div>

                {/* Diagnosis & Symptoms */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg mb-2 text-green-700">Diagnosis & Gejala</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Diagnosis</p>
                      <p className="font-medium">{selectedRecord.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gejala</p>
                      <p>{selectedRecord.symptoms}</p>
                    </div>
                    {selectedRecord.medicalHistory && (
                      <div>
                        <p className="text-sm text-gray-500">Riwayat Medis</p>
                        <p>{selectedRecord.medicalHistory}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Physical Examination & Lab Results */}
                {(selectedRecord.physicalExam || selectedRecord.labResults) && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-lg mb-2 text-green-700">Pemeriksaan & Hasil Lab</h3>
                    <div className="space-y-3">
                      {selectedRecord.physicalExam && (
                        <div>
                          <p className="text-sm text-gray-500">Pemeriksaan Fisik</p>
                          <p>{selectedRecord.physicalExam}</p>
                        </div>
                      )}
                      {selectedRecord.labResults && (
                        <div>
                          <p className="text-sm text-gray-500">Hasil Laboratorium</p>
                          <p>{selectedRecord.labResults}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Treatment Plan */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg mb-2 text-green-700">Rencana Pengobatan</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Pengobatan</p>
                      <p>{selectedRecord.treatment}</p>
                    </div>
                    {selectedRecord.notes && (
                      <div>
                        <p className="text-sm text-gray-500">Catatan</p>
                        <p>{selectedRecord.notes}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Kunjungan Berikutnya</p>
                      <p className="font-medium">{selectedRecord.nextVisit}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" onClick={() => setSelectedRecord(null)}>
                    Tutup
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}