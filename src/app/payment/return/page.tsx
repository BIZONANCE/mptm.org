"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getApiUrl } from "@/utils/config";

function PaymentReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  const [status, setStatus] = useState<"CHECKING" | "SUCCESS" | "FAILED" | "TIMEOUT">("CHECKING");
  const [message, setMessage] = useState("पेमेंट तपासत आहे, कृपया प्रतीक्षा करा...");
  const [pollCount, setPollCount] = useState(0);

  const checkStatus = async () => {
    if (!orderId) {
      setStatus("FAILED");
      setMessage("ऑर्डर क्रमांक आढळला नाही.");
      return;
    }

    try {
      const apiUrl = getApiUrl() || "http://localhost:5015";
      const res = await fetch(`${apiUrl}/api/payments/status/${encodeURIComponent(orderId)}`);
      const data = await res.json();

      const paymentState = (data.state || data.status || "").toUpperCase();

      if (data.success && paymentState === "SUCCESS") {
        setStatus("SUCCESS");
        setMessage("पेमेंट यशस्वी! अधिकृत पावतीकडे घेऊन जात आहे...");
        if (data.publicToken) {
          setTimeout(() => {
            router.push(`/receipt/${data.publicToken}`);
          }, 1000);
        }
        return true;
      } else if (paymentState === "FAILED") {
        setStatus("FAILED");
        setMessage(data.message || data.reason || "पेमेंट अयशस्वी झाले.");
        setTimeout(() => {
          router.push(`/payment/failed?order=${encodeURIComponent(orderId)}`);
        }, 2000);
        return true;
      } else {
        // Still pending
        return false;
      }
    } catch (err) {
      console.error("Status polling error:", err);
      return false;
    }
  };

  useEffect(() => {
    if (!orderId) {
      setStatus("FAILED");
      setMessage("अवैध विनंती: ऑर्डर क्रमांक सापडला नाही.");
      return;
    }

    let isSubscribed = true;
    let timer: NodeJS.Timeout;

    const poll = async () => {
      const finished = await checkStatus();
      if (!finished && isSubscribed) {
        setPollCount((prev) => {
          const nextCount = prev + 1;
          if (nextCount > 35) {
            setStatus("TIMEOUT");
            setMessage("पेमेंट प्रक्रिया अजून सुरू आहे. कृपया पुन्हा पैसे भरू नका. तुमची पावती थोड्या वेळात अपडेट होईल.");
          } else {
            timer = setTimeout(poll, 2500);
          }
          return nextCount;
        });
      }
    };

    poll();

    return () => {
      isSubscribed = false;
      if (timer) clearTimeout(timer);
    };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border-2 border-amber-600/30 rounded-2xl shadow-xl p-6 sm:p-8 text-center space-y-6">
        {/* Header Icon */}
        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center border-4">
          {status === "CHECKING" && (
            <div className="w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin flex items-center justify-center">
              <span className="text-xl">⏳</span>
            </div>
          )}
          {status === "SUCCESS" && (
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center text-3xl font-bold animate-bounce">
              ✓
            </div>
          )}
          {status === "FAILED" && (
            <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-500 text-red-700 flex items-center justify-center text-3xl font-bold">
              ✕
            </div>
          )}
          {status === "TIMEOUT" && (
            <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-500 text-amber-700 flex items-center justify-center text-3xl font-bold">
              ℹ
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#6B0D0D]">
            {status === "CHECKING" && "पेमेंट तपासत आहे..."}
            {status === "SUCCESS" && "पेमेंट यशस्वी झाले!"}
            {status === "FAILED" && "पेमेंट अयशस्वी!"}
            {status === "TIMEOUT" && "पेमेंट पडताळणी प्रलंबित"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 font-medium">
            {message}
          </p>
        </div>

        {/* Order ID display */}
        {orderId && (
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-stone-700">
            <span className="font-bold text-amber-950">ऑर्डर संदर्भ क्र : </span>
            <span className="font-mono text-stone-900 break-all">{orderId}</span>
          </div>
        )}

        {/* Warning / Instructions */}
        {status === "CHECKING" && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-semibold">
            ⚠️ कृपया हे पृष्ठ रीफ्रेश करू नका किंवा मागे (Back) जाऊ नका.
          </div>
        )}

        {status === "TIMEOUT" && (
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setStatus("CHECKING");
                setMessage("पुन्हा तपासत आहे...");
                setPollCount(0);
                checkStatus();
              }}
              className="w-full py-3 bg-gradient-to-r from-[#6B0D0D] to-[#8c1010] text-white font-bold rounded-xl shadow-md hover:brightness-110 transition-all text-sm"
            >
              🔄 स्थिती पुन्हा तपासा
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full py-2 bg-stone-100 text-stone-700 font-semibold rounded-xl hover:bg-stone-200 transition-all text-xs"
            >
              मुख्य पृष्ठावर परत जा
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
          <div className="text-center font-bold text-stone-700">लोड होत आहे...</div>
        </div>
      }
    >
      <PaymentReturnContent />
    </Suspense>
  );
}
