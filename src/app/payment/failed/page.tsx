"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white border-2 border-red-500/30 rounded-2xl shadow-xl p-6 sm:p-8 text-center space-y-6">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 border-2 border-red-400 text-red-600 flex items-center justify-center text-4xl font-bold">
          ✕
        </div>

        <div>
          <h1 className="text-2xl font-black text-[#6B0D0D]">
            पेमेंट अयशस्वी झाले!
          </h1>
          <p className="text-sm text-stone-600 mt-2 font-medium">
            आपले देयक पूर्ण होऊ शकले नाही किंवा पेमेंट गेटवेद्वारे रद्द करण्यात आले.
          </p>
        </div>

        {orderId && (
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700">
            <span className="font-bold text-stone-900">ऑर्डर संदर्भ क्रमांक : </span>
            <span className="font-mono text-stone-800 break-all">{orderId}</span>
          </div>
        )}

        <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-300 text-xs text-amber-950 text-left space-y-2">
          <p className="font-bold">महत्त्वाची सूचना :</p>
          <ul className="list-disc list-inside space-y-1 font-medium text-stone-800">
            <li>जर आपल्या बँक खात्यातून रक्कम कपात झाली असेल, तर ती PhonePe च्या नियमांनुसार पुढील ३ ते ५ कामकाजाच्या दिवसांत आपल्या खात्यात आपोआप परत जमा होईल.</li>
            <li>नोंदणी पूर्ण करण्यासाठी कृपया खालील बटणावर क्लिक करून नवीन फॉर्म भरा.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 px-4 bg-gradient-to-r from-[#6B0D0D] to-[#8c1010] text-white font-bold rounded-xl shadow-md hover:brightness-110 transition-all text-sm text-center"
          >
            नवीन नोंदणी फॉर्म भरा
          </Link>
          <Link
            href="/contact-us"
            className="py-3 px-4 bg-stone-100 text-stone-700 font-semibold rounded-xl hover:bg-stone-200 transition-all text-sm text-center"
          >
            संपर्क साधा
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
          <div className="text-center font-bold text-stone-700">लोड होत आहे...</div>
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
