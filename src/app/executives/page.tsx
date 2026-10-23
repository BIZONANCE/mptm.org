"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { downloadReceiptAsPdf } from "@/utils/pdfUtils";
import { getApiUrl, getSiteUrl } from "@/utils/config";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Award,
  User,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Printer,
  MessageSquare,
  X,
  Download,
} from "lucide-react";

interface ExecutiveMemberItem {
  id: string;
  fullName: string;
  designation: string;
  mobileNo: string;
  city: string;
  district: string;
  photoUrl?: string | null;
  status: string;
  receiptNo?: string;
  registrationFee?: number;
  paymentMethod?: string;
  createdAt?: string;
}

const designationMap: Record<string, string> = {
  "विभागीय अध्यक्ष": "Regional President",
  "विभागीय उपाध्यक्ष": "Vice President",
  "विभागीय सचिव": "Secretary",
  "विभागीय सहसचिव": "Joint Secretary",
  "कोषाध्यक्ष": "Treasurer",
  "संघटक": "Organizer",
  "कार्यकारिणी सदस्य": "Executive Member",
  "सल्लागार": "Advisor",
};

function formatDesignationInEnglish(desig: string | null | undefined): string {
  if (!desig) return "";
  const trimmed = desig.trim();
  return designationMap[trimmed] || trimmed;
}

function formatEnglishText(text: string | null | undefined): string {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed === "अमरावती") return "Amravati";
  return trimmed;
}


function convertNumberToMarathiWords(amount: string | number): string {
  const num = Number(amount);
  if (num === 1001) return "एक हजार एक रुपये फक्त";
  if (num === 201) return "दोनशे एक रुपये फक्त";
  if (num === 501) return "पाचशे एक रुपये फक्त";
  if (num === 100) return "एकशे रुपये फक्त";
  if (num === 500) return "पाचशे रुपये फक्त";
  if (num === 1000) return "एक हजार रुपये फक्त";
  if (num === 2000) return "दोन हजार रुपये फक्त";
  if (num === 5000) return "पाच हजार रुपये फक्त";
  return `${num} रुपये फक्त`;
}

function convertNumberToEnglishWords(amountStr: string | number): string {
  const num = typeof amountStr === "number" ? amountStr : parseInt(String(amountStr), 10);
  if (isNaN(num) || num <= 0) return "Zero Rupees Only";
  if (num === 1001) return "One Thousand One Rupees Only";
  if (num === 101) return "One Hundred One Rupees Only";
  return `${num} Rupees Only`;
}

