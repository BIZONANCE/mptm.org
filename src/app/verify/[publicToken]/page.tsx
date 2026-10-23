"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getApiUrl } from "@/utils/config";

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
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white border-2 border-amber-600/30 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <p className="text-xs font-bold text-amber-800">❖ जय संताजी ❖</p>
          <h1 className="text-xl sm:text-2xl font-black text-[#6B0D0D]">
            महाराष्ट्र प्रांतिक तैलिक महासभा
          </h1>
          <p className="text-xs text-stone-600 font-semibold">
            अधिकृत पावती पडताळणी पोर्टल (Official Receipt Verification)
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-stone-600">पावतीची पडताळणी सुरू आहे...</p>
          </div>
        ) : error || !data ? (
          <div className="p-5 bg-red-50 border-2 border-red-300 rounded-2xl text-center space-y-3">
            <div className="text-3xl text-red-600">✕</div>
            <h2 className="text-base font-bold text-red-950">पावती प्रमाणीकरण अयशस्वी</h2>
            <p className="text-xs text-red-800">{error || "पावतीची नोंद आढळली नाही किंवा पावती बनावट असू शकते."}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Success Badge */}
            <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                ✓
              </div>
              <h2 className="text-lg font-black text-emerald-950 pt-1">
                प्रमाणित अधिकृत पावती (Verified)
              </h2>
              <p className="text-xs text-emerald-800 font-semibold">
                ही पावती महासभेच्या अधिकृत डेटाबेसमध्ये नोंदणीकृत आणि वैध आहे.
              </p>
            </div>

            {/* Receipt Summary Table */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-stone-600 font-medium">पावती क्रमांक :</span>
                <span className="font-mono font-black text-red-900">{data.receiptNo}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-stone-600 font-medium">सदस्य / देणगीदाराचे नाव :</span>
                <span className="font-bold text-stone-900">{data.name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-stone-600 font-medium">दिनांक :</span>
                <span className="font-mono text-stone-900">{data.date}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-stone-600 font-medium">प्रकार :</span>
                <span className="font-bold text-stone-900">
                  {data.type === "DONATION" ? "देणगी (Donation)" : "सदस्य नोंदणी (Registration)"}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-700 font-bold">भरणा रक्कम :</span>
                <span className="font-mono font-black text-lg text-[#6B0D0D]">₹{data.amount}</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href={`/receipt/${encodeURIComponent(publicToken)}`}
                className="inline-block w-full py-3 bg-gradient-to-r from-[#6B0D0D] to-[#8c1010] text-white font-bold rounded-xl shadow-md hover:brightness-110 transition-all text-xs text-center"
              >
                संपूर्ण पावती पहा / प्रिंट करा
              </Link>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-stone-200 text-center">
          <Link href="/" className="text-xs text-stone-600 hover:text-stone-900 font-bold underline">
            मुख्य पृष्ठावर परत जा
          </Link>
        </div>
      </div>
    </div>
  );
}
