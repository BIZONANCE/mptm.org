"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    ShieldCheck,
    Lock,
    KeyRound,
    AlertTriangle,
    CheckCircle2,
    ArrowLeft,
    Phone,
    User,
    MapPin,
    CreditCard,
    Sparkles,
    Eye,
    EyeOff,
    X,
} from "lucide-react";
import { getApiUrl } from "@/utils/config";

const TEST_SECRET_PIN = "2244";

interface DuplicateModalState {
    open: boolean;
    mobileNo: string;
    memberNo?: string;
    fullName?: string;
}

export default function TestPaymentPage() {
    // 1. Password / PIN Protection State
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [pinInput, setPinInput] = useState<string>("");
    const [pinError, setPinError] = useState<string>("");
    const [showPin, setShowPin] = useState<boolean>(false);

    // 2. Form States (Same fields & logic as official form)
    const [membershipType, setMembershipType] = useState<"PRIMARY" | "EXECUTIVE">("PRIMARY");
    const [fullName, setFullName] = useState<string>("");
    const [mobileNo, setMobileNo] = useState<string>("");
    const [city, setCity] = useState<string>("अमरावती");
    const [taluka, setTaluka] = useState<string>("");
    const [district, setDistrict] = useState<string>("अमरावती");
    const [pincode, setPincode] = useState<string>("");
    const [address, setAddress] = useState<string>("");

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string>("");
    const [duplicateModal, setDuplicateModal] = useState<DuplicateModalState | null>(null);

    const API_URL = getApiUrl() || "http://localhost:5015";

    // Auto-check session on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedPin = sessionStorage.getItem("mptm_testpage_pin");
            if (savedPin === TEST_SECRET_PIN) {
                setIsAuthenticated(true);
            }
        }
    }, []);

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPinError("");
        if (pinInput.trim() === TEST_SECRET_PIN) {
            setIsAuthenticated(true);
            if (typeof window !== "undefined") {
                sessionStorage.setItem("mptm_testpage_pin", TEST_SECRET_PIN);
            }
        } else {
            setPinError("चुकीचा पासवर्ड! कृपया योग्य सुरक्षा पासवर्ड (PIN) प्रविष्ट करा.");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPinInput("");
        setPinError("");
        if (typeof window !== "undefined") {
            sessionStorage.removeItem("mptm_testpage_pin");
        }
    };

    // Real-time duplicate mobile check on blur (Exact same logic as registration form)
    const handleMobileBlur = async () => {
        const mob = mobileNo.trim();
        if (mob && /^[1-9]\d{9}$/.test(mob)) {
            try {
                const res = await fetch(`${API_URL}/api/members/check-mobile/${mob}`);
                const data = await res.json();
                if (data.success && data.exists) {
                    setDuplicateModal({
                        open: true,
                        mobileNo: mob,
                        memberNo: data.memberNo,
                        fullName: data.fullName,
                    });
                }
            } catch (_) {
                // Ignore network blur check errors
            }
        }
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");

        const trimmedName = fullName.trim();
        const trimmedMobile = mobileNo.trim();

        if (!trimmedName) {
            setSubmitError("कृपया सदस्याचे पूर्ण नाव प्रविष्ट करा.");
            return;
        }

        if (!trimmedMobile || !/^[1-9]\d{9}$/.test(trimmedMobile)) {
            setSubmitError("कृपया वैध १० अंकी मोबाईल क्रमांक प्रविष्ट करा (उदा. 9876543210).");
            return;
        }

        if (pincode && pincode.trim() !== "" && !/^\d{6}$/.test(pincode.trim())) {
            setSubmitError("पिनकोड ६ अंकी असावा.");
            return;
        }

        setSubmitting(true);

        try {
            const idempotencyKey = "test_" + Math.random().toString(36).substring(2) + Date.now();

            const payload = {
                type: membershipType,
                membershipType,
                date: new Date().toLocaleDateString("en-GB"),
                registrationFee: "1",
                amountInWords: "एक रुपया फक्त",
                address: address.trim() || `${city.trim()}, ${district.trim()}`,
                gaav: city.trim(),
                taluka: taluka.trim(),
                city: city.trim(),
                district: district.trim(),
                state: "महाराष्ट्र",
                country: "भारत",
                pincode: pincode.trim(),
                paymentMethod: "ONLINE_PHONEPE",
                isTestPayment: true,
                testPin: TEST_SECRET_PIN,
                mainMembers: [
                    {
                        srNo: 1,
                        fullName: trimmedName,
                        mobileNo: trimmedMobile,
                        prabhagNo: "",
                    },
                ],
                familyMembers: [],
            };

            const response = await fetch(`${API_URL}/api/registrations/online/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Idempotency-Key": idempotencyKey,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success && result.redirectUrl) {
                // Redirect user directly to PhonePe checkout
                window.location.href = result.redirectUrl;
            } else {
                setSubmitting(false);
                if (
                    result.code === "DUPLICATE_MOBILE" ||
                    (result.error && result.error.includes("आधीच मुख्य सदस्य म्हणून नोंदणीकृत"))
                ) {
                    const dupMember = result.duplicateMembers?.[0];
                    setDuplicateModal({
                        open: true,
                        mobileNo: dupMember?.mobileNo || result.duplicateList || trimmedMobile,
                        memberNo: dupMember?.memberNo || "",
                        fullName: dupMember?.fullName || "",
                    });
                } else {
                    setSubmitError(result.error || "पेमेंट सुरू करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
                }
            }
        } catch (err: unknown) {
            console.error("Test payment error:", err);
            const msg = err instanceof Error ? err.message : "सर्व्हरशी संपर्क साधताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.";
            setSubmitError(msg);
            setSubmitting(false);
        }
    };

    // SCREEN 1: Password Lock Screen (PIN: 2244)
    if (!isAuthenticated) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-[#1a0505] via-[#2c0808] to-[#120202] flex items-center justify-center p-4 font-sans text-stone-100"
                style={{ fontFamily: "'Baloo 2', system-ui, sans-serif" }}
            >
                <div className="max-w-md w-full bg-[#200707]/90 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 text-center">
                    {/* Lock Icon Header */}
                    <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-400/60 flex items-center justify-center text-amber-400 shadow-inner">
                        <Lock className="w-8 h-8" />
                    </div>

                    <div>
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
                            प्रशासकीय सुरक्षा (Admin Security)
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-amber-100 mt-2">
                            थेट गेटवे चाचणी पोर्टल
                        </h2>
                        <p className="text-xs text-amber-200/70 mt-1 font-medium">
                            कृपया ₹१ थेट पेमेंट गेटवे चाचणीमध्ये प्रवेश करण्यासाठी पासवर्ड (PIN) टाका.
                        </p>
                    </div>

                    <form onSubmit={handlePinSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type={showPin ? "text" : "password"}
                                value={pinInput}
                                onChange={(e) => {
                                    setPinInput(e.target.value);
                                    if (pinError) setPinError("");
                                }}
                                placeholder="सुरक्षा पासवर्ड प्रविष्ट करा (PIN)"
                                autoFocus
                                className="w-full py-3 px-4 bg-[#140202] border-2 border-amber-500/40 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-amber-100 placeholder:text-stone-500 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPin(!showPin)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-300 p-1"
                            >
                                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {pinError && (
                            <div className="p-2.5 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
                                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                                <span>{pinError}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 active:scale-98 text-stone-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            <KeyRound className="w-4 h-4" />
                            <span>प्रवेश करा (Unlock)</span>
                        </button>
                    </form>

                    <div className="pt-2 border-t border-amber-500/20 text-center">
                        <Link
                            href="/"
                            className="text-xs text-amber-300/80 hover:text-amber-200 font-bold inline-flex items-center gap-1 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>मुख्य वेबसाइटवर परत जा</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // SCREEN 2: ₹1 Live Payment Gateway Testing Portal
    return (
        <div
            className="min-h-screen bg-[#FDFBF7] py-6 sm:py-10 px-3 sm:px-6 font-sans text-stone-900"
            style={{ fontFamily: "'Baloo 2', system-ui, sans-serif" }}
        >
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Top Bar with Navigation and Session Indicator */}
                <div className="flex items-center justify-between gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7A0C0C] hover:text-amber-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>← मुख्य वेबसाइटवर जा</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>सुरक्षित चाचणी मोड सक्रिय</span>
                        </span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                        >
                            <Lock className="w-3 h-3" />
                            <span>पिन लॉक करा</span>
                        </button>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white border-2 border-amber-800/30 rounded-3xl shadow-xl overflow-hidden">
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-white p-5 sm:p-6 border-b-2 border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 text-2xl font-bold shrink-0">
                                🧪
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-black text-amber-100">
                                    PhonePe थेट गेटवे चाचणी (₹१ पेमेंट)
                                </h1>
                                <p className="text-xs text-amber-200/80 font-medium">
                                    थेट उत्पादनात (Live Production) PhonePe पेमेंट गेटवे योग्यरित्या काम करत आहे की नाही हे तपासण्यासाठी.
                                </p>
                            </div>
                        </div>

                        <div className="self-end sm:self-auto bg-amber-400 text-amber-950 font-black px-4 py-1.5 rounded-full text-xs shadow-md flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>चाचणी शुल्क: ₹१.००</span>
                        </div>
                    </div>

                    {/* How It Works Notice */}
                    <div className="p-4 sm:p-5 bg-amber-50/70 border-b border-amber-200 text-xs sm:text-sm text-stone-700 space-y-1">
                        <p className="font-bold text-amber-950 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>तंतोतंत फॉर्मसारखे लॉजिक व व्हॅलिडेशन (Same Logic as Form):</span>
                        </p>
                        <p className="text-stone-600 pl-5">
                            येथे तुम्ही सदस्याची चाचणी माहिती भरून ₹१ चे पेमेंट PhonePe द्वारे करू शकता. डुप्लिकेट मोबाईल, इनव्हॅलिड डेटा किंवा पेमेंट अपयशी झाल्यास फॉर्मप्रमाणेच अचूक एरर दिसेल.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {submitError && (
                        <div className="mx-5 mt-5 p-4 bg-red-50 border-2 border-red-500 rounded-2xl flex items-start gap-3 text-red-900 text-xs sm:text-sm animate-in fade-in">
                            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-black text-red-950">पेमेंट प्रक्रियेत त्रुटी आली:</p>
                                <p className="mt-0.5 font-semibold">{submitError}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSubmitError("")}
                                className="text-red-700 hover:text-red-950 font-bold"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Test Form */}
                    <form onSubmit={handlePaymentSubmit} className="p-5 sm:p-7 space-y-5">

                        {/* 1. Membership Type Toggle */}
                        <div>
                            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">
                                १. चाचणी सदस्यत्व प्रकार निवडा (Test Membership Type):
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setMembershipType("PRIMARY")}
                                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                                        membershipType === "PRIMARY"
                                            ? "border-[#7A0C0C] bg-[#7A0C0C]/5 shadow-xs"
                                            : "border-stone-200 hover:border-stone-300"
                                    }`}
                                >
                                    <div>
                                        <p className="font-black text-sm text-[#7A0C0C]">प्राथमिक सदस्य (Primary Member)</p>
                                        <p className="text-[11px] text-stone-500">मूळ शुल्क: ₹१०१ • चाचणी शुल्क: ₹१</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        membershipType === "PRIMARY" ? "border-[#7A0C0C] bg-[#7A0C0C]" : "border-stone-300"
                                    }`}>
                                        {membershipType === "PRIMARY" && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMembershipType("EXECUTIVE")}
                                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                                        membershipType === "EXECUTIVE"
                                            ? "border-[#7A0C0C] bg-[#7A0C0C]/5 shadow-xs"
                                            : "border-stone-200 hover:border-stone-300"
                                    }`}
                                >
                                    <div>
                                        <p className="font-black text-sm text-[#7A0C0C]">कार्यकारिणी सदस्य (Executive Member)</p>
                                        <p className="text-[11px] text-stone-500">मूळ शुल्क: ₹१००१ • चाचणी शुल्क: ₹१</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        membershipType === "EXECUTIVE" ? "border-[#7A0C0C] bg-[#7A0C0C]" : "border-stone-300"
                                    }`}>
                                        {membershipType === "EXECUTIVE" && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* 2. Member Information */}
                        <div className="space-y-4 pt-2 border-t border-stone-200">
                            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider">
                                २. चाचणी सदस्याची माहिती (Member Details):
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full Name on First Line */}
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                                        <User className="w-3.5 h-3.5 text-stone-500" />
                                        <span>सदस्याचे पूर्ण नाव *</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="उदा. राहुल प्रकाशराव ठाकरे"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border-2 border-stone-300 focus:border-amber-600 rounded-xl text-sm font-semibold outline-none transition-all"
                                    />
                                </div>

                                {/* Mobile Number with Real-time Duplicate Check */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                                        <Phone className="w-3.5 h-3.5 text-stone-500" />
                                        <span>१० अंकी मोबाईल क्रमांक * (Duplicate Check on Blur)</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={mobileNo}
                                        maxLength={10}
                                        onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, ""))}
                                        onBlur={handleMobileBlur}
                                        placeholder="उदा. 9876543210"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-stone-50 border-2 border-stone-300 focus:border-amber-600 rounded-xl text-sm font-semibold font-mono outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Location Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-stone-500" />
                                        <span>गाव / शहर</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold outline-none focus:border-amber-600"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-700">तालुका</label>
                                    <input
                                        type="text"
                                        value={taluka}
                                        onChange={(e) => setTaluka(e.target.value)}
                                        placeholder="उदा. अमरावती"
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold outline-none focus:border-amber-600"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-700">जिल्हा</label>
                                    <input
                                        type="text"
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold outline-none focus:border-amber-600"
                                    />
                                </div>
                            </div>

                            {/* Address & Pincode */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-stone-700">पत्ता</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="उदा. राजापेठ, अमरावती"
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold outline-none focus:border-amber-600"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-700">पिनकोड</label>
                                    <input
                                        type="text"
                                        value={pincode}
                                        maxLength={6}
                                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                                        placeholder="उदा. 444601"
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold font-mono outline-none focus:border-amber-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Payment Summary & Action Button */}
                        <div className="pt-4 border-t border-stone-200 space-y-4">
                            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-300 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-600 font-bold">पेमेंट पद्धत: PhonePe PG</p>
                                        <p className="text-xs text-stone-500 font-medium">UPI, QR, डेबिट/क्रेडिट कार्ड, नेट बँकिंग</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] text-stone-500 font-bold uppercase">एकूण देय रक्कम</p>
                                    <p className="text-xl font-black text-emerald-800">₹ १.००</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 hover:brightness-110 active:scale-98 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-purple-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <span>⏳ PhonePe पेमेंट पृष्ठावर घेऊन जात आहे...</span>
                                ) : (
                                    <>
                                        <span>💳 PhonePe द्वारे ₹१ चाचणी पेमेंट करा</span>
                                        <span className="text-amber-300">➔</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[11px] text-stone-500 font-semibold">
                                🔒 हे थेट PhonePe गेटवे पेमेंट आहे. देयकानंतर अधिकृत पावती व एसएमएस पडताळणी तपासता येईल.
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* DUPLICATE MOBILE MODAL POPUP (Exact same UI & behavior as official form) */}
            {duplicateModal && duplicateModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-[#FFFDF9] border-2 border-red-600 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-center space-y-4 p-6 relative border-t-8 border-t-red-700">
                        <button
                            type="button"
                            onClick={() => setDuplicateModal(null)}
                            className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-all cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-14 h-14 mx-auto rounded-full bg-red-100 border-2 border-red-400 text-red-700 flex items-center justify-center shadow-xs">
                            <AlertTriangle className="w-7 h-7 text-red-600 animate-pulse" />
                        </div>

                        <div>
                            <h3 className="text-base sm:text-lg font-black text-red-900">
                                मोबाईल क्रमांक आधीच नोंदणीकृत आहे!
                            </h3>
                            <p className="text-xs text-stone-600 mt-0.5 font-semibold">
                                एका मोबाईल क्रमांकावर फक्त १ मुख्य सदस्याची नोंदणी करता येते.
                            </p>
                        </div>

                        <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-300 text-xs text-stone-800 space-y-1.5 text-left">
                            <div className="flex items-center justify-between">
                                <span className="text-stone-600 font-bold">नोंदवलेला मोबाईल:</span>
                                <span className="font-mono font-black text-red-900">{duplicateModal.mobileNo}</span>
                            </div>
                            {duplicateModal.memberNo && (
                                <div className="flex items-center justify-between border-t border-amber-200/80 pt-1">
                                    <span className="text-stone-600 font-bold">विद्यमान सदस्य क्र:</span>
                                    <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{duplicateModal.memberNo}</span>
                                </div>
                            )}
                            {duplicateModal.fullName && (
                                <div className="flex items-center justify-between border-t border-amber-200/80 pt-1">
                                    <span className="text-stone-600 font-bold">सदस्याचे नाव:</span>
                                    <span className="font-bold text-stone-900">{duplicateModal.fullName}</span>
                                </div>
                            )}
                        </div>

                        <p className="text-[11px] text-stone-700 font-medium bg-red-50 p-2 rounded-lg border border-red-200">
                            💡 कृपया पुढे जाण्यासाठी <strong>दुसरा १० अंकी मोबाईल क्रमांक</strong> प्रविष्ट करा.
                        </p>

                        <div className="pt-2 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setDuplicateModal(null)}
                                className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                            >
                                ठीक आहे (बदला)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
