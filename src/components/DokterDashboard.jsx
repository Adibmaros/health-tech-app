"use client";
import React, { useActionState, useState, useEffect } from "react";
import { FileUp, LogOut, Send, MessageCircle, Phone, ShoppingCart, HelpCircle, UserCircle, FileText, Download, CheckCircle2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { createJawaban, logOutAction } from "@/app/dokter/dashboard/lib/action";
import { toast } from "sonner";

const initialState = {
  message: "",
  success: false,
};

// Enhanced medical record data (unchanged)
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
    physicalExam:
      "TD: 130/80 mmHg, HR: 76x/menit, RR: 16x/menit, Suhu: 36.7°C, BB: 82 kg, TB: 178 cm, IMT: 25.9 kg/m², SLR test positif pada 30° kanan, Kekuatan motorik ekstensor hallucis longus kanan 4/5, Sensibilitas berkurang dermatom L5 kanan",
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
    labResults:
      "Urinalisis: eritrosit 25-30/lpb, leukosit 5-10/lpb, kristal kalsium oksalat (+), USG abdomen: tampak batu 6mm di ureter kanan distal, hidronefrosis ringan ginjal kanan, CT-scan non-kontras: batu ureter kanan 6mm dengan atenuasi 950 HU",
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
      const filtered = enhancedMedicalRecords.filter((record) => record.id.toLowerCase().includes(searchId.toLowerCase()) || record.name.toLowerCase().includes(searchId.toLowerCase()));
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
        setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== selectedQuestion.id));
        setSelectedQuestion(null);
        toast.success("Pertanyaan berhasil dijawab!", {
          description: "Pertanyaan telah dihapus dari daftar.",
          className: "bg-green-600 text-white border-green-700",
        });
      } else {
        toast.error("Gagal mengirim jawaban", {
          description: result.message || "Silakan coba lagi.",
          className: "bg-red-600 text-white border-red-700",
        });
      }

      return result;
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi.",
        className: "bg-red-600 text-white border-red-700",
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

  const SubmitAnswerButton = () => (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full 
        hover:from-green-700 hover:to-teal-700 transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      {/* Header Navigation */}
      <header className="bg-gradient-to-r from-green-700 to-teal-600 text-white py-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-full">
              <UserCircle className="h-8 w-8" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg">{username}</span>
              <span className="text-xs text-green-100">Dokter</span>
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <button onClick={openWhatsApp} className="relative p-2 rounded-full hover:bg-green-600/20 transition-all group" title="Konsultasi via WhatsApp">
              <MessageCircle className="h-6 w-6" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">Konsultasi</span>
            </button>
            <form action={formActionLogout}>
              <button type="submit" className="relative p-2 rounded-full hover:bg-red-500/20 transition-all group text-red-400 hover:text-red-300" title="Keluar">
                <LogOut className="h-6 w-6" />
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">Logout</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <Tabs defaultValue="pertanyaan" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 m-2 bg-white rounded-xl overflow-hidden shadow-md">
            <TabsTrigger
              value="pertanyaan"
              className="flex items-center justify-center w-full py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Pertanyaan Pasien
            </TabsTrigger>
            <TabsTrigger
              value="rekam-medis"
              className="flex items-center justify-center w-full py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Rekam Medis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pertanyaan">
            <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <HelpCircle className="h-6 w-6 text-green-600 mr-2" />
                  Pertanyaan Pasien
                </h2>
                <span className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">{questions.length} pertanyaan</span>
              </div>

              {questions.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-lg">Tidak ada pertanyaan baru saat ini.</p>
                </div>
              ) : (
                questions.map((question) => (
                  <div key={question.id} className="border-b border-gray-100 py-4 hover:bg-green-50/50 rounded-lg transition-all duration-200 cursor-pointer px-4" onClick={() => setSelectedQuestion(question)}>
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-gray-700 font-medium line-clamp-2">{question.question}</p>
                        <p className="text-xs text-gray-400">
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
                        <a href={question.file_path} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 transition-colors" onClick={(e) => e.stopPropagation()}>
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
            <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FileText className="h-6 w-6 text-green-600 mr-2" />
                  Rekam Medis Pasien
                </h2>
                <div className="relative w-full md:w-80">
                  <Input
                    type="text"
                    placeholder="Cari berdasarkan ID atau nama..."
                    value={searchId}
                    onChange={handleFilterChange}
                    className="pl-12 pr-4 py-3 rounded-full border-gray-200 focus:border-green-400 focus:ring-green-200 text-sm shadow-sm"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {filteredRecords.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <p className="text-lg">Tidak ada rekam medis yang ditemukan.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-green-50 to-teal-50">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Nama
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Umur
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Jenis Kelamin
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Diagnosis
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-green-50/50 transition-all duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.age}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.gender}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.diagnosis}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <Button variant="outline" className="px-4 py-2 border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm" onClick={() => setSelectedRecord(record)}>
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
            <DialogContent className="max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
              <DialogHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-t-xl">
                <DialogTitle className="text-xl font-semibold">Jawab Pertanyaan</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-xl shadow-inner">
                  <p className="text-gray-800 font-medium">{selectedQuestion.question}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(selectedQuestion.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {selectedQuestion.file_path && (
                    <div className="mt-4 flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-green-600" />
                      <a href={selectedQuestion.file_path} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 hover:underline transition-colors">
                        Lihat Dokumen Terlampir
                      </a>
                    </div>
                  )}
                </div>

                <form action={formAction} className="space-y-6">
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
                      className="mt-1 p-4 block w-full rounded-xl border-gray-200 shadow-sm 
                        focus:border-green-400 focus:ring focus:ring-green-200 focus:ring-opacity-50 
                        text-sm transition-all duration-300 disabled:opacity-50"
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-8">
              <DialogHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-t-xl">
                <DialogTitle className="text-xl font-semibold">Detail Rekam Medis: {selectedRecord.id}</DialogTitle>
              </DialogHeader>

              <div className="space-y-8">
                {/* Patient Information */}
                <div className="bg-green-50 p-6 rounded-xl shadow-inner">
                  <h3 className="font-semibold text-lg mb-4 text-green-800 flex items-center">
                    <UserCircle className="h-5 w-5 mr-2" />
                    Informasi Pasien
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Nama</p>
                      <p className="text-gray-800">{selectedRecord.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Umur</p>
                      <p className="text-gray-800">{selectedRecord.age} tahun</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Jenis Kelamin</p>
                      <p className="text-gray-800">{selectedRecord.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Tanggal Pemeriksaan</p>
                      <p className="text-gray-800">{selectedRecord.date}</p>
                    </div>
                  </div>
                </div>

                {/* Diagnosis & Symptoms */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 text-green-800 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Diagnosis & Gejala
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Diagnosis</p>
                      <p className="text-gray-800 font-medium">{selectedRecord.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Gejala</p>
                      <p className="text-gray-800">{selectedRecord.symptoms}</p>
                    </div>
                    {selectedRecord.medicalHistory && (
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Riwayat Medis</p>
                        <p className="text-gray-800">{selectedRecord.medicalHistory}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Physical Examination & Lab Results */}
                {(selectedRecord.physicalExam || selectedRecord.labResults) && (
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-green-800 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Pemeriksaan & Hasil Lab
                    </h3>
                    <div className="space-y-4">
                      {selectedRecord.physicalExam && (
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Pemeriksaan Fisik</p>
                          <p className="text-gray-800">{selectedRecord.physicalExam}</p>
                        </div>
                      )}
                      {selectedRecord.labResults && (
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Hasil Laboratorium</p>
                          <p className="text-gray-800">{selectedRecord.labResults}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Treatment Plan */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 text-green-800 flex items-center">
                    <Send className="h-5 w-5 mr-2" />
                    Rencana Pengobatan
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Pengobatan</p>
                      <p className="text-gray-800">{selectedRecord.treatment}</p>
                    </div>
                    {selectedRecord.notes && (
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Catatan</p>
                        <p className="text-gray-800">{selectedRecord.notes}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Kunjungan Berikutnya</p>
                      <p className="text-gray-800 font-medium">{selectedRecord.nextVisit}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" className="px-6 py-3 border-green-600 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm" onClick={() => setSelectedRecord(null)}>
                    Tutup
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-700 to-teal-600 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Layanan Kesehatan</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-green-100 hover:text-white transition">
                    Konsultasi Online
                  </a>
                </li>
                <li>
                  <a href="#" className="text-green-100 hover:text-white transition">
                    Tanya Dokter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Informasi</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-green-100 hover:text-white transition">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="text-green-100 hover:text-white transition">
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Kontak</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-green-100">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span>support@kesehatan.id</span>
                </li>
                <li className="flex items-center text-green-100">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+62 812 3456 7890</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-400 mt-8 pt-6 text-center text-green-100">
            <p>© {new Date().getFullYear()} Health Tech. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
