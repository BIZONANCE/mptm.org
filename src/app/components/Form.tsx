"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AlertTriangle, Phone, X } from "lucide-react";
import { getDistrictOptions, getCityOptions } from "@/utils/locationData";
import { getApiUrl } from "@/utils/config";

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

function formatDateToDDMMYYYY(dateInput: string | Date | null | undefined): string {
    if (!dateInput) return "";

    if (dateInput instanceof Date) {
        if (isNaN(dateInput.getTime())) return "";
        const day = String(dateInput.getDate()).padStart(2, "0");
        const month = String(dateInput.getMonth() + 1).padStart(2, "0");
        const year = dateInput.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const str = String(dateInput).trim();
    if (!str) return "";

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        return str;
    }

    const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (isoMatch) {
        const [, yyyy, mm, dd] = isoMatch;
        return `${dd.padStart(2, "0")}/${mm.padStart(2, "0")}/${yyyy}`;
    }

    const dashMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dashMatch) {
        const [, dd, mm, yyyy] = dashMatch;
        return `${dd.padStart(2, "0")}/${mm.padStart(2, "0")}/${yyyy}`;
    }

    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return str;
}

function extractYear(dateStr?: string): number {
    if (!dateStr) return new Date().getFullYear();
    const str = dateStr.trim();
    const match = str.match(/\b(20\d{2}|19\d{2})\b/);
    if (match) {
        return parseInt(match[1], 10);
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        return d.getFullYear();
    }
    return new Date().getFullYear();
}

function formatReceiptNo(seq: number, dateStr?: string, isExec: boolean = false): string {
    if (isExec) {
        return `MPTM-EM-R${String(seq).padStart(3, "0")}`;
    }
    const year = extractYear(dateStr);
    return `MPTM-${year}-AMT-R${String(seq).padStart(3, "0")}`;
}

interface FormProps {
    initialMembershipType?: "PRIMARY" | "EXECUTIVE";
}

