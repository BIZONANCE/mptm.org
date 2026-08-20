import Image from "next/image";
import Link from "next/link";
import UpcomingEvents from "./components/UpcomingEvents";
import ConductedEvents from "./components/ConductedEvents";
import { Eye, Globe, HeartHandshake, ShieldCheck, Target, Users } from "lucide-react";

export default function Home() {
  return (
    <div className=" flex flex-col bg-[#FAF7F2] text-slate-900 selection:bg-amber-500 selection:text-white">

      {/* Top Header / Navigation Bar */}
      <header className="bg-[#4A0404] border-b border-amber-500/30 text-white shadow-lg print:hidden">
        
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
      {/* ================= ABOUT US ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Section Heading */}
        <div className="text-center mb-10">
          <span className="inline-block bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-xs sm:text-sm px-4 py-1 rounded-full border border-amber-400 shadow-sm mb-3">
            आमच्याबद्दल
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A0404]">
            महाराष्ट्र प्रांतिक तैलिक महासभा
          </h2>

          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-amber-500" />

          <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            अमरावती विभाग,अमरावती  – समाजसेवा, एकता आणि विकासासाठी समर्पित संस्था
          </p>
        </div>
         {/* About Content */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Image */}
          <div className="relative h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-200">
            <Image
              src="/about-team.jpg"
              alt="महाराष्ट्र प्रांतिक तैलिक महासभा – कार्यक्रम"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Text */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#4A0404] mb-5">
              संस्थेबद्दल
            </h3>

            <p className="text-slate-700 leading-7 mb-4">
              महाराष्ट्र प्रांतिक तैलिक महासभा, अमरावती विभाग ही एक सामाजिक
              संस्था आहे जी तैलिक समाजाच्या उत्थानासाठी, शैक्षणिक प्रगतीसाठी
              आणि सामाजिक एकतेसाठी कार्यरत आहे.
            </p>

            <p className="text-slate-700 leading-7 mb-4">
              संस्थेच्या माध्यमातून विविध उपक्रम, शिबिरे, मार्गदर्शन सत्रे
              आणि मदत कार्यक्रम राबवले जातात.
            </p>

            <p className="text-slate-700 leading-7 mb-6">
              आमचा उद्देश समाजातील प्रत्येक घटकाला सक्षम बनवणे आणि त्यांना
              मुख्य प्रवाहात आणणे हा आहे. सामाजिक बांधिलकी जपत संस्था
              निरंतर कार्यरत आहे.
            </p>

            {/* Registration CTA Button */}
            <div className="pt-2">
              <Link
                href="/registration"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4A0404] via-[#6d0909] to-[#4A0404] hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 text-white font-extrabold text-base sm:text-lg px-6 py-3.5 rounded-full border-2 border-amber-400 shadow-lg hover:shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>🚩 ऑनलाइन सदस्य नोंदणी करा</span>
                <span className="text-amber-300 font-bold ml-1">→</span>
              </Link>
            </div>
          </div>
          </div>
      </section>

{/* ================= VISION & MISSION ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16">

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A0404]">
            दृष्टीकोन आणि ध्येय
          </h2>

          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-amber-500" />
        </div>


        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">

          {/* Vision */}
          <div className="bg-white border border-amber-200 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300">

            <div className="flex items-center gap-4 mb-5">

              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shrink-0">
                <Eye className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#4A0404]">
                दृष्टीकोन
              </h3>

            </div>

            <p className="text-slate-700 leading-7">
              समाजातील प्रत्येक घटक सुशिक्षित, सक्षम आणि आत्मनिर्भर व्हावा,
              तसेच तैलिक समाजाची सामाजिक, शैक्षणिक आणि आर्थिक प्रगती साधून
              एक आदर्श समाज निर्माण करणे ही आमची दृष्टी आहे.
            </p>

          </div>


          {/* Mission */}
          <div className="bg-white border border-amber-200 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300">

            <div className="flex items-center gap-4 mb-5">

              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#4A0404]">
                ध्येय
              </h3>
              </div>

            <p className="text-slate-700 leading-7">
              शैक्षणिक मदत, आरोग्य शिबिरे, महिला सक्षमीकरण, युवकांना
              मार्गदर्शन आणि गरजू कुटुंबांना आर्थिक सहाय्य यांसारख्या
              उपक्रमांद्वारे समाजाच्या सर्वांगीण विकासासाठी कार्य करणे
              हे आमचे ध्येय आहे.
            </p>

          </div>

        </div>
      </section>
      {/* ================= OUR VALUES ================= */}
      <section className="bg-[#FDFBF7] border-y border-amber-500/30 py-12 sm:py-14 px-4 sm:px-6 lg:px-8">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A0404]">
              आमची मूल्ये
            </h2>

            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-amber-500" />
          </div>


          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Unity */}
            <div className="border border-amber-500/30 rounded-xl p-6 text-center bg-[#4A0404] transition">
              <Users className="w-8 h-8 text-amber-300 mx-auto mb-3" />

              <h4 className="text-white font-semibold mb-2">
                एकता
              </h4>

              <p className="text-amber-200/70 text-sm leading-6">
                समाजातील सर्व घटकांना एकत्र आणणे
              </p>
            </div>
            {/* Service */}
            <div className="border border-amber-500/30 rounded-xl p-6 text-center bg-[#4A0404] transition">
              <HeartHandshake className="w-8 h-8 text-amber-300 mx-auto mb-3" />

              <h4 className="text-white font-semibold mb-2">
                सेवा
              </h4>

              <p className="text-amber-200/70 text-sm leading-6">
                निस्वार्थ भावनेने समाजसेवा करणे
              </p>
            </div>
            {/* Development */}
            <div className="border border-amber-500/30 rounded-xl p-6 text-center bg-[#4A0404] transition">
              <Globe className="w-8 h-8 text-amber-300 mx-auto mb-3" />

              <h4 className="text-white font-semibold mb-2">
                विकास
              </h4>

              <p className="text-amber-200/70 text-sm leading-6">
                शैक्षणिक व आर्थिक प्रगतीसाठी प्रयत्न
              </p>
            </div>
            {/* Trust */}
            <div className="border border-amber-500/30 rounded-xl p-6 text-center bg-[#4A0404] transition">
              <ShieldCheck className="w-8 h-8 text-amber-300 mx-auto mb-3" />

              <h4 className="text-white font-semibold mb-2">
                विश्वास
              </h4>

              <p className="text-amber-200/70 text-sm leading-6">
                पारदर्शकता आणि विश्वासार्हता जपणे
              </p>
            </div>

          </div>

        </div>
      </section>





      {/* Primary Member Registration Form Component */}
      <main className="flex-1 py-6">
       
      </main>

      {/* Upcoming & Conducted Events — Home page only */}
      <UpcomingEvents />
      <ConductedEvents />

    </div>
  );
}