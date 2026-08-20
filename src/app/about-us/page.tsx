import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Target, Users, HeartHandshake, Globe, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "आमच्याबद्दल",
  description:
    "महाराष्ट्र प्रांतिक तैलिक महासभा अमरावती विभाग - संस्थेची माहिती, दृष्टीकोन आणि ध्येय.",
};

export default function AboutPage() {
  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#4A0404] border-b border-amber-500/30 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-xs sm:text-sm px-4 py-1 rounded-full border border-amber-400 shadow-xs mb-3">
          आमच्याबद्दल
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          महाराष्ट्र प्रांतिक तैलिक महासभा
        </h1>
        <p className="text-amber-200/80 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
          अमरावती विभाग,अमरावती – समाजसेवा, एकता आणि विकासासाठी समर्पित संस्था
        </p>
      </section>

      {/* About Image + Description */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-200">
          {/* Replace with your actual image */}
          <Image
            src="/about-team.jpg"
            alt="महाराष्ट्र प्रांतिक तैलिक महासभा – कार्यक्रम"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4A0404] mb-4">
            संस्थेबद्दल
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            महाराष्ट्र प्रांतिक तैलिक महासभा, अमरावती विभाग ही एक सामाजिक संस्था
            आहे जी तैलिक समाजाच्या उत्थानासाठी, शैक्षणिक प्रगतीसाठी आणि सामाजिक
            एकतेसाठी कार्यरत आहे. संस्थेच्या माध्यमातून विविध उपक्रम, शिबिरे,
            मार्गदर्शन सत्रे आणि मदत कार्यक्रम राबवले जातात.
          </p>
          <p className="text-slate-700 leading-relaxed">
            आमचा उद्देश समाजातील प्रत्येक घटकाला सक्षम बनवणे आणि त्यांना मुख्य
            प्रवाहात आणणे हा आहे. सामाजिक बांधिलकी जपत संस्था निरंतर कार्यरत आहे.
          </p>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="bg-white border border-amber-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#4A0404]">दृष्टीकोन</h3>
            </div>
            <p className="text-slate-700 leading-relaxed">
              समाजातील प्रत्येक घटक सुशिक्षित, सक्षम आणि आत्मनिर्भर व्हावा,
              तसेच तैलिक समाजाची सामाजिक, शैक्षणिक आणि आर्थिक प्रगती साधून एक
              आदर्श समाज निर्माण करणे ही आमची दृष्टी आहे.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white border border-amber-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#4A0404]">ध्येय</h3>
            </div>
            <p className="text-slate-700 leading-relaxed">
              शैक्षणिक मदत, आरोग्य शिबिरे, महिला सक्षमीकरण, युवकांना मार्गदर्शन
              आणि गरजू कुटुंबांना आर्थिक सहाय्य यांसारख्या उपक्रमांद्वारे
              समाजाच्या सर्वांगीण विकासासाठी कार्य करणे हे आमचे ध्येय आहे.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values / Additional Info */}
      <section className="bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-[#4A0404] text-center mb-8">
            आमची मूल्ये
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#4A0404] border border-amber-500/30 rounded-xl p-5 text-center">
              <Users className="w-8 h-8 text-amber-300 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-1">एकता</h4>
              <p className="text-amber-200/70 text-sm">
                समाजातील सर्व घटकांना एकत्र आणणे
              </p>
            </div>
            <div className="bg-[#4A0404] border border-amber-500/30 rounded-xl p-5 text-center">
              <HeartHandshake className="w-8 h-8 text-amber-300 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-1">सेवा</h4>
              <p className="text-amber-200/70 text-sm">
                निस्वार्थ भावनेने समाजसेवा करणे
              </p>
            </div>
            <div className="bg-[#4A0404] border border-amber-500/30 rounded-xl p-5 text-center">
              <Globe className="w-8 h-8 text-amber-300 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-1">विकास</h4>
              <p className="text-amber-200/70 text-sm">
                शैक्षणिक व आर्थिक प्रगतीसाठी प्रयत्न
              </p>
            </div>
            <div className="bg-[#4A0404] border border-amber-500/30 rounded-xl p-5 text-center">
              <ShieldCheck className="w-8 h-8 text-amber-300 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-1">विश्वास</h4>
              <p className="text-amber-200/70 text-sm">
                पारदर्शकता आणि विश्वासार्हता जपणे
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}