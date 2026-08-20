"use client";

import { Calendar, MapPin, Clock } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
};

const upcomingEvents: EventItem[] = [
  {
    id: "1",
    title: "वार्षिक सर्वसाधारण सभा",
    date: "१५ सप्टेंबर २०२६",
    time: "सकाळी १०:०० वा.",
    location: "महासभा सभागृह, अमरावती",
  },
  {
    id: "2",
    title: "सामाजिक एकता मेळावा",
    date: "२ ऑक्टोबर २०२६",
    time: "सकाळी ९:०० वा.",
    location: "जिल्हा क्रीडा संकुल, अमरावती",
  },
  {
    id: "3",
    title: "युवा मार्गदर्शन शिबिर",
    date: "२० ऑक्टोबर २०२६",
    time: "दुपारी २:०० वा.",
    location: "समाज भवन, अमरावती",
  },
  {
    id: "4",
    title: "महिला सक्षमीकरण कार्यशाळा",
    date: "५ नोव्हेंबर २०२६",
    time: "सकाळी ११:०० वा.",
    location: "सामाजिक सभागृह, अमरावती",
  },
  {
    id: "5",
    title: "रक्तदान शिबिर",
    date: "१८ नोव्हेंबर २०२६",
    time: "सकाळी ९:३० वा.",
    location: "जिल्हा रुग्णालय, अमरावती",
  },
  {
    id: "6",
    title: "वार्षिक स्नेहसंमेलन",
    date: "१० डिसेंबर २०२६",
    time: "संध्याकाळी ६:०० वा.",
    location: "महासभा सभागृह, अमरावती",
  },
];

export default function UpcomingEvents() {
  return (
    <section className="bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10">
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A0404]">
            आगामी कार्यक्रम
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full" />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-amber-200 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="bg-[#4A0404] px-5 py-3">
                <h3 className="text-white font-bold text-lg leading-snug">
                  {event.title}
                </h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-sm font-medium">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-sm font-medium">{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-sm font-medium">{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state fallback (shown when list is empty) */}
        {upcomingEvents.length === 0 && (
          <p className="text-center text-slate-500 mt-6">
            सध्या कोणतेही आगामी कार्यक्रम नाहीत.
          </p>
        )}
      </div>
    </section>
  );
}