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
  ShieldCheck,
} from "lucide-react";

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
      setError("अवैध पडताळणी टोकन.");
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
          setError(json.error || "पावती अमान्य आहे किंवा डेटाबेसमधील रेकॉर्डशी जुळत नाही.");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setError("पावतीची पडताळणी करताना त्रुटी आली.");
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, [publicToken]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="w-full max-w-lg bg-white border-2 border-amber-600/30 rounded-3xl shadow-2xl overflow-hidden space-y-0 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-white p-4 text-center border-b-2 border-amber-400">
          <p className="text-[11px] font-bold text-amber-300">❖ जय संताजी ❖</p>
          <h1 className="text-base sm:text-xl font-black text-amber-100 leading-tight">
            महाराष्ट्र प्रांतिक तैलिक महासभा
          </h1>
          <p className="text-[11px] text-amber-200/90 font-medium">
            अमरावती विभाग, अमरावती • अधिकृत डिजिटल पडताळणी पोर्टल
          </p>
        </div>

        <div className="p-5 sm:p-7 space-y-5">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-stone-600">पावतीची पडताळणी सुरू आहे...</p>
            </div>
          ) : error || !data ? (
            /* ❖ FAKE / INVALID RECEIPT POPUP (Pavti is Fake) ❖ */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-red-300">
                <AlertTriangle className="w-9 h-9 text-red-600 animate-pulse" />
              </div>

              <div className="space-y-1">
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-red-800 bg-red-100 px-3 py-0.5 rounded-full border border-red-300">
                  ✕ अनधिकृत / बनावट पावती • Fake Receipt
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-red-950">
                  पावती बनावट / अमान्य आहे!
                </h2>
                <p className="text-xs font-bold text-red-700">
                  (Receipt is Fake or Not Found in Database)
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-left space-y-2 text-xs text-red-900 leading-relaxed">
                <p className="font-semibold">
                  ⚠️ ही पावती महाराष्ट्र प्रांतिक तैलिक महासभा (अमरावती विभाग) च्या अधिकृत डेटाबेसमध्ये आढळली नाही.
                </p>
                <p className="text-[11.5px] text-red-800">
                  सदर पावती बनावट (Fake), फेरफार केलेली किंवा जुनी असू शकते. अधिकृत डिजिटल सिस्टीमशिवाय जारी केलेली कोणतीही पावती वैध मानली जाणार नाही.
                </p>
                {publicToken && (
                  <p className="font-mono text-[11px] text-stone-600 pt-1.5 border-t border-red-200">
                    स्कॅन केलेला संदर्भ: <strong className="text-red-950 font-bold">{publicToken}</strong>
                  </p>
                )}
              </div>

              {/* User Requested Options: Mukhya Prushth */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#7A0C0C] to-[#991B1B] hover:brightness-110 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>मुख्य पृष्ठ (Mukhya Prushth)</span>
                </button>
                <Link
                  href="/contact"
                  className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl border border-stone-300 transition-all text-xs text-center inline-block"
                >
                  तक्रार नोंदवा / महासभेशी संपर्क करा
                </Link>
              </div>
            </div>
          ) : (
            /* ❖ VERIFIED PAVATI POPUP CARD (Verified Pavati) ❖ */
            <div className="space-y-4">
              {/* Success Badge */}
              <div className="text-center space-y-1.5">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-pulse" />
                </div>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300">
                  ✓ 100% Genuine & Verified
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
                  प्रमाणित अधिकृत पावती
                </h2>
                <p className="text-xs text-stone-600 font-medium">
                  ही पावती महासभेच्या अधिकृत डेटाबेसमध्ये नोंदणीकृत आणि वैध आहे.
                </p>
              </div>

              {/* Receipt Summary Table */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-600 font-medium">पावती क्रमांक :</span>
                  <span className="font-mono font-black text-[#7A0C0C] text-sm sm:text-base">
                    {data.receiptNo}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-600 font-medium">सदस्य / देणगीदाराचे नाव :</span>
                  <span className="font-bold text-stone-900">{data.name}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-600 font-medium">दिनांक :</span>
                  <span className="font-mono font-semibold text-stone-900">{data.date}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-600 font-medium">नोंदणी प्रकार :</span>
                  <span className="font-bold text-stone-900">
                    {data.type === "DONATION" ? "देणगी (Donation)" : "सदस्य नोंदणी (Registration)"}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-stone-700 font-bold">भरणा रक्कम :</span>
                  <span className="font-mono font-black text-lg text-emerald-700">
                    ₹{data.amount}/-
                  </span>
                </div>
              </div>

              {/* Action Buttons: User Requested Options */}
              <div className="space-y-2 pt-1">
                {/* 1. Download Your Pavati */}
                <Link
                  href={`/receipt/${encodeURIComponent(publicToken)}?download=1`}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:brightness-110 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>तुमची पावती डाउनलोड करा (Download Pavati)</span>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  {/* 2. Mukhya Prushth */}
                  <Link
                    href="/"
                    className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold rounded-xl border border-amber-300 transition-all flex items-center justify-center gap-1.5 text-xs text-center"
                  >
                    <Home className="w-3.5 h-3.5 text-amber-800" />
                    <span>मुख्य पृष्ठ (Home)</span>
                  </Link>

                  {/* 3. View Full Pavati */}
                  <Link
                    href={`/receipt/${encodeURIComponent(publicToken)}`}
                    className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl border border-stone-300 transition-all flex items-center justify-center gap-1.5 text-xs text-center"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-700" />
                    <span>पावती पहा (View)</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

