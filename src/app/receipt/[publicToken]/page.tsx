"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getApiUrl } from "@/utils/config";
import { downloadReceiptAsPdf } from "@/utils/pdfUtils";

interface MainMember {
  srNo: number;
  memberNo: string;
  fullName: string;
  mobileNo: string;
  prabhagNo: string;
}

interface FamilyMember {
  srNo: number;
  name: string;
  relation: string;
  dob: string;
  occupation: string;
  mobile: string;
}

interface ReceiptData {
  receiptNo: string;
  date: string;
  membershipType?: "PRIMARY" | "EXECUTIVE";
  fee?: number;
  registrationFee?: number;
  amount?: number;
  amountInWords: string;
  address?: string;
  gaav?: string;
  taluka?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  paymentMode: string;
  paymentReference?: string;
  mainMembers?: MainMember[];
  familyMembers?: FamilyMember[];
  name?: string; // Donation donor name
  mobileNo?: string; // Donation donor mobile
  publicToken: string;
  verifyUrl: string;
}

// ── Official Organization Seal (मुद्रा / शिक्का with Navbar Logo) ──
function OfficialSeal({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none w-28 h-28 sm:w-32 sm:h-32 ${className}`}>
      {/* Outer circular SVG ring with curved Marathi text */}
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

      {/* Center Official Nav Logo (Santaji Maharaj Emblem) */}
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

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const publicToken = params?.publicToken as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiptType, setReceiptType] = useState<"REGISTRATION" | "DONATION">("REGISTRATION");
  const [data, setData] = useState<ReceiptData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!publicToken) {
      setError("अवैध पावती टोकन.");
      setLoading(false);
      return;
    }

    const fetchReceipt = async () => {
      try {
        const apiUrl = getApiUrl() || "http://localhost:5015";
        const res = await fetch(`${apiUrl}/api/receipts/${encodeURIComponent(publicToken)}`);
        const json = await res.json();

        if (json.success && json.data) {
          setData(json.data);
          setReceiptType(json.type);
        } else {
          setError(json.error || "पावती सापडली नाही किंवा अमान्य आहे.");
        }
      } catch (err: any) {
        console.error("Fetch receipt error:", err);
        setError("सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [publicToken]);

  // Dynamically set page title to receipt number so browser's native print/Save as PDF uses the receipt ID
  useEffect(() => {
    if (data?.receiptNo) {
      document.title = data.receiptNo;
    }
  }, [data?.receiptNo]);

  const handlePrint = () => {
    const originalTitle = document.title;
    if (data?.receiptNo) {
      document.title = data.receiptNo.trim().replace(/[/\\?%*:|"<>]/g, "-");
    }
    window.print();
    setTimeout(() => {
      if (data?.receiptNo) {
        document.title = data.receiptNo;
      } else {
        document.title = originalTitle;
      }
    }, 1500);
  };

  const handleDownloadPdf = async () => {
    if (!data) return;
    setIsDownloading(true);
    const safeReceiptId = (data.receiptNo || "Receipt").trim().replace(/[/\\?%*:|"<>]/g, "-");
    const originalTitle = document.title;
    document.title = safeReceiptId;
    try {
      const filename = `${safeReceiptId}.pdf`;
      await downloadReceiptAsPdf("printable-receipt-card", filename);
    } catch (err) {
      console.error("PDF download failed, using browser print:", err);
      window.print();
    } finally {
      setIsDownloading(false);
      setTimeout(() => {
        if (data?.receiptNo) {
          document.title = data.receiptNo;
        } else {
          document.title = originalTitle;
        }
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-stone-700 text-sm">अधिकृत पावती लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-red-200 shadow-lg text-center space-y-4">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-stone-900">पावती आढळली नाही</h2>
          <p className="text-sm text-stone-600">{error || "पावती माहिती उपलब्ध नाही."}</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full py-2.5 px-4 bg-[#7A0C0C] hover:bg-[#5e0909] text-white font-bold rounded-xl text-sm transition-all"
          >
            मुख्य पृष्ठावर जा
          </button>
        </div>
      </div>
    );
  }

  const feeAmount = data.registrationFee || data.amount || data.fee || 0;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    data.verifyUrl || typeof window !== "undefined" ? window.location.href : ""
  )}`;


  return (
    <div
      className="min-h-screen bg-[#F8F5EE] py-4 sm:py-8 px-2 sm:px-4 print:p-0 print:bg-white"
      style={{ fontFamily: "'Baloo 2', 'Tiro Devanagari Marathi', 'Noto Sans Devanagari', system-ui, sans-serif" }}
    >
      {/* Top action toolbar - hidden during print */}
      <div className="max-w-4xl mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 px-3.5 py-2 rounded-lg border border-amber-300 transition-all"
        >
          <span>←</span>
          <span>मुख्य पृष्ठ</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#6B0D0D] hover:bg-[#8c1010] px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <span>🖨️</span>
            <span>प्रिंट करा</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 px-4 py-2 rounded-lg border border-amber-400 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <span>📥</span>
            <span>{isDownloading ? "डाउनलोड होत आहे..." : "PDF डाउनलोड"}</span>
          </button>
        </div>
      </div>

      {/* Official Receipt Card - Clean Content & Details without Underlines */}
      <div
        id="printable-receipt-card"
        style={{ fontFamily: "'Baloo 2', 'Tiro Devanagari Marathi', 'Noto Sans Devanagari', system-ui, sans-serif" }}
        className="max-w-4xl mx-auto bg-[#FFFDF9] border-2 border-amber-800/40 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden print:border-amber-800/60 print:shadow-none print:m-0 print:w-full"
      >
        {/* 1. Header Title Banner */}
        <div className="bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-white py-3 px-3 sm:px-6 relative flex items-center justify-between border-b-2 border-amber-400 print:py-2">
          <div className="hidden sm:flex items-center gap-1 text-amber-400 text-lg font-bold">
            <span>❖</span>
            <span className="w-6 h-[2px] bg-amber-400"></span>
          </div>

          <div className="text-center mx-auto space-y-0.5">
            <p className="text-[11px] sm:text-sm font-bold text-amber-400">❖ जय संताजी ❖</p>
            <h1 className="text-base sm:text-2xl font-black text-amber-200 drop-shadow-md leading-tight">
              महाराष्ट्र प्रांतिक तैलिक महासभा
            </h1>
            <p className="text-[11px] sm:text-sm text-sky-200 font-bold">अमरावती विभाग, अमरावती.</p>
            <div className="inline-block mt-1">
              <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-[10px] sm:text-sm px-3 sm:px-4 py-0.5 rounded-full border border-amber-400 shadow-xs">
                {receiptType === "DONATION"
                  ? "अधिकृत देणगी पावती"
                  : data.membershipType === "EXECUTIVE"
                  ? "कार्यकारिणी सदस्य नोंदणी पावती"
                  : "नोंदणी पावती"}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-amber-400 text-lg font-bold">
            <span className="w-6 h-[2px] bg-amber-400"></span>
            <span>❖</span>
          </div>
        </div>

        {/* 2. Receipt Body */}
        <div className="p-3 sm:p-6 space-y-4 text-stone-900 print:p-4 print:space-y-3">
          {/* Top Meta Row: पावती क्र. | दिनांक | नोंदणी शुल्क */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-3 rounded-xl bg-amber-50/70 border border-amber-300 print:p-2.5 print:gap-3">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-stone-600 text-xs sm:text-sm whitespace-nowrap">पावती क्र. :</span>
              <span className="font-mono font-black text-stone-900 text-sm sm:text-base">{data.receiptNo}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-stone-600 text-xs sm:text-sm whitespace-nowrap">दिनांक :</span>
              <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">{data.date}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-stone-600 text-xs sm:text-sm whitespace-nowrap">
                {receiptType === "DONATION" ? "देणगी रक्कम :" : "नोंदणी शुल्क :"}
              </span>
              <span className="font-mono font-black text-[#7A0C0C] text-sm sm:text-base">
                ₹{feeAmount}/-
              </span>
            </div>
          </div>

          {/* 3. MAIN MEMBERS SECTION */}
          {receiptType === "REGISTRATION" && data.mainMembers && data.mainMembers.length > 0 && (
            <div className="space-y-3 sm:space-y-4 print:space-y-2">
              <div className="flex items-center justify-between border-b border-amber-300 pb-1.5 print:pb-1">
                <h3 className="text-sm sm:text-base font-extrabold text-amber-950 flex items-center gap-2">
                  <span>👤 मुख्य सदस्य माहिती</span>
                  <span className="text-[10px] sm:text-xs font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
                    एकूण: {data.mainMembers.length}
                  </span>
                </h3>
              </div>

              {/* Container Box for Main Member(s) & Address */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white border-2 border-amber-700/30 shadow-xs space-y-4 print:p-3 print:space-y-3">
                {data.mainMembers.map((member, index) => (
                  <div
                    key={index}
                    className={`space-y-2.5 print:space-y-2 ${
                      index > 0 ? "pt-3.5 border-t-2 border-dashed border-amber-300/80" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 border-b border-stone-200 pb-1.5 print:pb-1">
                      <span className="w-5 h-5 rounded-full bg-[#7A0C0C] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {member.srNo}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                        {member.srNo === 1 ? "प्राथमिक" : `सदस्य #${member.srNo}`} सदस्य माहिती
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-sm">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-stone-600 whitespace-nowrap">
                          {member.srNo === 1 ? "प्राथमिक सदस्य क्रमांक :" : "सदस्य क्रमांक :"}
                        </span>
                        <span className="font-mono font-black text-[#7A0C0C] text-sm">
                          {member.memberNo || "-"}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-stone-600 whitespace-nowrap">
                          प्रभाग क्रमांक :
                        </span>
                        <span className="font-bold text-stone-900">
                          {member.prabhagNo || "-"}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-stone-600 whitespace-nowrap">सदस्याचे पूर्णनाव :</span>
                        <span className="font-extrabold text-stone-950 text-sm sm:text-base">
                          {member.fullName}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-stone-600 whitespace-nowrap">मोबाईल क्रमांक :</span>
                        <span className="font-mono font-bold text-stone-900">
                          {member.mobileNo}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Common Address & Location Details (Clean without underlines) */}
                <div className="space-y-2.5 pt-3 border-t-2 border-amber-200 text-xs sm:text-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-stone-600 whitespace-nowrap">पत्ता :</span>
                    <span className="font-semibold text-stone-900">
                      {data.address || "-"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-stone-600 whitespace-nowrap">गाव :</span>
                      <span className="font-semibold text-stone-900">
                        {data.gaav || "-"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-stone-600 whitespace-nowrap">तालुका :</span>
                      <span className="font-semibold text-stone-900">
                        {data.taluka || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-stone-600 whitespace-nowrap">जिल्हा :</span>
                      <span className="font-semibold text-stone-900">
                        {data.district || "अमरावती"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-stone-600 whitespace-nowrap">राज्य :</span>
                      <span className="font-semibold text-stone-900">
                        {data.state || "महाराष्ट्र"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-stone-600 whitespace-nowrap">देश :</span>
                      <span className="font-semibold text-stone-900">
                        {data.country || "भारत"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-stone-600 whitespace-nowrap">पिनकोड :</span>
                      <span className="font-mono font-bold text-stone-900">
                        {data.pincode || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Donation Donor Info (If Donation Receipt) */}
          {receiptType === "DONATION" && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-white border-2 border-amber-700/30 shadow-xs space-y-3 text-xs sm:text-sm">
              <h3 className="text-sm font-extrabold text-amber-950 border-b border-amber-300 pb-1">
                देणगीदाराची माहिती
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-stone-600 whitespace-nowrap">देणगीदाराचे नाव :</span>
                  <span className="font-extrabold text-stone-950 text-sm sm:text-base">{data.name}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-stone-600 whitespace-nowrap">मोबाईल क्रमांक :</span>
                  <span className="font-mono font-bold text-stone-900">{data.mobileNo}</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 pt-2 border-t border-amber-200">
                <span className="font-bold text-stone-600 whitespace-nowrap">पत्ता :</span>
                <span className="font-semibold text-stone-900">
                  {data.address || `${data.city || ""}, ${data.district || ""}`}
                </span>
              </div>
            </div>
          )}

          {/* 4. FAMILY MEMBERS SECTION (Exact table matching Form.tsx) */}
          {receiptType === "REGISTRATION" && data.familyMembers && data.familyMembers.length > 0 && (
            <div className="my-4 space-y-2 print:my-2">
              <div className="flex flex-wrap items-center justify-center gap-2 my-2 print:my-1">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-amber-300 py-1 px-4 sm:px-5 rounded-full border-2 border-amber-400/80 shadow-md">
                  <span className="text-amber-400 text-xs font-bold">❖</span>
                  <h3 className="text-xs sm:text-sm font-extrabold tracking-wide text-amber-200 whitespace-nowrap">
                    कौटुंबिक सदस्यांची माहिती
                  </h3>
                  <span className="text-amber-400 text-xs font-bold">❖</span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border-2 border-amber-700/40 shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#6B0D0D] text-white font-bold text-center border-b border-amber-600">
                      <th className="py-1.5 px-2 border-r border-amber-700/60 w-12">अ. क्र.</th>
                      <th className="py-1.5 px-3 border-r border-amber-700/60">नाव</th>
                      <th className="py-1.5 px-3 border-r border-amber-700/60">नाते</th>
                      <th className="py-1.5 px-3 border-r border-amber-700/60">जन्म दिनांक</th>
                      <th className="py-1.5 px-3 border-r border-amber-700/60">व्यवसाय / शिक्षण</th>
                      <th className="py-1.5 px-3">मोबाईल क्रमांक</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-800/30 text-stone-900 bg-white">
                    {data.familyMembers.map((fm, i) => (
                      <tr key={i} className="hover:bg-amber-50/50">
                        <td className="py-1.5 px-2 text-center font-bold text-stone-800 border-r border-amber-800/30">
                          {fm.srNo}.
                        </td>
                        <td className="py-1.5 px-3 font-bold border-r border-amber-800/30">{fm.name}</td>
                        <td className="py-1.5 px-3 border-r border-amber-800/30">{fm.relation}</td>
                        <td className="py-1.5 px-3 border-r border-amber-800/30 font-mono">{fm.dob || "-"}</td>
                        <td className="py-1.5 px-3 border-r border-amber-800/30">{fm.occupation || "-"}</td>
                        <td className="py-1.5 px-3 font-mono">{fm.mobile || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Amount in Words */}
          <div className="flex items-baseline gap-2 pt-1 text-xs sm:text-sm">
            <span className="font-bold text-stone-700 whitespace-nowrap">रक्कम अक्षरी :</span>
            <span className="font-extrabold text-[#7A0C0C] text-sm">{data.amountInWords}</span>
          </div>

          {/* 6. PAYMENT DETAILS BOX AT BOTTOM */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-50/90 via-amber-100/40 to-amber-50/90 border-2 border-amber-400/80 space-y-2.5 text-xs sm:text-sm shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-300 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-stone-800 text-xs sm:text-sm">भरणा केलेली एकूण रक्कम :</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-[#7A0C0C]">₹{feeAmount}/-</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-900 font-extrabold text-xs">
                <span>✓</span>
                <span>पेमेंट पुष्टी (Payment Confirmed)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="font-bold text-stone-600">पेमेंट पद्धत : </span>
                <span className="font-bold text-stone-900">{data.paymentMode || "PhonePe / UPI"}</span>
              </div>
              <div>
                <span className="font-bold text-stone-600">व्यवहार संदर्भ : </span>
                <span className="font-mono font-bold text-stone-900">{data.paymentReference || "N/A"}</span>
              </div>
              <div>
                <span className="font-bold text-stone-600">पावती दिनांक : </span>
                <span className="font-mono font-bold text-stone-900">{data.date}</span>
              </div>
            </div>
          </div>

          {/* 7. Authorization: QR Code + Official Seal (with Navbar Logo) + Official Signature */}
          <div className="pt-3 border-t-2 border-amber-300/80 grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
            {/* Left: QR Code Verification */}
            <div className="flex items-center gap-2.5">
              <div className="p-1 bg-white border border-amber-400 rounded-xl shadow-2xs shrink-0 text-center">
                <img
                  src={qrUrl}
                  alt="Receipt Verification QR"
                  className="w-18 h-18 sm:w-20 sm:h-20 object-contain mx-auto"
                />
                <span className="text-[8px] font-bold text-stone-600 block leading-tight mt-0.5">
                  स्कॅन व पडताळा
                </span>
              </div>
              <div className="space-y-0.5 text-stone-700 text-left">
                <p className="font-bold text-[11px] text-[#7A0C0C]">डिजिटल सत्यता हमी</p>
                <p className="text-[9.5px] text-stone-500 leading-tight">
                  मोबाईलने स्कॅन करून पावतीची थेट पोर्टलवर सत्यता तपासा.
                </p>
              </div>
            </div>

            {/* Center: Official Seal with Navbar Logo */}
            <div className="flex justify-center">
              <OfficialSeal />
            </div>

            {/* Right: Signature & Approval Block */}
            <div className="flex flex-col items-center sm:items-end justify-center text-center sm:text-right space-y-1">
              <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                ✓ Digitally Certified & Approved
              </div>
              <p className="font-black text-[#7A0C0C] text-xs pt-0.5">अध्यक्ष / सचिव / कोषाध्यक्ष</p>
              <p className="text-[10px] text-stone-600 font-medium">महाराष्ट्र प्रांतिक तैलिक महासभा, अमरावती</p>
            </div>
          </div>

          {/* 8. Simple Clean Footer Disclaimer (NO HMAC, NO SHA-256, NO gfbcyf hashes) */}
          <div className="pt-2 border-t border-amber-200 text-center">
            <p className="text-[10px] text-stone-600 font-semibold">
              ही पावती संगणकीय प्रणालीद्वारे तयार करण्यात आलेली अधिकृत डिजिटल पावती आहे. (Computer-Generated Official Receipt)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
