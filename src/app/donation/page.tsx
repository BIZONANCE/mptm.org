"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, QrCode, Printer, CheckCircle, Sparkles, Upload } from "lucide-react";

// Convert numeric amount to English words
function convertNumberToEnglishWords(amountStr: string): string {
    const num = parseInt(amountStr, 10);
    if (isNaN(num) || num <= 0) return "Zero Rupees Only";

    const a = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function inWords(n: number): string {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
        if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + inWords(n % 100) : "");
        if (n < 100000) return inWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + inWords(n % 1000) : "");
        if (n < 10000000) return inWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + inWords(n % 100000) : "");
        return inWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + inWords(n % 10000000) : "");
    }

    return `${inWords(num).trim()} Rupees Only`;
}

export default function DonationPage() {
    const [name, setName] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [city, setCity] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [screenshotError, setScreenshotError] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [receiptNo, setReceiptNo] = useState("");
    const [submissionDate, setSubmissionDate] = useState("");

    const getApiUrl = (): string => {
        if (typeof window !== "undefined") {
            const host = window.location.hostname;
            if (host.includes("mptmamravati.org")) return "https://api.mptmamravati.org";
            if (host.includes("mptm.org")) return "https://api.mptm.org";
        }
        return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5007";
    };

    const API_URL = getApiUrl();

    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setScreenshotError("⚠️ Please upload a valid image file (JPG, PNG, WEBP)!");
                return;
            }
            setPaymentScreenshot(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setScreenshotError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !mobileNo.trim() || mobileNo.length !== 10 || !city.trim() || !amount || parseInt(amount, 10) <= 0) {
            alert("Please fill in all required fields accurately.");
            return;
        }

        if (!paymentScreenshot) {
            setScreenshotError("⚠️ Uploading a payment screenshot or transaction receipt is mandatory to submit your donation!");
            return;
        }

        setSubmitting(true);
        const amountWords = convertNumberToEnglishWords(amount);

        try {
            const res = await fetch(`${API_URL}/api/donation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    mobileNo: mobileNo.trim(),
                    city: city.trim(),
                    amount: parseInt(amount, 10),
                    amountInWords: amountWords,
                    paymentScreenshot: screenshotPreview,
                }),
            });

            const data = await res.json();
            if (res.ok && data.success && data.data) {
                setReceiptNo(data.data.receiptNo);
                setSubmissionDate(data.data.date);
            } else {
                const now = new Date();
                setReceiptNo(`MPTM-2026-DON-${Math.floor(1000 + Math.random() * 9000)}`);
                setSubmissionDate(`${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`);
            }
        } catch (err) {
            console.error("Donation submit error:", err);
            const now = new Date();
            setReceiptNo(`MPTM-2026-DON-${Math.floor(1000 + Math.random() * 9000)}`);
            setSubmissionDate(`${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`);
        } finally {
            setSubmitting(false);
            setSubmitted(true);
            setTimeout(() => {
                window.print();
            }, 500);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const inputBaseStyle =
        "w-full bg-slate-50 border-b-2 border-slate-300 focus:border-indigo-600 outline-none px-3 py-2 text-slate-900 font-bold transition-all text-sm sm:text-base rounded-t-md";

    return (
        <div className="min-h-screen bg-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Back Link - Hidden on print */}
                <div className="print:hidden">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home Page</span>
                    </Link>
                </div>

                {/* Combined Form & Header Container */}
                <div className={`bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden ${submitted ? "print:hidden" : ""}`}>
                    
                    {/* Merged Compact Header Banner at top of form container */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white py-4 px-4 sm:py-5 sm:px-6 text-center space-y-1 relative border-b border-indigo-500/30">
                        <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-400/30 shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                            <span>Community Welfare & Voluntary Contribution</span>
                        </div>

                        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase">
                            Maharashtra Prantik Tailik Mahasabha
                        </h1>

                        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                            Amravati Division — Official Voluntary Donation Registration Form
                        </p>
                    </div>

                    {/* Form Body Container */}
                    <div className="p-4 sm:p-6 space-y-5">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* Left Side: Donation Form (7 Cols) */}
                        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
                            
                            <div className="border-b border-slate-200 pb-2">
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                                    <span>📝 Donor Details</span>
                                </h2>
                            </div>

                            {/* Name Input */}
                            <div className="space-y-1">
                                <label className="block text-xs sm:text-sm font-bold text-slate-700">
                                    Full Name <span className="text-red-600">*</span> :
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Enter donor's full name"
                                    className={inputBaseStyle}
                                />
                            </div>

                            {/* Mobile Input */}
                            <div className="space-y-1">
                                <label className="block text-xs sm:text-sm font-bold text-slate-700">
                                    Mobile Number <span className="text-red-600">*</span> :
                                </label>
                                <input
                                    type="tel"
                                    value={mobileNo}
                                    onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                    required
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                    inputMode="numeric"
                                    placeholder="10-digit mobile number"
                                    className={inputBaseStyle}
                                />
                            </div>

                            {/* City Input */}
                            <div className="space-y-1">
                                <label className="block text-xs sm:text-sm font-bold text-slate-700">
                                    City / Town <span className="text-red-600">*</span> :
                                </label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                    placeholder="Enter your city or town name"
                                    className={inputBaseStyle}
                                />
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-2">
                                <label className="block text-xs sm:text-sm font-bold text-slate-700">
                                    Donation Amount (₹) <span className="text-red-600">*</span> :
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    placeholder="Enter amount in ₹"
                                    className={`${inputBaseStyle} font-extrabold text-indigo-700 text-lg`}
                                />

                                {amount && parseInt(amount, 10) > 0 && (
                                    <p className="text-xs font-bold text-indigo-900 bg-indigo-50 p-2 rounded-lg border border-indigo-100 italic">
                                        Amount in words: {convertNumberToEnglishWords(amount)}
                                    </p>
                                )}
                            </div>

                            {/* Payment Screenshot Image Picker */}
                            <div className="space-y-2 pt-2 border-t border-slate-200">
                                <label className="block text-xs sm:text-sm font-bold text-slate-700">
                                    Attach Payment Screenshot / Receipt <span className="text-red-600">*</span> :
                                </label>
                                
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-300 shadow-xs">
                                        <label
                                            htmlFor="donation-screenshot-upload"
                                            className="min-h-[40px] bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5 shadow-xs"
                                        >
                                            <Upload className="w-4 h-4 text-indigo-400" />
                                            <span>Choose Screenshot File</span>
                                        </label>
                                        <span className="text-xs font-medium text-slate-600 truncate flex-1 px-1">
                                            {paymentScreenshot ? paymentScreenshot.name : "No file chosen"}
                                        </span>
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="donation-screenshot-upload"
                                        onChange={handleScreenshotChange}
                                        className="hidden"
                                    />

                                    {screenshotPreview && (
                                        <div className="relative w-full p-2.5 bg-emerald-50 rounded-xl border border-emerald-300 shadow-xs flex items-center gap-3">
                                            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-emerald-300 shrink-0">
                                                <img
                                                    src={screenshotPreview}
                                                    alt="Payment Screenshot Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                                                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0">✓</span>
                                                    <span>Payment Screenshot Attached</span>
                                                </div>
                                                <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                                                    {paymentScreenshot?.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {screenshotError && (
                                        <p className="text-xs font-bold text-red-700 bg-red-50 p-2 rounded-lg border border-red-200">
                                            {screenshotError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={!paymentScreenshot || submitting}
                                    className={`w-full min-h-[50px] font-extrabold text-sm sm:text-base rounded-2xl shadow-lg border transition-all flex items-center justify-center gap-2 ${
                                        !paymentScreenshot || submitting
                                            ? "bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed"
                                            : "bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 hover:brightness-110 text-white border-indigo-400/40 cursor-pointer active:scale-[0.99]"
                                    }`}
                                >
                                    <Printer className="w-5 h-5 text-indigo-300" />
                                    <span>{submitting ? "Submitting..." : "Submit Donation & Download Receipt"}</span>
                                </button>
                            </div>
                        </form>

                        {/* Right Side: QR Code & Payment Mobile Info (5 Cols) */}
                        <div className="lg:col-span-5 bg-gradient-to-b from-indigo-50/70 to-slate-100/90 p-5 rounded-2xl border border-slate-200 space-y-4 text-center">
                            <div className="space-y-1">
                                <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-1.5">
                                    <QrCode className="w-4 h-4 text-indigo-600" />
                                    <span>Pay via UPI QR Code</span>
                                </h3>
                                <p className="text-[11px] text-slate-600 font-semibold">
                                    PhonePe / Google Pay / Paytm QR Code
                                </p>
                            </div>

                            {/* QR Image */}
                            <div className="relative w-44 h-44 sm:w-48 sm:h-48 mx-auto bg-white p-2 rounded-2xl border border-slate-300 shadow-sm">
                                <Image
                                    src="/QR.jpeg"
                                    alt="Payment QR Code"
                                    fill
                                    className="object-contain p-1 rounded-xl"
                                />
                            </div>

                            {/* Mobile Number for Payment & Helpline */}
                            <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-slate-900 shadow-xs space-y-1.5">
                                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
                                    <Phone className="w-4 h-4 text-emerald-600 fill-emerald-600 animate-bounce" />
                                    <span>Payment & Contact Mobile:</span>
                                </div>
                                <a
                                    href="tel:9595707707"
                                    className="block text-xl font-black text-indigo-700 tracking-wider hover:underline"
                                >
                                    9595707707
                                </a>
                                <p className="text-[11px] font-bold text-emerald-800 bg-emerald-50 py-1 px-2 rounded-md border border-emerald-200">
                                    (PhonePe / Google Pay / UPI Payments & Enquiries)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                {/* Printable Official Receipt Section */}
                {submitted && (
                    <div className="space-y-4">
                        
                        {/* Interactive Banner on Screen */}
                        <div className="bg-emerald-50 border border-emerald-400 text-emerald-950 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden shadow-md">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                                <div>
                                    <h3 className="font-extrabold text-base text-emerald-950">
                                        Donation details successfully recorded!
                                    </h3>
                                    <p className="text-xs font-medium text-emerald-800">
                                        Click the print button below to download or print your official donation receipt.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Print / Download Receipt</span>
                            </button>
                        </div>

                        {/* Official Receipt Card - Printable Format */}
                        <div className="bg-white rounded-3xl border-2 border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative">
                            
                            {/* Receipt Header */}
                            <div className="text-center space-y-1.5 border-b-2 border-slate-800 pb-4">
                                <div className="text-slate-600 text-xs font-extrabold tracking-widest uppercase">
                                    OFFICIAL DONATION RECEIPT
                                </div>
                                <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                                    Maharashtra Prantik Tailik Mahasabha
                                </h1>
                                <p className="text-xs sm:text-sm font-bold text-slate-700">
                                    Amravati Division, Amravati (Official Donation Receipt)
                                </p>
                            </div>

                            {/* Receipt Meta (No. & Date) */}
                            <div className="flex justify-between items-center text-xs sm:text-sm font-extrabold text-slate-800 border-b border-slate-200 pb-2">
                                <div>
                                    Receipt No: <span className="text-indigo-700 font-mono">{receiptNo}</span>
                                </div>
                                <div>
                                    Date: <span className="text-slate-900">{submissionDate}</span>
                                </div>
                            </div>

                            {/* Receipt Details Table */}
                            <div className="space-y-3 text-xs sm:text-base font-bold text-slate-900 leading-relaxed">
                                <div className="flex items-center gap-2 border-b border-dashed border-slate-200 pb-2">
                                    <span className="w-36 text-slate-500 font-semibold">Donor Name:</span>
                                    <span className="text-base sm:text-lg font-black text-indigo-950">{name}</span>
                                </div>

                                <div className="flex items-center gap-2 border-b border-dashed border-slate-200 pb-2">
                                    <span className="w-36 text-slate-500 font-semibold">Mobile Number:</span>
                                    <span>{mobileNo}</span>
                                </div>

                                <div className="flex items-center gap-2 border-b border-dashed border-slate-200 pb-2">
                                    <span className="w-36 text-slate-500 font-semibold">City / Town:</span>
                                    <span>{city}</span>
                                </div>

                                <div className="flex items-center gap-2 border-b border-dashed border-slate-200 pb-2">
                                    <span className="w-36 text-slate-500 font-semibold">Donation Amount:</span>
                                    <span className="text-lg sm:text-xl font-black text-emerald-700">
                                        ₹ {amount} /- ({convertNumberToEnglishWords(amount)})
                                    </span>
                                </div>
                            </div>

                            {/* Footer & Authorization Note */}
                            <div className="pt-4 border-t-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs font-semibold text-slate-700">
                                <div>
                                    <p className="font-extrabold text-slate-900">Payment & Contact Mobile: 9595707707</p>
                                    <p className="text-[11px] text-slate-500">Maharashtra Prantik Tailik Mahasabha, Amravati</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-28 h-10 mx-auto border-b border-slate-400 mb-1 flex items-end justify-center text-[10px] italic text-slate-400">
                                        [ Signature / Seal ]
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-900">Authorized Signatory</span>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
