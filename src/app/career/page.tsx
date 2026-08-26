"use client";

import React, { useState } from "react";
import {
  Upload,
  ArrowRight,
  CheckCircle2,
  FileText,
} from "lucide-react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  resume: File | null;
};

export default function CareerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    resume: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, resume: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      resume: null,
    });
  };

  return (
    <main className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero / Header */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <span className="inline-block bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-xs sm:text-sm px-4 py-1 rounded-full border border-amber-400 shadow-xs mb-3">
          Job Application
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#4A0404]">
          करिअर नोंदणी अर्ज
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          महाराष्ट्र प्रांतिक तैलिक महासभा, अमरावती विभागात काम करण्यासाठी खालील फॉर्म भरा आणि तुमचा अर्ज सादर करा.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8">
        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              अर्ज यशस्वीरित्या सादर झाला!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              धन्यवाद {formData.name}, तुमचा अर्ज आमच्या टीमकडे प्राप्त झाला आहे. आम्ही लवकरच तुमच्याशी संपर्क साधू.
            </p>
            <button
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-2 bg-[#4A0404] hover:bg-[#6b0808] text-white font-bold text-sm px-6 py-2.5 rounded-full transition shadow-md"
            >
              नवीन अर्ज भरा
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#4A0404] border-b border-slate-100 pb-3">
              Apply for कार्यालय सहाय्यक
            </h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                नाव *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="तुमचे पूर्ण नाव"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                ईमेल *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                फोन नंबर *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="१० अंकी मोबाईल नंबर"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                संदेश लिहा
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-y"
                placeholder="तुमच्याबद्दल थोडक्यात सांगा..."
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                रेझ्युमे अपलोड करा *
              </label>
              <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-amber-400 rounded-2xl p-6 cursor-pointer bg-amber-50/40 hover:bg-amber-50 transition-colors">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                  <Upload className="w-5 h-5" />
                  <span>{formData.resume ? formData.resume.name : "PDF"}</span>
                </div>
                {!formData.resume && (
                  <span className="text-xs text-slate-500">
                    फक्त PDF फाईल अपलोड करा (Max 5MB)
                  </span>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-white font-bold text-base py-3 px-6 rounded-full border border-amber-400 shadow-md transition-all duration-200 active:scale-[0.99]"
              >
                <span>अर्ज सादर करा</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}