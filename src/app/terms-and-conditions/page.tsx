import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms & Conditions for using our website and services.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white rounded-2xl border border-amber-800/20 p-6 sm:p-10 shadow-xl max-w-4xl mx-auto my-4 space-y-6 text-slate-800 leading-relaxed">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4A0404] border-b-2 border-amber-500 pb-3">
          Terms & Conditions
        </h1>
        
        <p className="text-sm sm:text-base text-slate-700">
          By using the <strong className="text-slate-900 font-bold">महाराष्ट्र प्रांतिक तैलिक महासभा अमरावती विभाग, अमरावती.</strong> website, you agree to the following Terms & Conditions.
        </p>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A0404]">Use of Website</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-700">
            <li>
              <strong className="text-slate-900 font-semibold">Eligibility:</strong> The website is available to all individuals who can form legally binding contracts under applicable law.
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">User Obligations:</strong> You agree to provide accurate information when making a donation or filling out any forms on the website.
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">Content Ownership:</strong> All content on this website is the intellectual property of <strong className="text-slate-900 font-semibold">महाराष्ट्र प्रांतिक तैलिक महासभा अमरावती विभाग, अमरावती.</strong>.
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">Prohibited Activities:</strong> You are prohibited from using the website for unlawful activities.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A0404]">Donations</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-700">
            <li>
              <strong className="text-slate-900 font-semibold">Purpose of Donations:</strong> All donations are used to support our mission.
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">Payment Methods:</strong> We accept donations via secure payment methods.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A0404]">Termination of Access</h2>
          <p className="text-sm sm:text-base text-slate-700">
            We reserve the right to suspend or terminate access for users who violate these Terms.
          </p>
        </div>

      </div>
    </main>
  );
}
