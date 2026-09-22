import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund Policy for donations and payments.",
};

export default function RefundPolicyPage() {
  return (
    <main className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white rounded-2xl border border-amber-800/20 p-6 sm:p-10 shadow-xl max-w-4xl mx-auto my-4 space-y-6 text-slate-800 leading-relaxed">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4A0404] border-b-2 border-amber-500 pb-3">
          Refund Policy
        </h1>
        
        <p className="text-sm sm:text-base text-slate-700">
          At <strong className="text-slate-900 font-bold">Aaradhya Foundation</strong>, we ensure transparency in the use of donor funds. Please review our Refund Policy below:
        </p>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A0404]">Donation Refunds</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-700">
            <li>
              <strong className="text-slate-900 font-semibold">Refund Requests:</strong> If you made a donation in error, you may request a refund within <strong className="text-slate-900 font-bold">7 days</strong> of the donation.
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">Non-Refundable Donations:</strong> Donations made after 7 days are non-refundable.
            </li>
            <li>
              <strong className="text-slate-900 font-semibold">Processing Refunds:</strong> Approved refunds will be credited within <strong className="text-slate-900 font-bold">7-10 business days</strong>.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A0404]">Contact for Refunds</h2>
          <p className="text-sm sm:text-base text-slate-700">
            For any refund-related inquiries, please contact us at <a href="mailto:info@aaradhyafoundation.org.in" className="text-[#7A0C0C] font-semibold underline hover:text-amber-800">info@aaradhyafoundation.org.in</a>.
          </p>
        </div>

      </div>
    </main>
  );
}
