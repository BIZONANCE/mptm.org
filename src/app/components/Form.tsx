"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface MainMember {
    srNo: number;
    memberNo: string;
    fullName: string;
    mobileNo: string;
    prabhagNo: string;
}

interface FamilyMember {
    srNo: number;
    name: string;
    relation: string;
    dob: string;
    occupation: string;
    mobile: string;
}

// Convert ordinal index to Marathi word prefix (प्राथमिक, द्वितीय, तृतीय, चतुर्थ...)
function getMemberOrdinalLabel(srNo: number): string {
    const ordinals: { [key: number]: string } = {
        1: "प्राथमिक",
        2: "द्वितीय",
        3: "तृतीय",
        4: "चतुर्थ",
        5: "पंचम",
        6: "षष्ठ",
        7: "सप्तम",
        8: "अष्टम",
        9: "नवम",
        10: "दशम",
    };
    return (ordinals[srNo] || `${srNo} वा`) + " सदस्य क्रमांक";
}

function getMemberTitle(srNo: number): string {
    const ordinals: { [key: number]: string } = {
        1: "प्राथमिक",
        2: "द्वितीय",
        3: "तृतीय",
        4: "चतुर्थ",
        5: "पंचम",
        6: "षष्ठ",
        7: "सप्तम",
        8: "अष्टम",
        9: "नवम",
        10: "दशम",
    };
    return (ordinals[srNo] || `${srNo} वा`) + " सदस्य";
}

// Convert numeric amount to Marathi words automatically for any amount
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

    return words.trim() + " रुपये फक्त";
}

