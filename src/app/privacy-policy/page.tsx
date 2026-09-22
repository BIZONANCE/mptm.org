import type { Metadata } from "next";
import React from "react";
import "./PrivacyPolicy.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for our website and services.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="policy-container bg-white rounded-2xl border border-amber-800/20 p-6 sm:p-10 shadow-xl max-w-4xl mx-auto my-4">
        <h1>Privacy Policy</h1>
        <p>
          <strong>Aaradhya Foundation</strong> is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your personal information when you visit our website and use our services.
        </p>
        <h2>Information We Collect</h2>
        <ul>
          <li><strong>Personal Information:</strong> We collect your name, email address, phone number, and payment details when you donate through our website.</li>
          <li><strong>Non-Personal Information:</strong> We collect anonymous data like your IP address, browser type, and device information to enhance user experience.</li>
        </ul>
        <h2>How We Use Your Information</h2>
        <ul>
          <li><strong>To Process Donations:</strong> We use your personal information to process and acknowledge donations made through our website.</li>
          <li><strong>Communication:</strong> We may use your contact details to inform you about our initiatives, campaigns, and newsletters.</li>
          <li><strong>Legal Compliance:</strong> We may disclose your information if required by law or to protect the rights and safety of the Aaradhya Foundation.</li>
        </ul>
        <h2>Data Security</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information, including secure payment gateways and encryption protocols.
        </p>
        <h2>Changes to the Privacy Policy</h2>
        <p>
          We may update this policy from time to time. Please review this page periodically for any changes.
        </p>
      </div>
    </main>
  );
}
