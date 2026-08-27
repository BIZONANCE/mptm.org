"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface ContactInfoData {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export default function ContactUs() {
  const [contactInfo, setContactInfo] = useState<ContactInfoData>({
    address: "महाराष्ट्र प्रांतिक तैलिक महासभा\nअमरावती विभाग, अमरावती.\nमहाराष्ट्र, भारत.",
    phone: "9876543210",
    email: "info@mptmamravati.org",
    hours: "सोमवार - शनिवार\nसकाळी 10:00 ते संध्याकाळी 6:00",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const getApiUrl = (): string => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host.includes("mptmamravati.org")) return "https://api.mptmamravati.org";
      if (host.includes("mptm.org")) return "https://api.mptm.org";
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5007";
  };

  const API_URL = getApiUrl();

  // Fetch dynamic contact info configured in Super Admin Dashboard
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch(`${API_URL}/api/contact/info`);
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          setContactInfo(data.data);
        }
      } catch (err) {
        console.error("Fetch contact info error:", err);
      }
    };
    fetchContactInfo();
  }, [API_URL]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (formData.phone.length !== 10) {
      setSubmitError("कृपया १० अंकी वैध मोबाईल नंबर प्रविष्ट करा!");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/contact/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error || "संदेश पाठवताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
      }
    } catch (err: any) {
      console.error("Contact submit error:", err);
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
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 font-sans">
      {/* Page Header */}
      <section className="bg-[#4A0404] border-b border-amber-500/30 py-10 px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-xs sm:text-sm px-4 py-1 rounded-full border border-amber-400 shadow-xs mb-3">
          Contact Us
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          संपर्क साधा
        </h1>

        <p className="text-amber-200/80 text-sm mt-2 max-w-2xl mx-auto">
          महाराष्ट्र प्रांतिक तैलिक महासभा, अमरावती विभागाशी संपर्क साधा
          आणि आपल्या सूचना, प्रश्न किंवा संदेश आम्हाला पाठवा.
        </p>
      </section>

      {/* Contact Section */}
      <main className="flex-1 py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ================= CONTACT INFORMATION ================= */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A0404]">
                  आमच्याशी संपर्क साधा
                </h2>
                <div className="mt-2 h-1 w-16 bg-amber-500 rounded-full" />
                <p className="mt-4 text-sm sm:text-base leading-7 text-gray-600">
                  महाराष्ट्र प्रांतिक तैलिक महासभा, अमरावती विभागाशी
                  संबंधित माहिती, सदस्यत्व, कार्यक्रम किंवा इतर
                  कोणत्याही माहितीसाठी आमच्याशी संपर्क साधा.
                </p>
              </div>

              <div className="space-y-4">
                {/* Address */}
                <div className="bg-white border border-amber-300/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-[#4A0404] flex items-center justify-center text-white shadow-xs">
                      <MapPin className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#4A0404]">
                        कार्यालयाचा पत्ता
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-600 whitespace-pre-line">
                        {contactInfo.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-white border border-amber-300/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-[#4A0404] flex items-center justify-center text-white shadow-xs">
                      <Phone className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#4A0404]">
                        फोन नंबर
                      </h3>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="mt-1 block text-sm font-bold text-gray-700 hover:text-[#4A0404] transition-colors"
                      >
                        +91 {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white border border-amber-300/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-[#4A0404] flex items-center justify-center text-white shadow-xs">
                      <Mail className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#4A0404]">
                        ई-मेल
                      </h3>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="mt-1 block text-sm text-gray-600 hover:text-[#4A0404] transition-colors"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="bg-white border border-amber-300/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-[#4A0404] flex items-center justify-center text-white shadow-xs">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#4A0404]">
                        कार्यालयीन वेळ
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-600 whitespace-pre-line">
                        {contactInfo.hours}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white border border-amber-300/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-[#4A0404] mb-3">
                    आम्हाला फॉलो करा
                  </h3>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-10 h-10 rounded-full bg-[#4A0404] flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                        <path d="M13.5 21v-8h2.75l.4-3h-3.15V8.08c0-.87.24-1.46 1.5-1.46h1.75V3.94c-.3-.04-1.34-.13-2.55-.13-2.52 0-4.25 1.54-4.25 4.37V10H7.1v3h2.85v8h3.55Z" />
                      </svg>
                    </a>

                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-10 h-10 rounded-full bg-[#4A0404] flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    </a>

                    <a
                      href="https://google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Google"
                      className="w-10 h-10 rounded-full bg-[#4A0404] flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                        <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
                      </svg>
                    </a>

                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="w-10 h-10 rounded-full bg-[#4A0404] flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= CONTACT FORM ================= */}
            <div className="bg-white border border-amber-300/60 rounded-2xl p-6 sm:p-8 shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-[#4A0404]">
                  आम्हाला संदेश पाठवा
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  खालील फॉर्म भरून आम्हाला आपला संदेश पाठवा.
                </p>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    संदेश यशस्वीरित्या पाठवला गेला!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto">
                    धन्यवाद {formData.name}, तुमचा संदेश आमच्याकडे प्राप्त झाला आहे. आम्ही लवकरच तुमच्याशी संपर्क साधू.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-4 px-6 py-2.5 bg-[#4A0404] hover:bg-[#650606] text-white font-bold text-sm rounded-full transition shadow-md"
                  >
                    नवीन संदेश पाठवा
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {submitError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold">
                      {submitError}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      पूर्ण नाव *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="आपले पूर्ण नाव"
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      ई-मेल *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="आपला ई-मेल"
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* Mobile (10-Digit) */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      मोबाईल नंबर (१० अंकी) *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                      maxLength={10}
                      minLength={10}
                      pattern="[0-9]{10}"
                      inputMode="numeric"
                      placeholder="१० अंकी मोबाईल नंबर (उदा. 9876543210)"
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      विषय
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="संदेशाचा विषय"
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                      संदेश *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="आपला संदेश येथे लिहा..."
                      className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-[#4A0404] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#650606] hover:shadow-lg disabled:opacity-60"
                  >
                    {isSubmitting ? "संदेश पाठवत आहे..." : "संदेश पाठवा"}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}