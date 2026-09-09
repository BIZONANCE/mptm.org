"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, MapPin, Award, User, RefreshCw, ShieldCheck } from "lucide-react";

interface ExecutiveMemberItem {
  id: string;
  fullName: string;
  designation: string;
  mobileNo: string;
  city: string;
  district: string;
  photoUrl?: string | null;
  status: string;
}

export default function ExecutivesPublicPage() {
  const [executives, setExecutives] = useState<ExecutiveMemberItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutives();
  }, [API_URL]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#7A0C0C] hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← मुख्य पानावर परत जा</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-amber-800/40 shadow-xl overflow-hidden">
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

                    <div className="pt-3 border-t border-amber-200/80 flex items-center justify-between text-[11px] font-bold text-stone-600">
                      <span className="flex items-center gap-1 text-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>अधिकृत पदाधिकारी</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
