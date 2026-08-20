import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#FDFBF7] text-amber-100 border-t border-amber-500/30 py-4 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Organization Title & Copyright */}
        <div className="text-center sm:text-left">
          <p className="text-sm sm:text-base font-bold text-[#4A0404]">
            महाराष्ट्र प्रांतिक तैलिक महासभा - अमरावती विभाग अमरावती.
          </p>
          <p className="text-xs text-[#4A0404] mt-0.5">
            © {new Date().getFullYear()} सर्व हक्क सुरक्षित
          </p>
        </div>

        {/* Right Side: Developed by Bizonance Logo Link */}
        <a
          href="https://bizonance.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#4A0404] hover:opacity-90 transition group"
        >
          <span className="leading-none flex items-center">Developed by</span>
          <div className="flex items-center justify-center shrink-0">
            <Image
              src="/bizonance.png"
              alt="Bizonance"
              width={110}
              height={26}
              priority
              className="h-5 sm:h-6 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        </a>
      </div>
    </footer>
  );
}