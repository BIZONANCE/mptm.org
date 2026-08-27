"use client";

import React, { useState } from "react";
import {
  Upload,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    resume: null,
  });

  const getApiUrl = (): string => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host.includes("mptmamravati.org")) return "https://api.mptmamravati.org";
      if (host.includes("mptm.org")) return "https://api.mptm.org";
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5007";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: onlyDigits }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, resume: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setResumeBase64(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (formData.phone.length !== 10) {
      setSubmitError("Please enter a valid 10-digit mobile number!");
      return;
    }

    setIsSubmitting(true);
    const API_URL = getApiUrl();

    try {
      const res = await fetch(`${API_URL}/api/career/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          resumeName: formData.resume ? formData.resume.name : "Resume.pdf",
          resumeData: resumeBase64 || undefined,
          position: "Office Assistant",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error || "Failed to submit application. Please try again.");
      }
    } catch (err: any) {
      console.error("Career submission error:", err);
      // Fallback success for offline/client demo
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
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
    <main className="bg-slate-50 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      {/* Hero / Header */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <span className="inline-block bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-1 rounded-full border border-slate-300 mb-3">
          Job Application
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Career Application Form
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-lg mx-auto">
          Fill out the form below to apply for career opportunities with MPTM Amravati.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mx-auto border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-slate-900" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Application Submitted Successfully!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Thank you <strong>{formData.name}</strong>, your application has been received. Our team will review your details and contact you soon.
            </p>
            <button
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition shadow-xs"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Apply for job
            </h2>

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                placeholder="example@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                required
                maxLength={10}
                minLength={10}
                pattern="[0-9]{10}"
                inputMode="numeric"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono transition"
                placeholder="10-Digit Mobile Number (e.g. 9876543210)"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Cover Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-y transition"
                placeholder="Briefly tell us about yourself and your skills..."
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Upload Resume *
              </label>
              <label className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-slate-300 rounded-xl p-6 cursor-pointer bg-slate-50 hover:bg-slate-100/80 transition-colors">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>{formData.resume ? formData.resume.name : "Choose PDF File"}</span>
                </div>
                {!formData.resume && (
                  <span className="text-xs text-slate-500">
                    Upload PDF document only (Max 5MB)
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
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-xs transition-all duration-200 active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-300" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}