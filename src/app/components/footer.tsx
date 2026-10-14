import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FDFBF7] border-t border-amber-500/30 py-4 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Managed By */}
        <div className="text-xs sm:text-sm font-semibold text-[#7A0C0C] tracking-wide">
          Managed By - Rajas Balkrushna Gulwade     | Saurabh Gadbail
        </div>

        {/* Policy Links on the Right */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 text-xs sm:text-sm font-bold text-[#7A0C0C]">
          <Link
            href="/privacy-policy"
            className="hover:text-amber-800 underline transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-amber-700/50 font-normal select-none">•</span>
          <Link
            href="/terms-and-conditions"
            className="hover:text-amber-800 underline transition-colors"
          >
            Terms & Conditions
          </Link>
          <span className="text-amber-700/50 font-normal select-none">•</span>
          <Link
            href="/refund-policy"
            className="hover:text-amber-800 underline transition-colors"
          >
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}