export default function Form({ initialMembershipType = "PRIMARY" }: FormProps = {}) {
    const DEFAULT_BASE_FEE = 101;
    const getFullSandeshMessage = (type: "PRIMARY" | "EXECUTIVE") =>
        type === "EXECUTIVE"
            ? "वरील रक्कम महाराष्ट्र प्रांतिक तैलिक महासभेच्या कार्यकारिणी सदस्य नोंदणी शुल्क म्हणून प्राप्त झाली."
            : "वरील रक्कम महाराष्ट्र प्रांतिक तैलिक महासभेच्या प्राथमिक सदस्य नोंदणी शुल्क म्हणून प्राप्त झाली.";

    // One unique idempotency key per form session
    const [idempotencyKey] = useState<string>(() => {
        if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
            return window.crypto.randomUUID();
        }
        return "reg_" + Math.random().toString(36).substring(2) + Date.now();
    });

    // Referral link tracking & initial membership type handling
    const [referredBy, setReferredBy] = useState<string>("");
    const [membershipType, setMembershipType] = useState<"PRIMARY" | "EXECUTIVE">(initialMembershipType);

    const SERVER_ASSIGNED_PLACEHOLDER = "MPTM-2026-AMT-R*****";

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const refParam = params.get("ref");
            const typeParam = params.get("type");

            if (refParam && refParam.trim()) {
                setReferredBy(refParam.trim());
            }

            if (initialMembershipType === "EXECUTIVE" || typeParam === "EXECUTIVE" || typeParam === "EXECUTIVE_MEMBER") {
                setMembershipType("EXECUTIVE");
                setFormData((prev) => ({
                    ...prev,
                    receiptNo: initialMembershipType === "EXECUTIVE" ? "MPTM-EM-R*****" : "MPTM-2026-AMT-R*****",
                    registrationFee: "1001",
                    amountInWords: convertNumberToMarathiWords("1001"),
                }));
            }
        }
    }, [initialMembershipType]);

    // Main Members list (Default 1 Main Member)
    const [mainMembers, setMainMembers] = useState<MainMember[]>([
        { srNo: 1, memberNo: SERVER_ASSIGNED_PLACEHOLDER, fullName: "", mobileNo: "", prabhagNo: "" },
    ]);

    // Family Members table (Initial 1 row default)
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
        { srNo: 1, name: "", relation: "", dob: "", occupation: "", mobile: "" },
    ]);

    const initialFee = membershipType === "EXECUTIVE" ? 1001 : DEFAULT_BASE_FEE * 1;

    const [formData, setFormData] = useState({
        receiptNo: membershipType === "EXECUTIVE" ? "MPTM-EM-R*****" : "MPTM-2026-AMT-R*****",
        date: formatDateToDDMMYYYY(new Date()),
        registrationFee: initialFee.toString(),
        address: "",
        gaav: "",
        taluka: "",
        city: "अमरावती",
        district: "अमरावती",
        state: "महाराष्ट्र",
        country: "भारत",
        pincode: "",
        amountInWords: convertNumberToMarathiWords(initialFee.toString()),
        paymentMethod: "ONLINE_PHONEPE",
        otherPaymentMethod: "",
    });

    const calculateFee = (type: "PRIMARY" | "EXECUTIVE", count: number) => {
        return type === "EXECUTIVE" ? 1001 : DEFAULT_BASE_FEE * count;
    };

    const handleMembershipTypeChange = (type: "PRIMARY" | "EXECUTIVE") => {
        setMembershipType(type);
        const fee = calculateFee(type, mainMembers.length);
        setFormData((prev) => ({
            ...prev,
            receiptNo: SERVER_ASSIGNED_PLACEHOLDER,
            registrationFee: fee.toString(),
            amountInWords: convertNumberToMarathiWords(fee.toString()),
        }));
    };

    const [submitting, setSubmitting] = useState(false);
    const [submitSuccessMsg, setSubmitSuccessMsg] = useState("");
    const [submitErrorMsg, setSubmitErrorMsg] = useState("");

    interface DuplicateModalState {
        open: boolean;
        mobileNo: string;
        memberNo?: string;
        fullName?: string;
        memberIndex?: number;
    }
    const [duplicateModal, setDuplicateModal] = useState<DuplicateModalState | null>(null);

    const API_URL = getApiUrl() || "http://localhost:5015";

    const handleMainMobileBlur = async (index: number) => {
        const mob = mainMembers[index]?.mobileNo?.trim();
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
                        memberIndex: index,
                    });
                }
            } catch (_) {
                // Ignore blur check network errors
            }
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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

    const addMainMember = () => {
        setMainMembers((prev) => {
            if (prev.length >= 10) {
                setSubmitErrorMsg("एका वेळी जास्तीत जास्त १० मुख्य सदस्यांची नोंदणी करता येते.");
                return prev;
            }
            const newCount = prev.length + 1;
            const newFee = calculateFee(membershipType, newCount);

            setFormData((f) => ({
                ...f,
                registrationFee: newFee.toString(),
                amountInWords: convertNumberToMarathiWords(newFee.toString()),
            }));

            return [
                ...prev,
                {
                    srNo: newCount,
                    memberNo: SERVER_ASSIGNED_PLACEHOLDER,
                    fullName: "",
                    mobileNo: "",
                    prabhagNo: "",
                },
            ];
        });
    };

    const deleteMainMember = (indexToDelete: number) => {
        setMainMembers((prev) => {
            if (prev.length <= 1) return prev;

            const updated = prev.filter((_, idx) => idx !== indexToDelete);
            const reindexed = updated.map((m, idx) => ({
                ...m,
                srNo: idx + 1,
                memberNo: SERVER_ASSIGNED_PLACEHOLDER,
            }));

            const newCount = reindexed.length;
            const newFee = calculateFee(membershipType, newCount);

            setFormData((f) => ({
                ...f,
                registrationFee: newFee.toString(),
                amountInWords: convertNumberToMarathiWords(newFee.toString()),
            }));

            return reindexed;
        });
    };

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
        setFamilyMembers((prev) => {
            if (prev.length >= 20) {
                setSubmitErrorMsg("एका वेळी जास्तीत जास्त २० कौटुंबिक सदस्यांची नोंदणी करता येते.");
                return prev;
            }
            return [
                ...prev,
                {
                    srNo: prev.length + 1,
                    name: "",
                    relation: "",
                    dob: "",
                    occupation: "",
                    mobile: "",
                },
            ];
        });
    };

    const deleteFamilyMemberRow = (indexToDelete: number) => {
        setFamilyMembers((prev) => {
            const updated = prev.filter((_, idx) => idx !== indexToDelete);
            return updated.map((member, idx) => ({ ...member, srNo: idx + 1 }));
        });
    };

    const validateFullForm = () => {
        setSubmitErrorMsg("");

        if (!formData.address || formData.address.trim() === "") {
            setSubmitErrorMsg("⚠️ कृपया पत्ता प्रविष्ट करा!");
            return false;
        }

        if (!formData.city || formData.city.trim() === "") {
            setSubmitErrorMsg("⚠️ कृपया शहर प्रविष्ट करा!");
            return false;
        }

        if (!formData.district || formData.district.trim() === "") {
            setSubmitErrorMsg("⚠️ कृपया जिल्हा प्रविष्ट करा!");
            return false;
        }

        if (formData.pincode && formData.pincode.trim() !== "" && !/^\d{6}$/.test(formData.pincode.trim())) {
            setSubmitErrorMsg("⚠️ पिनकोड ६ अंकी असावा!");
            return false;
        }

        for (let i = 0; i < mainMembers.length; i++) {
            const m = mainMembers[i];
            if (!m.fullName || m.fullName.trim() === "") {
                setSubmitErrorMsg(`⚠️ मुख्य सदस्य #${i + 1} चे पूर्ण नाव आवश्यक आहे!`);
                return false;
            }
            if (!m.mobileNo || !/^\d{10}$/.test(m.mobileNo.trim())) {
                setSubmitErrorMsg(`⚠️ मुख्य सदस्य #${i + 1} चा मोबाईल क्रमांक १० अंकी असावा!`);
                return false;
            }
            if (!m.prabhagNo || m.prabhagNo.trim() === "") {
                setSubmitErrorMsg(`⚠️ मुख्य सदस्य #${i + 1} चा प्रभाग क्रमांक आवश्यक आहे!`);
                return false;
            }
        }

        for (let i = 0; i < familyMembers.length; i++) {
            const fm = familyMembers[i];
            const hasAnyData = fm.name.trim() !== "" || fm.relation.trim() !== "" || fm.dob.trim() !== "" || fm.occupation.trim() !== "" || fm.mobile.trim() !== "";

            if (hasAnyData) {
                if (!fm.name || fm.name.trim() === "" || !fm.relation || fm.relation.trim() === "") {
                    setSubmitErrorMsg(`⚠️ कौटुंबिक सदस्य #${i + 1} चे नाव व नाते आवश्यक आहे!`);
                    return false;
                }
                if (fm.mobile && fm.mobile.trim() !== "" && !/^\d{10}$/.test(fm.mobile.trim())) {
                    setSubmitErrorMsg(`⚠️ कौटुंबिक सदस्य #${i + 1} चा मोबाईल क्रमांक १० अंकी असावा!`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFullForm()) return;

        setSubmitting(true);
        setSubmitErrorMsg("");
        setSubmitSuccessMsg("सुरक्षित पेमेंट पृष्ठावर घेऊन जात आहे, कृपया प्रतीक्षा करा...");

        try {
            const trimmedAddress = formData.address.trim();
            const trimmedGaav = formData.gaav.trim();
            const trimmedTaluka = formData.taluka.trim();
            const trimmedCity = formData.city.trim() || "अमरावती";
            const trimmedDistrict = formData.district.trim() || "अमरावती";
            const trimmedState = formData.state.trim() || "महाराष्ट्र";
            const trimmedCountry = formData.country.trim() || "भारत";
            const trimmedPincode = formData.pincode.trim();
            const trimmedReferredBy = referredBy || "Direct Website";

            const payload = {
                type: membershipType,
                address: trimmedAddress,
                gaav: trimmedGaav || null,
                taluka: trimmedTaluka || null,
                city: trimmedCity,
                district: trimmedDistrict,
                state: trimmedState,
                country: trimmedCountry,
                pincode: trimmedPincode || null,
                referredBy: trimmedReferredBy,
                formData: {
                    date: formatDateToDDMMYYYY(formData.date),
                    address: trimmedAddress,
                    gaav: trimmedGaav,
                    taluka: trimmedTaluka,
                    city: trimmedCity,
                    district: trimmedDistrict,
                    state: trimmedState,
                    country: trimmedCountry,
                    pincode: trimmedPincode,
                    referredBy: trimmedReferredBy,
                },
                mainMembers: mainMembers.map((m) => ({
                    srNo: m.srNo,
                    fullName: m.fullName.trim(),
                    mobileNo: m.mobileNo.trim(),
                    prabhagNo: m.prabhagNo.trim(),
                })),
                familyMembers: familyMembers
                    .filter((fm) => fm.name && fm.name.trim() !== "")
                    .map((fm) => ({
                        srNo: fm.srNo,
                        name: fm.name.trim(),
                        relation: fm.relation.trim(),
                        dob: formatDateToDDMMYYYY(fm.dob),
                        occupation: fm.occupation.trim(),
                        mobile: fm.mobile.trim(),
                    })),
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
                        mobileNo: dupMember?.mobileNo || result.duplicateList || "",
                        memberNo: dupMember?.memberNo || "",
                        memberIndex: 0,
                    });
                } else {
                    setSubmitErrorMsg(result.error || "पेमेंट सुरू करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
                }
            }
        } catch (err: unknown) {
            console.error("Online registration submission error:", err);
            const errorMessage = err instanceof Error ? err.message : "सर्व्हरशी संपर्क साधताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.";
            setSubmitErrorMsg(errorMessage);
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
        <div
            className="w-full max-w-5xl mx-auto my-4 sm:my-8 px-3 sm:px-4 print:my-0 print:p-0 print-page-wrapper"
            style={{ fontFamily: "'Baloo 2', 'Tiro Devanagari Marathi', 'Noto Sans Devanagari', system-ui, sans-serif" }}
        >


            {/* Receipt Card Container */}
            <div
                id="printable-receipt-card"
                className="bg-[#FFFDF9] border-2 border-amber-800/40 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden print:border-amber-800/60 print:shadow-none print:rounded-xl"
                style={{ fontFamily: "'Baloo 2', 'Tiro Devanagari Marathi', 'Noto Sans Devanagari', system-ui, sans-serif" }}
            >

                <form onSubmit={handleSubmit}>
                    <table className="w-full border-collapse">
                        <thead className="print-header-group">
                            <tr>
                                <th className="p-0 font-normal border-none text-left">
                                    {/* Header Title Banner */}
                                    <div className="bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-white py-3 px-3 sm:px-6 relative flex items-center justify-between border-b-2 border-amber-400 print:py-2">
                                        <div className="hidden sm:flex items-center gap-1 text-amber-400 text-lg font-bold">
                                            <span>❖</span>
                                            <span className="w-6 h-[2px] bg-amber-400"></span>
                                        </div>

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
                                                    नोंदणी पावती
                                                </span>
                                            </div>
                                        </div>

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

                                        {/* Header Badge in Body / Title indicator */}
                                        {membershipType === "EXECUTIVE" && (
                                            <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#7A0C0C]/10 via-amber-100/60 to-[#7A0C0C]/10 border border-amber-400 text-center">
                                                <span className="font-extrabold text-[#7A0C0C] text-xs sm:text-sm">
                                                    ★ कार्यकारिणी सदस्य ऑनलाईन नोंदणी फॉर्म
                                                </span>
                                            </div>
                                        )}

                                        {/* Top Row: Receipt No, Date, & Total Registration Fee */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 rounded-xl bg-amber-50/60 border border-amber-300/60 print:p-2 print:gap-3">
                                            <div className="flex items-center gap-2">
                                                <label className="font-bold text-stone-800 whitespace-nowrap text-sm sm:text-base">
                                                    पावती क्र. :
                                                </label>
                                                <span className="font-mono font-extrabold text-stone-900 text-sm sm:text-base">
                                                    {formData.receiptNo}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label className="font-bold text-stone-800 whitespace-nowrap text-sm sm:text-base">
                                                    दिनांक :
                                                </label>
                                                <span className="font-mono font-bold text-stone-900 text-sm sm:text-base">
                                                    {formData.date}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label className="font-bold text-stone-800 whitespace-nowrap text-sm sm:text-base">
                                                    नोंदणी शुल्क: रु.
                                                </label>
                                                <span className="font-mono font-black text-[#7A0C0C] text-sm sm:text-base">
                                                    {formData.registrationFee}
                                                </span>
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

                                                <button
                                                    type="button"
                                                    onClick={addMainMember}
                                                    className="min-h-[40px] text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 border border-amber-500 px-3.5 py-2 sm:py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 transform active:scale-[0.98] sm:hover:scale-[1.02] print:hidden"
                                                >
                                                    <span>➕ मुख्य सदस्य जोडा</span>
                                                </button>
                                            </div>

                                            {/* Single Container Box for Main Member(s) & Address */}
                                            <div className="p-3 sm:p-4 rounded-xl bg-white border-2 border-amber-700/30 shadow-xs space-y-4 print:p-2.5 print:space-y-3">
                                                {mainMembers.map((member, index) => (
                                                    <div
                                                        key={index}
                                                        className={`space-y-3 print:space-y-2 ${index > 0 ? "pt-3.5 border-t-2 border-dashed border-amber-300/80" : ""}`}
                                                    >
                                                        <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 print:pb-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-5 h-5 rounded-full bg-[#7A0C0C] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                                    {member.srNo}
                                                                </span>
                                                                <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                                                                    {getMemberTitle(member.srNo)} माहिती
                                                                </h4>
                                                            </div>

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

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:gap-2">
                                                            {/* First Line: सदस्याचे पूर्णनाव */}
                                                            <div className="flex items-center gap-2 sm:col-span-2">
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

                                                            {/* Below It: मोबाईल क्रमांक */}
                                                            <div className="flex items-center gap-2">
                                                                <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                                    मोबाईल क्रमांक :
                                                                </label>
                                                                <input
                                                                    type="tel"
                                                                    id={`main-member-mobile-${index}`}
                                                                    value={member.mobileNo}
                                                                    onChange={(e) => {
                                                                        const cleanVal = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                                        handleMainMemberChange(index, "mobileNo", cleanVal);
                                                                    }}
                                                                    onBlur={() => handleMainMobileBlur(index)}
                                                                    required
                                                                    maxLength={10}
                                                                    pattern="[0-9]{10}"
                                                                    inputMode="numeric"
                                                                    placeholder="१० अंकी मोबाईल नंबर"
                                                                    className={inputBase}
                                                                />
                                                            </div>

                                                            {/* Below It: प्रभाग क्रमांक */}
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
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Common Address & Location Input Fields (No Dropdowns) */}
                                                <div className="space-y-3 pt-3 border-t-2 border-amber-200">
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

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                                गाव :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="gaav"
                                                                value={formData.gaav}
                                                                onChange={handleChange}
                                                                placeholder="गावाचे नाव प्रविष्ट करा"
                                                                className={inputBase}
                                                            />
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                                तालुका :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="taluka"
                                                                value={formData.taluka}
                                                                onChange={handleChange}
                                                                placeholder="तालुक्याचे नाव प्रविष्ट करा"
                                                                className={inputBase}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                                जिल्हा :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="district"
                                                                value={formData.district}
                                                                onChange={handleChange}
                                                                placeholder="जिल्ह्याचे नाव प्रविष्ट करा"
                                                                className={inputBase}
                                                            />
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                                राज्य :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="state"
                                                                value={formData.state}
                                                                onChange={handleChange}
                                                                placeholder="राज्याचे नाव प्रविष्ट करा"
                                                                className={inputBase}
                                                            />
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                                देश :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="country"
                                                                value={formData.country}
                                                                onChange={handleChange}
                                                                placeholder="देशाचे नाव प्रविष्ट करा"
                                                                className={inputBase}
                                                            />
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <label className="font-bold text-stone-800 whitespace-nowrap text-xs sm:text-sm">
                                                                पिनकोड :
                                                            </label>
                                                            <input
                                                                type="text"
                                                                inputMode="numeric"
                                                                maxLength={6}
                                                                name="pincode"
                                                                value={formData.pincode}
                                                                onChange={handleChange}
                                                                placeholder="६ अंकी पिनकोड प्रविष्ट करा"
                                                                className={inputBase}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* FAMILY MEMBERS SECTION */}
                                        <div className="my-4 space-y-2 print:my-2 family-table-section">
                                            <div className="flex flex-wrap items-center justify-center gap-2 my-2 print:my-1">
                                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#3A0202] via-[#7A0C0C] to-[#3A0202] text-amber-300 py-1 px-4 sm:px-5 rounded-full border-2 border-amber-400/80 shadow-md">
                                                    <span className="text-amber-400 text-xs font-bold">❖</span>
                                                    <h3 className="text-xs sm:text-sm font-extrabold tracking-wide text-amber-200 whitespace-nowrap">
                                                        कौटुंबिक सदस्यांची माहिती
                                                    </h3>
                                                    <span className="text-amber-400 text-xs font-bold">❖</span>
                                                </div>
                                            </div>

                                            {/* Mobile View */}
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

                                            {/* Desktop / Print Table View */}
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
                                                                <td className="py-1 px-2 text-center font-bold text-stone-800 border-r border-amber-800/30 text-xs">
                                                                    {member.srNo}.
                                                                </td>
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
                                                readOnly
                                                className={`${inputReadOnly} text-[#7A0C0C]`}
                                            />
                                        </div>

                                        {/* Payment Method Section (देयक पद्धत) */}
                                        <div className="p-3 sm:p-4 rounded-xl bg-amber-50/60 border border-amber-300/60 flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <label className="text-stone-900 font-extrabold text-xs sm:text-sm whitespace-nowrap">
                                                    देयक पद्धत :
                                                </label>
                                                <button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#4A0404] via-[#7A0C0C] to-[#4A0404] hover:brightness-110 active:scale-95 text-amber-200 font-extrabold text-xs sm:text-sm shadow-md border border-amber-500/50 cursor-pointer transition-all disabled:opacity-50"
                                                >
                                                    {submitting ? (
                                                        <span>⏳ प्रक्रिया सुरू आहे...</span>
                                                    ) : (
                                                        <>
                                                            <span>💳 Pay & Submit (PhonePe Online)</span>
                                                            <span className="text-amber-400">➔</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-stone-600 font-semibold">एकूण देय रक्कम: </span>
                                                <span className="font-mono font-black text-sm sm:text-base text-[#7A0C0C]">₹{formData.registrationFee}</span>
                                            </div>
                                        </div>

                                        <p className="text-center text-[11px] font-semibold text-stone-500 pt-1 print:hidden">
                                            🔒 देयक पुष्टीनंतर लगेचच अधिकृत पावती व सदस्य क्रमांक जारी केला जाईल.
                                        </p>

                                        {/* Feedback alerts */}
                                        {submitSuccessMsg && (
                                            <div className="p-3.5 rounded-xl bg-purple-100 border-2 border-purple-500 text-purple-950 font-bold text-center text-xs sm:text-sm print:hidden shadow-sm">
                                                {submitSuccessMsg}
                                            </div>
                                        )}

                                        {submitErrorMsg && (
                                            <div className="p-3.5 rounded-xl bg-red-100 border-2 border-red-500 text-red-950 font-bold text-center text-xs sm:text-sm print:hidden shadow-sm">
                                                {submitErrorMsg}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>

            {/* Duplicate Mobile Modal Popup */}
            {duplicateModal && duplicateModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-[#FFFDF9] border-2 border-red-600 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-center space-y-4 p-6 sm:p-7 relative border-t-8 border-t-red-700">
                        {/* Close 'X' Button */}
                        <button
                            type="button"
                            onClick={() => setDuplicateModal(null)}
                            className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-all cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Alert Badge Icon */}
                        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 border-2 border-red-400 text-red-700 flex items-center justify-center text-3xl shadow-xs">
                            <AlertTriangle className="w-8 h-8 text-red-600 animate-pulse" />
                        </div>

                        {/* Title */}
                        <div>
                            <h3 className="text-lg sm:text-xl font-black text-red-900">
                                मोबाईल क्रमांक आधीच नोंदणीकृत आहे!
                            </h3>
                            <p className="text-xs text-stone-600 mt-1 font-semibold">
                                एका मोबाईल क्रमांकावर फक्त १ मुख्य सदस्याची नोंदणी करता येते.
                            </p>
                        </div>

                        {/* Duplicate Details Box */}
                        <div className="p-4 bg-amber-50/90 rounded-xl border border-amber-300 text-xs sm:text-sm text-stone-800 space-y-2 text-left">
                            <div className="flex items-center justify-between">
                                <span className="text-stone-600 font-bold">नोंदवलेला मोबाईल:</span>
                                <span className="font-mono font-black text-red-900 text-sm">{duplicateModal.mobileNo}</span>
                            </div>
                            {duplicateModal.memberNo && (
                                <div className="flex items-center justify-between border-t border-amber-200/80 pt-1.5">
                                    <span className="text-stone-600 font-bold">विद्यमान सदस्य क्र:</span>
                                    <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{duplicateModal.memberNo}</span>
                                </div>
                            )}
                            {duplicateModal.fullName && (
                                <div className="flex items-center justify-between border-t border-amber-200/80 pt-1.5">
                                    <span className="text-stone-600 font-bold">सदस्याचे नाव:</span>
                                    <span className="font-bold text-stone-900">{duplicateModal.fullName}</span>
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-stone-700 font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
                            💡 कृपया पुढे जाण्यासाठी <strong>दुसरा वैध १० अंकी मोबाईल क्रमांक</strong> प्रविष्ट करा.
                        </p>

                        {/* Action Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                            <button
                                type="button"
                                onClick={() => {
                                    const targetIdx = duplicateModal.memberIndex ?? 0;
                                    setDuplicateModal(null);
                                    setTimeout(() => {
                                        const mobileInput = document.getElementById(`main-member-mobile-${targetIdx}`) as HTMLInputElement;
                                        if (mobileInput) {
                                            mobileInput.focus();
                                            mobileInput.select();
                                        }
                                    }, 100);
                                }}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white font-black rounded-xl shadow-md hover:brightness-110 active:scale-98 transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
                            >
                                <Phone className="w-4 h-4 text-red-200" />
                                <span>मोबाईल क्रमांक बदला</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setDuplicateModal(null)}
                                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                            >
                                बंद करा
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}