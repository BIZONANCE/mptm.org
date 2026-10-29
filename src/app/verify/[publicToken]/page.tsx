"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getApiUrl } from "@/utils/config";
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  Home,
  Eye,
} from "lucide-react";

const WhatsappIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

interface VerificationData {
  valid: boolean;
  type: "REGISTRATION" | "DONATION";
  receiptNo: string;
  name: string;
  amount: number;
  date: string;
}

export default function VerifyReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const publicToken = params?.publicToken as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerificationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicToken) {
      setError("अवैध पडताळणी संदर्भ.");
      setLoading(false);
      return;
    }

    const checkVerification = async () => {
      try {
        const apiUrl = getApiUrl() || "http://localhost:5015";
        const res = await fetch(`${apiUrl}/api/verify/${encodeURIComponent(publicToken)}`);
        const json = await res.json();

        if (json.success && json.valid) {
          setData(json);
        } else {
          setError(json.error || "पावती अमान्य आहे किंवा डेटाबेसमध्ये आढळली नाही.");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setError("पावती पडताळताना त्रुटी आली.");
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, [publicToken]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-amber-600/20 rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-white py-3 px-4 text-center border-b-2 border-amber-400">
          <p className="text-[11px] font-bold text-amber-300">❖ जय संताजी ❖</p>
          <h1 className="text-sm sm:text-base font-black text-amber-100 leading-tight">
            महाराष्ट्र प्रांतिक तैलिक महासभा
          </h1>
          <p className="text-[10px] sm:text-[11px] text-amber-200/90 font-medium">
            अमरावती विभाग, अमरावती
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {loading ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium text-stone-600">पावतीची पडताळणी सुरू आहे...</p>
            </div>
          ) : error || !data ? (
            /* ❖ INVALID / FAKE RECEIPT (अमान्य पावती) ❖ */
            <div className="text-center space-y-3.5">
              <div className="w-13 h-13 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-red-200">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>

              <div className="space-y-0.5">
                <h2 className="text-lg sm:text-xl font-black text-red-950">
                  पावती अमान्य आहे!
                </h2>
                <span className="inline-block text-[11px] font-bold text-red-800 bg-red-100 px-3 py-0.5 rounded-full border border-red-200">
                  ✕ रेकॉर्ड आढळले नाही
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
                सदर पावती अधिकृत डेटाबेसमध्ये आढळली नाही किंवा बनावट असू शकते.
              </p>

              <div className="pt-1">
                <Link
                  href="/"
                  className="w-full py-2.5 px-4 bg-[#7A0C0C] hover:bg-[#600808] text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs sm:text-sm text-center"
                >
                  <Home className="w-4 h-4" />
                  <span>मुख्य पृष्ठ</span>
                </Link>
              </div>
            </div>
          ) : (
            /* ❖ VERIFIED RECEIPT CARD (पावती सत्यापित) ❖ */
            <div className="space-y-4">
              {/* Success Verification Badge */}
              <div className="text-center space-y-1">
                <div className="w-13 h-13 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-300">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-emerald-950">
                  पावती सत्यापित
                </h2>
                <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300">
                  ✓ अधिकृत नोंद
                </span>
              </div>

              {/* Essentials Summary Table (Only core essentials in clean Marathi) */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center border-b border-stone-200/80 pb-1.5">
                  <span className="text-stone-600 font-medium">पावती क्र. :</span>
                  <span className="font-mono font-black text-[#7A0C0C]">
                    {data.receiptNo}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-stone-200/80 pb-1.5">
                  <span className="text-stone-600 font-medium">नाव :</span>
                  <span className="font-bold text-stone-900">{data.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-stone-200/80 pb-1.5">
                  <span className="text-stone-600 font-medium">दिनांक :</span>
                  <span className="font-mono font-medium text-stone-800">{data.date}</span>
                </div>
                <div className="flex justify-between items-baseline pt-0.5">
                  <span className="text-stone-700 font-bold">रक्कम :</span>
                  <span className="font-mono font-black text-base sm:text-lg text-emerald-700">
                    ₹{data.amount}/-
                  </span>
                </div>
              </div>

              {/* Short & Pure Marathi Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1. Download Pavati */}
                <Link
                  href={`/receipt/${encodeURIComponent(publicToken)}?download=1`}
                  className="w-full py-2.5 px-4 bg-[#7A0C0C] hover:bg-[#600808] text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs sm:text-sm text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>पावती डाउनलोड</span>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  {/* 2. Pavti Paha */}
                  <Link
                    href={`/receipt/${encodeURIComponent(publicToken)}`}
                    className="w-full py-2.5 px-3 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-xl border border-stone-300 shadow-2xs transition flex items-center justify-center gap-1.5 text-xs text-center"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-700" />
                    <span>पावती पहा</span>
                  </Link>

                  {/* 3. Mukhya Prushtha */}
                  <Link
                    href="/"
                    className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold rounded-xl border border-amber-300 shadow-2xs transition flex items-center justify-center gap-1.5 text-xs text-center"
                  >
                    <Home className="w-3.5 h-3.5 text-amber-800" />
                    <span>मुख्य पृष्ठ</span>
                  </Link>
                </div>

                {/* 4. WhatsApp Share */}
                <button
                  type="button"
                  onClick={() => {
                    const siteUrl = typeof window !== "undefined" && window.location.origin ? window.location.origin : "https://mptmamravati.org";
                    const shareUrl = `${siteUrl}/receipt/${encodeURIComponent(publicToken)}`;
                    const titleType = data.type === "DONATION" ? "देणगी पावती" : "नोंदणी पावती";
                    const text = `*महाराष्ट्र प्रांतिक तैलिक महासभा (अमरावती विभाग)*\n❖ *प्रमाणित अधिकृत डिजिटल ${titleType}* ❖\n• पावती क्र.: ${data.receiptNo}\n• नाव: ${data.name}\n• भरणा रक्कम: ₹${data.amount}/-\n• दिनांक: ${data.date}\n\nपावती पाहण्यासाठी व डाउनलोड करण्यासाठी खालील लिंकवर क्लिक करा:\n${shareUrl}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
                  }}
                  className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-2xs transition flex items-center justify-center gap-1.5 text-xs cursor-pointer active:scale-95"
                >
                  <WhatsappIcon className="w-3.5 h-3.5 text-white" />
                  <span>व्हॉट्सॲपवर शेअर</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
