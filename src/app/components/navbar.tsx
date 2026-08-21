"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogIn, Menu, X } from "lucide-react";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "मुख्यपृष्ठ" },
    { href: "/about-us", label: "आमच्याबद्दल" },
    { href: "/career", label: "करिअर" },
    { href: "/management", label: "व्यवस्थापन" },
    { href: "/contact-us", label: "संपर्क करा" },
  ];

  return (
    <>
      <header className="bg-[#4A0404] border-b border-amber-500/30 text-white shadow-lg print:hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 flex items-center">

          {/* Logo + Organization Name */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
          >
            {/* Logo */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[2px] flex items-center justify-center shadow-md shrink-0">
              <div className="w-full h-full bg-[#4A0404] rounded-full flex items-center justify-center text-amber-400 text-lg sm:text-xl">
                🚩
              </div>
            </div>

            {/* Organization Name */}
            <div>
              <div className="text-amber-400 text-[10px] sm:text-xs font-semibold tracking-wider">
                जय संताजी
              </div>

              <h1 className="text-sm sm:text-xl font-bold text-white leading-tight">
                महाराष्ट्र प्रांतिक तैलिक महासभा
              </h1>

              <div className="text-[10px] sm:text-xs text-amber-200/80">
                अमरावती विभाग, अमरावती.
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - pushed to right corner */}
          <div className="ml-auto hidden md:flex items-center gap-2 lg:gap-3">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 lg:px-4 py-2 text-base lg:text-lg font-bold transition-all rounded-xl ${
                      isActive
                        ? "text-amber-400 bg-amber-400/10 border-b-2 border-amber-400 shadow-xs"
                        : "text-white hover:text-amber-400 hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 ml-2">
              {/* Golden CTA button - Registration */}
              <Link
                href="/registration"
                className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-full border border-amber-300 shadow-sm hover:shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0"
              >
                सदस्य नोंदणी
              </Link>

              {/* Login Button - Triggers Login Modal */}
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-full border border-amber-400/50 shadow-sm hover:border-amber-400 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>लॉगिन</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="मेनू टॉगल करा"
            aria-expanded={isOpen}
            className="ml-auto md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-amber-300 hover:text-white hover:bg-amber-500/10 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col border-t border-amber-500/30 bg-[#3a0303] px-4 sm:px-6 py-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-3 text-base font-bold transition-all border-b border-amber-500/10 last:border-b-0 ${
                    isActive
                      ? "text-amber-400 bg-amber-400/10 pl-4 border-l-4 border-l-amber-400"
                      : "text-white hover:text-amber-400"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Action buttons - Mobile */}
            <div className="flex items-center gap-2 my-3">
              <Link
                href="/registration"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white font-bold text-xs sm:text-sm px-3 py-2.5 rounded-full border border-amber-300 shadow-sm hover:from-amber-500 hover:to-amber-600 transition-all"
              >
                सदस्य नोंदणी
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="flex-1 text-center inline-flex items-center justify-center gap-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-white font-bold text-xs sm:text-sm px-3 py-2.5 rounded-full border border-amber-400/50 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>लॉगिन</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Embedded Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}