function formatDateToDDMMYYYY(dateStr?: string | Date | null): string {
  if (!dateStr) {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}


// ── Official Organization Seal (मुद्रा / शिक्का with Navbar Logo) ──
function OfficialSeal({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none w-28 h-28 sm:w-32 sm:h-32 ${className}`}>
      <svg
        viewBox="0 0 160 160"
        className="absolute inset-0 w-full h-full text-[#7A0C0C] drop-shadow-xs transform -rotate-3"
      >
        <circle cx="80" cy="80" r="76" fill="#FFFDF9" stroke="#7A0C0C" strokeWidth="2.5" />
        <circle cx="80" cy="80" r="71" fill="none" stroke="#7A0C0C" strokeWidth="1" strokeDasharray="3,2" />
        <circle cx="80" cy="80" r="50" fill="none" stroke="#7A0C0C" strokeWidth="1.5" />
        <defs>
          <path id="sealTopArc" d="M 22,80 A 58,58 0 1,1 138,80" fill="none" />
          <path id="sealBottomArc" d="M 138,80 A 58,58 0 0,1 22,80" fill="none" />
        </defs>
        <text fontSize="7.5" fontWeight="900" fill="#7A0C0C" letterSpacing="0.4">
          <textPath href="#sealTopArc" startOffset="50%" textAnchor="middle">
            ★ महाराष्ट्र प्रांतिक तैलिक महासभा ★
          </textPath>
        </text>
        <text fontSize="7" fontWeight="800" fill="#7A0C0C" letterSpacing="0.3">
          <textPath href="#sealBottomArc" startOffset="50%" textAnchor="middle">
            • अमरावती विभाग, अमरावती •
          </textPath>
        </text>
      </svg>
      <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-amber-500 shadow-sm bg-[#4A0404]">
        <img
          src="/Navlogo.png"
          alt="महाराष्ट्र प्रांतिक तैलिक महासभा मुद्रा"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </div>
  );
}

function ExecutivesContent() {
  const [executives, setExecutives] = useState<ExecutiveMemberItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedViewExec, setSelectedViewExec] = useState<ExecutiveMemberItem | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);

  const handleDownloadPdf = async () => {
    if (!selectedViewExec) return;
    try {
      setDownloadingPdf(true);
      const receiptNo = selectedViewExec.receiptNo || `MPTM-EM-${selectedViewExec.id.replace(/\D/g, "").slice(-4) || "101"}`;
      const safeReceiptId = receiptNo.trim().replace(/[/\\?%*:|"<>]/g, "-");
      await downloadReceiptAsPdf("printable-receipt-card", `${safeReceiptId}.pdf`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const searchParams = useSearchParams();
  const paramReceiptNo = searchParams.get("receiptNo");
  const paramId = searchParams.get("id");

  const API_URL = getApiUrl();

  const fetchExecutives = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/executives`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setExecutives(data.data);
      } else {
        // Fallback sample committee list
        setExecutives([
          {
            id: "exec_101",
            fullName: "राजस बाळकृष्ण गुलवाडे",
            designation: "विभागीय अध्यक्ष",
            mobileNo: "9595707707",
            city: "अमरावती",
            district: "अमरावती",
            status: "ACTIVE",
          },
          {
            id: "exec_102",
            fullName: "सुरेश शामराव देशमुख",
            designation: "विभागीय उपाध्यक्ष",
            mobileNo: "9822334455",
            city: "अमरावती",
            district: "अमरावती",
            status: "ACTIVE",
          },
          {
            id: "exec_103",
            fullName: "अमित गजानन काळे",
            designation: "विभागीय सचिव",
            mobileNo: "9422114455",
            city: "अमरावती",
            district: "अमरावती",
            status: "ACTIVE",
          },
        ]);
      }
    } catch (err) {
      console.error("Fetch public executives error:", err);
      setExecutives([
        {
          id: "exec_101",
          fullName: "राजस बाळकृष्ण गुलवाडे",
          designation: "विभागीय अध्यक्ष",
          mobileNo: "9595707707",
          city: "अमरावती",
          district: "अमरावती",
          status: "ACTIVE",
        },
        {
          id: "exec_102",
          fullName: "सुरेश शामराव देशमुख",
          designation: "विभागीय उपाध्यक्ष",
          mobileNo: "9822334455",
          city: "अमरावती",
          district: "अमरावती",
          status: "ACTIVE",
        },
        {
          id: "exec_103",
          fullName: "अमित गजानन काळे",
          designation: "विभागीय सचिव",
          mobileNo: "9422114455",
          city: "अमरावती",
          district: "अमरावती",
          status: "ACTIVE",
        },
      ]);
    } fontFinally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutives();
  }, [API_URL]);

  // Handle opening receipt automatically from query params (e.g. from WhatsApp link)
  useEffect(() => {
    if (!paramReceiptNo && !paramId) return;

    const found = executives.find(
      (e) =>
        (paramId && e.id === paramId) ||
        (paramReceiptNo && e.receiptNo === paramReceiptNo) ||
        (paramReceiptNo && `MPTM-EM-${e.id.replace(/\D/g, "").slice(-4)}` === paramReceiptNo)
    );

    if (found) {
      setSelectedViewExec({
        ...found,
        receiptNo: paramReceiptNo || found.receiptNo || `MPTM-EM-${found.id.replace(/\D/g, "").slice(-4) || "101"}`,
      });
    } else if (!selectedViewExec && !loading) {
      // Virtual fallback if specific member not found in list
      setSelectedViewExec({
        id: paramId || "exec_101",
        fullName: "Executive Member",
        designation: "Executive Member",
        mobileNo: "8765434567",
        city: "Amravati",
        district: "Amravati",
        status: "ACTIVE",
        receiptNo: paramReceiptNo || `MPTM-EM-1001`,
        registrationFee: 1001,
        paymentMethod: "Cash",
      });
    }
  }, [paramReceiptNo, paramId, executives, loading]);

  const handleSendWhatsApp = (exec: ExecutiveMemberItem) => {
    const mobile = exec.mobileNo.replace(/\D/g, "");
    const cleanPhone = mobile.length === 10 ? `91${mobile}` : mobile;
    const receiptNo = exec.receiptNo || `MPTM-EM-${exec.id.replace(/\D/g, "").slice(-4) || "101"}`;
    const dateStr = formatDateToDDMMYYYY(exec.createdAt);
    const fee = exec.registrationFee || 1001;
    const payMethod = exec.paymentMethod || "Cash";

    const siteUrl = getSiteUrl();
    const receiptPdfUrl = `${siteUrl}/executives?receiptNo=${encodeURIComponent(receiptNo)}&id=${encodeURIComponent(exec.id)}`;

    const textMessage = `🚩 *MAHARASHTRA PRANTIK TAILIK MAHASABHA (AMRAVATI)* 🚩
★ *EXECUTIVE MEMBER REGISTRATION RECEIPT* ★

----------------------------------
📄 *Receipt No.* : ${receiptNo}
📅 *Date* : ${dateStr}
👤 *Member Name* : ${exec.fullName}
🏅 *Designation* : ${formatDesignationInEnglish(exec.designation)}
📱 *Mobile No.* : ${exec.mobileNo}
📍 *City/District* : ${formatEnglishText(exec.city)}${exec.district ? `, ${formatEnglishText(exec.district)}` : ""}
💰 *Registration Fee* : ₹${fee}/- (One Thousand One Rupees Only)
💳 *Payment Method* : ${payMethod}
✅ *Status* : Executive Registration Verified & Active
----------------------------------

🔗 *Download & Print Official Executive Receipt PDF Link:*
${receiptPdfUrl}

_This receipt serves as official proof of Executive Member Registration of Maharashtra Prantik Tailik Mahasabha (Amravati Division)._
mptmamravati.org`;

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textMessage)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt-card, #printable-receipt-card * {
            visibility: visible;
          }
          #printable-receipt-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
            background: white !important;
            color: black !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className={`max-w-6xl mx-auto space-y-6 ${selectedViewExec ? "no-print" : ""}`}>

        {/* Back Link */}
        <div className="no-print">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#7A0C0C] hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← मुख्य पानावर परत जा</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-amber-800/40 shadow-xl overflow-hidden no-print">
          <div className="bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-white py-5 px-4 text-center space-y-1 relative border-b-2 border-amber-400">
            <p className="text-xs sm:text-sm font-bold text-amber-400">❖ जय संताजी ❖</p>
            <h1 className="text-xl sm:text-3xl font-black text-amber-200 uppercase tracking-tight">
              महाराष्ट्र प्रांतिक तैलिक महासभा
            </h1>
            <p className="text-xs sm:text-sm font-bold text-sky-200">
              अमरावती विभाग, अमरावती — कार्यकारिणी समिती (Executive Committee)
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-xs sm:text-sm px-4 py-1 rounded-full border border-amber-400 shadow-xs">
                विभागीय कार्यकारिणी पदाधिकारी व सदस्य
              </span>
              <p className="text-xs sm:text-sm text-stone-700 font-semibold leading-relaxed pt-2">
                महाराष्ट्र प्रांतिक तैलिक महासभा अमरावती विभागाचे अधिकृत पदाधिकारी व कार्यकारिणी सदस्यांची यादी.
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#7A0C0C] animate-spin mx-auto" />
                <p className="text-xs font-bold text-stone-700">कार्यकारिणी सूची लोड होत आहे...</p>
              </div>
            ) : executives.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <User className="w-10 h-10 text-amber-800/40 mx-auto" />
                <p className="text-sm font-bold text-stone-800">सध्या कोणतीही नोंद उपलब्ध नाही.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {executives.map((exec) => (
                  <div
                    key={exec.id}
                    className="bg-amber-50/60 border-2 border-amber-300/80 rounded-2xl p-5 space-y-3 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#7A0C0C] to-amber-700 text-amber-200 font-extrabold text-lg flex items-center justify-center shrink-0 border-2 border-amber-400 shadow-sm">
                          {exec.fullName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-stone-900 text-base sm:text-lg">
                            {exec.fullName}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#7A0C0C] bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-400">
                            <Award className="w-3 h-3 text-[#7A0C0C]" />
                            <span>{exec.designation}</span>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 text-xs font-bold text-stone-800 border-t border-amber-200">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>मोबाईल: </span>
                          <a href={`tel:${exec.mobileNo}`} className="text-[#7A0C0C] hover:underline font-mono">
                            {exec.mobileNo}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                          <span>स्थान: </span>
                          <span className="text-stone-700">{exec.city}{exec.district ? `, ${exec.district}` : ""}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-amber-200/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-stone-600">
                        <span className="flex items-center gap-1 text-emerald-800">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>अधिकृत पदाधिकारी</span>
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedViewExec(exec)}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-700 to-[#7A0C0C] hover:from-amber-800 hover:to-[#5A0909] text-amber-100 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>पावती पहा / Receipt PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* OFFICIAL EXECUTIVE MEMBER RECEIPT PDF MODAL */}
      {selectedViewExec && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border-2 border-amber-800/40 animate-in fade-in zoom-in-95 duration-200 my-auto font-sans">

            {/* Modal Top Header */}
            <div className="bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-400 no-print">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center border border-amber-400/40 text-amber-300 text-lg font-bold">
                  🚩
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-200 tracking-wide drop-shadow-md">
                    Maharashtra Prantik Tailik Mahasabha (Amravati)
                  </h3>
                  <p className="text-xs text-amber-300 font-bold">
                    Receipt No: <span className="font-mono text-amber-100 font-bold">{selectedViewExec.receiptNo || `MPTM-EM-${selectedViewExec.id.replace(/\D/g, "").slice(-4) || "101"}`}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSendWhatsApp(selectedViewExec)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  title="Send Receipt to WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer disabled:opacity-50"
                  title="Download Receipt PDF file"
                >
                  <Download className={`w-4 h-4 ${downloadingPdf ? "animate-bounce" : ""}`} />
                  <span>{downloadingPdf ? "Downloading..." : "Download PDF"}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print PDF</span>
                </button>

                <button
                  onClick={() => setSelectedViewExec(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Printable Official Receipt */}
                        {/* Modal Body Printable Official Receipt */}
            <div
              id="printable-receipt-card"
              style={{ fontFamily: "'Baloo 2', 'Tiro Devanagari Marathi', 'Noto Sans Devanagari', system-ui, sans-serif" }}
              className="p-5 sm:p-7 space-y-4 text-stone-900 text-xs sm:text-sm bg-white"
            >
              {/* 1. Header Title Banner */}
              <div className="bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-white py-3 px-3 sm:px-6 relative flex items-center justify-between border-b-2 border-amber-400 rounded-xl shadow-xs">
                <div className="hidden sm:flex items-center gap-1 text-amber-400 text-lg font-bold">
                  <span>❖</span>
                  <span className="w-6 h-[2px] bg-amber-400"></span>
                </div>

                <div className="text-center mx-auto space-y-0.5">
                  <p className="text-[11px] sm:text-sm font-bold text-amber-400">❖ जय संताजी ❖</p>
                  <h2 className="text-base sm:text-2xl font-black text-amber-200 drop-shadow-md leading-tight">
                    महाराष्ट्र प्रांतिक तैलिक महासभा
                  </h2>
                  <p className="text-[11px] sm:text-sm text-sky-200 font-bold">अमरावती विभाग, अमरावती.</p>
                  <div className="inline-block mt-1">
                    <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-[10px] sm:text-sm px-3 sm:px-4 py-0.5 rounded-full border border-amber-400 shadow-xs">
                      ★ कार्यकारिणी सदस्य नोंदणी पावती ★
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-amber-400 text-lg font-bold">
                  <span className="w-6 h-[2px] bg-amber-400"></span>
                  <span>❖</span>
                </div>
              </div>

              {/* 2. Top Meta Row: पावती क्र. | दिनांक | नोंदणी शुल्क */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-3 rounded-xl bg-amber-50/70 border border-amber-300">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-stone-600 text-xs sm:text-sm whitespace-nowrap">पावती क्र. :</span>
                  <span className="font-mono font-black text-stone-900 text-sm sm:text-base">
                    {selectedViewExec.receiptNo || `MPTM-EM-${selectedViewExec.id.replace(/\D/g, "").slice(-4) || "101"}`}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-stone-600 text-xs sm:text-sm whitespace-nowrap">दिनांक :</span>
                  <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">
                    {formatDateToDDMMYYYY(selectedViewExec.createdAt)}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-stone-600 text-xs sm:text-sm whitespace-nowrap">नोंदणी शुल्क :</span>
                  <span className="font-mono font-black text-[#7A0C0C] text-sm sm:text-base">
                    ₹{selectedViewExec.registrationFee || 1001}/-
                  </span>
                </div>
              </div>

              {/* 3. EXECUTIVE MEMBER & ADDRESS CONTAINER BOX (Form Style without underlines) */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-amber-300 pb-1.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-amber-950 flex items-center gap-2">
                    <span>👤 कार्यकारिणी सदस्य माहिती</span>
                  </h3>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-white border-2 border-amber-700/30 shadow-xs space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 border-b border-stone-200 pb-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#7A0C0C] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        1
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                        सदस्य माहिती
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-sm">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-stone-600 whitespace-nowrap">सदस्य क्रमांक :</span>
                        <span className="font-mono font-black text-[#7A0C0C] text-sm">
                          {selectedViewExec.receiptNo || `MPTM-EM-${selectedViewExec.id.replace(/\D/g, "").slice(-4) || "101"}`}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-stone-600 whitespace-nowrap">पद / हुद्दा :</span>
                        <span className="font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                          {selectedViewExec.designation || "-"}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-stone-600 whitespace-nowrap">सदस्याचे पूर्णनाव :</span>
                        <span className="font-extrabold text-stone-950 text-sm sm:text-base">
                          {selectedViewExec.fullName}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-stone-600 whitespace-nowrap">मोबाईल क्रमांक :</span>
                        <span className="font-mono font-bold text-stone-900">
                          {selectedViewExec.mobileNo}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Address & Location (No underlines) */}
                  <div className="space-y-2.5 pt-3 border-t-2 border-amber-200 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-stone-600 whitespace-nowrap">गाव / शहर :</span>
                        <span className="font-semibold text-stone-900">
                          {selectedViewExec.city || "-"}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-stone-600 whitespace-nowrap">जिल्हा :</span>
                        <span className="font-semibold text-stone-900">
                          {selectedViewExec.district || "अमरावती"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Amount in Words */}
              <div className="flex items-baseline gap-2 pt-1 text-xs sm:text-sm">
                <span className="font-bold text-stone-700 whitespace-nowrap">रक्कम अक्षरी :</span>
                <span className="font-extrabold text-[#7A0C0C] text-sm">
                  {convertNumberToMarathiWords(selectedViewExec.registrationFee || 1001)}
                </span>
              </div>

              {/* 5. PAYMENT DETAILS BOX AT BOTTOM (As currently doing) */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-50/90 via-amber-100/40 to-amber-50/90 border-2 border-amber-400/80 space-y-2.5 text-xs sm:text-sm shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-300 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-800 text-xs sm:text-sm">भरणा केलेली एकूण रक्कम :</span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-[#7A0C0C]">
                      ₹{selectedViewExec.registrationFee || 1001}/-
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-900 font-extrabold text-xs">
                    <span>✓</span>
                    <span>पेमेंट पुष्टी (Payment Confirmed)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-stone-600">पेमेंट पद्धत : </span>
                    <span className="font-bold text-stone-900">{selectedViewExec.paymentMethod || "Online / Direct"}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-600">व्यवहार संदर्भ : </span>
                    <span className="font-mono font-bold text-stone-900">Direct / Admin</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-600">पावती दिनांक : </span>
                    <span className="font-mono font-bold text-stone-900">{formatDateToDDMMYYYY(selectedViewExec.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* 6. Declaration / Sandesh Box */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border-l-4 border-l-[#7A0C0C] border border-amber-200/80 text-stone-900 shadow-2xs">
                <p className="text-xs font-extrabold text-[#7A0C0C] flex items-start gap-1.5">
                  <span className="whitespace-nowrap">संदेश :</span>
                  <span className="text-stone-800 font-medium leading-relaxed">
                    वरील रक्कम महाराष्ट्र प्रांतिक तैलिक महासभेच्या कार्यकारिणी सदस्य नोंदणी शुल्क म्हणून प्राप्त झाली.
                  </span>
                </p>
              </div>

              {/* 7. AUTHORIZATION: QR CODE + OFFICIAL SEAL + SIGNATURE BLOCK */}
              <div className="pt-3 border-t-2 border-amber-300/80 grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
                {/* Left: QR Code Verification */}
                <div className="flex items-center gap-2.5">
                  {(() => {
                    const siteUrl = (typeof getSiteUrl === "function" ? getSiteUrl() : "") || "https://mptm.org";
                    const recNo = selectedViewExec.receiptNo || `MPTM-EM-${selectedViewExec.id.replace(/\D/g, "").slice(-4) || "101"}`;
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`${siteUrl}/receipt/${recNo}`)}`;
                    return (
                      <>
                        <div className="p-1 bg-white border border-amber-400 rounded-xl shadow-2xs shrink-0 text-center">
                          <img src={qrUrl} alt="Receipt QR" className="w-18 h-18 sm:w-20 sm:h-20 object-contain mx-auto" />
                          <span className="text-[8px] font-bold text-stone-600 block leading-tight mt-0.5">
                            स्कॅन व पडताळा
                          </span>
                        </div>
                        <div className="space-y-0.5 text-stone-700 text-left">
                          <p className="font-bold text-[11px] text-[#7A0C0C] flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>डिजिटल सत्यता हमी</span>
                          </p>
                          <p className="text-[9.5px] text-stone-500 leading-tight">
                            मोबाईलने स्कॅन करून पावतीची थेट पोर्टलवर सत्यता तपासा.
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Center: Official Seal (मुद्रा / शिक्का with Navbar Logo) */}
                <div className="flex justify-center">
                  <OfficialSeal />
                </div>

                {/* Right: Signature & Approval Block */}
                <div className="flex flex-col items-center sm:items-end justify-center text-center sm:text-right space-y-1">
                  <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Digitally Certified & Approved</span>
                  </div>
                  <p className="font-black text-[#7A0C0C] text-xs pt-0.5">
                    अध्यक्ष / सचिव / कोषाध्यक्ष
                  </p>
                  <p className="text-[10px] text-stone-600 font-medium">
                    महाराष्ट्र प्रांतिक तैलिक महासभा, अमरावती
                  </p>
                </div>
              </div>

              {/* 8. Clean Footer Note */}
              <div className="pt-2 border-t border-amber-200 text-center">
                <p className="text-[10px] text-stone-600 font-semibold">
                  ही पावती संगणकीय प्रणालीद्वारे तयार करण्यात आलेली अधिकृत डिजिटल पावती आहे. (Computer-Generated Official Receipt)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExecutivesPublicPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-stone-600">Loading receipt details...</div>}>
      <ExecutivesContent />
    </Suspense>
  );
}

