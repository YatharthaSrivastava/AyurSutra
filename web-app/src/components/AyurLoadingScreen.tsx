import { useState, useEffect } from "react";
import { Leaf, Sparkles } from "lucide-react";

interface AyurLoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

const AYURVEDIC_PROVERBS = [
  "Harmonizing Tridoshas (Vata, Pitta, Kapha)...",
  "Preparing Shastra Protocols and Clinical Modules...",
  "Connecting Patient Vitals and Samsarjana Recovery...",
  "Initializing AyurSutra Healthcare Operating System...",
];

export function AyurLoadingScreen({
  message,
  subMessage,
  fullScreen = true,
}: AyurLoadingScreenProps) {
  const [proverbIndex, setProverbIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProverbIndex((prev) => (prev + 1) % AYURVEDIC_PROVERBS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const content = (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-6 max-w-md mx-auto animate-fade-in">
      {/* Sacred Rotating Emblem and Pulsing Glow */}
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Sacred Ring */}
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#d4a373] animate-spin-slow opacity-80"></div>

        {/* Second Orbit Ring */}
        <div className="absolute w-20 h-20 rounded-full border border-emerald-700/40 animate-spin-slow [animation-direction:reverse] opacity-60"></div>

        {/* Center Pulsing Emblem */}
        <div className="absolute w-14 h-14 rounded-2xl bg-[#d4a373] text-[#1b4332] flex items-center justify-center font-serif text-2xl font-black shadow-xl animate-pulse-glow">
          आ
        </div>

        {/* Small floating sparkles */}
        <div className="absolute -top-2 -right-2 text-[#d4a373] animate-bounce">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* Brand Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-serif font-black text-[#1b4332] tracking-tight">
          AyurSutra
        </h2>
        <p className="text-[11px] font-bold text-[#b45309] uppercase tracking-widest">
          आयुसूत्र PANCHAKARMA OS
        </p>
      </div>

      {/* Dynamic Status Progress Message with Smooth Text Transition */}
      <div className="space-y-3 w-full">
        <div className="min-h-[2.5rem] flex items-center justify-center">
          <p
            key={message || proverbIndex}
            className="text-xs sm:text-sm font-serif italic text-gray-800 animate-text-reveal leading-relaxed px-4"
          >
            "{message || AYURVEDIC_PROVERBS[proverbIndex]}"
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-56 h-1.5 bg-gray-200/80 rounded-full mx-auto overflow-hidden border border-[#1b4332]/10 shadow-inner">
          <div className="w-full h-full skeleton-shimmer rounded-full"></div>
        </div>

        {subMessage && (
          <p className="text-[10px] text-[#b45309] font-bold uppercase tracking-wider animate-pulse">
            {subMessage}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-[#2d6a4f] font-semibold pt-1">
        <Leaf className="w-3.5 h-3.5 text-[#2d6a4f] animate-pulse" />
        <span className="tracking-wide">स्वास्थ्यस्य स्वास्थ्य रक्षणम् • Classical Panchakarma</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf6f1]/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}
