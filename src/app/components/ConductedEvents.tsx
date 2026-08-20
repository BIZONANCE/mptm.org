"use client";

import { Calendar, MapPin, Users } from "lucide-react";

type ConductedEventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  summary: string;
};

const conductedEvents: ConductedEventItem[] = [
  {
    id: "1",
    title: "जय संताजी जयंती सोहळा",
    date: "१२ फेब्रुवारी २०२६",
    location: "महासभा सभागृह, अमरावती",
    summary: "समाजबांधवांच्या मोठ्या उपस्थितीत जयंती सोहळा उत्साहात संपन्न झाला.",
  },
  {
    id: "2",
    title: "सामाजिक सहाय्य शिबिर",
    date: "५ मार्च २०२६",
    location: "जिल्हा परिषद मैदान, अमरावती",
    summary: "गरजू कुटुंबांना आवश्यक साहित्य व मार्गदर्शन पुरवण्यात आले.",
  },
  {
    id: "3",
    title: "गुणवंत विद्यार्थी सत्कार",
    date: "२२ एप्रिल २०२६",
    location: "समाज भवन, अमरावती",
    summary: "उत्तम गुण मिळवलेल्या विद्यार्थ्यांचा सन्मान करण्यात आला.",
  },
  {
    id: "4",
    title: "आरोग्य तपासणी शिबिर",
    date: "१० मे २०२६",
    location: "जिल्हा रुग्णालय परिसर, अमरावती",
    summary: "मोफत आरोग्य तपासणी व औषध वाटप शिबिराचे आयोजन करण्यात आले.",
  },
  {
    id: "5",
    title: "महिला मेळावा",
    date: "८ जून २०२६",
    location: "सामाजिक सभागृह, अमरावती",
    summary: "महिलांसाठी स्वयंरोजगार व सक्षमीकरण विषयावर मार्गदर्शन झाले.",
  },
  {
    id: "6",
    title: "क्रीडा स्पर्धा",
    date: "१९ जुलै २०२६",
    location: "जिल्हा क्रीडा संकुल, अमरावती",
    summary: "युवकांसाठी विविध क्रीडा स्पर्धांचे यशस्वी आयोजन करण्यात आले.",
  },
];

export default function ConductedEvents() {
  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-amber-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10">
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A0404]">
            संपन्न झालेले कार्यक्रम
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {conductedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-[#FDFBF7] border border-amber-200 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="bg-[#4A0404] px-5 py-3 flex items-center justify-between gap-2">
                <h3 className="text-white font-bold text-lg leading-snug">
                  {event.title}
                </h3>
                <Users className="w-5 h-5 text-amber-300 shrink-0" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-sm font-medium">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-sm font-medium">{event.location}</span>
                </div>
                <p className="text-sm text-slate-600 pt-1 border-t border-amber-100">
                  {event.summary}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state fallback (shown when list is empty) */}
        {conductedEvents.length === 0 && (
          <p className="text-center text-slate-500 mt-6">
            सध्या कोणतेही संपन्न कार्यक्रम नाहीत.
          </p>
        )}
      </div>
    </section>
  );
}