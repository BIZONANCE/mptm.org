import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FDFBF7] border-t border-amber-500/30 py-4 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        {/* Policy Links in Center */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold text-[#7A0C0C]">
          <Link
            href="/privacy-policy"
            className="hover:text-amber-800 underline transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-amber-700/50 font-normal select-none">•</span>
          <Link
            href="/refund-policy"
            className="hover:text-amber-800 underline transition-colors"
          >
            Refund Policy
          </Link>
          <span className="text-amber-700/50 font-normal select-none">•</span>
          <Link
            href="/terms-and-conditions"
            className="hover:text-amber-800 underline transition-colors"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}