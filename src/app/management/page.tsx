"use client";

import { useState } from "react";

const managementData = [
  {
    title: "उद्दिष्टे",
    content: (
      <div className="space-y-3">
        <p>
          श्री संताजी जगनाडे महाराजांचा समाजहिताचा वैचारिक दृष्टिकोन मनामनात
          बिंबवणे.
        </p>

        <p>जयंती उत्सवातून सामाजिक जागृती करणे.</p>

        <p>
          समाजातील सर्व घटकांना एकत्रित करून सामाजिक ऐक्य दृढ करणे.
        </p>

        <p>
          शिक्षण, रोजगार, उद्योजकता व आरोग्य क्षेत्रातील योजना राबवणे.
        </p>

        <p>
          गुणवंत विद्यार्थी, समाजसेवक व उद्योजकांचा गौरव करणे.
        </p>

        <p>
          महिला, युवक व ज्येष्ठ नागरिकांसाठी विकासात्मक उपक्रम राबवणे.
        </p>

        <p>
          समाजहिताच्या प्रश्नांवर विधायक भूमिका घेऊन शासनाशी समन्वय साधणे.
        </p>

        <p>
          वधू-वर मेळाव्यासारख्या कार्यक्रमांची रूपरेषा आखणे.
        </p>
      </div>
    ),
  },

  {
    title: "अमरावती विभागीय अध्यक्षांची प्रमुख कर्तव्ये",
    content: (
      <div className="space-y-3">
        <p>
          जिल्हा व तालुका स्तरावर समित्या स्थापन करून समन्वय राखणे.
        </p>

        <p>
          वार्षिक कार्य योजना तयार करून प्रभावी अंमलबजावणी करणे.
        </p>

        <p>
          प्रत्येक तिमाहीत आढावा बैठक आयोजित करणे.
        </p>

        <p>
          सदस्य नोंदणी व सदस्यसंख्या वाढीसाठी विशेष मोहीम राबवणे.
        </p>

        <p>
          आर्थिक शिस्त, पारदर्शकता व लेखापरीक्षण सुनिश्चित करणे.
        </p>

        <p>
          सामाजिक, शैक्षणिक व सांस्कृतिक उपक्रमांना मार्गदर्शन करणे.
        </p>

        <p>
          शासन, स्वयंसेवी संस्था, आरोग्य व उद्योग क्षेत्राशी सहकार्य निर्माण
          करणे.
        </p>

        <p>
          वार्षिक अहवाल व आर्थिक अहवाल राज्य कार्यकारिणीकडे सादर करणे.
        </p>
      </div>
    ),
  },

  {
    title: "विभागीय मंडळाची प्रमुख कामे",
    content: (
      <div className="space-y-3">
        <p>
          समाजभूषण, गुणवंत विद्यार्थी, पालक व शिक्षक सन्मान सोहळे.
        </p>

        <p>
          शैक्षणिक, करिअर व स्पर्धा परीक्षा मार्गदर्शन कार्यशाळा.
        </p>

        <p>
          आरोग्य तपासणी व रक्तदान शिबिरे.
        </p>

        <p>
          महिला सक्षमीकरण व स्वयंरोजगार प्रशिक्षण.
        </p>

        <p>
          युवक नेतृत्व व कौशल्य विकास कार्यक्रम.
        </p>

        <p>
          वृक्षारोपण, पर्यावरण संवर्धन व स्वच्छता अभियान.
        </p>

        <p>
          गरजू विद्यार्थ्यांना शैक्षणिक साहित्य व शिष्यवृत्ती सहाय्य.
        </p>

        <p>
          गरजू कुटुंबांसाठी आपत्कालीन समाजसेवा मदत.
        </p>
      </div>
    ),
  },

  {
    title: "वार्षिक कार्यक्रम आराखडा",
    content: (
      <div className="space-y-3">
        <p>
          जानेवारी – सदस्य नोंदणी व नियोजन बैठक.
        </p>

        <p>
          फेब्रुवारी – आरोग्य तपासणी शिबिर.
        </p>

        <p>
          एप्रिल – करिअर व रोजगार मार्गदर्शन.
        </p>

        <p>
          जून – वृक्षारोपण अभियान.
        </p>

        <p>
          जुलै – गुणवंत विद्यार्थी सत्कार.
        </p>

        <p>
          ऑगस्ट – समाजभूषण पुरस्कार वितरण.
        </p>

        <p>
          सप्टेंबर – महिला सक्षमीकरण कार्यक्रम.
        </p>

        <p>
          ऑक्टोबर – उद्योजकता विकास कार्यशाळा.
        </p>

        <p>
          नोव्हेंबर – दिवाळी मिलन कार्यक्रम.
        </p>

        <p>
          डिसेंबर – संताजी महाराजांची जयंती, स्नेहसंमेलन व वार्षिक आढावा.
        </p>
      </div>
    ),
  },

  {
    title: "वार्षिक आर्थिक नियोजन",
    content: (
      <div className="space-y-3">
        <p>
          प्राथमिक सदस्य नोंदणी शुल्क – ₹ १०१/- प्रतिवर्ष.
        </p>

        <p>
          वार्षिक कार्यकारिणी सभासद शुल्क – ₹ १००१/-.
        </p>

        <p>
          देणग्या व समाजहित निधी.
        </p>

        <p>
          प्रायोजक संस्था व उद्योग क्षेत्राकडून विशेष आर्थिक सहाय्य.
        </p>

        <p>
          सामाजिक कार्यक्रमांमधून प्राप्त निधी.
        </p>

        <p>
          शैक्षणिक व सामाजिक उपक्रम, पुरस्कार व सन्मान.
        </p>

        <p>
          TA & DA, प्रचार-प्रसिद्धी व आपत्कालीन समाजसेवा निधी.
        </p>

        <p>
          लेखापरीक्षण व कार्यालयीन व्यवस्थापन.
        </p>
      </div>
    ),
  },

  {
    title: "आर्थिक पारदर्शकता",
    content: (
      <div className="space-y-3">
        <p>
          सर्व आर्थिक व्यवहार बँक खात्यामार्फत करणे.
        </p>

        <p>
          प्रत्येक खर्चास स्थायी समितीची अधिकृत मंजुरी आवश्यक.
        </p>

        <p>
          वार्षिक लेखापरीक्षण करून अहवाल सर्वसाधारण सभेत सादर करणे.
        </p>

        <p>
          आर्थिक माहिती सदस्यांसाठी उपलब्ध ठेवणे.
        </p>
      </div>
    ),
  },

  {
    title: "बैठकीचे नियम",
    content: (
      <div className="space-y-3">
        <p>
          दर तीन महिन्यांनी विभागीय बैठक घेणे.
        </p>

        <p>
          सर्व पदाधिकाऱ्यांना वार्षिक सर्वसाधारण सभा अनिवार्य.
        </p>

        <p>
          आपत्कालीन गैरहजेरीची पूर्वकल्पना द्यावी.
        </p>

        <p>
          आवश्यकतेनुसार विशेष बैठक बोलावता येईल.
        </p>

        <p>
          बैठकीचे इतिवृत्त लेखी स्वरूपात नोंदवणे.
        </p>
      </div>
    ),
  },

  {
    title: "आचारसंहिता",
    content: (
      <div className="space-y-3">
        <p>
          सामाजिक ऐक्य, शिस्त व पारदर्शकतेचे पालन करणे.
        </p>

        <p>
          जात, धर्म, पक्षीय राजकारण व वैयक्तिक मतभेद संघटनेच्या कामकाजात
          आणू नयेत.
        </p>

        <p>
          समाजहित सर्वोच्च मानून एकसंघतेने कार्य करणे.
        </p>

        <p>
          संघटनेच्या प्रतिष्ठेला बाधा पोहोचेल असे कृत्य टाळणे.
        </p>

        <p>
          प्रचार-प्रसार नियोजित पद्धतीने मार्गदर्शक समितीच्या निर्देशानुसार
          करणे.
        </p>

        <p>
          विभागीय अध्यक्षांनी उपक्रमाची संपूर्ण माहिती संपर्क प्रमुख व
          प्रवक्त्यांना देणे.
        </p>
      </div>
    ),
  },

  {
    title: "वार्षिक अहवालाची रूपरेषा",
    content: (
      <div className="space-y-3">
        <p>
          वर्षभरातील कार्यक्रमांचा तपशील.
        </p>

        <p>
          लाभार्थ्यांची संख्या.
        </p>

        <p>
          आर्थिक उत्पन्न व खर्चाचा सारांश.
        </p>

        <p>
          सदस्यसंख्या वाढीचा अहवाल.
        </p>

        <p>
          विशेष यश व पुरस्कार.
        </p>

        <p>
          पुढील वर्षाची उद्दिष्टे व कृती आराखडा.
        </p>
      </div>
    ),
  },

  {
    title: "घोषवाक्य",
    content: (
      <div className="space-y-3">
        <p >
          “संघटन – शिक्षण – सेवा – स्वावलंबन – समाजोन्नती”
        </p>
      </div>
    ),
  },
  {
  title: "मसुदा व सादरीकरण",
  content: (
    <div className="space-y-3">
      <p>
        मसुदा दिनांक – १६/०६/२०२६
      </p>

      <p>
        प्राथमिक बैठक – ०६/०६/२०२६
      </p>

      <p>
        द्वितीय बैठक – ०८/०८/२०२६
      </p>

      <p>
        तृतीय बैठक – ११/०८/२०२६
      </p>

      <p>
        लेखन व सादरीकरण – प्रा. डॉ. इशांत गजानन राजगुरे
      </p>

      <p>
        सर्व मुद्द्यांवर चर्चा करून अंतिम नियमावली व कार्यप्रणाली
        सादर करण्यात आली.
      </p>
    </div>
  ),
},
{
  title: "मंजुरीसाठी विनंती",
  content: (
    <div className="space-y-3">
      <p>
        राज्य कार्यकारिणीच्या मार्गदर्शनाखाली अमरावती विभागीय मंडळाची
        स्वतंत्र घटना म्हणून नियमावली व कार्यआराखडा प्रमाणित करण्यात यावा.
      </p>

      <p>
        राज्यस्तरीय प्रतिनिधी – मा.खा. श्री रामदासजी तडस साहेब
      </p>

      <p>
        सर्व उपस्थित स्थायी समिती सदस्यांचे मार्गदर्शन व सहकार्य अपेक्षित.
      </p>
    </div>
  ),
},

];

