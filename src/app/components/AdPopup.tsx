"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Globe, ChevronLeft, ChevronRight } from "lucide-react";

export interface SocialLinks {
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  website?: string;
}

export interface AdItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: "image" | "video";
  adLink?: string;
  socialLinks?: SocialLinks;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

const DEFAULT_DEMO_ADS: AdItem[] = [
  {
    id: "ad_101",
    title: "महाराष्ट्र प्रांतिक तैलिक महासभा – विशेष नोंदणी अभियान २०२६",
    subtitle: "अमरावती विभागातील सर्व तैलिक बांधवांसाठी महत्त्वाची सूचना",
    mediaType: "image",
    imageUrl: "/mptmm.png",
    adLink: "https://mptmamravati.org/registration",
    socialLinks: {
      whatsapp: "https://wa.me/919876543210?text=Hello%20MPTM%20Amravati",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      twitter: "https://x.com",
      website: "https://mptmamravati.org"
    },
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "ad_102_video_demo",
    title: "महाराष्ट्र प्रांतिक तैलिक महासभा (व्हीडिओ जाहिरात)",
    subtitle: "अमरावती विभागातील सर्व तैलिक बांधवांसाठी व्हीडिओ जाहिरात",
    mediaType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    imageUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    adLink: "https://mptmamravati.org",
    socialLinks: {
      whatsapp: "https://wa.me/919876543210",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      website: "https://mptmamravati.org"
    },
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Authentic Real SVG Brand Icons
const WhatsappIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const FacebookIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="igGradientAd" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path
      fill="url(#igGradientAd)"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    />
  </svg>
);

const YoutubeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TwitterIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function AdPopup() {
  const [ads, setAds] = useState<AdItem[]>(DEFAULT_DEMO_ADS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const getApiUrl = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.includes("mptmamravati.org")) {
        return "https://api.mptmamravati.org";
      }
    }
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  };

  useEffect(() => {
    const fetchActiveAds = async () => {
      try {
        setLoading(true);
        const API_URL = getApiUrl();
        const res = await fetch(`${API_URL}/api/ads/active`);
        const contentType = res.headers.get("content-type") || "";
        if (!res.ok || !contentType.includes("application/json")) {
          setAds(DEFAULT_DEMO_ADS);
          setIsOpen(true);
          return;
        }
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setAds(data.data);
          setCurrentIndex(0);
          setIsOpen(true);
        } else {
          setAds(DEFAULT_DEMO_ADS);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Fetch pop-up ads error:", err);
        setAds(DEFAULT_DEMO_ADS);
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAds();
  }, []);

  // Auto-scroll slideshow timer (runs every 4.5 seconds unless user hovers)
  useEffect(() => {
    if (!isOpen || ads.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isOpen, ads.length, isHovered]);

  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const currentAd = ads[currentIndex] || ads[0];

  useEffect(() => {
    setAspectRatio(null);
  }, [currentAd?.id]);

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
  };

  if (!isOpen || ads.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const isVideoAd = (ad: AdItem) => {
    if (!ad) return false;
    if (ad.mediaType === "video") return true;
    if (ad.videoUrl && ad.videoUrl.trim() !== "") return true;
    const url = (ad.imageUrl || "").toLowerCase().trim();
    if (!url) return false;
    return (
      url.startsWith("data:video/") ||
      url.startsWith("data:application/octet-stream") ||
      url.includes(".mp4") ||
      url.includes(".webm") ||
      url.includes(".ogg") ||
      url.includes(".mov") ||
      url.includes(".mkv") ||
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("vimeo.com")
    );
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1`
      : null;
  };

  const mediaSrc = currentAd.videoUrl || currentAd.imageUrl;
  const isVideo = isVideoAd(currentAd);
  const ytEmbed = isVideo && mediaSrc ? getYouTubeEmbedUrl(mediaSrc) : null;

  const hasSocialLinks =
    currentAd.socialLinks?.whatsapp ||
    currentAd.socialLinks?.facebook ||
    currentAd.socialLinks?.instagram ||
    currentAd.socialLinks?.youtube ||
    currentAd.socialLinks?.twitter ||
    currentAd.socialLinks?.website;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-300 print:hidden font-sans overflow-y-auto">
      <div
        style={{
          width: aspectRatio ? `min(calc(75vh * ${aspectRatio}), 92vw, 48rem)` : "min(90vw, 42rem)",
          minWidth: "280px",
        }}
        className="bg-white rounded-2xl max-w-[95vw] sm:max-w-3xl md:max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-auto animate-in zoom-in-95 duration-200 flex flex-col transition-[width] duration-300"
      >

        {/* Floating Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2.5 right-2.5 z-30 w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition cursor-pointer shadow-lg border border-white/40 backdrop-blur-xs"
          title="Close Advertisement"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Body Container */}
        <div className="p-1.5 sm:p-2 flex flex-col min-h-0 overflow-hidden space-y-1.5">

          {/* Ad Image / Video Container with Hover Detect & Nav Controls */}
          {mediaSrc && (
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-xl bg-slate-900 group"
            >
              {ytEmbed ? (
                <iframe
                  key={currentAd.id}
                  src={ytEmbed}
                  className="w-full h-[55vh] min-h-[300px] rounded-xl border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : isVideo ? (
                <video
                  key={currentAd.id}
                  src={mediaSrc}
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                  ref={(vid) => {
                    if (vid && vid.videoWidth && vid.videoHeight && !aspectRatio) {
                      setAspectRatio(vid.videoWidth / vid.videoHeight);
                    }
                  }}
                  onLoadedMetadata={(e) => {
                    const { videoWidth, videoHeight } = e.currentTarget;
                    if (videoWidth && videoHeight) {
                      setAspectRatio(videoWidth / videoHeight);
                    }
                  }}
                  className="max-h-[75vh] w-full h-auto object-contain rounded-xl block mx-auto shadow-xs bg-black"
                />
              ) : currentAd.adLink ? (
                <a
                  href={currentAd.adLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block cursor-pointer relative max-h-[75vh] w-full"
                  title="Click to view advertisement"
                >
                  <img
                    key={currentAd.id}
                    ref={(img) => {
                      if (img && img.complete && img.naturalWidth && !aspectRatio) {
                        setAspectRatio(img.naturalWidth / img.naturalHeight);
                      }
                    }}
                    src={mediaSrc}
                    alt={currentAd.title || "Advertisement"}
                    onLoad={handleImgLoad}
                    className="max-h-[75vh] w-full h-auto object-contain transition-all duration-500 ease-in-out group-hover:scale-[1.01] rounded-xl block mx-auto"
                  />
                </a>
              ) : (
                <img
                  key={currentAd.id}
                  ref={(img) => {
                    if (img && img.complete && img.naturalWidth && !aspectRatio) {
                      setAspectRatio(img.naturalWidth / img.naturalHeight);
                    }
                  }}
                  src={mediaSrc}
                  alt={currentAd.title || "Advertisement"}
                  onLoad={handleImgLoad}
                  className="max-h-[75vh] w-full h-auto object-contain transition-all duration-500 ease-in-out rounded-xl block mx-auto"
                />
              )}

              {/* Navigation Left/Right Arrows overlay on image when multiple ads exist */}
              {ads.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition shadow-md border border-white/30 cursor-pointer"
                    title="Previous Ad"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition shadow-md border border-white/30 cursor-pointer"
                    title="Next Ad"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Bottom Strip: Social Media Icons + Autoscroll Pagination */}
          <div className="flex items-center justify-between gap-3 py-1 px-1.5 min-h-[38px] w-full shrink-0">

            {/* Social Icons (Left Side) */}
            <div className="flex items-center justify-start gap-3">
              {currentAd.socialLinks?.whatsapp && (
                <a
                  href={currentAd.socialLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-[#25D366] hover:scale-115 transition duration-200 cursor-pointer"
                  title="WhatsApp"
                >
                  <WhatsappIcon className="w-6 h-6" />
                </a>
              )}
              {currentAd.socialLinks?.facebook && (
                <a
                  href={currentAd.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-[#1877F2] hover:scale-115 transition duration-200 cursor-pointer"
                  title="Facebook"
                >
                  <FacebookIcon className="w-6 h-6" />
                </a>
              )}
              {currentAd.socialLinks?.instagram && (
                <a
                  href={currentAd.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 hover:scale-115 transition duration-200 cursor-pointer"
                  title="Instagram"
                >
                  <InstagramIcon className="w-6 h-6" />
                </a>
              )}
              {currentAd.socialLinks?.youtube && (
                <a
                  href={currentAd.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-[#FF0000] hover:scale-115 transition duration-200 cursor-pointer"
                  title="YouTube"
                >
                  <YoutubeIcon className="w-6 h-6" />
                </a>
              )}
              {currentAd.socialLinks?.twitter && (
                <a
                  href={currentAd.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-slate-900 hover:text-black hover:scale-115 transition duration-200 cursor-pointer"
                  title="Twitter / X"
                >
                  <TwitterIcon className="w-5.5 h-5.5" />
                </a>
              )}
              {currentAd.socialLinks?.website && (
                <a
                  href={currentAd.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-amber-600 hover:text-amber-500 hover:scale-115 transition duration-200 cursor-pointer"
                  title="Website"
                >
                  <Globe className="w-6 h-6" />
                </a>
              )}
            </div>

            {/* Slide Pagination Indicators (Right Side) */}
            {ads.length > 1 && (
              <div className="flex items-center gap-1.5 bg-slate-100/90 px-2.5 py-1 rounded-full border border-slate-200">
                {ads.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex
                        ? "w-6 bg-amber-600 shadow-xs"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                    title={`Go to advertisement ${index + 1}`}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
