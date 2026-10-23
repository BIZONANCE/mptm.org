"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, QrCode, Printer } from "lucide-react";
import { getApiUrl } from "@/utils/config";

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
    const [address, setAddress] = useState("");
    const [gaav, setGaav] = useState("");
    const [taluka, setTaluka] = useState("");
    const [city, setCity] = useState("अमरावती");
    const [district, setDistrict] = useState("अमरावती");
    const [state, setState] = useState("महाराष्ट्र");
    const [country, setCountry] = useState("भारत");
    const [pincode, setPincode] = useState("");
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isTestMode, setIsTestMode] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const testRequested = params.get("test") === "1" || params.get("test_payment") === "true";
            if (testRequested || process.env.NEXT_PUBLIC_ONE_RUPEE_TEST_MODE === "true") {
                setIsTestMode(true);
                setAmount("1");
            }
        }
    }, []);

    const [idempotencyKey] = useState<string>(() => {
        if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
            return window.crypto.randomUUID();
        }
        return "don_" + Math.random().toString(36).substring(2) + Date.now();
    });

    const API_URL = getApiUrl() || "http://localhost:5015";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");

        if (!name.trim()) {
            setSubmitError("कृपया आपले पूर्ण नाव प्रविष्ट करा.");
            return;
        }

        if (!mobileNo.trim() || !/^\d{10}$/.test(mobileNo.trim())) {
            setSubmitError("कृपया वैध १० अंकी मोबाईल क्रमांक प्रविष्ट करा.");
            return;
        }

        const amtNum = parseInt(amount, 10);
        if (isNaN(amtNum) || amtNum <= 0) {
            setSubmitError("कृपया वैध देणगी रक्कम प्रविष्ट करा.");
            return;
        }

        if (pincode && pincode.trim() !== "" && !/^\d{6}$/.test(pincode.trim())) {
            setSubmitError("पिनकोड ६ अंकी असावा.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`${API_URL}/api/donations/online/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Idempotency-Key": idempotencyKey,
                    ...(isTestMode ? { "X-Test-Payment": "1" } : {}),
                },
                body: JSON.stringify({
                    name: name.trim(),
                    mobileNo: mobileNo.trim(),
                    address: address.trim(),
                    gaav: gaav.trim(),
                    taluka: taluka.trim(),
                    city: city.trim(),
                    district: district.trim(),
                    state: state.trim(),
                    country: country.trim(),
                    pincode: pincode.trim(),
                    amount: amtNum,
                    isTestPayment: isTestMode,
                }),
            });

            const data = await res.json();

            if (data.success && data.redirectUrl) {
                // Redirect to PhonePe payment page
                window.location.href = data.redirectUrl;
            } else {
                setSubmitError(data.error || "देणगी प्रक्रिया सुरू करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
                setSubmitting(false);
            }
        } catch (err: any) {
            console.error("Donation submit error:", err);
            setSubmitError("सर्व्हरशी संपर्क साधताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
            setSubmitting(false);
        }
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

                {/* Live Test Payment Mode Banner */}
                {isTestMode && (
                    <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 border-2 border-amber-500 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950 font-bold text-xs sm:text-sm shadow-sm animate-in fade-in print:hidden">
                        <div className="flex items-center gap-2.5">
                            <span className="text-2xl">🧪</span>
                            <div>
                                <p className="font-black text-amber-900 text-sm sm:text-base">थेट चाचणी पेमेंट मोड सुरू आहे (Live Test Payment: ₹१)</p>
                                <p className="text-xs text-amber-800 font-medium">प्रत्यक्ष PhonePe गेटवेवर फक्त ₹१ भरून देणगी नोंदणीची थेट प्रक्रिया तपासता येईल.</p>
                            </div>
                        </div>
                        <span className="self-end sm:self-auto px-3.5 py-1.5 bg-amber-600 text-white rounded-full text-xs font-black shadow-xs whitespace-nowrap">
                            ₹१ चाचणी सक्रिय
                        </span>
                    </div>
                )}

                {/* Combined Form & Header Container */}
                <div className="bg-[#FFFDF9] rounded-xl sm:rounded-2xl border-2 border-amber-800/40 shadow-2xl overflow-hidden">

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
                                            अनुक्रमांक / पावती क्र. : सबमिट केल्यानंतर मिळेल
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

                                    {/* Address Input */}
                                    <div className="space-y-1">
                                        <label className="block text-xs sm:text-sm font-bold text-stone-800">
                                            संपूर्ण पत्ता :
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="संपूर्ण पत्ता प्रविष्ट करा"
                                            className={`${inputBaseStyle} resize-none`}
                                        />
                                    </div>

                                    {/* Location Input Fields: Gaav, Taluka */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="block text-xs sm:text-sm font-bold text-stone-800">
                                                गाव :
                                            </label>
                                            <input
                                                type="text"
                                                value={gaav}
                                                onChange={(e) => setGaav(e.target.value)}
                                                placeholder="गावाचे नाव"
                                                className={inputBaseStyle}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs sm:text-sm font-bold text-stone-800">
                                                तालुका :
                                            </label>
                                            <input
                                                type="text"
                                                value={taluka}
                                                onChange={(e) => setTaluka(e.target.value)}
                                                placeholder="तालुक्याचे नाव"
                                                className={inputBaseStyle}
                                            />
                                        </div>
                                    </div>

                                    {/* Location Input Fields: District, State, Country, Pincode */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        <div className="space-y-1">
                                            <label className="block text-xs sm:text-sm font-bold text-stone-800">
                                                जिल्हा :
                                            </label>
                                            <input
                                                type="text"
                                                value={district}
                                                onChange={(e) => setDistrict(e.target.value)}
                                                placeholder="जिल्हा"
                                                className={inputBaseStyle}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs sm:text-sm font-bold text-stone-800">
                                                राज्य :
                                            </label>
                                            <input
                                                type="text"
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                placeholder="राज्य"
                                                className={inputBaseStyle}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs sm:text-sm font-bold text-stone-800">
                                                देश :
                                            </label>
                                            <input
                                                type="text"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                placeholder="देश"
                                                className={inputBaseStyle}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs sm:text-sm font-bold text-stone-800">
                                                पिनकोड :
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                placeholder="६ अंकी पिनकोड"
                                                className={inputBaseStyle}
                                            />
                                        </div>
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

                                    {/* Payment Info Badge */}
                                    <div className="space-y-2 pt-3 border-t border-amber-300">
                                        <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs sm:text-sm">
                                            <div className="flex items-center gap-2.5 text-purple-950 font-bold">
                                                <span className="text-xl">💳</span>
                                                <div>
                                                    <p className="font-extrabold text-sm text-[#5f259f]">सुरक्षित ऑनलाईन देणगी (PhonePe Gateway)</p>
                                                    <p className="text-[11px] text-stone-600 font-medium">UPI, Google Pay, PhonePe, कार्ड व नेटबँकिंग द्वारे त्वरित पावती मिळेल</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {submitError && (
                                        <p className="text-xs font-bold text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-200">
                                            {submitError}
                                        </p>
                                    )}

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={!amount || parseInt(amount, 10) <= 0 || submitting}
                                            className={`w-full min-h-[50px] font-extrabold text-base sm:text-lg rounded-full shadow-xl border-2 transition-all flex items-center justify-center gap-2.5 ${
                                                !amount || parseInt(amount, 10) <= 0 || submitting
                                                    ? "bg-stone-200 text-stone-500 border-stone-300 cursor-not-allowed"
                                                    : "bg-gradient-to-r from-[#5f259f] via-[#7b2cbf] to-[#5f259f] hover:brightness-110 text-white border-purple-300 cursor-pointer active:scale-[0.99]"
                                            }`}
                                        >
                                            <Printer className="w-5 h-5 text-purple-200" />
                                            <span>
                                                {submitting
                                                    ? "पेमेंट पृष्ठावर घेऊन जात आहे..."
                                                    : `💳 PhonePe द्वारे देणगी भरा (₹${amount || "०"})`}
                                            </span>
                                        </button>
                                        <p className="text-[11px] text-center font-medium text-stone-500 mt-2">
                                            🔒 देयक यशस्वी होताच अधिकृत देणगी पावती आपोआप तयार होईल.
                                        </p>
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

            </div>
        </div>
    );
}