export default function ManagementPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900">

      {/* ================= PAGE HEADER ================= */}
      <section className="bg-[#4A0404] border-b border-amber-500/30 py-10 px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-xs sm:text-sm px-4 py-1 rounded-full border border-amber-400 shadow-sm mb-3">
          Management
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          व्यवस्थापन
        </h1>

        <p className="text-amber-200/80 text-sm mt-2 max-w-2xl mx-auto">
          महाराष्ट्र प्रांतिक तैलिक महासभा, अमरावती विभागाच्या
          व्यवस्थापन मंडळाची माहिती.
        </p>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 py-10 sm:py-12">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Heading */}
          <div className="text-center mb-8">

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A0404]">
              सामाजिक संघटनेची
            </h2>

            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-amber-500" />

            <p className="mt-4 text-sm sm:text-base text-gray-600">
              प्राथमिक नियमावली व कार्यआराखडा
            </p>
            {/* लेखन व सादरीकरण */}
<div className="mt-7 mx-auto max-w-xl">
  <div className="flex items-center justify-center gap-3 mb-3">
    <div className="h-px w-10 bg-amber-300" />

    <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#8B5A00] uppercase">
      लेखन व सादरीकरण
    </span>

    <div className="h-px w-10 bg-amber-300" />
  </div>

  <p className="text-base sm:text-lg font-bold text-[#4A0404]">
    प्रा. डॉ. इशांत गजानन राजगुरे
  </p>

  
</div>

          </div>

          {/* ================= ACCORDION ================= */}
          <div className="space-y-4">

            {managementData.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={item.title}
                  className={`border rounded-2xl overflow-hidden bg-white transition-all duration-300 ${
                    isOpen
                      ? "border-amber-300 shadow-md"
                      : "border-amber-100/70 hover:border-amber-200"
                  }`}
                >

                  {/* Accordion Button */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >

                    <span
                      className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${
                        isOpen
                          ? "text-[#4A0404]"
                          : "text-[#111827]"
                      }`}
                    >
                      {item.title}
                    </span>

                    {/* Arrow Circle */}
                    <div
                      className={`w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "rotate-180"
                          : "rotate-0"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-amber-500"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>

                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }`}
                  >

                    <div className="overflow-hidden">

                      <div className="border-t border-amber-100 px-6 pb-6 pt-5 text-sm leading-7 text-gray-600">

                        {item.content}

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </main>

    </div>
  );
}

        
                  