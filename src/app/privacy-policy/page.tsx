import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for our website and services.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white rounded-2xl border border-amber-800/20 p-6 sm:p-10 shadow-xl max-w-4xl mx-auto my-4 space-y-6 text-slate-800 leading-relaxed">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4A0404] border-b-2 border-amber-500 pb-3">
          Privacy Policy
        </h1>
        
        <p className="text-sm sm:text-base text-slate-700">
          <strong className="text-slate-900 font-bold">महाराष्ट्र प्रांतिक तैलिक महासभा अमरावती विभाग, अमरावती.</strong> is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your personal information when you visit our website and use our services.
        </p>
        
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A0404]">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-700">
            <li>
              <strong className="text-slate-900 font-semibold">Personal Information:</strong> We collect your name, email address, phone number, and payment details when you donate through our website.
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">Non-Personal Information:</strong> We collect anonymous data like your IP address, browser type, and device information to enhance user experience.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A0404]">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-700">
            <li>
              <strong className="text-slate-900 font-semibold">To Process Donations:</strong> We use your personal information to process and acknowledge donations made through our website.
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">Communication:</strong> We may use your contact details to inform you about our initiatives, campaigns, and newsletters.
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">Legal Compliance:</strong> We may disclose your information if required by law or to protect the rights and safety of the महाराष्ट्र प्रांतिक तैलिक महासभा अमरावती विभाग, अमरावती.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A0404]">Data Security</h2>
          <p className="text-sm sm:text-base text-slate-700">
            We implement a variety of security measures to maintain the safety of your personal information, including secure payment gateways and encryption protocols.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A0404]">Changes to the Privacy Policy</h2>
          <p className="text-sm sm:text-base text-slate-700">
            We may update this policy from time to time. Please review this page periodically for any changes.
          </p>
        </div>

      </div>
    </main>
  );
}
