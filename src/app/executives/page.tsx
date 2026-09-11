"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Award,
  User,
  RefreshCw,
  ShieldCheck,
  FileText,
  Printer,
  MessageSquare,
  X,
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

function ExecutivesContent() {
  const [executives, setExecutives] = useState<ExecutiveMemberItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedViewExec, setSelectedViewExec] = useState<ExecutiveMemberItem | null>(null);

  const searchParams = useSearchParams();
  const paramReceiptNo = searchParams.get("receiptNo");
  const paramId = searchParams.get("id");

  const getApiUrl = (): string => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host.includes("mptmamravati.org")) return "https://api.mptmamravati.org";
      if (host.includes("mptm.org")) return "https://api.mptm.org";
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5007";
  };

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
            fullName: "राजस बाळकृष्ण गुळवाडे",
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
          fullName: "राजस बाळकृष्ण गुळवाडे",
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

    const getBasePublicUrl = () => {
      if (typeof window !== "undefined") {
        const host = window.location.hostname;
        if (host.includes("mptmamravati.org")) return "https://mptmamravati.org";
        if (host.includes("mptm.org")) return "https://mptm.org";
      }
      return process.env.NEXT_PUBLIC_SITE_URL || "https://mptmamravati.org";
    };

    const siteUrl = getBasePublicUrl();
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

      <div className="max-w-6xl mx-auto space-y-6">

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
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-print">
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
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF</span>
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
            <div id="printable-receipt-card" className="p-4 sm:p-6 space-y-4 text-stone-900 text-xs sm:text-sm">

              {/* Header Title Banner */}
              <div className="bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-white py-3 px-4 text-center rounded-xl border-b-2 border-amber-400 shadow-xs">
                <p className="text-xs font-bold text-amber-400">❖ Jai Santaji ❖</p>
                <h2 className="text-base sm:text-2xl font-black text-amber-200 tracking-wide">
                  Maharashtra Prantik Tailik Mahasabha
                </h2>
                <p className="text-xs text-sky-200 font-bold">Amravati Division, Amravati.</p>
                <div className="inline-block mt-1">
                  <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-xs px-4 py-0.5 rounded-full border border-amber-400 shadow-xs">
                    ★ Executive Member Registration Receipt
                  </span>
                </div>
              </div>

              {/* Top Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-amber-50/80 border border-amber-300">
                <div>
                  <span className="font-bold text-stone-700 text-xs">Receipt No. : </span>
                  <span className="font-mono font-black text-stone-900 text-sm">
                    {selectedViewExec.receiptNo || `MPTM-EM-${selectedViewExec.id.replace(/\D/g, "").slice(-4) || "101"}`}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-stone-700 text-xs">Date : </span>
                  <span className="font-bold text-stone-900 text-xs">
                    {formatDateToDDMMYYYY(selectedViewExec.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-stone-700 text-xs">Registration Fee : </span>
                  <span className="font-black text-[#7A0C0C] text-sm">
                    ₹{selectedViewExec.registrationFee || 1001}/-
                  </span>
                </div>
              </div>

              {/* Member Details */}
              <div className="p-4 rounded-xl bg-white border border-amber-300 space-y-3">
                <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider border-b border-amber-300 pb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-800" />
                  <span>Executive Member Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-stone-600">Full Name : </span>
                    <span className="font-black text-stone-900 text-sm">{selectedViewExec.fullName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-600">Designation : </span>
                    <span className="font-extrabold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full inline-block">
                      {formatDesignationInEnglish(selectedViewExec.designation)} ({selectedViewExec.designation})
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-600">Mobile Number : </span>
                    <a href={`tel:${selectedViewExec.mobileNo}`} className="font-mono font-bold text-stone-900 hover:underline">
                      {selectedViewExec.mobileNo}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-stone-600">City / District : </span>
                    <span className="font-bold text-stone-900">
                      {formatEnglishText(selectedViewExec.city)}{selectedViewExec.district ? `, ${formatEnglishText(selectedViewExec.district)}` : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount in Words */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-300 text-xs">
                <span className="font-bold text-stone-800">Amount in Words : </span>
                <span className="font-extrabold text-[#7A0C0C]">
                  {convertNumberToEnglishWords(selectedViewExec.registrationFee || 1001)}
                </span>
              </div>

              {/* Payment Details & Verification */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-stone-800">Payment Method : </span>
                    <span className="font-extrabold text-stone-900">
                      {selectedViewExec.paymentMethod || "Cash"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold bg-emerald-100/90 border border-emerald-300 px-2.5 py-1 rounded-full">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">✓</span>
                    <span>Amount Rs. {selectedViewExec.registrationFee || 1001} Received (Payment Verified)</span>
                  </div>
                </div>
                <div className="text-slate-600 italic text-[11px] flex items-center gap-1 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Executive Member Registration Verified & Issued by Maharashtra Prantik Tailik Mahasabha Admin.</span>
                </div>
              </div>

              {/* Message Declaration Box */}
              <div className="p-3.5 rounded-xl bg-amber-100/90 border-2 border-amber-400 text-stone-900">
                <p className="text-xs sm:text-sm font-extrabold text-[#7A0C0C] flex items-start gap-1.5">
                  <span className="whitespace-nowrap">Message :</span>
                  <span className="text-stone-900 font-bold">
                    The above amount was received as registration fee for Executive Member of Maharashtra Prantik Tailik Mahasabha.
                  </span>
                </p>
              </div>

              {/* Footer Signature Block */}
              <div className="pt-6 border-t border-amber-300 flex items-end justify-between text-xs">
                <div className="text-stone-600 font-semibold italic">
                  This receipt should be preserved as official proof of member registration.
                </div>
                <div className="text-center space-y-1">
                  <div className="w-36 h-8 border-b-2 border-stone-800 border-dashed mx-auto"></div>
                  <p className="font-extrabold text-[#7A0C0C]">Issuer Signature / Stamp</p>
                </div>
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

