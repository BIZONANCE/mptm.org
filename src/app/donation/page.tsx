"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, QrCode, Printer, CheckCircle, Upload, RefreshCw } from "lucide-react";

// Convert numeric amount to Marathi words automatically for any donation amount
function convertNumberToMarathiWords(amountStr: string): string {
    const num = parseInt(amountStr, 10);
    if (isNaN(num) || num <= 0) return "शून्य रुपये फक्त";

    const unitsAndTens: { [key: number]: string } = {
        1: "एक", 2: "दोन", 3: "तीन", 4: "चार", 5: "पाच", 6: "सहा", 7: "सात", 8: "आठ", 9: "नऊ", 10: "दहा",
        11: "अकरा", 12: "बारा", 13: "तेरा", 14: "चौदा", 15: "पंधरा", 16: "सोळा", 17: "सतरा", 18: "अठरा", 19: "एकोणीस",
        20: "वीस", 21: "एकवीस", 22: "बावीस", 23: "तेवीस", 24: "चोवीस", 25: "पंचवीस", 26: "सव्वीस", 27: "सत्तावीस", 28: "अठ्ठावीस", 29: "एकोणतीस",
        30: "तीस", 31: "एकतीस", 32: "बत्तीस", 33: "तेहेतीस", 34: "चौतीस", 35: "पस्तीस", 36: "छत्तीस", 37: "सदतीस", 38: "अडतीस", 39: "एकोणचाळीस",
        40: "चाळीस", 41: "एक्केचाळीस", 42: "बेचाळीस", 43: "त्रेश्चाळीस", 44: "चौचाळीस", 45: "पंचेचाळीस", 46: "शेचाळीस", 47: "सत्ताचाळीस", 48: "अठ्ठाचाळीस", 49: "एकोणपन्नास",
        50: "पन्नास", 51: "एकपन्न", 52: "बावन्न", 53: "तिरपन्न", 54: "चौपन्न", 55: "पंचावन्न", 56: "छप्पन्न", 57: "सत्तावन्न", 58: "अठ्ठावन्न", 59: "एकोणसाठ",
        60: "साठ", 61: "एकसष्ठ", 62: "बासष्ठ", 63: "त्रिसष्ठ", 64: "चौसष्ठ", 65: "पासष्ठ", 66: "सायसष्ठ", 67: "सदसष्ठ", 68: "अडसष्ठ", 69: "एकोणसत्तर",
        70: "सत्तर", 71: "एकहत्तर", 72: "बाहत्तर", 73: "त्रियेहत्तर", 74: "चौहत्तर", 75: "पंचहत्तर", 76: "शहात्तर", 77: "सत्त्याहत्तर", 78: "अठ्ठाहत्तर", 79: "एकोणऐंशी",
        80: "ऐंशी", 81: "एकऐंशी", 82: "ब्याऐंशी", 83: "त्र्याऐंशी", 84: "चौऱ्याऐंशी", 85: "पंच्याऐंशी", 86: "स्याऐंशी", 87: "सत्त्याऐंशी", 88: "अठ्ठ्याऐंशी", 89: "एकोणनव्वद",
        90: "नव्वद", 91: "एक्यानव्वद", 92: "ब्यानव्वद", 93: "त्र्यानव्वद", 94: "चौऱ्यानव्वद", 95: "पंच्यानव्वद", 96: "शहाणव्वद", 97: "सत्त्यानव्वद", 98: "अठ्ठ्यानव्वद", 99: "नव्व्यान्नव"
    };

    const hundreds: { [key: number]: string } = {
        1: "एकशे", 2: "दोनशे", 3: "तीनशे", 4: "चारशे", 5: "पाचशे", 6: "सहाशे", 7: "सातशे", 8: "आठशे", 9: "नऊशे"
    };

    let words = "";
    let n = num;

    if (n >= 100000) {
        const lakh = Math.floor(n / 100000);
        n %= 100000;
        words += (unitsAndTens[lakh] || lakh) + " लाख ";
    }

    if (n >= 1000) {
        const th = Math.floor(n / 1000);
        n %= 1000;
        words += (unitsAndTens[th] || th) + " हजार ";
    }

    if (n >= 100) {
        const h = Math.floor(n / 100);
        n %= 100;
        words += (hundreds[h] || (unitsAndTens[h] + " शे")) + " ";
    }

    if (n > 0) {
        words += (unitsAndTens[n] || n) + " ";
    }

    return `${words.trim()} रुपये फक्त`;
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
    const [nextSerialNo, setNextSerialNo] = useState("MPTM-2026-DON-001");
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

    const fetchNextSerialNo = async () => {
        try {
            const res = await fetch(`${API_URL}/api/donation/next-number`);
            const data = await res.json();
            if (res.ok && data.success && data.receiptNo) {
                setNextSerialNo(data.receiptNo);
            }
        } catch (err) {
            console.error("Fetch next serial number error:", err);
        }
    };

    useEffect(() => {
        fetchNextSerialNo();
    }, [API_URL]);

    const handleResetForm = () => {
        setName("");
        setMobileNo("");
        setCity("");
        setAmount("");
        setPaymentScreenshot(null);
        setScreenshotPreview(null);
        setScreenshotError("");
        setSubmitted(false);
        setSubmitting(false);
        fetchNextSerialNo();
    };

    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setScreenshotError("⚠️ कृपया वैध फोटो फाईल (JPG, PNG, WEBP) अपलोड करा!");
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
            alert("कृपया सर्व आवश्यक माहिती अचूक प्रविष्ट करा.");
            return;
        }

        if (!paymentScreenshot) {
            setScreenshotError("⚠️ देणगी सबमिट करण्यासाठी ट्रान्सअॅक्शनचा स्क्रीनशॉट किंवा पावती अपलोड करणे अनिवार्य आहे!");
            return;
        }

        setSubmitting(true);
        const amountWords = convertNumberToMarathiWords(amount);

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
                setReceiptNo(nextSerialNo);
                setSubmissionDate(`${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`);
            }
        } catch (err) {
            console.error("Donation submit error:", err);
            const now = new Date();
            setReceiptNo(nextSerialNo);
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
        "flex-1 w-full bg-transparent border-b-2 border-stone-800 focus:border-amber-700 outline-none px-2 py-2 sm:py-1 text-base sm:text-sm font-semibold text-stone-900 placeholder:text-stone-400/80";

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-6 sm:py-10 px-3 sm:px-4 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Back Link - Hidden on print */}
                <div className="print:hidden">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#7A0C0C] hover:text-amber-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>← मुख्य पानावर परत जा</span>
                    </Link>
                </div>

                {/* Combined Form & Header Container */}
                <div className={`bg-[#FFFDF9] rounded-xl sm:rounded-2xl border-2 border-amber-800/40 shadow-2xl overflow-hidden ${submitted ? "print:hidden" : ""}`}>
                    
                    {/* Top Traditional Marathi Banner Header matching Form.tsx */}
                    <div className="bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-white py-4 px-4 sm:py-5 sm:px-6 relative flex items-center justify-between border-b-2 border-amber-400">
                        <div className="hidden sm:flex items-center gap-1 text-amber-400 text-lg font-bold">
                            <span>❖</span>
                            <span className="w-6 h-[2px] bg-amber-400"></span>
                        </div>

                        <div className="text-center mx-auto space-y-1">
                            <p className="text-xs sm:text-sm font-bold text-amber-400">
                                ❖ जय संताजी ❖
                            </p>
                            <h1 className="text-lg sm:text-2xl font-black text-amber-200 drop-shadow-md leading-tight">
                                महाराष्ट्र प्रांतिक तैलिक महासभा
                            </h1>
                            <p className="text-xs sm:text-sm text-sky-200 font-bold">
                                अमरावती विभाग, अमरावती.
                            </p>
                            <div className="inline-block mt-1">
                                <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-xs sm:text-sm px-4 py-0.5 rounded-full border border-amber-400 shadow-xs">
                                    ऐच्छिक देणगी नोंदणी अर्ज
                                </span>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-1 text-amber-400 text-lg font-bold">
                            <span className="w-6 h-[2px] bg-amber-400"></span>
                            <span>❖</span>
                        </div>
                    </div>

                    {/* Form Body Container */}
                    <div className="p-4 sm:p-6 space-y-6 text-stone-900">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                            {/* Left Side: Donation Form (7 Cols) */}
                            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
                                
                                <div className="border-b border-amber-300 pb-2 flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                                    <h2 className="text-base sm:text-lg font-bold text-[#7A0C0C] flex items-center gap-2">
                                        <span>📝 देणगीदार माहिती</span>
                                    </h2>
                                    <span className="bg-amber-100 text-[#7A0C0C] border border-amber-300 font-mono font-extrabold text-xs px-3 py-1 rounded-full shadow-2xs self-start xs:self-auto">
                                        अनुक्रमांक / पावती क्र. : {nextSerialNo}
                                    </span>
                                </div>

                                {/* Name Input */}
                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-bold text-stone-800">
                                        पूर्ण नाव <span className="text-red-600">*</span> :
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="देणगीदाराचे पूर्ण नाव प्रविष्ट करा"
                                        className={inputBaseStyle}
                                    />
                                </div>

                                {/* Mobile Input */}
                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-bold text-stone-800">
                                        मोबाईल नंबर <span className="text-red-600">*</span> :
                                    </label>
                                    <input
                                        type="tel"
                                        value={mobileNo}
                                        onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                        required
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                        inputMode="numeric"
                                        placeholder="१० अंकी मोबाईल नंबर"
                                        className={inputBaseStyle}
                                    />
                                </div>

                                {/* City Input */}
                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-bold text-stone-800">
                                        शहर / गाव <span className="text-red-600">*</span> :
                                    </label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                        placeholder="तुमचे शहर किंवा गाव प्रविष्ट करा"
                                        className={inputBaseStyle}
                                    />
                                </div>

                                {/* Amount Input */}
                                <div className="space-y-2">
                                    <label className="block text-xs sm:text-sm font-bold text-stone-800">
                                        देणगी रक्कम (₹) <span className="text-red-600">*</span> :
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                        placeholder="देणगी रक्कम (₹)"
                                        className={`${inputBaseStyle} font-extrabold text-[#7A0C0C] text-lg sm:text-xl`}
                                    />

                                    {amount && parseInt(amount, 10) > 0 && (
                                        <p className="text-xs font-bold text-[#7A0C0C] bg-amber-100/60 p-2.5 rounded-lg border border-amber-300">
                                            अक्षरी रक्कम : {convertNumberToMarathiWords(amount)}
                                        </p>
                                    )}
                                </div>

                                {/* Payment Screenshot Image Picker */}
                                <div className="space-y-2 pt-3 border-t border-amber-300">
                                    <label className="block text-xs sm:text-sm font-bold text-stone-800">
                                        पावती / ट्रान्सअॅक्शन स्क्रीनशॉट निवडा <span className="text-red-600">*</span> :
                                    </label>
                                    
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2.5 bg-amber-50/60 p-3 rounded-xl border border-amber-300/60">
                                            <label
                                                htmlFor="donation-screenshot-upload"
                                                className="min-h-[42px] bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-900 text-amber-100 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap flex items-center gap-2 shadow-sm border border-amber-400/50"
                                            >
                                                <Upload className="w-4 h-4 text-amber-300" />
                                                <span>स्क्रीनशॉट फाईल निवडा</span>
                                            </label>
                                            <span className="text-xs font-semibold text-stone-700 truncate flex-1 px-1">
                                                {paymentScreenshot ? paymentScreenshot.name : "कोणतीही फाईल निवडली नाही"}
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
                                            <div className="relative w-full p-3 bg-emerald-50/90 rounded-xl border border-emerald-300 flex items-center gap-3 shadow-xs">
                                                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-emerald-400 shrink-0">
                                                    <img
                                                        src={screenshotPreview}
                                                        alt="Payment Screenshot Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900">
                                                        <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center font-bold shrink-0">✓</span>
                                                        <span>स्क्रीनशॉट यशस्वीरित्या जोडला गेला</span>
                                                    </div>
                                                    <p className="text-xs text-stone-600 truncate mt-0.5 font-medium">
                                                        {paymentScreenshot?.name}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {screenshotError && (
                                            <p className="text-xs font-bold text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-200">
                                                {screenshotError}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button matching Form.tsx */}
                                <div className="pt-3">
                                    <button
                                        type="submit"
                                        disabled={!paymentScreenshot || submitting}
                                        className={`w-full min-h-[50px] font-extrabold text-base sm:text-lg rounded-full shadow-xl border-2 transition-all flex items-center justify-center gap-2.5 ${
                                            !paymentScreenshot || submitting
                                                ? "bg-stone-200 text-stone-500 border-stone-300 cursor-not-allowed"
                                                : "bg-gradient-to-r from-[#7A0C0C] via-[#9E1010] to-[#7A0C0C] hover:from-[#5A0808] hover:to-[#5A0808] text-amber-200 border-amber-400 cursor-pointer active:scale-[0.99]"
                                        }`}
                                    >
                                        <Printer className="w-5 h-5 text-amber-300" />
                                        <span>{submitting ? "जतन करत आहे..." : "देणगी नोंदवा आणि पावती डाऊनलोड करा"}</span>
                                    </button>
                                </div>
                            </form>

                            {/* Right Side: QR Code & Payment Mobile Info (5 Cols) */}
                            <div className="lg:col-span-5 bg-amber-50/60 p-5 rounded-xl border border-amber-300/60 space-y-4 text-center">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-[#7A0C0C] flex items-center justify-center gap-1.5">
                                        <QrCode className="w-4 h-4 text-amber-800" />
                                        <span>PhonePe / Google Pay / Paytm द्वारे क्यूआर कोड स्कॅन करा</span>
                                    </h3>
                                    <p className="text-xs text-stone-600 font-semibold">
                                        UPI QR Code
                                    </p>
                                </div>

                                {/* QR Image */}
                                <div className="relative w-44 h-44 sm:w-48 sm:h-48 mx-auto bg-white p-2 rounded-xl border border-amber-300 shadow-md">
                                    <Image
                                        src="/QR.jpeg"
                                        alt="Payment QR Code"
                                        fill
                                        className="object-contain p-1 rounded-lg"
                                    />
                                </div>

                                <p className="text-xs font-bold text-stone-800">
                                    Rajas Balkrushna Gulwade
                                </p>

                                {/* Mobile Number for Payment & Helpline */}
                                <div className="bg-white p-3.5 rounded-xl border border-amber-300 text-stone-900 shadow-xs space-y-1.5">
                                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-stone-800">
                                        <Phone className="w-4 h-4 text-emerald-700 fill-emerald-700 animate-bounce" />
                                        <span>देयक व अधिक माहितीसाठी संपर्क मोबाईल:</span>
                                    </div>
                                    <a
                                        href="tel:9595707707"
                                        className="block text-xl font-black text-[#7A0C0C] tracking-wider hover:underline"
                                    >
                                        9595707707
                                    </a>
                                    <p className="text-[11px] font-bold text-emerald-900 bg-emerald-50 py-1 px-2 rounded-md border border-emerald-300">
                                        (PhonePe / Google Pay / UPI पेमेंट व चौकशीसाठी)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Printable Official Marathi Receipt Section */}
                {submitted && (
                    <div className="space-y-4">
                        
                        {/* Interactive Success Alert Banner */}
                        <div className="bg-emerald-50 border border-emerald-400 text-emerald-950 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden shadow-md">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-8 h-8 text-emerald-700 shrink-0" />
                                <div>
                                    <h3 className="font-extrabold text-base text-emerald-950">
                                        देणगीची माहिती यशस्वीरित्या नोंदवली गेली आहे!
                                    </h3>
                                    <p className="text-xs font-semibold text-emerald-900">
                                        आपली अधिकृत देणगी पावती डाऊनलोड किंवा प्रिंट करण्यासाठी खालील बटणावर क्लिक करा.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <Printer className="w-4 h-4 text-emerald-200" />
                                    <span>पावती प्रिंट / डाऊनलोड करा</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResetForm}
                                    className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border border-amber-400/40"
                                >
                                    <RefreshCw className="w-4 h-4 text-amber-300" />
                                    <span>नवीन देणगी नोंदवा (फॉर्म रिफ्रेश करा)</span>
                                </button>
                            </div>
                        </div>

                        {/* Official Marathi Receipt Card - Printable Format matching Form.tsx */}
                        <div className="bg-[#FFFDF9] rounded-2xl border-2 border-amber-800/60 p-6 sm:p-8 space-y-6 shadow-2xl relative">
                            
                            {/* Receipt Banner Header */}
                            <div className="bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-white py-3 px-4 rounded-xl text-center space-y-0.5 border border-amber-400">
                                <p className="text-xs font-bold text-amber-400">❖ जय संताजी ❖</p>
                                <h1 className="text-xl sm:text-2xl font-black text-amber-200 uppercase tracking-tight">
                                    महाराष्ट्र प्रांतिक तैलिक महासभा
                                </h1>
                                <p className="text-xs sm:text-sm font-bold text-sky-200">
                                    अमरावती विभाग, अमरावती.
                                </p>
                                <div className="inline-block mt-1">
                                    <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-xs px-4 py-0.5 rounded-full border border-amber-400">
                                        अधिकृत देणगी पावती
                                    </span>
                                </div>
                            </div>

                            {/* Receipt Meta (No. & Date) */}
                            <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-stone-900 border-b border-amber-300 pb-2">
                                <div>
                                    पावती क्र. : <span className="text-[#7A0C0C] font-mono font-extrabold">{receiptNo}</span>
                                </div>
                                <div>
                                    दिनांक : <span className="text-stone-900 font-extrabold">{submissionDate}</span>
                                </div>
                            </div>

                            {/* Receipt Details Table */}
                            <div className="space-y-3 text-xs sm:text-base font-bold text-stone-900 leading-relaxed">
                                <div className="flex items-center gap-2 border-b border-dashed border-amber-300 pb-2">
                                    <span className="w-36 text-stone-600 font-semibold">देणगीदाराचे नाव :</span>
                                    <span className="text-base sm:text-lg font-black text-[#7A0C0C]">{name}</span>
                                </div>

                                <div className="flex items-center gap-2 border-b border-dashed border-amber-300 pb-2">
                                    <span className="w-36 text-stone-600 font-semibold">मोबाईल नंबर :</span>
                                    <span>{mobileNo}</span>
                                </div>

                                <div className="flex items-center gap-2 border-b border-dashed border-amber-300 pb-2">
                                    <span className="w-36 text-stone-600 font-semibold">शहर / गाव :</span>
                                    <span>{city}</span>
                                </div>

                                <div className="flex items-center gap-2 border-b border-dashed border-amber-300 pb-2">
                                    <span className="w-36 text-stone-600 font-semibold">देणगी रक्कम :</span>
                                    <span className="text-lg sm:text-xl font-black text-emerald-800">
                                        ₹ {amount} /- ({convertNumberToMarathiWords(amount)})
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm font-semibold text-stone-700 italic bg-amber-50/60 p-3 rounded-xl border border-amber-300/60 text-center">
                                &quot;वरील रक्कम महाराष्ट्र प्रांतिक तैलिक महासभेस ऐच्छिक देणगी म्हणून प्राप्त झाली.&quot;
                            </p>

                            {/* Footer & Authorization Note */}
                            <div className="pt-4 border-t-2 border-amber-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs font-semibold text-stone-700">
                                <div>
                                    <p className="font-bold text-stone-900">संपर्क मोबाईल: 9595707707</p>
                                    <p className="text-[11px] text-stone-600">महाराष्ट्र प्रांतिक तैलिक महासभा, अमरावती विभाग</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-32 h-10 mx-auto border-b border-stone-400 mb-1 flex items-end justify-center text-[10px] italic text-stone-400">
                                        [ स्वाक्षरी / शिक्का ]
                                    </div>
                                    <span className="text-[10px] font-bold text-stone-900">अधिकृत स्वाक्षरी</span>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