export default function Form() {
    const DEFAULT_BASE_FEE = 101;
    const FULL_SANDESH_MESSAGE = "वरील रक्कम महाराष्ट्र प्रांतिक तैलिक महासभेच्या प्राथमिक सदस्य नोंदणी शुल्क म्हणून प्राप्त झाली.";

    const [baseMemberSeq, setBaseMemberSeq] = useState(1);

    const formatMemberNo = (srNo: number, baseSeq: number = baseMemberSeq) =>
        `AVA${String(baseSeq + srNo - 1).padStart(3, "0")}`;

    // Main Members list (Default 1 Main Member)
    const [mainMembers, setMainMembers] = useState<MainMember[]>([
        { srNo: 1, memberNo: "AVA001", fullName: "", mobileNo: "", prabhagNo: "" },
    ]);

    // Family Members table (Initial 3 rows default)
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
        { srNo: 1, name: "", relation: "", dob: "", occupation: "", mobile: "" },
        { srNo: 2, name: "", relation: "", dob: "", occupation: "", mobile: "" },
        { srNo: 3, name: "", relation: "", dob: "", occupation: "", mobile: "" },
    ]);

    const initialFee = DEFAULT_BASE_FEE * 1; // ₹101 by default

    const [formData, setFormData] = useState({
        receiptNo: "MPTM001",
        date: new Date().toISOString().split("T")[0],
        registrationFee: initialFee.toString(),
        address: "",
        amountInWords: convertNumberToMarathiWords(initialFee.toString()),
        paymentMethod: "रोख",
        otherPaymentMethod: "",
    });

    const [cashPaidStatus, setCashPaidStatus] = useState<"yes" | "no" | "">("");
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [screenshotError, setScreenshotError] = useState<string>("");
    const [typedMessage, setTypedMessage] = useState<string>("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccessMsg, setSubmitSuccessMsg] = useState("");
    const [submitErrorMsg, setSubmitErrorMsg] = useState("");

    const isPaymentVerified =
        (formData.paymentMethod === "रोख" && cashPaidStatus === "yes") ||
        (formData.paymentMethod === "UPI" && Boolean(paymentScreenshot));

    // Fetch unique next receipt and member numbers from Backend API
    const fetchNextNumbers = async () => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${backendUrl}/api/next-numbers`);
            const data = await res.json();

            if (data.success) {
                if (data.receiptNo) {
                    setFormData((prev) => ({ ...prev, receiptNo: data.receiptNo }));
                }
                if (data.nextMemberSeq) {
                    const startSeq = data.nextMemberSeq;
                    setBaseMemberSeq(startSeq);
                    setMainMembers((prev) =>
                        prev.map((m, idx) => ({
                            ...m,
                            memberNo: `AVA${String(startSeq + idx).padStart(3, "0")}`,
                        }))
                    );
                }
            }
        } catch (err) {
            console.error("Error fetching next sequence numbers:", err);
        }
    };

    useEffect(() => {
        fetchNextNumbers();
    }, []);

    // Typing transition effect for Sandesh (संदेश) message
    useEffect(() => {
        if (isPaymentVerified) {
            setTypedMessage("");
            let idx = 0;
            const interval = setInterval(() => {
                if (idx < FULL_SANDESH_MESSAGE.length) {
                    setTypedMessage(FULL_SANDESH_MESSAGE.slice(0, idx + 1));
                    idx++;
                } else {
                    clearInterval(interval);
                }
            }, 30);

            return () => clearInterval(interval);
        } else {
            setTypedMessage("");
        }
    }, [isPaymentVerified, paymentScreenshot, formData.paymentMethod]);

    // Dynamic fee calculation rate helper
    const getRatePerMember = (currentFeeStr: string, memberCount: number) => {
        const currentNum = parseInt(currentFeeStr, 10);
        if (!isNaN(currentNum) && currentNum > 0 && memberCount > 0) {
            return Math.round(currentNum / memberCount);
        }
        return DEFAULT_BASE_FEE;
    };

    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentScreenshot(file);
            setScreenshotError("");
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === "registrationFee") {
            setFormData((prev) => ({
                ...prev,
                registrationFee: value,
                amountInWords: convertNumberToMarathiWords(value),
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Main Member field changes
    const handleMainMemberChange = (
        index: number,
        field: keyof MainMember,
        value: string
    ) => {
        setMainMembers((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    // Add a Main Member
    const addMainMember = () => {
        setMainMembers((prev) => {
            const currentRate = getRatePerMember(formData.registrationFee, prev.length);
            const newCount = prev.length + 1;
            const newFee = newCount * currentRate;

            setFormData((f) => ({
                ...f,
                registrationFee: newFee.toString(),
                amountInWords: convertNumberToMarathiWords(newFee.toString()),
            }));

            return [
                ...prev,
                {
                    srNo: newCount,
                    memberNo: formatMemberNo(newCount, baseMemberSeq),
                    fullName: "",
                    mobileNo: "",
                    prabhagNo: "",
                },
            ];
        });
    };

    // Delete a Main Member
    const deleteMainMember = (indexToDelete: number) => {
        setMainMembers((prev) => {
            if (prev.length <= 1) return prev; // Keep at least 1 main member

            const currentRate = getRatePerMember(formData.registrationFee, prev.length);
            const updated = prev.filter((_, idx) => idx !== indexToDelete);
            const reindexed = updated.map((m, idx) => ({
                ...m,
                srNo: idx + 1,
                memberNo: formatMemberNo(idx + 1, baseMemberSeq),
            }));

            const newCount = reindexed.length;
            const newFee = newCount * currentRate;

            setFormData((f) => ({
                ...f,
                registrationFee: newFee.toString(),
                amountInWords: convertNumberToMarathiWords(newFee.toString()),
            }));

            return reindexed;
        });
    };

    // Family member field changes
    const handleFamilyMemberChange = (
        index: number,
        field: keyof FamilyMember,
        value: string
    ) => {
        setFamilyMembers((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addFamilyMemberRow = () => {
        setFamilyMembers((prev) => [
            ...prev,
            {
                srNo: prev.length + 1,
                name: "",
                relation: "",
                dob: "",
                occupation: "",
                mobile: "",
            },
        ]);
    };

    const deleteFamilyMemberRow = (indexToDelete: number) => {
        setFamilyMembers((prev) => {
            const updated = prev.filter((_, idx) => idx !== indexToDelete);
            return updated.map((member, idx) => ({ ...member, srNo: idx + 1 }));
        });
    };

    const validateFullForm = () => {
        const FILL_FORM_FIRST_MSG = "⚠️ कृपया आधी संपूर्ण फॉर्म भरा!";

        // 1. Basic Top Fields
        if (!formData.receiptNo || formData.receiptNo.trim() === "") {
            setScreenshotError(FILL_FORM_FIRST_MSG);
            return false;
        }

        if (!formData.date || formData.date.trim() === "") {
            setScreenshotError(FILL_FORM_FIRST_MSG);
            return false;
        }

        if (!formData.registrationFee || formData.registrationFee.trim() === "" || parseInt(formData.registrationFee, 10) <= 0) {
            setScreenshotError(FILL_FORM_FIRST_MSG);
            return false;
        }

        if (!formData.address || formData.address.trim() === "") {
            setScreenshotError(FILL_FORM_FIRST_MSG);
            return false;
        }

        // 2. Main Members Validation
        for (let i = 0; i < mainMembers.length; i++) {
            const m = mainMembers[i];
            if (!m.fullName || m.fullName.trim() === "" || !m.mobileNo || m.mobileNo.length !== 10 || !m.prabhagNo || m.prabhagNo.trim() === "") {
                setScreenshotError(FILL_FORM_FIRST_MSG);
                return false;
            }
        }

        // 3. Family Members Validation
        for (let i = 0; i < familyMembers.length; i++) {
            const fm = familyMembers[i];
            const hasAnyData = fm.name.trim() !== "" || fm.relation.trim() !== "" || fm.dob.trim() !== "" || fm.occupation.trim() !== "" || fm.mobile.trim() !== "";

            if (hasAnyData) {
                if (!fm.name || fm.name.trim() === "" || !fm.relation || fm.relation.trim() === "" || !fm.dob || fm.dob.trim() === "") {
                    setScreenshotError(FILL_FORM_FIRST_MSG);
                    return false;
                }
                if (fm.mobile && fm.mobile.length !== 10) {
                    setScreenshotError(FILL_FORM_FIRST_MSG);
                    return false;
                }
            }
        }

        // 4. Payment Method & Verification
        if (formData.paymentMethod === "रोख" && cashPaidStatus !== "yes") {
            setScreenshotError("⚠️ कृपया रोख रक्कम भरली गेली असल्याची (होय) निवड करा!");
            return false;
        }

        if (formData.paymentMethod === "UPI" && !paymentScreenshot) {
            setScreenshotError(
                "⚠️ ऑनलाईन देयकासाठी ट्रान्सअॅक्शनचा स्क्रीनशॉट अपलोड करणे अनिवार्य आहे!"
            );
            return false;
        }

        setScreenshotError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFullForm()) return;

        setSubmitting(true);
        setSubmitErrorMsg("");
        setSubmitSuccessMsg("");

        try {
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const response = await fetch(`${backendUrl}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    formData,
                    mainMembers,
                    familyMembers,
                    paymentScreenshot: screenshotPreview,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setSubmitSuccessMsg("✅ सदस्य नोंदणी यशस्वीरित्या जतन झाली!");
                
                // Open browser print dialog for receipt
                window.print();

                // Auto-refresh form fields for the next submission after printing
                setTimeout(async () => {
                    setFormData({
                        receiptNo: "MPTM001",
                        date: new Date().toISOString().split("T")[0],
                        registrationFee: "101",
                        address: "",
                        amountInWords: "एकशे एक रुपये फक्त",
                        paymentMethod: "रोख",
                        otherPaymentMethod: "",
                    });
                    setMainMembers([
                        {
                            srNo: 1,
                            memberNo: "AVA001",
                            fullName: "",
                            mobileNo: "",
                            prabhagNo: "",
                        },
                    ]);
                    setFamilyMembers([]);
                    setPaymentScreenshot(null);
                    setScreenshotPreview(null);
                    setCashPaidStatus("");
                    setSubmitSuccessMsg("");
                    setSubmitErrorMsg("");
                    await fetchNextNumbers();
                }, 1000);
            } else {
                setSubmitErrorMsg(result.error || "❌ डेटाबेसमध्ये जतन करताना त्रुटी आली. हा मोबाईल क्रमांक किंवा माहिती आधीच नोंदणीकृत असण्याची शक्यता आहे.");
            }
        } catch (err: unknown) {
            console.error("Submission error:", err);
            setSubmitErrorMsg("❌ सर्व्हरशी संपर्क साधताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
        } finally {
            setSubmitting(false);
        }
    };

    // Shared input styling: text-base on mobile prevents iOS auto-zoom-on-focus,
    // sm:text-sm keeps things compact on larger screens. py-2 gives a comfortable
    // 40px+ touch target on mobile, sm:py-0.5 tightens up on desktop.
    const inputBase =
        "flex-1 w-full bg-transparent border-b-2 border-stone-800 focus:border-amber-700 outline-none px-2 py-2 sm:py-0.5 text-base sm:text-sm font-semibold text-stone-900 placeholder:text-stone-400/80";
    const inputReadOnly =
        "flex-1 w-full bg-amber-100/40 border-b-2 border-stone-800 outline-none px-2 py-2 sm:py-0.5 text-base sm:text-sm font-extrabold text-stone-900 cursor-not-allowed select-none";

    return (
        <div className="w-full max-w-5xl mx-auto my-4 sm:my-8 px-3 sm:px-4 font-sans print:my-0 print:p-0 print-page-wrapper">
            {/* Receipt Card Container */}
            <div className="bg-[#FFFDF9] border-2 border-amber-800/40 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden print:border-amber-800/60 print:shadow-none print:rounded-xl">

                <form onSubmit={handleSubmit}>
                    {/* Wrap in Table for repeating print header on Page 2+ */}
                    <table className="w-full border-collapse">
                        <thead className="print-header-group">
                            <tr>
                                <th className="p-0 font-normal border-none text-left">
                                    {/* Header Title Banner */}
                                    <div className="bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-white py-3 px-3 sm:px-6 relative flex items-center justify-between border-b-2 border-amber-400 print:py-2">
                                        {/* Left Decorative Motif */}
                                        <div className="hidden sm:flex items-center gap-1 text-amber-400 text-lg font-bold">
                                            <span>❖</span>
                                            <span className="w-6 h-[2px] bg-amber-400"></span>
                                        </div>

                                        {/* Center Title Box matching physical reference receipt */}
                                        <div className="text-center mx-auto space-y-0.5">
                                            <p className="text-[11px] sm:text-sm font-bold text-amber-400">
                                                ❖ जय संताजी ❖
                                            </p>
                                            <h2 className="text-base sm:text-2xl font-black text-amber-200 drop-shadow-md leading-tight">
                                                महाराष्ट्र प्रांतिक तैलिक महासभा
                                            </h2>
                                            <p className="text-[11px] sm:text-sm text-sky-200 font-bold">
                                                अमरावती विभाग, अमरावती.
                                            </p>
                                            <div className="inline-block mt-1">
                                                <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-[10px] sm:text-sm px-3 sm:px-4 py-0.5 rounded-full border border-amber-400 shadow-xs">
                                                    प्राथमिक सदस्य नोंदणी पावती
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Decorative Motif */}
                                        <div className="hidden sm:flex items-center gap-1 text-amber-400 text-lg font-bold">
                                            <span className="w-6 h-[2px] bg-amber-400"></span>
                                            <span>❖</span>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className="p-0 border-none">
                                    {/* Receipt Body */}
                                    <div className="p-3 sm:p-6 space-y-4 text-stone-900 print:p-4 print:space-y-3">

                                        {/* Top Row: Receipt No, Date, & Total Registration Fee */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 rounded-xl bg-amber-50/60 border border-amber-300/60 print:p-2 print:gap-3">
                                            <div className="flex items-center gap-2">
                                                <label className="font-bold text-stone-800 whitespace-nowrap text-sm sm:text-base">
                                                    पावती क्र. :
                                                </label>
                                                <input
                                                    type="text"
                                                    name="receiptNo"
                                                    value={formData.receiptNo}
                                                    readOnly
                                                    className={inputReadOnly}
                                                />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label className="font-bold text-stone-800 whitespace-nowrap text-sm sm:text-base">
                                                    दिनांक :
                                                </label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    required
                                                    className={inputBase}
                                                />
                                            </div>

                                            {/* Registration Fee Input */}
                                            <div className="flex items-center gap-2">
                                                <label className="font-bold text-stone-800 whitespace-nowrap text-sm sm:text-base">
                                                    नोंदणी शुल्क: रु.
                                                </label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    name="registrationFee"
                                                    value={formData.registrationFee}
                                                    onChange={handleChange}
                                                    required
                                                    className={`${inputBase} font-extrabold text-[#7A0C0C]`}
                                                />
                                            </div>
                                        </div>

                                        {/* MAIN MEMBERS SECTION (मुख्य सदस्य माहिती) */}
                                        <div className="space-y-3 sm:space-y-4 print:space-y-2">
                                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-300 pb-1.5 print:pb-1">
                                                <h3 className="text-sm sm:text-lg font-extrabold text-amber-950 flex items-center gap-2">
                                                    <span>👤 मुख्य सदस्य माहिती</span>
                                                    <span className="text-[10px] sm:text-xs font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
                                                        एकूण: {mainMembers.length}
                                                    </span>
                                                </h3>

                                                {/* Add Main Member Button */}
                                                <button
                                                    type="button"
                                                    onClick={addMainMember}
                                                    className="min-h-[40px] text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 border border-amber-500 px-3.5 py-2 sm:py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 transform active:scale-[0.98] sm:hover:scale-[1.02] print:hidden"
                                                >
                                                    <span>➕ मुख्य सदस्य जोडा</span>
                                                </button>
                                            </div>

                                            {/* List of Main Members */}
                                            {mainMembers.map((member, index) => (
                                                <div
                                                    key={index}
                                                    className="p-3 sm:p-4 rounded-xl bg-white border-2 border-amber-700/30 shadow-xs relative space-y-3 print:p-2.5 print:space-y-2"
                                                >
                                                    {/* Header line for each Main Member */}
                                                    <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 print:pb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-5 h-5 rounded-full bg-[#7A0C0C] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                                {member.srNo}
                                                            </span>
                                                            <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                                                                {getMemberTitle(member.srNo)} माहिती
                                                            </h4>
                                                        </div>

                                                        {/* Delete Main Member Button */}
                                                        {mainMembers.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteMainMember(index)}
                                                                className="min-h-[36px] text-xs font-bold text-red-600 hover:text-white hover:bg-red-700 active:bg-red-700 px-2.5 py-1.5 rounded-lg border border-red-300 transition-all flex items-center gap-1 print:hidden"
                                                            >
                                                                <span>🗑️ हटवा</span>
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Member Fields Grid */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:gap-2">
                                                        {/* Dynamic Member ID Label: प्राथमिक सदस्य क्रमांक, द्वितीय सदस्य क्रमांक, तृतीय... */}
                                                        <div className="flex items-center gap-2">
                                                            <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                                {getMemberOrdinalLabel(member.srNo)} :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={member.memberNo}
                                                                readOnly
                                                                className={inputReadOnly}
                                                            />
                                                        </div>

                                                        {/* Prabhag No */}
                                                        <div className="flex items-center gap-2">
                                                            <label className="font-bold text-red-700 whitespace-nowrap text-xs sm:text-sm">
                                                                प्रभाग क्रमांक :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={member.prabhagNo}
                                                                onChange={(e) =>
                                                                    handleMainMemberChange(index, "prabhagNo", e.target.value)
                                                                }
                                                                placeholder="प्रभाग किंवा वॉर्ड क्रमांक"
                                                                className={inputBase}
                                                            />
                                                        </div>

                                                        {/* Member Full Name */}
                                                        <div className="flex items-center gap-2">
                                                            <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                                सदस्याचे पूर्णनाव :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={member.fullName}
                                                                onChange={(e) =>
                                                                    handleMainMemberChange(index, "fullName", e.target.value)
                                                                }
                                                                required
                                                                placeholder="मुख्य सदस्याचे पूर्ण नाव"
                                                                className={inputBase}
                                                            />
                                                        </div>

                                                        {/* Mobile Number */}
                                                        <div className="flex items-center gap-2">
                                                            <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                                मोबाईल क्रमांक :
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                value={member.mobileNo}
                                                                onChange={(e) => {
                                                                    const cleanVal = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                                    handleMainMemberChange(index, "mobileNo", cleanVal);
                                                                }}
                                                                required
                                                                maxLength={10}
                                                                pattern="[0-9]{10}"
                                                                inputMode="numeric"
                                                                placeholder="१० अंकी मोबाईल नंबर"
                                                                className={inputBase}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Common Address Field */}
                                        <div className="flex items-center gap-2">
                                            <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                पत्ता :
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                placeholder="रहिवासी पत्ता प्रविष्ट करा"
                                                className={inputBase}
                                            />
                                        </div>

                                        {/* FAMILY MEMBERS SECTION - Wrapped together so heading never separates from content */}
                                        <div className="my-4 space-y-2 print:my-2 family-table-section">
                                            {/* Section Header Banner Capsule */}
                                            <div className="flex flex-wrap items-center justify-center gap-2 my-2 print:my-1">
                                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-amber-300 py-1 px-4 sm:px-5 rounded-full border-2 border-amber-400/80 shadow-md">
                                                    <span className="text-amber-400 text-xs font-bold">❖</span>
                                                    <h3 className="text-xs sm:text-sm font-extrabold tracking-wide text-amber-200 whitespace-nowrap">
                                                        कौटुंबिक सदस्यांची माहिती
                                                    </h3>
                                                    <span className="text-amber-400 text-xs font-bold">❖</span>
                                                </div>
                                            </div>

                                            {/* MOBILE VIEW: stacked cards (comfortable for small screens, no horizontal scrolling) */}
                                            <div className="md:hidden space-y-3 print:hidden">
                                                {familyMembers.length === 0 && (
                                                    <p className="text-center text-xs text-stone-500 italic py-2">
                                                        सध्या कोणतेही कौटुंबिक सदस्य जोडलेले नाहीत.
                                                    </p>
                                                )}
                                                {familyMembers.map((member, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-3 rounded-xl bg-white border-2 border-amber-700/25 shadow-xs space-y-2.5"
                                                    >
                                                        <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-5 h-5 rounded-full bg-[#6B0D0D] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                                    {member.srNo}
                                                                </span>
                                                                <h4 className="font-bold text-stone-900 text-sm">
                                                                    कौटुंबिक सदस्य {member.srNo}
                                                                </h4>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteFamilyMemberRow(index)}
                                                                title="कौटुंबिक सदस्य हटवा"
                                                                className="min-h-[36px] px-2.5 py-1.5 rounded-lg border border-red-300 text-red-600 hover:text-white hover:bg-red-700 active:bg-red-700 transition-all text-xs font-bold flex items-center gap-1"
                                                            >
                                                                <span>🗑️ हटवा</span>
                                                            </button>
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-2.5">
                                                            <div className="flex items-center gap-2">
                                                                <label className="font-bold text-stone-700 whitespace-nowrap text-xs w-20 flex-shrink-0">
                                                                    नाव :
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={member.name}
                                                                    onChange={(e) =>
                                                                        handleFamilyMemberChange(index, "name", e.target.value)
                                                                    }
                                                                    placeholder="सदस्याचे नाव"
                                                                    className={inputBase}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <label className="font-bold text-stone-700 whitespace-nowrap text-xs w-20 flex-shrink-0">
                                                                    नाते :
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={member.relation}
                                                                    onChange={(e) =>
                                                                        handleFamilyMemberChange(index, "relation", e.target.value)
                                                                    }
                                                                    placeholder="उदा. पत्नी/मुलगा"
                                                                    className={inputBase}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <label className="font-bold text-stone-700 whitespace-nowrap text-xs w-20 flex-shrink-0">
                                                                    जन्म दि. :
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    value={member.dob}
                                                                    onChange={(e) =>
                                                                        handleFamilyMemberChange(index, "dob", e.target.value)
                                                                    }
                                                                    className={inputBase}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <label className="font-bold text-stone-700 whitespace-nowrap text-xs w-20 flex-shrink-0">
                                                                    व्यवसाय :
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={member.occupation}
                                                                    onChange={(e) =>
                                                                        handleFamilyMemberChange(index, "occupation", e.target.value)
                                                                    }
                                                                    placeholder="उदा. नोकरी / शिक्षण"
                                                                    className={inputBase}
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <label className="font-bold text-stone-700 whitespace-nowrap text-xs w-20 flex-shrink-0">
                                                                    मोबाईल :
                                                                </label>
                                                                <input
                                                                    type="tel"
                                                                    value={member.mobile}
                                                                    onChange={(e) => {
                                                                        const cleanVal = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                                        handleFamilyMemberChange(index, "mobile", cleanVal);
                                                                    }}
                                                                    maxLength={10}
                                                                    pattern="[0-9]{10}"
                                                                    inputMode="numeric"
                                                                    placeholder="१० अंकी मोबाईल"
                                                                    className={inputBase}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* DESKTOP / TABLET / PRINT VIEW: table layout */}
                                            <div className="hidden md:block overflow-x-auto rounded-lg border-2 border-amber-700/40 shadow-xs print:block">
                                                <table className="w-full text-left border-collapse min-w-[650px] print:min-w-full">
                                                    <thead>
                                                        <tr className="bg-[#6B0D0D] text-white text-xs font-bold text-center border-b border-amber-600">
                                                            <th className="py-1.5 px-2 border-r border-amber-700/60 w-10">अ. क्र.</th>
                                                            <th className="py-1.5 px-3 border-r border-amber-700/60">नाव</th>
                                                            <th className="py-1.5 px-3 border-r border-amber-700/60">नाते</th>
                                                            <th className="py-1.5 px-3 border-r border-amber-700/60">जन्म दिनांक</th>
                                                            <th className="py-1.5 px-3 border-r border-amber-700/60">व्यवसाय / शिक्षण</th>
                                                            <th className="py-1.5 px-3 border-r border-amber-700/60">मोबाईल क्रमांक</th>
                                                            <th className="py-1.5 px-2 print:hidden w-14 text-center">हटवा</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-amber-800/30 text-stone-900 bg-white">
                                                        {familyMembers.map((member, index) => (
                                                            <tr key={index} className="hover:bg-amber-50/50 transition-colors">
                                                                {/* Sr. No */}
                                                                <td className="py-1 px-2 text-center font-bold text-stone-800 border-r border-amber-800/30 text-xs">
                                                                    {member.srNo}.
                                                                </td>

                                                                {/* Name */}
                                                                <td className="py-0.5 px-2 border-r border-amber-800/30">
                                                                    <input
                                                                        type="text"
                                                                        value={member.name}
                                                                        onChange={(e) =>
                                                                            handleFamilyMemberChange(index, "name", e.target.value)
                                                                        }
                                                                        placeholder="सदस्याचे नाव"
                                                                        className="w-full bg-transparent outline-none px-1 py-0.5 text-xs font-medium text-stone-900 focus:bg-amber-50 rounded"
                                                                    />
                                                                </td>

                                                                {/* Relation */}
                                                                <td className="py-0.5 px-2 border-r border-amber-800/30">
                                                                    <input
                                                                        type="text"
                                                                        value={member.relation}
                                                                        onChange={(e) =>
                                                                            handleFamilyMemberChange(index, "relation", e.target.value)
                                                                        }
                                                                        placeholder="उदा. पत्नी/मुलगा"
                                                                        className="w-full bg-transparent outline-none px-1 py-0.5 text-xs font-medium text-stone-900 focus:bg-amber-50 rounded"
                                                                    />
                                                                </td>

                                                                {/* Date of Birth */}
                                                                <td className="py-0.5 px-2 border-r border-amber-800/30">
                                                                    <input
                                                                        type="date"
                                                                        value={member.dob}
                                                                        onChange={(e) =>
                                                                            handleFamilyMemberChange(index, "dob", e.target.value)
                                                                        }
                                                                        className="w-full bg-transparent outline-none px-1 py-0.5 text-xs font-medium text-stone-900 focus:bg-amber-50 rounded cursor-pointer"
                                                                    />
                                                                </td>

                                                                {/* Occupation / Education */}
                                                                <td className="py-0.5 px-2 border-r border-amber-800/30">
                                                                    <input
                                                                        type="text"
                                                                        value={member.occupation}
                                                                        onChange={(e) =>
                                                                            handleFamilyMemberChange(index, "occupation", e.target.value)
                                                                        }
                                                                        placeholder="उदा. नोकरी / शिक्षण"
                                                                        className="w-full bg-transparent outline-none px-1 py-0.5 text-xs font-medium text-stone-900 focus:bg-amber-50 rounded"
                                                                    />
                                                                </td>

                                                                {/* Mobile Number */}
                                                                <td className="py-0.5 px-2 border-r border-amber-800/30">
                                                                    <input
                                                                        type="tel"
                                                                        value={member.mobile}
                                                                        onChange={(e) => {
                                                                            const cleanVal = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                                            handleFamilyMemberChange(index, "mobile", cleanVal);
                                                                        }}
                                                                        maxLength={10}
                                                                        pattern="[0-9]{10}"
                                                                        inputMode="numeric"
                                                                        placeholder="१० अंकी मोबाईल"
                                                                        className="w-full bg-transparent outline-none px-1 py-0.5 text-xs font-medium text-stone-900 focus:bg-amber-50 rounded"
                                                                    />
                                                                </td>

                                                                {/* Delete Family Member Row Button */}
                                                                <td className="py-0.5 px-2 text-center print:hidden">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => deleteFamilyMemberRow(index)}
                                                                        title="कौटुंबिक सदस्य ओळ हटवा"
                                                                        className="p-1 rounded text-red-600 hover:text-white hover:bg-red-700 transition-all text-xs font-bold"
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Add More Family Member Row Button */}
                                            <div className="flex justify-center sm:justify-end print:hidden">
                                                <button
                                                    type="button"
                                                    onClick={addFamilyMemberRow}
                                                    className="min-h-[40px] w-full sm:w-auto justify-center text-xs sm:text-sm font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 active:bg-amber-200 border border-amber-400 px-3 py-2 sm:py-1 rounded-lg shadow-xs transition-all flex items-center gap-1"
                                                >
                                                    <span>+ कौटुंबिक सदस्य जोडा</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Amount in Words */}
                                        <div className="flex items-center gap-2">
                                            <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                रक्कम अक्षरी :
                                            </label>
                                            <input
                                                type="text"
                                                name="amountInWords"
                                                value={formData.amountInWords}
                                                onChange={handleChange}
                                                required
                                                placeholder="उदा. एकशे एक रुपये फक्त"
                                                className={`${inputBase} font-extrabold text-[#7A0C0C]`}
                                            />
                                        </div>

                                        {/* Payment Method Selection & Print Only Styling */}
                                        <div className="space-y-3 pt-1">
                                            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 p-3 rounded-xl bg-amber-50/80 border border-amber-300/80 print:p-2">
                                                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
                                                    <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                        देयक पद्धत :
                                                    </label>

                                                    <div className="flex items-center gap-6 text-stone-900 font-semibold text-sm sm:text-sm">
                                                        <label className="flex items-center gap-1.5 cursor-pointer min-h-[36px]">
                                                            <input
                                                                type="radio"
                                                                name="paymentMethod"
                                                                value="रोख"
                                                                checked={formData.paymentMethod === "रोख"}
                                                                onChange={handleChange}
                                                                className="w-4 h-4 sm:w-3.5 sm:h-3.5 accent-amber-800"
                                                            />
                                                            <span>रोख</span>
                                                        </label>

                                                        <label className="flex items-center gap-1.5 cursor-pointer min-h-[36px]">
                                                            <input
                                                                type="radio"
                                                                name="paymentMethod"
                                                                value="UPI"
                                                                checked={formData.paymentMethod === "UPI"}
                                                                onChange={handleChange}
                                                                className="w-4 h-4 sm:w-3.5 sm:h-3.5 accent-amber-800"
                                                            />
                                                            <span>UPI</span>
                                                        </label>
                                                    </div>

                                                    {/* Cash Paid Yes / No Radio Buttons for web view */}
                                                    {formData.paymentMethod === "रोख" && (
                                                        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 bg-white px-3 py-2 sm:py-1 rounded-lg border border-amber-400 shadow-xs text-xs font-extrabold text-stone-900 print:hidden">
                                                            <span>💵 रोख रक्कम भरली गेली का? :</span>
                                                            <div className="flex items-center gap-3">
                                                                <label className="flex items-center gap-1 cursor-pointer hover:text-emerald-700 min-h-[32px]">
                                                                    <input
                                                                        type="radio"
                                                                        name="cashPaidStatus"
                                                                        value="yes"
                                                                        checked={cashPaidStatus === "yes"}
                                                                        onChange={() => setCashPaidStatus("yes")}
                                                                        className="w-4 h-4 sm:w-3.5 sm:h-3.5 accent-emerald-700 cursor-pointer"
                                                                    />
                                                                    <span className="text-emerald-800 font-bold">होय (Yes)</span>
                                                                </label>
                                                                <label className="flex items-center gap-1 cursor-pointer hover:text-red-700 min-h-[32px]">
                                                                    <input
                                                                        type="radio"
                                                                        name="cashPaidStatus"
                                                                        value="no"
                                                                        checked={cashPaidStatus === "no"}
                                                                        onChange={() => setCashPaidStatus("no")}
                                                                        className="w-4 h-4 sm:w-3.5 sm:h-3.5 accent-red-700 cursor-pointer"
                                                                    />
                                                                    <span className="text-red-700 font-bold">नाही (No)</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Payment Received Status Confirmation Badge */}
                                                {isPaymentVerified && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 sm:py-1 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-extrabold shadow-xs">
                                                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">✓</span>
                                                        <span>रक्कम रु. {formData.registrationFee} प्राप्त झाली (Payment Received)</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Interactive Payment Container for Web View (QR code + upload for screen view, hidden on print/PDF) */}
                                            {formData.paymentMethod === "UPI" && (
                                                <div className="mt-3 p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-500/60 shadow-lg max-w-sm mx-auto text-center space-y-3 print:hidden">
                                                    <p className="text-xs font-bold text-amber-950 flex items-center justify-center gap-1.5">
                                                        <span>📲</span>
                                                        <span>PhonePe / UPI द्वारे QR कोड स्कॅन करून ऑनलाईन पेमेंट करा</span>
                                                    </p>
                                                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-white p-2 rounded-2xl border-2 border-amber-300 shadow-md">
                                                        <Image
                                                            src="/QR.jpeg"
                                                            alt="PhonePe Payment QR Code"
                                                            fill
                                                            className="object-contain p-1 rounded-xl"
                                                        />
                                                    </div>
                                                    <div className="pt-1 border-t border-amber-200">
                                                        <p className="text-xs font-bold text-stone-800">
                                                            एकूण भरणा शुल्क: <span className="font-extrabold text-[#7A0C0C] text-sm">₹{formData.registrationFee}</span>
                                                        </p>
                                                        <p className="text-[10px] font-semibold text-stone-600 mt-0.5">
                                                            (Rajas Balkrushna Gulwade)
                                                        </p>
                                                    </div>

                                                    {/* Upload Transaction Screenshot Section */}
                                                    <div className="pt-2 border-t border-amber-300/80 space-y-1.5 text-left">
                                                        <label className="block text-xs font-extrabold text-stone-900">
                                                            पेमेंट स्क्रीनशॉट अपलोड करा : <span className="text-red-600">*</span>
                                                        </label>

                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 bg-white p-1.5 rounded-xl border-2 border-amber-400 shadow-xs">
                                                                <label
                                                                    htmlFor="screenshot-upload"
                                                                    className="min-h-[40px] bg-[#7A0C0C] hover:bg-[#5c0808] active:bg-[#5c0808] text-amber-200 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-all whitespace-nowrap flex items-center gap-1 shadow-xs"
                                                                >
                                                                    <span>📂</span>
                                                                    <span>Choose File (फाईल निवडा)</span>
                                                                </label>
                                                                <span className="text-[11px] font-semibold text-stone-700 truncate flex-1">
                                                                    {paymentScreenshot ? paymentScreenshot.name : "कोणतीही फाईल निवडली नाही (No file chosen)"}
                                                                </span>
                                                            </div>

                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                id="screenshot-upload"
                                                                onChange={handleScreenshotChange}
                                                                className="hidden"
                                                            />

                                                            {/* Screenshot Preview Card */}
                                                            {screenshotPreview && (
                                                                <div className="relative w-full p-2 bg-emerald-50 rounded-xl border border-emerald-400 shadow-xs flex items-center gap-3 mt-1">
                                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-emerald-300 flex-shrink-0">
                                                                        <img
                                                                            src={screenshotPreview}
                                                                            alt="Payment Screenshot Preview"
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800">
                                                                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold flex-shrink-0">✓</span>
                                                                            <span>स्क्रीनशॉट जोडला गेला</span>
                                                                        </div>
                                                                        <p className="text-[11px] text-stone-600 truncate mt-0.5 font-medium">
                                                                            {paymentScreenshot?.name}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Error Message if Screenshot is missing */}
                                            {screenshotError && (
                                                <div className="p-2.5 rounded-xl bg-red-100 border border-red-400 text-red-900 font-bold text-center text-xs print:hidden">
                                                    {screenshotError}
                                                </div>
                                            )}
                                        </div>

                                        {/* Sandesh (Message) Box with Typing Animation on verification */}
                                        {isPaymentVerified && (
                                            <div className="mt-4 p-3 rounded-xl bg-amber-50/90 border-2 border-amber-600/40 text-stone-900 shadow-xs print:p-2">
                                                <p className="text-xs sm:text-sm leading-relaxed font-semibold flex items-start gap-2">
                                                    <span className="font-extrabold text-red-700 whitespace-nowrap">
                                                        संदेश :
                                                    </span>
                                                    <span className="text-stone-900 font-extrabold">
                                                        {typedMessage}
                                                        {typedMessage.length < FULL_SANDESH_MESSAGE.length && (
                                                            <span className="inline-block w-1.5 h-3.5 bg-amber-800 ml-1 animate-pulse print:hidden" />
                                                        )}
                                                    </span>
                                                </p>
                                            </div>
                                        )}

                                        {/* Footer Official Proof Notice */}
                                        <div className="hidden print:block text-center pt-2 border-t border-amber-200 mt-2">
                                            <p className="text-[11px] font-extrabold text-[#7A0C0C]">
                                                ही पावती सदस्य नोंदणीचा अधिकृत पुरावा म्हणून जतन करावी.
                                            </p>
                                        </div>

                                        {/* Submitted Alert Message & Database Feedback */}
                                        {submitSuccessMsg && (
                                            <div className="p-3.5 rounded-xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold text-center text-xs sm:text-sm print:hidden shadow-sm">
                                                {submitSuccessMsg}
                                            </div>
                                        )}

                                        {submitErrorMsg && (
                                            <div className="p-3.5 rounded-xl bg-red-100 border-2 border-red-500 text-red-950 font-bold text-center text-xs sm:text-sm print:hidden shadow-sm">
                                                {submitErrorMsg}
                                            </div>
                                        )}

                                        {/* Action Button — Single Combined Submit & Print Button */}
                                        <div className="flex items-center justify-center pt-2 print:hidden">
                                            <button
                                                type="submit"
                                                disabled={submitting || (formData.paymentMethod === "UPI" && !paymentScreenshot)}
                                                className={`min-h-[50px] w-full sm:w-auto px-8 py-3.5 rounded-full font-extrabold text-white shadow-xl transition-all transform active:scale-[0.98] sm:hover:-translate-y-0.5 text-base sm:text-lg flex items-center justify-center gap-2 ${submitting || (formData.paymentMethod === "UPI" && !paymentScreenshot)
                                                    ? "bg-stone-400 cursor-not-allowed opacity-80"
                                                    : "bg-gradient-to-r from-[#4A0404] via-[#7A0C0C] to-[#4A0404] hover:brightness-110 hover:shadow-red-900/40 border border-amber-500/40"
                                                    }`}
                                            >
                                                {submitting ? (
                                                    <span>⏳ जतन होत आहे...</span>
                                                ) : (
                                                    <>
                                                        <span>अर्ज सबमिट करा व पावती प्रिंट काढा</span>
                                                        <span>🖨️</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    );
}