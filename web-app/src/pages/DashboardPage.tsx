import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/lib/types";
import {
  Calendar,
  Activity,
  UserCheck,
  Bot,
  FileText,
  HeartPulse,
  Sparkles,
  ClipboardList,
  ArrowRight,
  UserPlus,
  MessageSquare,
  Sliders,
  ShieldCheck,
  History,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Flame,
  Shield,
  Heart,
  ArrowUpRight,
  Award,
  CheckCircle,
  Eye
} from "lucide-react";

interface TherapySlide {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  therapyTarget: string;
  image: string;
  doshaTag: string;
  icon: any;
}

export default function DashboardPage() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const therapySlides: TherapySlide[] = [
    {
      id: "shirodhara",
      name: "Shirodhara",
      subtitle: "Medicated Oil Stream",
      description: "Continuous warm medicated oil stream poured gently over the forehead to calm the mind, relieve insomnia, and pacify Vata dosha.",
      therapyTarget: "Shirodhara (Taila Dhara)",
      image: "/assets/images/shirodhara.jpg",
      doshaTag: "Vata & Mind Calm",
      icon: Sparkles,
    },
    {
      id: "abhyanga",
      name: "Abhyanga & Swedana",
      subtitle: "Full Body Herb Massage & Steam",
      description: "Synchronized herbal oil massage followed by steam bath to nourish tissues, unblock body srotas, and release deep ama toxins.",
      therapyTarget: "Abhyanga & Swedana (Purvakarma)",
      image: "/assets/images/abhyanga.jpg",
      doshaTag: "Nourish & Circulation",
      icon: Leaf,
    },
    {
      id: "katibasti",
      name: "Kati Basti",
      subtitle: "Lumbar Oil Reservoir Therapy",
      description: "Warm medicated oil retained in a herbal dough ring over the lumbosacral region to relieve chronic back pain and strengthen spine.",
      therapyTarget: "Kati Basti (Lumbar Therapy)",
      image: "/assets/images/katibasti.jpg",
      doshaTag: "Spine & Joint Health",
      icon: Heart,
    },
    {
      id: "netrabasti",
      name: "Netra Tarpana (Basti)",
      subtitle: "Ocular Rejuvenation Therapy",
      description: "Ghee reservoir treatment for the eyes to improve vision, soothe strain, and nourish optic nerves.",
      therapyTarget: "Nasya Karma & Mukha Abhyanga",
      image: "/assets/images/hero_banner.jpg",
      doshaTag: "Eye Care & Vision",
      icon: Eye,
    },
    {
      id: "virechana",
      name: "Virechana Karma",
      subtitle: "Therapeutic Herbal Purgation",
      description: "Pitta detoxification targeting the small intestine and liver for skin clarity, blood purification, and metabolic balance.",
      therapyTarget: "Virechana Karma Preparation",
      image: "/assets/images/hero_banner.jpg",
      doshaTag: "Pitta Heat Clear",
      icon: Flame,
    },
    {
      id: "basti",
      name: "Kashaya Basti",
      subtitle: "Medicated Enema Therapy",
      description: "Herbal decoction enema procedure considered the half of all Ayurvedic treatments for colon health and Vata pacification.",
      therapyTarget: "Kashaya Basti (Pradhanakarma)",
      image: "/assets/images/shirodhara.jpg",
      doshaTag: "Vata & Colon Balance",
      icon: Shield,
    },
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-advance slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % therapySlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [therapySlides.length]);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % therapySlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + therapySlides.length) % therapySlides.length);
  };

  const handleTherapyClick = (targetTherapy: string) => {
    navigate(`/schedule?therapy=${encodeURIComponent(targetTherapy)}`);
  };

  if (!session) return null;

  const activeSlide = therapySlides[currentSlideIndex];

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ========================================================================= */}
        {/* 1. TOP FULL-WIDTH HERO SECTION (Book Appointment Box)                    */}
        {/* ========================================================================= */}
        <div className="ayur-card p-8 sm:p-10 rounded-3xl bg-white shadow-xl relative overflow-hidden border border-gray-200/80">
          {/* Background Blended Herbal Image */}
          <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
            <img
              src="/assets/images/hero_banner.jpg"
              alt="Ayurvedic Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent"></div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Main Text Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4a373]/20 border border-[#d4a373]/50 text-[#1b4332] text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#d4a373]" />
                <span>AYURVEDA × DIGITAL TECHNOLOGY</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#1b4332] leading-tight">
                Smarter healthcare, <br />
                <span className="italic font-normal text-[#2d6a4f]">rooted in Ayurveda.</span>
              </h1>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                Logged in as <strong className="text-[#1b4332]">{session.fullName}</strong> ({ROLE_LABELS[session.role]}). A digital platform for Panchakarma management, connected patient care, zero-conflict therapy scheduling, and 24/7 AI-guided recovery.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/schedule"
                  className="px-6 py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold shadow-xl transition-all flex items-center gap-2 group"
                >
                  <Calendar className="w-4 h-4 text-[#d4a373]" />
                  <span>Book Appointment</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={() => {
                    const el = document.getElementById("homepage-slideshow");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-5 py-3 rounded-xl border border-gray-300 hover:border-[#1b4332] text-gray-800 text-xs font-bold bg-white/90 shadow-sm transition-all flex items-center gap-2"
                >
                  <Leaf className="w-4 h-4 text-[#1b4332]" />
                  <span>Explore Therapies</span>
                </button>
              </div>
            </div>

            {/* Right Pillar Badges */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="bg-[#faf6f1]/90 p-4 rounded-2xl border border-gray-200/80 text-center space-y-1 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[#1b4332] text-[#d4a373] flex items-center justify-center mx-auto font-bold shadow">
                  <Leaf className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1b4332]">Detoxify Body</h4>
                <p className="text-[10px] text-gray-500">Purge toxins (Ama)</p>
              </div>

              <div className="bg-[#faf6f1]/90 p-4 rounded-2xl border border-gray-200/80 text-center space-y-1 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[#1b4332] text-[#d4a373] flex items-center justify-center mx-auto font-bold shadow">
                  <Flame className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1b4332]">Balance Doshas</h4>
                <p className="text-[10px] text-gray-500">Vata - Pitta - Kapha</p>
              </div>

              <div className="bg-[#faf6f1]/90 p-4 rounded-2xl border border-gray-200/80 text-center space-y-1 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[#1b4332] text-[#d4a373] flex items-center justify-center mx-auto font-bold shadow">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1b4332]">Rejuvenate Mind</h4>
                <p className="text-[10px] text-gray-500">Restore Manas peace</p>
              </div>

              <div className="bg-[#faf6f1]/90 p-4 rounded-2xl border border-gray-200/80 text-center space-y-1 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[#1b4332] text-[#d4a373] flex items-center justify-center mx-auto font-bold shadow">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#1b4332]">Nurture Soul</h4>
                <p className="text-[10px] text-gray-500">Holistic well-being</p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. THERAPY SLIDESHOW SHOWCASE (Positioned DIRECTLY BELOW Hero Box)        */}
        {/* ========================================================================= */}
        <div id="homepage-slideshow" className="ayur-card p-6 sm:p-8 rounded-3xl bg-white shadow-xl space-y-6 border border-gray-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#1b4332] text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-[#d4a373]" />
                <span>Panchakarma Therapies for Holistic Healing</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1b4332]">
                Therapy Showcase & Quick Scheduler
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                Explore traditional therapies managed through AyurSutra. Click any slide to schedule your treatment session.
              </p>
            </div>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrevSlide}
                className="w-10 h-10 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                title="Previous Therapy"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-10 h-10 rounded-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                title="Next Therapy"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Featured Active Slide Banner */}
          <div
            onClick={() => handleTherapyClick(activeSlide.therapyTarget)}
            className="relative bg-[#faf6f1] rounded-2xl overflow-hidden shadow-lg border border-gray-200 cursor-pointer group transition-all duration-300 transform hover:scale-[1.005]"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[300px]">
              {/* Therapy Photo Left */}
              <div className="md:col-span-6 relative h-64 md:h-full min-h-[260px] overflow-hidden">
                <img
                  src={activeSlide.image}
                  alt={activeSlide.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#1b4332] text-[#d4a373] border border-[#d4a373]/40 shadow-md">
                  {activeSlide.doshaTag}
                </span>
              </div>

              {/* Therapy Info Right */}
              <div className="md:col-span-6 p-6 sm:p-8 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#d4a373] uppercase tracking-wider">
                    <activeSlide.icon className="w-4 h-4 text-[#1b4332]" />
                    <span>{activeSlide.subtitle}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors flex items-center justify-between">
                    <span>{activeSlide.name}</span>
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#1b4332] group-hover:translate-x-1 transition-all" />
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                    {activeSlide.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTherapyClick(activeSlide.therapyTarget);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold shadow-md group-hover:bg-[#2d6a4f] transition-colors"
                  >
                    <span>Schedule {activeSlide.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#d4a373]" />
                  </button>

                  <span className="text-xs font-mono text-gray-400 font-bold">
                    Slide {currentSlideIndex + 1} of {therapySlides.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Therapy Cards Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {therapySlides.map((slide, idx) => (
              <div
                key={slide.id}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left shadow-sm ${
                  currentSlideIndex === idx
                    ? "bg-[#1b4332] text-white border-[#1b4332] ring-2 ring-[#1b4332]/30 shadow-md scale-105"
                    : "bg-white text-[#1b4332] border-gray-200 hover:border-[#1b4332]/50 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    currentSlideIndex === idx ? "bg-white/20 text-[#d4a373]" : "bg-gray-100 text-gray-600"
                  }`}>
                    0{idx + 1}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTherapyClick(slide.therapyTarget);
                    }}
                    title="Book Now"
                    className="hover:scale-110 transition-transform"
                  >
                    <ArrowUpRight className={`w-3.5 h-3.5 ${currentSlideIndex === idx ? "text-[#d4a373]" : "text-gray-400"}`} />
                  </button>
                </div>
                <h4 className="font-serif font-bold text-xs truncate">{slide.name}</h4>
                <p className={`text-[10px] truncate mt-0.5 ${currentSlideIndex === idx ? "text-white/80" : "text-gray-500"}`}>
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. VALUE PILLARS ROW & FOOTER GUARANTEES BAR                             */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="ayur-card p-6 rounded-2xl bg-white shadow-md space-y-2 border border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1b4332]">Natural Healing</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Ayurveda uses pure medicated herbs, ghritas, and oils to restore dosha balance and promote long-term vitality.
            </p>
          </div>

          <div className="ayur-card p-6 rounded-2xl bg-white shadow-md space-y-2 border border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1b4332]">Holistic Approach</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Treats the root cause of imbalance, not just isolated symptoms — ensuring complete body, mind, and spirit harmony.
            </p>
          </div>

          <div className="ayur-card p-6 rounded-2xl bg-white shadow-md space-y-2 border border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#1b4332]">Personalized Care</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Every Panchakarma treatment plan is tailored based on your unique Prakriti constitution and clinical evaluation.
            </p>
          </div>
        </div>

        {/* Quality Guarantees Bar (Bottom Bar of Reference Image) */}
        <div className="bg-[#1b4332] text-white p-6 rounded-2xl shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Safe & Traditional</h4>
              <p className="text-[11px] text-white/70">Rooted in ancient Shastras</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Expert Practitioners</h4>
              <p className="text-[11px] text-white/70">Certified Ayurvedic Vaidyas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Pure & Natural</h4>
              <p className="text-[11px] text-white/70">Highest quality formulations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Better Living</h4>
              <p className="text-[11px] text-white/70">Immunity & quality of life</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid with Shadow Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border-l-4 border-l-[#1b4332] border border-gray-200/80 shadow-md hover:shadow-xl transition-all space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Scheduler Engine</span>
            <p className="text-xl font-bold font-serif text-[#1b4332]">Zero Conflict</p>
            <p className="text-[11px] text-gray-500">+15m T_s Sanitation Buffer</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-l-4 border-l-[#d4a373] border border-gray-200/80 shadow-md hover:shadow-xl transition-all space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Data Protection</span>
            <p className="text-xl font-bold font-serif text-[#1b4332]">AES-256 Fernet</p>
            <p className="text-[11px] text-gray-500">Field-Level Encryption</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-l-4 border-l-[#2d6a4f] border border-gray-200/80 shadow-md hover:shadow-xl transition-all space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Therapy History Tracker</span>
            <p className="text-xl font-bold font-serif text-[#1b4332]">Prior Intake Log</p>
            <p className="text-[11px] text-gray-500">RBAC Gated (Patient & Doctors)</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-l-4 border-l-[#16a34a] border border-gray-200/80 shadow-md hover:shadow-xl transition-all space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">AI Care Engine</span>
            <p className="text-xl font-bold font-serif text-[#1b4332]">24/7 Assistant</p>
            <p className="text-[11px] text-gray-500">Samsarjana Krama Diet Guidance</p>
          </div>
        </div>

        {/* Clinical & Operational Modules Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif text-[#1b4332] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#1b4332]" />
              <span>Panchakarma Management Suite</span>
            </h2>
            <span className="text-xs font-bold text-gray-500">Creamish Green Theme Palette</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Therapy History Tracker */}
            <ModuleCard
              title="Therapy History Tracker"
              description="Verify whether a patient has previously taken specific Panchakarma therapies with session counts & Vaidya notes."
              to="/therapy-tracker"
              icon={History}
              badge="MOD-02 / History"
              colorTheme="emerald"
            />

            {/* Multi-Resource Scheduler */}
            <ModuleCard
              title="Multi-Resource Scheduler"
              description="Zero-conflict scheduling for rooms, Dronis, and gender-matched therapists with 15-min sanitation buffer (T_s)."
              to="/schedule"
              icon={Calendar}
              badge="MOD-04"
              colorTheme="emerald"
            />

            {/* Panchakarma 3-Phase Progression */}
            <ModuleCard
              title="3-Phase Care Plan"
              description="Track patient lifecycle through Purvakarma preparation, Pradhanakarma main therapy, and Paschatkarma."
              to="/treatment-plans"
              icon={ClipboardList}
              badge="Sprint 1.3"
              colorTheme="amber"
            />

            {/* Vaidya Clinical Console */}
            {["VAIDYA", "ADMIN"].includes(session.role) && (
              <ModuleCard
                title="Vaidya Clinical Console"
                description="Consultation desk to inspect assigned patient EHRs, tripartite dosha scores, and add progress notes."
                to="/vaidya/patients"
                icon={UserCheck}
                badge="MOD-02"
                colorTheme="teal"
              />
            )}

            {/* Therapist Touch Vitals */}
            {["THERAPIST", "VAIDYA"].includes(session.role) && (
              <ModuleCard
                title="Therapist Quick Vitals"
                description="Single-tap BP, Nadi pulse, and Agni logging optimized for therapy room touchscreens."
                to="/therapist/vitals"
                icon={HeartPulse}
                badge="MOD-05"
                colorTheme="rose"
              />
            )}

            {/* Therapist Workload Ratio */}
            {["ADMIN", "VAIDYA", "THERAPIST"].includes(session.role) && (
              <ModuleCard
                title="Therapist Workload (W ≤ 1.0)"
                description="Monitors shift hours (H_t) vs assigned therapy hours (H_a) to prevent therapist fatigue."
                to="/therapist/workload"
                icon={Activity}
                badge="Phase 2.2"
                colorTheme="emerald"
              />
            )}

            {/* WhatsApp Reminders */}
            {["ADMIN", "VAIDYA", "PATIENT"].includes(session.role) && (
              <ModuleCard
                title="WhatsApp & SMS Alerts"
                description="Automated Twilio reminder dispatches for Purvakarma Snehapana intake & diet protocols."
                to="/notifications"
                icon={MessageSquare}
                badge="MOD-06"
                colorTheme="whatsapp"
              />
            )}

            {/* AI Care Assistant */}
            <ModuleCard
              title="AI Patient Care Assistant"
              description="24/7 interactive chatbot for post-Panchakarma Samsarjana Krama diet queries and recovery rules."
              to="/patient/ai-assistant"
              icon={Bot}
              badge="Phase 3.2"
              colorTheme="purple"
            />

            {/* Tariff & Billing */}
            {["ADMIN", "VAIDYA", "PATIENT"].includes(session.role) && (
              <ModuleCard
                title="Dynamic Tariff & Billing"
                description="Calculate patient costs using T_c = B_c + D × C_h + M_c + T_tax and export itemized invoices."
                to="/billing"
                icon={FileText}
                badge="Phase 3.3"
                colorTheme="orange"
              />
            )}

            {/* Super Admin Master Config */}
            {session.role === "ADMIN" && (
              <ModuleCard
                title="Super Admin Master Config"
                description="Global feature toggles, multi-center hospital selector, and master platform switches."
                to="/admin/master"
                icon={Sliders}
                badge="Phase 3.2"
                colorTheme="amber"
              />
            )}

            {/* Compliance Audit Trail */}
            {["ADMIN", "VAIDYA"].includes(session.role) && (
              <ModuleCard
                title="DISHA & HIPAA Audit Logs"
                description="Immutable audit trail logs for Fernet encryption access and Chief Vaidya overrides."
                to="/admin/audit-logs"
                icon={ShieldCheck}
                badge="Phase 3.3"
                colorTheme="teal"
              />
            )}

            {/* Prakriti Diagnostic Quiz */}
            <ModuleCard
              title="Prakriti Diagnostic Quiz"
              description="Tripartite Vata-Pitta-Kapha diagnostic quiz with instant radar/bar visualization and H_I score."
              to="/patient/prakriti"
              icon={Sparkles}
              badge="MOD-03"
              colorTheme="yellow"
            />

            {/* Patient EHR Onboarding */}
            <ModuleCard
              title="Patient EHR Onboarding"
              description="Register new patient demographics, emergency contacts, and initialize clinical records."
              to="/patient/onboarding"
              icon={UserPlus}
              badge="MOD-02"
              colorTheme="jade"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

interface ModuleTheme {
  cardBg: string;
  avatarBg: string;
  badgeBg: string;
  titleColor: string;
  hoverBorder: string;
}

const THEME_MAP: Record<string, ModuleTheme> = {
  emerald: {
    cardBg: "bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-teal-50 border-emerald-200/80 shadow-md hover:shadow-xl",
    avatarBg: "bg-emerald-700 text-white shadow-emerald-200",
    badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
    titleColor: "text-emerald-950",
    hoverBorder: "hover:border-emerald-600",
  },
  amber: {
    cardBg: "bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-100/40 border-amber-200/80 shadow-md hover:shadow-xl",
    avatarBg: "bg-amber-600 text-white shadow-amber-200",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300 font-extrabold",
    titleColor: "text-amber-950",
    hoverBorder: "hover:border-amber-600",
  },
  teal: {
    cardBg: "bg-gradient-to-br from-teal-50 via-cyan-50/40 to-teal-100/40 border-teal-200/80 shadow-md hover:shadow-xl",
    avatarBg: "bg-teal-700 text-white shadow-teal-200",
    badgeBg: "bg-teal-100 text-teal-900 border-teal-300 font-extrabold",
    titleColor: "text-teal-950",
    hoverBorder: "hover:border-teal-600",
  },
  rose: {
    cardBg: "bg-gradient-to-br from-rose-50 via-red-50/40 to-rose-100/40 border-rose-200/80 shadow-md hover:shadow-xl",
    avatarBg: "bg-rose-600 text-white shadow-rose-200",
    badgeBg: "bg-rose-100 text-rose-900 border-rose-300 font-extrabold",
    titleColor: "text-rose-950",
    hoverBorder: "hover:border-rose-600",
  },
  whatsapp: {
    cardBg: "bg-gradient-to-br from-emerald-50 via-green-50/50 to-emerald-100/50 border-emerald-300 shadow-md hover:shadow-xl",
    avatarBg: "bg-[#25D366] text-white shadow-emerald-200",
    badgeBg: "bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold",
    titleColor: "text-emerald-950",
    hoverBorder: "hover:border-emerald-600",
  },
  purple: {
    cardBg: "bg-gradient-to-br from-purple-50 via-violet-50/40 to-[#faf6f1] border-purple-200/80 shadow-md hover:shadow-xl",
    avatarBg: "bg-purple-600 text-white shadow-purple-200",
    badgeBg: "bg-purple-100 text-purple-900 border-purple-300 font-extrabold",
    titleColor: "text-purple-950",
    hoverBorder: "hover:border-purple-600",
  },
  orange: {
    cardBg: "bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100/40 border-orange-200/80 shadow-md hover:shadow-xl",
    avatarBg: "bg-orange-600 text-white shadow-orange-200",
    badgeBg: "bg-orange-100 text-orange-900 border-orange-300 font-extrabold",
    titleColor: "text-orange-950",
    hoverBorder: "hover:border-orange-600",
  },
  yellow: {
    cardBg: "bg-gradient-to-br from-yellow-50 via-amber-50/50 to-yellow-100/40 border-yellow-200/80 shadow-md hover:shadow-xl",
    avatarBg: "bg-yellow-600 text-white shadow-yellow-200",
    badgeBg: "bg-yellow-100 text-yellow-900 border-yellow-300 font-extrabold",
    titleColor: "text-yellow-950",
    hoverBorder: "hover:border-yellow-600",
  },
  jade: {
    cardBg: "bg-gradient-to-br from-emerald-50 via-teal-50/40 to-emerald-100/40 border-emerald-200/80 shadow-md hover:shadow-xl",
    avatarBg: "bg-emerald-800 text-white shadow-emerald-200",
    badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold",
    titleColor: "text-emerald-950",
    hoverBorder: "hover:border-emerald-600",
  },
};

function ModuleCard({
  title,
  description,
  to,
  icon: Icon,
  badge,
  colorTheme = "emerald",
}: {
  title: string;
  description: string;
  to: string;
  icon: any;
  badge: string;
  colorTheme?: string;
}) {
  const theme = THEME_MAP[colorTheme] || THEME_MAP.emerald;

  return (
    <Link
      to={to}
      className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${theme.cardBg} ${theme.hoverBorder}`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-transform group-hover:scale-110 ${theme.avatarBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full ${theme.badgeBg}`}>
            {badge}
          </span>
        </div>

        <div>
          <h3 className={`font-serif font-bold text-lg transition-colors flex items-center justify-between ${theme.titleColor}`}>
            <span>{title}</span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-gray-700 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-gray-200/60 flex items-center justify-between text-[11px] font-bold text-gray-800">
        <span>Launch Module</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}
