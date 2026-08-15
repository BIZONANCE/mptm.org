import Image from "next/image";
import Form from "./components/Form";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 selection:bg-amber-500 selection:text-white">
      {/* Top Header / Navigation Bar */}
      <header className="bg-[#4A0404] border-b border-amber-500/30 text-white shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-[#4A0404] rounded-full flex items-center justify-center text-amber-400 font-bold text-lg">
                🚩
              </div>
            </div>
            <div>
              <div className="text-amber-400 text-xs font-semibold tracking-wider">जय संताजी</div>
              <h1 className="text-base sm:text-xl font-bold text-white leading-tight">
                महाराष्ट्र प्रांतिक तैलिक महासभा
              </h1>
              <div className="text-xs text-amber-200/80">अमरावती विभाग, अमरावती.</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section — Spread mptmm.png edge-to-edge from left to right corner */}
      <section className="relative w-full print:hidden bg-[#FAF7F2]">
        <div className="w-full relative">
          <Image
            src="/mptmm.png"
            alt="महाराष्ट्र प्रांतिक तैलिक महासभा अमरावती विभाग"
            width={1920}
            height={550}
            priority
            sizes="100vw"
            className="w-full h-auto block object-cover object-center"
          />
        </div>
      </section>

      {/* Primary Member Registration Form Component */}
      <main className="flex-1 py-6">
        <Form />
      </main>

      {/* Footer */}
      <footer className="bg-[#300202] text-amber-100 border-t border-amber-500/30 py-4 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Side: Organization Title & Copyright */}
          <div className="text-center sm:text-left">
            <p className="text-sm sm:text-base font-bold text-amber-400">
              महाराष्ट्र प्रांतिक तैलिक महासभा - अमरावती विभाग अमरावती.
            </p>
            <p className="text-xs text-amber-200/80 mt-0.5">
              © {new Date().getFullYear()} सर्व हक्क सुरक्षित
            </p>
          </div>

          {/* Right Side: Developed by Bizonance Text Link */}
          <a
            href="https://bizonance.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold text-amber-200/90 hover:opacity-95 transition group"
          >
            <span>Developed by</span>
            <div className="bg-white/95 px-2.5 py-1 rounded-md shadow-xs border border-amber-300/40 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <span className="font-extrabold tracking-wide text-xs sm:text-sm font-sans">
                <span className="text-[#1D4ED8]">B</span>
                <span className="text-[#DC2626]">i</span>
                <span className="text-[#1D4ED8]">ZONANCE</span>
              </span>
            </div>
          </a>
        </div>
      </footer>
    </div>
  );
}