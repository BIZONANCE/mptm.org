"use client";

import { useState } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  ArrowRight,
  X,
  Upload,
} from "lucide-react";

type JobItem = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  description: string;
};

const jobOpenings: JobItem[] = [
  {
    id: "1",
    title: "कार्यालय सहाय्यक",
    department: "प्रशासन विभाग",
    location: "अमरावती",
    type: "पूर्णवेळ",
    salary: "₹ १५,००० - २०,०००",
    deadline: "३१ ऑगस्ट २०२६",
    description:
      "कार्यालयीन कामकाज, नोंदी व्यवस्थापन आणि सदस्य नोंदणी प्रक्रियेत मदत.",
  },
  {
    id: "2",
    title: "सामाजिक कार्यकर्ता",
    department: "सामाजिक उपक्रम विभाग",
    location: "अमरावती जिल्हा",
    type: "पूर्णवेळ",
    salary: "₹ १८,००० - २५,०००",
    deadline: "१५ सप्टेंबर २०२६",
    description:
      "समाजातील गरजू कुटुंबांपर्यंत पोहोचून विविध योजनांची अंमलबजावणी.",
  },
  {
    id: "3",
    title: "डेटा एंट्री ऑपरेटर",
    department: "IT व नोंदणी विभाग",
    location: "अमरावती",
    type: "अर्धवेळ",
    salary: "₹ १०,००० - १२,०००",
    deadline: "५ सप्टेंबर २०२६",
    description: "सदस्य माहिती संगणकीकृत करणे व डेटाबेस अद्ययावत ठेवणे.",
  },
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  resume: File | null;
};

export default function CareerClient() {
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    resume: null,
  });

  const openApplication = (job: JobItem) => {
    setSelectedJob(job);
    setSubmitted(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitted(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, resume: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Combine form data with selected job title
    const applicationData = {
      ...formData,
      role: selectedJob?.title || "",
    };
    console.log("Application submitted:", applicationData);
    setSubmitted(true);
  };

  return (
    <main className="bg-[#FDFBF7] min-h-screen">
      {/* Hero / Header */}
      <section className="bg-[#4A0404] border-b border-amber-500/30 py-10 px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-extrabold text-xs sm:text-sm px-4 py-1 rounded-full border border-amber-400 shadow-xs mb-3">
          Job Alerts
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          करिअर संधी
        </h1>
        <p className="text-amber-200/80 text-sm mt-2 max-w-2xl mx-auto">
          महाराष्ट्र प्रांतिक तैलिक महासभा, अमरावती विभागातील सद्य नोकरी संधी पहा
          आणि अर्ज करा.
        </p>
      </section>

      {/* Job Listings */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {jobOpenings.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-amber-200 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="bg-[#4A0404] px-5 py-3 flex items-center justify-between gap-2">
                <h2 className="text-white font-bold text-lg leading-snug">
                  {job.title}
                </h2>
                <Briefcase className="w-5 h-5 text-amber-300 shrink-0" />
              </div>

              <div className="p-5">
                <p className="text-sm font-semibold text-amber-700 mb-2">
                  {job.department}
                </p>
                <p className="text-sm text-slate-600 mb-4">{job.description}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      {job.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <IndianRupee className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      {job.salary}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="text-xs sm:text-sm font-medium">
                      अंतिम तारीख: {job.deadline}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => openApplication(job)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-bold text-sm px-4 py-2 rounded-full border border-amber-400 shadow-xs hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 transition-colors"
                  >
                    अर्ज करा
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {jobOpenings.length === 0 && (
          <p className="text-center text-slate-500 mt-10">
            सध्या कोणत्याही नोकरी संधी उपलब्ध नाहीत. कृपया नंतर पुन्हा तपासा.
          </p>
        )}
      </section>

      {/* Application Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dynamic Header */}
            <h2 className="text-xl font-bold text-[#4A0404] mb-4">
              Apply for {selectedJob?.title || "this position"}
            </h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-5 text-center">
                <p className="font-semibold">
                  धन्यवाद! तुमचा अर्ज यशस्वीरित्या सादर झाला.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-4 inline-flex items-center justify-center bg-[#4A0404] text-white font-bold text-sm px-5 py-2 rounded-full hover:bg-[#6b0808] transition-colors"
                >
                  बंद करा
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    नाव *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="तुमचे पूर्ण नाव"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    ईमेल *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  फोन नंबर *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="१० अंकी मोबाईल नंबर"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    संदेश लिहा
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="तुमच्याबद्दल थोडक्यात सांगा..."
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    रेझ्युमे अपलोड करा *
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-amber-300 rounded-xl px-4 py-6 cursor-pointer hover:bg-amber-50 transition-colors">
                    <Upload className="w-5 h-5 text-amber-600" />
                    <span className="text-sm text-slate-600">
                      {formData.resume
                        ? formData.resume.name
                        : "PDF"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 font-bold text-sm px-4 py-3 rounded-full border border-amber-400 shadow-xs hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 transition-colors"
                >
                  अर्ज सादर करा
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}