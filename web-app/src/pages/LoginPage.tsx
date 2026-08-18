import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, type UserRole } from "@/lib/types";
import {
  User,
  Mail,
  Phone,
  Shield,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  Smartphone,
  Leaf,
  Flame,
  Sparkles,
  Heart,
  ArrowUp,
  Award,
  Activity,
  CheckCircle,
  Calendar,
  HeartPulse,
  Bot,
  X,
  ArrowRight,
  Droplets,
  Wind,
  Layers,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from "lucide-react";

const ROLES: UserRole[] = ["PATIENT", "VAIDYA", "ADMIN", "THERAPIST"];

export default function LoginPage() {
  const { session, loginWithDevRole, loading } = useAuth();

  // Modal open/close state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  // Auth Mode: "SIGNIN" (existing user login) vs "SIGNUP" (new registration)
  const [authMode, setAuthMode] = useState<"SIGNIN" | "SIGNUP">("SIGNIN");

  const openAuthModal = (mode: "SIGNIN" | "SIGNUP" = "SIGNIN") => {
    setAuthMode(mode);
    setStep("DETAILS");
    setError(null);
    setOtpSuccessMessage(null);
    setIsLoginModalOpen(true);
  };

  // Authentication form states
  const [selectedRole, setSelectedRole] = useState<UserRole>("PATIENT");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpMethod, setOtpMethod] = useState<"PHONE" | "EMAIL">("PHONE");

  // OTP State
  const [step, setStep] = useState<"DETAILS" | "OTP_VERIFY">("DETAILS");
  const [enteredOtp, setEnteredOtp] = useState<string>("");
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Active Dosha tab for interactive explorer
  const [activeDosha, setActiveDosha] = useState<"VATA" | "PITTA" | "KAPHA">("VATA");

  // Active Karma tab for the 5 Karmas
  const [activeKarmaIndex, setActiveKarmaIndex] = useState<number>(0);

  // FAQ Accordion open state & show all state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showAllFaqs, setShowAllFaqs] = useState<boolean>(false);

  // Scroll position state for floating scroll-to-top button
  const [scrolledDown, setScrolledDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setScrolledDown(true);
      } else {
        setScrolledDown(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLoginModalOpen) {
        setIsLoginModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoginModalOpen]);

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Send OTP handler
  const handleSendOtp = () => {
    setError(null);
    if (authMode === "SIGNUP") {
      if (!fullName.trim()) {
        setError("Please enter your full name to create an account.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!phone.trim()) {
        setError("Please enter your phone number.");
        return;
      }
    } else {
      // In Sign In mode, accept email, phone, or name
      if (!email.trim() && !phone.trim() && !fullName.trim()) {
        setError("Please enter your Email, Phone Number, or Full Name to sign in.");
        return;
      }
    }

    setStep("OTP_VERIFY");
    const target = otpMethod === "PHONE" ? (phone.trim() || "+91 98765 43210") : (email.trim() || "user@ayursutra.org");
    const channel = otpMethod === "PHONE" ? "mobile SMS" : "email inbox";
    setOtpSuccessMessage(`Security OTP dispatched to ${target}. Please check your ${channel}.`);
  };

  // Verify OTP and complete sign-in
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (enteredOtp.trim().length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }

    const displayName = fullName.trim() || (selectedRole === "VAIDYA" ? "Dr. Vaidya" : `${ROLE_LABELS[selectedRole]} User`);
    try {
      await loginWithDevRole(selectedRole, displayName, email, phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete authentication.");
    }
  };

  // Direct bypass sign-in
  const handleDirectSignIn = async () => {
    setError(null);
    const displayName = fullName.trim() || (selectedRole === "VAIDYA" ? "Dr. Vaidya" : `${ROLE_LABELS[selectedRole]} User`);
    try {
      await loginWithDevRole(selectedRole, displayName, email, phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in.");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // The 5 Pradhana Karmas Data
  const panchakarmaProcedures = [
    {
      name: "Vamana",
      sanskrit: "वमन",
      translation: "Therapeutic Emesis",
      dosha: "Kapha Dosha",
      badgeColor: "bg-amber-50 text-amber-900 border-amber-300",
      description:
        "Controlled therapeutic induction of vomiting to eliminate accumulated Kapha toxins from the respiratory tract, stomach, and chest cavity.",
      indications: ["Chronic Bronchitis & Asthma", "Skin Disorders & Psoriasis", "Chronic Allergies & Sinusitis", "Hyperlipidemia & Obesity"],
      herbalFormulations: "Madanaphala (Randia dumetorum), Yashtimadhu decoction, Vacha, and warm Saindhava water.",
      stages: "3 to 5 days of internal Snehana followed by morning emetic therapy under clinical Vaidya monitoring."
    },
    {
      name: "Virechana",
      sanskrit: "विरेचन",
      translation: "Therapeutic Purgation",
      dosha: "Pitta Dosha",
      badgeColor: "bg-rose-50 text-rose-900 border-rose-300",
      description:
        "Medicated purgation therapy cleansing the liver, gallbladder, and small intestine to purge deep-seated Pitta toxins and purify Rakta (blood).",
      indications: ["Chronic Acidity & Gastritis", "Liver & Spleen Disorders", "Dermatitis, Eczema & Acne", "Gout & Inflammatory Arthritis"],
      herbalFormulations: "Trivrit Lehyam, Avipattikar Churna, Castor Oil, Triphala Kashayam.",
      stages: "Preparatory Deepana-Pachana and Snehana, followed by calibrated herbal purgation."
    },
    {
      name: "Basti",
      sanskrit: "बस्ति",
      translation: "Medicated Enema (The King of Karmas)",
      dosha: "Vata Dosha",
      badgeColor: "bg-sky-50 text-sky-900 border-sky-300",
      description:
        "Considered 'Ardha Chikitsa' (half of all Ayurvedic treatments). Medicated decoction (Niruha) and lipid (Anuvasana) enemas that nourish the colon and pacify chronic Vata disorders.",
      indications: ["Sciatica & Lumbar Spondylosis", "Rheumatoid & Osteoarthritis", "Paralysis & Motor Neuron Disorders", "Chronic Constipation & IBS"],
      herbalFormulations: "Dashamoola Kashayam, Dhanwantharam Thailam, Sahacharadi Thailam, Honey & Saindhava.",
      stages: "Karma Basti (30 days), Kala Basti (16 days), or Yoga Basti (8 days) progressive schedules."
    },
    {
      name: "Nasya",
      sanskrit: "नस्य",
      translation: "Nasal Errhine Administration",
      dosha: "Urdhva Jatrugata (Head & Sense Organs)",
      badgeColor: "bg-emerald-50 text-emerald-900 border-emerald-300",
      description:
        "Administration of herbal oils, juices, or powders through nostrils (the gateway to the head) to eliminate toxins from the brain, sinuses, and sensory organs.",
      indications: ["Migraines & Chronic Headaches", "Sinusitis & Rhinitis", "Premature Greying & Hair Loss", "Cervical Spondylosis & Insomnia"],
      herbalFormulations: "Anu Thailam, Shadbindu Thailam, Ksheerabala 101, Medicated Ghee.",
      stages: "Facial massage (Mukha Abhyanga), mild steam (Nadi Sweda), and precise nasal drop instillation."
    },
    {
      name: "Raktamokshana",
      sanskrit: "रक्तमोक्षण",
      translation: "Blood Purification & Leech Therapy",
      dosha: "Rakta Dhatu & Pitta",
      badgeColor: "bg-purple-50 text-purple-900 border-purple-300",
      description:
        "Para-surgical bio-purification method using medicinal leeches (Jalaukavacharana) or Siravyadha to extract vitiated blood and clear micro-vascular blockages.",
      indications: ["Severe Chronic Eczema & Psoriasis", "Varicose Veins & Ulcers", "Localized Inflammatory Swelling", "Alopecia Areata & Herpes"],
      herbalFormulations: "Sterile Nirvisha Medicinal Leeches, Haridra (Turmeric) powder, Shatadhauta Ghrita.",
      stages: "Sterile preparation, natural leech suction of toxic blood, followed by antiseptic turmeric dressing."
    }
  ];

  // Primary Initial FAQs (Questions: 1, 3, 5, 8, 11)
  const initialFaqs = [
    {
      q: "What is Panchakarma?",
      a: "Panchakarma (पञ्चकर्म, 'Five Actions') is Ayurveda's classical bio-purification and cellular detoxification methodology. It systematically cleanses metabolic waste (Ama) from bodily micro-channels (Srotas) through five specialized therapies (Vamana, Virechana, Basti, Nasya, and Raktamokshana), restoring digestive fire (Agni) and Tridoshic equilibrium."
    },
    {
      q: "Is there an age limit for Panchakarma?",
      a: "Classical intensive Panchakarma is generally indicated for individuals between 10 and 70 years of age. However, gentle supporting therapies (Upakarmas like gentle Abhyanga, Shirodhara, and mild Nasya) can be safely customized by experienced Vaidyas for children and elderly individuals based on their physical vitality (Bala)."
    },
    {
      q: "Is Panchakarma safe for everyone?",
      a: "Yes, when prescribed and supervised by a qualified Ayurvedic Vaidya and administered by trained therapists. Every Panchakarma protocol is preceded by preparatory Purvakarma (Snehana oleation and Swedana herbal steam) to ensure toxins are safely liquefied before gentle elimination."
    },
    {
      q: "What are the benefits of Panchakarma?",
      a: "Key clinical benefits include cellular-level detoxification, rekindled digestive fire (Agni), balanced Tridoshas (Vata, Pitta, Kapha), reinforced immunity (Ojas), stress reduction, enhanced lymphatic drainage, radiant skin, mental clarity, and improved sleep vitality."
    },
    {
      q: "How do I book a Panchakarma consultation?",
      a: "You can book a consultation directly through the AyurSutra platform by clicking the 'Login / Sign In' button to access your patient portal, selecting 'Book Appointment' or 'Scheduler', and choosing your preferred Vaidya, date, and therapy center."
    }
  ];

  // Remaining FAQs (Revealed when user expands all questions)
  const remainingFaqs = [
    {
      q: "Who can undergo Panchakarma treatment?",
      a: "Panchakarma is recommended for both healthy individuals seeking seasonal rejuvenation (Ritu Shodhana) and disease prevention, as well as those managing chronic conditions such as arthritis, metabolic disorders, digestive issues, skin diseases, respiratory allergies, migraines, and chronic stress."
    },
    {
      q: "Who should avoid Panchakarma therapy?",
      a: "Intensive bio-purification procedures are strictly avoided during pregnancy, immediately following major surgeries, during acute infectious fevers, severe cardiac decompensation, extreme physical emaciation, active internal hemorrhages, or severe anemia. An Ayurvedic Vaidya conducts a thorough eligibility screening beforehand."
    },
    {
      q: "Do I need a doctor's consultation before treatment?",
      a: "Yes, a comprehensive Ayurvedic consultation (Ashtavidha Pariksha, including Nadi pulse diagnosis, Prakriti constitutional assessment, and disease evaluation) is mandatory before initiating any Panchakarma therapy to ensure a safe, personalized protocol."
    },
    {
      q: "How long does a Panchakarma treatment program last?",
      a: "Treatment programs typically range from 7 days (introductory detox and stress relief), 14 days (intermediate metabolic and tissue cleansing), to 21 or 28 days (intensive chronic disease management), tailored according to your clinical assessment."
    },
    {
      q: "Can Panchakarma help with stress and lifestyle disorders?",
      a: "Yes, remarkably well. Specialized external therapies like Shirodhara, Abhyanga, and Nasya calm the central nervous system (Majja Dhatu), pacify aggravated Vata dosha, lower cortisol levels, and provide deep therapeutic relief from anxiety, insomnia, burnout, hypertension, and chronic fatigue."
    },
    {
      q: "Are there any dietary restrictions during treatment?",
      a: "Yes. During Panchakarma and the subsequent recovery phase (Samsarjana Krama), patients adhere to a warm, light, sattvic diet starting with thin rice gruel (Peya), progressing to porridge (Vilepi) and green gram soup (Yusha). Heavy, oily, cold, raw, spicy, and processed foods, along with alcohol and caffeine, are avoided."
    },
    {
      q: "What should I expect during my first visit?",
      a: "Your initial visit includes an in-depth clinical consultation and Nadi Pariksha (pulse assessment) with the Vaidya, Prakriti (body constitution) analysis, personalized therapy mapping, dietary guidelines, and a complete orientation to your Panchakarma treatment plan."
    }
  ];

  const displayedFaqs = showAllFaqs ? [...initialFaqs, ...remainingFaqs] : initialFaqs;

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans selection:bg-[#d4a373]/30 selection:text-[#1b4332]">
      {/* ========================================================================= */}
      {/* PUBLIC NAVBAR (Exact Match to Header Reference Image 1)                   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#1b4332] text-white border-b border-emerald-900/40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo matching Reference Image 1 */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#d4a373] flex items-center justify-center font-serif text-2xl font-black text-[#1b4332] shadow-md shrink-0">
                आ
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-2xl font-bold font-serif text-white tracking-tight leading-none block">
                  AyurSutra
                </span>
                <span className="block text-[11px] tracking-widest text-[#d4a373] uppercase font-bold font-sans mt-1">
                  आयुसूत्र PANCHAKARMA
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-white/90">
              <a href="#about-panchakarma" className="hover:text-[#d4a373] transition-colors">
                What is Panchakarma
              </a>
              <a href="#five-karmas" className="hover:text-[#d4a373] transition-colors">
                The 5 Karmas
              </a>
              <a href="#classical-therapies" className="hover:text-[#d4a373] transition-colors">
                Therapies
              </a>
              <a href="#three-stages" className="hover:text-[#d4a373] transition-colors">
                3 Detox Stages
              </a>
              <a href="#platform-features" className="hover:text-[#d4a373] transition-colors">
                Digital Features
              </a>
              <a href="#panchakarma-faq" className="hover:text-[#d4a373] transition-colors">
                FAQs
              </a>
            </nav>

            {/* Sign In and Sign Up Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => openAuthModal("SIGNIN")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950/70 hover:bg-emerald-900 text-white text-xs font-bold tracking-wide uppercase shadow-sm transition-all cursor-pointer border border-emerald-700/60 hover:scale-105 active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-[#d4a373]" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => openAuthModal("SIGNUP")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#d4a373] hover:bg-[#c69363] text-[#1b4332] text-xs font-black tracking-wide uppercase shadow-md transition-all cursor-pointer border border-[#d4a373]/80 hover:scale-105 active:scale-95"
              >
                <User className="w-3.5 h-3.5 text-[#1b4332]" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Exact Match to Reference Image 2 Theme & Headline)       */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b-2 border-[#1b4332]/10">
        {/* Background High-Res AyurSutra Branding Image with very slight 1px blur for high image visibility */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/assets/images/ayursutra_branding_hero.jpg"
            alt="AyurSutra Panchakarma Therapy Background"
            className="w-full h-full object-cover object-center scale-105 opacity-95 blur-[1px]"
          />
          {/* Light natural gradient keeping the image clearly visible while providing subtle text comfort */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf6f1]/55 via-[#faf6f1]/25 to-[#faf6f1]/75"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-7">
          {/* Pill Badge matching Image 2: ✨ AYURVEDA × DIGITAL TECHNOLOGY */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#faedcd]/80 border border-[#d4a373] text-[#78350f] text-xs font-bold tracking-widest uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
            <span>AYURVEDA × DIGITAL TECHNOLOGY</span>
          </div>

          {/* Headline matching Image 2 */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-serif font-black text-[#1b4332] tracking-tight leading-[1.15]">
              Smarter healthcare,<br />
              <span className="italic font-serif font-normal text-[#1b4332]">rooted in Ayurveda.</span>
            </h1>
            <p className="text-[#143628] text-sm sm:text-base leading-relaxed font-semibold max-w-2xl mx-auto">
              A modern clinical operating system for Panchakarma centers, combining ancient Shastra protocols with automated scheduling, touch vitals, and AI-guided patient recovery.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openAuthModal("SIGNIN")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-extrabold tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer group border-2 border-[#1b4332]"
            >
              <Lock className="w-4 h-4 text-[#d4a373] group-hover:rotate-12 transition-transform" />
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4 text-[#d4a373] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => openAuthModal("SIGNUP")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#d4a373] hover:bg-[#c69363] text-[#1b4332] text-xs font-black uppercase tracking-wider border-2 border-[#d4a373] shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#1b4332]" />
              <span>Create New Account</span>
            </button>

            <a
              href="#five-karmas"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-[#1b4332] text-xs font-bold uppercase tracking-wider border-2 border-[#1b4332]/20 shadow-sm transition-all hover:border-[#1b4332] hover:scale-105"
            >
              <Leaf className="w-4 h-4 text-[#2d6a4f]" />
              <span>Explore The 5 Karmas</span>
            </a>
          </div>

          {/* 4 Pillars with Clear Box Outlines */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto">
            <div className="bg-white p-4.5 rounded-2xl border-2 border-[#1b4332]/15 shadow-sm text-center space-y-2 hover:border-[#1b4332] hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] border border-[#1b4332]/20 flex items-center justify-center mx-auto font-bold group-hover:bg-[#1b4332] group-hover:text-[#d4a373] transition-colors">
                <Leaf className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-serif font-extrabold text-[#1b4332]">Detoxify Body</h4>
              <p className="text-[11px] text-gray-600 font-medium">Purge deep-seated Ama</p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border-2 border-[#1b4332]/15 shadow-sm text-center space-y-2 hover:border-[#1b4332] hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] border border-[#1b4332]/20 flex items-center justify-center mx-auto font-bold group-hover:bg-[#1b4332] group-hover:text-[#d4a373] transition-colors">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-serif font-extrabold text-[#1b4332]">Balance Doshas</h4>
              <p className="text-[11px] text-gray-600 font-medium">Vata • Pitta • Kapha</p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border-2 border-[#1b4332]/15 shadow-sm text-center space-y-2 hover:border-[#1b4332] hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] border border-[#1b4332]/20 flex items-center justify-center mx-auto font-bold group-hover:bg-[#1b4332] group-hover:text-[#d4a373] transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-serif font-extrabold text-[#1b4332]">Rejuvenate Mind</h4>
              <p className="text-[11px] text-gray-600 font-medium">Restore Manas peace</p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border-2 border-[#1b4332]/15 shadow-sm text-center space-y-2 hover:border-[#1b4332] hover:shadow-md transition-all group">
              <div className="w-11 h-11 rounded-2xl bg-[#1b4332]/10 text-[#1b4332] border border-[#1b4332]/20 flex items-center justify-center mx-auto font-bold group-hover:bg-[#1b4332] group-hover:text-[#d4a373] transition-colors">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-serif font-extrabold text-[#1b4332]">Nurture Soul</h4>
              <p className="text-[11px] text-gray-600 font-medium">Holistic longevity</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SANSKRIT SHLOKA BANNER (Exact Match to Reference Image)                   */}
      {/* ========================================================================= */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-3">
        <div className="flex justify-center items-center">
          <Leaf className="w-5 h-5 text-emerald-700 animate-pulse" />
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-[#1b4332] tracking-wide leading-relaxed">
          स्वस्थस्य स्वास्थ्यरक्षणं आतुरस्य विकारप्रशमनं च ।
        </h3>
        <p className="text-xs sm:text-base font-serif italic text-gray-700 font-medium leading-relaxed max-w-2xl mx-auto">
          “To preserve the health of the healthy and to alleviate the disease of the diseased.”
        </p>
        <p className="text-[11px] text-[#b45309] font-bold tracking-widest uppercase flex items-center justify-center gap-2 pt-0.5">
          <span className="text-gray-300">————</span>
          <span>Charaka Samhita</span>
          <span className="text-gray-300">————</span>
        </p>
      </section>

      {/* ========================================================================= */}
      {/* 2. WHAT IS PANCHAKARMA? (Fixed 100% Bio-Purification Alignment)           */}
      {/* ========================================================================= */}
      <section id="about-panchakarma" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Column with cleanly aligned 100% Bio-Purification Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#1b4332]/20 bg-white group">
              <img
                src="/assets/images/shirodhara.jpg"
                alt="Classical Shirodhara Therapy"
                className="w-full h-[420px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Shastra quote overlay at top/center */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6">
                <div className="space-y-2 pb-16">
                  <span className="px-3 py-1 rounded-full bg-[#d4a373] text-[#1b4332] text-[10px] font-extrabold uppercase tracking-wider inline-block">
                    Charaka Samhita Shloka
                  </span>
                  <p className="text-white text-xs sm:text-sm font-serif font-bold leading-relaxed">
                    "स्वस्थस्य स्वास्थ्यरक्षणं आतुरस्य विकारप्रशमनं च ।"
                  </p>
                  <p className="text-white/80 text-[11px] italic">
                    “To preserve the health of the healthy and to alleviate the disease of the diseased.”
                  </p>
                </div>
              </div>

              {/* Fixed 100% Bio-Purification Box Alignment (Cleanly inset at bottom) */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border-2 border-[#1b4332]/20 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-bold shadow-xs shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Clinical Efficacy</p>
                    <p className="text-sm font-serif font-black text-[#1b4332]">100% Bio-Purification</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b4332]/10 border border-[#1b4332]/20 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>Ayurvedic Cellular Detoxification</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1b4332] leading-tight">
              What is Panchakarma? The Ultimate Five-Fold Purification
            </h2>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-normal">
              <strong>Panchakarma (पञ्चकर्म)</strong> is Ayurveda’s premier therapeutic protocol for bio-cleansing, metabolic restoration, and biological revitalization. When dietary stress, lifestyle imbalances, and environmental factors corrupt our Tridoshas (Vata, Pitta, Kapha), toxic residue called <strong>Ama</strong> accumulates in bodily micro-channels (Srotas).
            </p>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-normal">
              Unlike ordinary cleanses, Panchakarma mobilizes cellular toxins from deep connective tissues (Dhatus) and systematically evacuates them through the body’s natural elimination pathways, reinstating pristine digestive fire (Agni) and cellular vitality.
            </p>

            {/* 3 Core Highlight Outlined Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border-2 border-[#1b4332]/15 shadow-sm space-y-1 hover:border-[#1b4332] transition-colors">
                <h4 className="text-xs font-serif font-bold text-[#1b4332] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#2d6a4f]" />
                  <span>Srotas Cleansing</span>
                </h4>
                <p className="text-[11px] text-gray-600">Unclogs lymphatic, vascular, and digestive channels.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-[#1b4332]/15 shadow-sm space-y-1 hover:border-[#1b4332] transition-colors">
                <h4 className="text-xs font-serif font-bold text-[#1b4332] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#2d6a4f]" />
                  <span>Agni Kindling</span>
                </h4>
                <p className="text-[11px] text-gray-600">Restores metabolic digestive power and enzymes.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-[#1b4332]/15 shadow-sm space-y-1 hover:border-[#1b4332] transition-colors">
                <h4 className="text-xs font-serif font-bold text-[#1b4332] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#2d6a4f]" />
                  <span>Rasayana Renewal</span>
                </h4>
                <p className="text-[11px] text-gray-600">Nourishes deep tissues, boosting Ojas & immunity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE THREE STAGES OF DETOXIFICATION (Outlined Boxes)                    */}
      {/* ========================================================================= */}
      <section id="three-stages" className="py-20 bg-white border-y-2 border-[#1b4332]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 border border-[#1b4332]/20 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>The Complete Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1b4332]">
              The 3 Systematic Stages of Panchakarma
            </h2>
            <p className="text-gray-600 text-sm font-medium">
              A classical Panchakarma therapy is never performed abruptly. It follows a rigorous tri-fold protocol to ensure maximum safety, gentle toxin liquefaction, and sustainable vitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#faf6f1] p-8 rounded-3xl border-2 border-[#1b4332]/20 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 relative group">
              <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-serif text-lg font-black shadow-md">
                1
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#b45309] uppercase tracking-wider">Stage One</span>
                <h3 className="text-xl font-serif font-bold text-[#1b4332]">Purvakarma (पूर्वक्रम)</h3>
                <p className="text-xs font-semibold text-gray-500">Preparatory & Liquefaction Stage</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Before expelling toxins, the body is softened and toxins are mobilized from the periphery into the gut via:
              </p>
              <ul className="space-y-2 text-xs text-gray-700 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Deepana & Pachana:</strong> Herbs to kindle Agni and digest raw Ama.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Snehana:</strong> Internal medicated ghee ingestion & full-body Abhyanga oil massage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Swedana:</strong> Herbal steam therapy opening pores and liquefying deep toxins.</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-[#1b4332] text-white p-8 rounded-3xl border-2 border-emerald-700 shadow-xl space-y-4 relative group transform md:-translate-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#d4a373] text-[#1b4332] flex items-center justify-center font-serif text-lg font-black shadow-md">
                2
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#d4a373] uppercase tracking-wider">Stage Two</span>
                <h3 className="text-xl font-serif font-bold text-white">Pradhana Karma (प्रधानकर्म)</h3>
                <p className="text-xs font-semibold text-white/70">Main Bio-Purification Procedures</p>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
                The targeted administration of the primary cleansing procedure customized for the patient's constitution:
              </p>
              <ul className="space-y-2 text-xs text-white/90 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#d4a373] shrink-0 mt-0.5" />
                  <span><strong>Vamana:</strong> Eliminates chest and upper gastric Kapha toxins.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#d4a373] shrink-0 mt-0.5" />
                  <span><strong>Virechana:</strong> Liver and gallbladder Pitta purgation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#d4a373] shrink-0 mt-0.5" />
                  <span><strong>Basti / Nasya / Raktamokshana:</strong> Colon, sinus, or blood purification.</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-[#faf6f1] p-8 rounded-3xl border-2 border-[#1b4332]/20 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 relative group">
              <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-serif text-lg font-black shadow-md">
                3
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#b45309] uppercase tracking-wider">Stage Three</span>
                <h3 className="text-xl font-serif font-bold text-[#1b4332]">Paschatkarma (पश्चात्कर्म)</h3>
                <p className="text-xs font-semibold text-gray-500">Post-Therapy Recovery & Diet</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                After intense cleansing, the digestive fire is sensitive like a tender flame. Restorative care includes:
              </p>
              <ul className="space-y-2 text-xs text-gray-700 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Samsarjana Krama:</strong> Graduated diet (Peya gruel → Vilepi → Yusha soup).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dinacharya & Lifestyle:</strong> Restful habits avoiding wind, sun, and mental strain.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Rasayana Chikitsa:</strong> Herbal rejuvenation tonics for long-term immunity.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE FIVE PRADHANA KARMAS (Outlined Interactive Showcase)               */}
      {/* ========================================================================= */}
      <section id="five-karmas" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 border border-[#1b4332]/20 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span>The Five Pillars</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1b4332]">
            The Five Pradhana Karmas Explained
          </h2>
          <p className="text-gray-600 text-sm font-medium">
            Explore each specialized detoxification modality, targeted doshas, clinical indications, and classical formulations.
          </p>
        </div>

        {/* Karma Selection Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
          {panchakarmaProcedures.map((karma, idx) => (
            <button
              key={karma.name}
              onClick={() => setActiveKarmaIndex(idx)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                activeKarmaIndex === idx
                  ? "bg-[#1b4332] text-white shadow-lg scale-105 border-2 border-[#1b4332]"
                  : "bg-white text-gray-700 hover:bg-[#1b4332]/10 border-2 border-[#1b4332]/15"
              }`}
            >
              <span>{karma.name}</span>
              <span className="text-[11px] opacity-75 font-serif font-normal">({karma.sanskrit})</span>
            </button>
          ))}
        </div>

        {/* Active Karma Detail Showcase */}
        {(() => {
          const karma = panchakarmaProcedures[activeKarmaIndex];
          return (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#1b4332]/20 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="w-10 h-10 rounded-xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-serif text-lg font-bold shadow-xs">
                    {karma.sanskrit}
                  </span>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1b4332]">
                      {karma.name} Therapy
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold">{karma.translation}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border-2 ${karma.badgeColor} ml-auto`}>
                    Target: {karma.dosha}
                  </span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed font-normal">
                  {karma.description}
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-[#1b4332]" />
                    <span>Primary Clinical Indications</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {karma.indications.map((ind, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-[#faf6f1] border-2 border-[#1b4332]/10 text-xs font-medium text-gray-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Key Classical Formulations</p>
                    <p className="text-xs text-gray-800 font-semibold mt-1">{karma.herbalFormulations}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Clinical Protocol Flow</p>
                    <p className="text-xs text-gray-800 font-semibold mt-1">{karma.stages}</p>
                  </div>
                </div>
              </div>

              {/* Right Summary Card */}
              <div className="lg:col-span-5 bg-[#1b4332] text-white p-6 sm:p-8 rounded-3xl space-y-5 shadow-lg border-2 border-emerald-700">
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <span className="text-xs font-bold text-[#d4a373] uppercase tracking-wider">AyurSutra Clinical Protocol</span>
                  <Award className="w-5 h-5 text-[#d4a373]" />
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-white/90">
                  <p className="flex items-start gap-2">
                    <span className="text-[#d4a373] font-bold">•</span>
                    <span><strong>Pre-Therapy Vitals:</strong> Baseline BP, Nadi Pulse, and Agni level logged by the attending therapist.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-[#d4a373] font-bold">•</span>
                    <span><strong>Droni Assignment:</strong> Automated allocation of bronze or teakwood droni with a mandatory 15-min sanitization window.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-[#d4a373] font-bold">•</span>
                    <span><strong>Post-Care Notification:</strong> Automated SMS and in-app dietary alert dispatched to the patient's portal.</span>
                  </p>
                </div>

                <button
                  onClick={() => openAuthModal("SIGNIN")}
                  className="w-full py-3 rounded-xl bg-[#d4a373] hover:bg-[#c69363] text-[#1b4332] text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#d4a373]/80"
                >
                  <Lock className="w-3.5 h-3.5 text-[#1b4332]" />
                  <span>Access Clinical Care Plans</span>
                </button>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ========================================================================= */}
      {/* 5. CLASSICAL AYURVEDIC THERAPIES SHOWCASE (Outlined Gallery)              */}
      {/* ========================================================================= */}
      <section id="classical-therapies" className="py-20 bg-white border-y-2 border-[#1b4332]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 border border-[#1b4332]/20 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>Specialized Upakarmas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1b4332]">
              Renowned Classical External Therapies
            </h2>
            <p className="text-gray-600 text-sm font-medium">
              Supporting therapies executed in dedicated Panchakarma theater suites under standardized therapeutic parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Therapy 1: Shirodhara */}
            <div className="bg-[#faf6f1] rounded-3xl overflow-hidden border-2 border-[#1b4332]/20 shadow-md hover:border-[#1b4332] hover:shadow-2xl transition-all duration-500 group flex flex-col">
              <div className="relative h-56 overflow-hidden border-b-2 border-[#1b4332]/10">
                <img
                  src="/assets/images/shirodhara.jpg"
                  alt="Shirodhara Treatment"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#1b4332] text-[10px] font-extrabold border border-gray-200 shadow">
                  Ajna Chakra
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-[#1b4332]">Shirodhara (शिरोधारा)</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    A continuous, rhythmic stream of lukewarm medicated herbal oils, Takra (buttermilk), or Kwath poured gently over the forehead.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1b4332]/10">
                  <p className="text-[11px] font-bold text-gray-700">Benefits:</p>
                  <p className="text-xs text-emerald-800 font-semibold">Relieves insomnia, anxiety, hypertension, and mental burnout.</p>
                </div>
              </div>
            </div>

            {/* Therapy 2: Abhyanga */}
            <div className="bg-[#faf6f1] rounded-3xl overflow-hidden border-2 border-[#1b4332]/20 shadow-md hover:border-[#1b4332] hover:shadow-2xl transition-all duration-500 group flex flex-col">
              <div className="relative h-56 overflow-hidden border-b-2 border-[#1b4332]/10">
                <img
                  src="/assets/images/abhyanga.jpg"
                  alt="Abhyanga Therapy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#1b4332] text-[10px] font-extrabold border border-gray-200 shadow">
                  Full Body
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-[#1b4332]">Abhyanga (अभ्यङ्ग)</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Traditional synchronized full-body massage using warm dosha-specific herbal oils, moving along energy pathways (Nadis) and Marma points.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1b4332]/10">
                  <p className="text-[11px] font-bold text-gray-700">Benefits:</p>
                  <p className="text-xs text-emerald-800 font-semibold">Enhances lymphatic drainage, nourishes Dhatus, and halts aging.</p>
                </div>
              </div>
            </div>

            {/* Therapy 3: Kati Basti */}
            <div className="bg-[#faf6f1] rounded-3xl overflow-hidden border-2 border-[#1b4332]/20 shadow-md hover:border-[#1b4332] hover:shadow-2xl transition-all duration-500 group flex flex-col">
              <div className="relative h-56 overflow-hidden border-b-2 border-[#1b4332]/10">
                <img
                  src="/assets/images/katibasti.jpg"
                  alt="Kati Basti Spinal Therapy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[#1b4332] text-[10px] font-extrabold border border-gray-200 shadow">
                  Spine Care
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-[#1b4332]">Kati Basti (कटिबस्ति)</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    A reservoir made of black gram dough placed over the lumbosacral region, holding warm medicated herbal oil (Mahanarayan / Ksheerabala).
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1b4332]/10">
                  <p className="text-[11px] font-bold text-gray-700">Benefits:</p>
                  <p className="text-xs text-emerald-800 font-semibold">Effective for lower back pain, sciatica, disc bulge & spondylosis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TRIDOSHA HARMONY & PANCHAKARMA MATRIX (Outlined Cards)                 */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 border border-[#1b4332]/20 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span>Constitutional Science</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1b4332]">
            Tridosha Balance: Finding Your Prakriti
          </h2>
          <p className="text-gray-600 text-sm font-medium">
            Every human body is governed by three primary biological energies (Doshas). Select a dosha to see how Panchakarma restores balance.
          </p>
        </div>

        {/* Dosha Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <button
            onClick={() => setActiveDosha("VATA")}
            className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
              activeDosha === "VATA"
                ? "border-[#1b4332] bg-[#1b4332] text-white shadow-xl scale-105"
                : "border-[#1b4332]/20 bg-white text-gray-700 hover:border-[#1b4332]"
            }`}
          >
            <div className="flex items-center justify-center gap-2 font-serif font-bold text-lg">
              <Wind className="w-5 h-5 text-[#d4a373]" />
              <span>Vata (वात)</span>
            </div>
            <p className={`text-xs mt-1 ${activeDosha === "VATA" ? "text-white/80" : "text-gray-500"}`}>
              Space & Air • Governs Motion
            </p>
          </button>

          <button
            onClick={() => setActiveDosha("PITTA")}
            className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
              activeDosha === "PITTA"
                ? "border-[#1b4332] bg-[#1b4332] text-white shadow-xl scale-105"
                : "border-[#1b4332]/20 bg-white text-gray-700 hover:border-[#1b4332]"
            }`}
          >
            <div className="flex items-center justify-center gap-2 font-serif font-bold text-lg">
              <Flame className="w-5 h-5 text-[#d4a373]" />
              <span>Pitta (पित्त)</span>
            </div>
            <p className={`text-xs mt-1 ${activeDosha === "PITTA" ? "text-white/80" : "text-gray-500"}`}>
              Fire & Water • Governs Digestion
            </p>
          </button>

          <button
            onClick={() => setActiveDosha("KAPHA")}
            className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
              activeDosha === "KAPHA"
                ? "border-[#1b4332] bg-[#1b4332] text-white shadow-xl scale-105"
                : "border-[#1b4332]/20 bg-white text-gray-700 hover:border-[#1b4332]"
            }`}
          >
            <div className="flex items-center justify-center gap-2 font-serif font-bold text-lg">
              <Droplets className="w-5 h-5 text-[#d4a373]" />
              <span>Kapha (कफ)</span>
            </div>
            <p className={`text-xs mt-1 ${activeDosha === "KAPHA" ? "text-white/80" : "text-gray-500"}`}>
              Water & Earth • Governs Structure
            </p>
          </button>
        </div>

        {/* Dosha Display Card with Box Outlines */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#1b4332]/20 shadow-lg max-w-4xl mx-auto space-y-6">
          {activeDosha === "VATA" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xl font-serif font-bold text-[#1b4332]">Vata Dosha — The Force of Nervous & Kinetic Motion</h3>
                <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-300">Primary Karma: BASTI</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                When Vata is aggravated, individuals experience dry skin, insomnia, anxiety, joint stiffness, bloating, constipation, and neurological pain.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-[#faf6f1] border-2 border-[#1b4332]/10">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Recommended Panchakarma</p>
                  <p className="text-xs font-bold text-[#1b4332] mt-1">Anuvasana & Niruha Basti, Abhyanga, Shirodhara</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#faf6f1] border-2 border-[#1b4332]/10">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Dietary Harmony</p>
                  <p className="text-xs font-bold text-[#1b4332] mt-1">Warm, unctuous, grounding cooked soups with ghee</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#faf6f1] border-2 border-[#1b4332]/10">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Balancing Herbs</p>
                  <p className="text-xs font-bold text-[#1b4332] mt-1">Ashwagandha, Bala, Dashamoola, Sesame oil</p>
                </div>
              </div>
            </div>
          )}

          {activeDosha === "PITTA" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xl font-serif font-bold text-[#1b4332]">Pitta Dosha — The Force of Metabolism & Thermal Transformation</h3>
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">Primary Karma: VIRECHANA</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Aggravated Pitta results in hyperacidity, peptic ulcers, inflammatory skin rashes, early balding, irritability, liver strain, and blood impurities.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-[#faf6f1] border-2 border-[#1b4332]/10">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Recommended Panchakarma</p>
                  <p className="text-xs font-bold text-[#1b4332] mt-1">Virechana (Purgation), Takradhara, Raktamokshana</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#faf6f1] border-2 border-[#1b4332]/10">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Dietary Harmony</p>
                  <p className="text-xs font-bold text-[#1b4332] mt-1">Cooling, sweet, bitter, astringent foods, coconut water</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#faf6f1] border-2 border-[#1b4332]/10">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Balancing Herbs</p>
                  <p className="text-xs font-bold text-[#1b4332] mt-1">Shatavari, Guduchi, Amalaki, Chandana, Ghee</p>
                </div>
              </div>
            </div>
          )}

          {activeDosha === "KAPHA" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xl font-serif font-bold text-[#1b4332]">Kapha Dosha — The Force of Cellular Cohesion & Lubrication</h3>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">Primary Karma: VAMANA</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Excess Kapha leads to lethargy, sluggish metabolism, congestion, sinus buildup, weight gain, excessive sleep, and respiratory distress.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-[#faf6f1] border-2 border-[#1b4332]/10">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Recommended Panchakarma</p>
                  <p className="text-xs font-bold text-[#1b4332] mt-1">Vamana (Emesis), Udvartana (Dry herbal scrub), Nasya</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#faf6f1] border-2 border-[#1b4332]/10">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Dietary Harmony</p>
                  <p className="text-xs font-bold text-[#1b4332] mt-1">Light, warm, pungent, spiced foods with honey</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#faf6f1] border-2 border-[#1b4332]/10">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Balancing Herbs</p>
                  <p className="text-xs font-bold text-[#1b4332] mt-1">Trikatu (Ginger, Black pepper, Pippali), Guggulu, Tulsi</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. AYURSUTRA CLINICAL OS PLATFORM FEATURES (Outlined Feature Boxes)       */}
      {/* ========================================================================= */}
      <section id="platform-features" className="py-20 bg-white border-y-2 border-[#1b4332]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 border border-[#1b4332]/20 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>AyurSutra Platform Suite</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1b4332]">
              Why Leading Panchakarma Centers Choose AyurSutra
            </h2>
            <p className="text-gray-600 text-sm font-medium">
              Purpose-built specifically for Ayurvedic hospitals, multi-specialty wellness centers, Vaidyas, and therapy practitioners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#faf6f1] border-2 border-[#1b4332]/15 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#1b4332] hover:shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1b4332]">Multi-Resource Scheduler</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Zero-conflict scheduling for rooms, Teakwood/Bronze Dronis, and gender-matched therapists with 15-min sanitation buffer (T_s).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#faf6f1] border-2 border-[#1b4332]/15 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#1b4332] hover:shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1b4332]">Therapist Touch Vitals</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Touch-optimized BP, Nadi pulse, and Agni/Sweda score logging designed for therapy room touchscreens.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#faf6f1] border-2 border-[#1b4332]/15 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#1b4332] hover:shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1b4332]">24/7 AI Care Assistant</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Interactive AI chatbot guiding patients through the 4-stage Samsarjana Krama recovery diet and clinical rules.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#faf6f1] border-2 border-[#1b4332]/15 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#1b4332] hover:shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1b4332]">AES-256 Data Protection</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Field-level Fernet encryption for clinical vitals and DISHA/HIPAA audit trail event logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FREQUENTLY ASKED QUESTIONS (Outlined Accordion)                        */}
      {/* ========================================================================= */}
      <section id="panchakarma-faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 border border-[#1b4332]/20 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span>Clarifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1b4332]">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-sm font-medium">
            Clear insights regarding Panchakarma procedures, preparation guidelines, and recovery protocols.
          </p>
        </div>

        <div className="space-y-4">
          {displayedFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-[#1b4332]/15 overflow-hidden shadow-xs transition-all hover:border-[#1b4332]/30"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <span className="font-serif font-bold text-sm sm:text-base text-[#1b4332] flex items-center gap-2">
                    <span className="text-[#b45309] font-sans font-bold">Q{idx + 1}.</span>
                    {faq.q}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-90 text-[#1b4332]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-[#faf6f1]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Expand / Collapse Remaining Questions Toggle Button */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setShowAllFaqs(!showAllFaqs)}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#faf6f1] text-[#1b4332] text-xs font-black uppercase tracking-wider border-2 border-[#1b4332]/20 hover:border-[#1b4332] shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            {showAllFaqs ? (
              <>
                <ChevronUp className="w-4 h-4 text-[#b45309]" />
                <span>Show Fewer Questions</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#b45309]" />
                <span>View All Questions ({remainingFaqs.length} More)</span>
                <ChevronDown className="w-4 h-4 text-[#1b4332]" />
              </>
            )}
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. BOTTOM CALL TO ACTION BANNER (Outlined Box)                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="py-14 px-6 sm:px-12 bg-[#1b4332] text-white rounded-3xl border-2 border-emerald-700 shadow-2xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
            Ready to Experience Authentic Panchakarma or Manage Your Clinic?
          </h2>
          <p className="text-white/80 text-sm max-w-2xl mx-auto leading-relaxed">
            Log in to the AyurSutra platform to access individualized treatment plans, schedule appointments, review daily recovery, or manage hospital resources.
          </p>
          <div>
            <button
              onClick={() => openAuthModal("SIGNIN")}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#d4a373] hover:bg-[#c69363] text-[#1b4332] text-xs font-black tracking-wider uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#d4a373]/80"
            >
              <Lock className="w-4 h-4 text-[#1b4332]" />
              <span>Login to AyurSutra Portal</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FOOTER                                                                */}
      {/* ========================================================================= */}
      <footer className="bg-[#122e22] text-white/80 py-12 px-4 sm:px-6 lg:px-8 border-t-2 border-emerald-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#d4a373] flex items-center justify-center font-serif text-lg font-bold text-[#1b4332]">
                आ
              </div>
              <span className="font-serif font-bold text-lg text-white">AyurSutra</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Classical Panchakarma Clinical Operating System connecting Vaidyas, Therapists, and Patients.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-bold text-[#d4a373] uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#d4a373]" />
              <span>Ayurvedic Wisdom</span>
            </p>
            <p className="font-serif font-bold text-xs sm:text-sm text-white leading-relaxed">
              "स्वस्थस्य स्वास्थ्यरक्षणं आतुरस्य विकारप्रशमनं च ।"
            </p>
            <p className="italic text-white/80 text-[11px] leading-relaxed">
              “To preserve the health of the healthy and to alleviate the disease of the diseased.”
            </p>
            <p className="text-[10px] text-[#d4a373] font-bold tracking-wider uppercase">
              — Charaka Samhita —
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-bold text-[#d4a373] uppercase tracking-wider">Quick Links</p>
            <ul className="space-y-1 text-white/70">
              <li><a href="#about-panchakarma" className="hover:text-white">What is Panchakarma</a></li>
              <li><a href="#five-karmas" className="hover:text-white">The 5 Karmas</a></li>
              <li><a href="#classical-therapies" className="hover:text-white">Therapies</a></li>
              <li><a href="#platform-features" className="hover:text-white">Digital Features</a></li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <p className="font-bold text-[#d4a373] uppercase tracking-wider">Access Portal</p>
            <button
              onClick={() => openAuthModal("SIGNIN")}
              className="w-full py-2.5 rounded-xl bg-[#d4a373] text-[#1b4332] font-extrabold hover:bg-[#c69363] transition-colors cursor-pointer border border-[#d4a373]/80"
            >
              Sign In to Account
            </button>
            <p className="text-[10px] text-white/50">DISHA & HIPAA compliant health data standard.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/50">
          © {new Date().getFullYear()} AyurSutra Digital Panchakarma OS. All rights reserved.
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 11. LOGIN MODAL OVERLAY (Opens when user clicks Login button)             */}
      {/* ========================================================================= */}
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border-2 border-[#1b4332]/20 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Close Dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Segmented Tabs: Sign In vs Sign Up */}
            <div className="flex items-center p-1.5 bg-gray-100/90 rounded-2xl border-2 border-gray-200/80 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("SIGNIN");
                  setStep("DETAILS");
                  setError(null);
                  setOtpSuccessMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === "SIGNIN"
                    ? "bg-[#1b4332] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In (Existing User)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("SIGNUP");
                  setStep("DETAILS");
                  setError(null);
                  setOtpSuccessMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === "SIGNUP"
                    ? "bg-[#1b4332] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign Up (New Account)</span>
              </button>
            </div>

            {/* Modal Header */}
            <div className="border-b border-gray-100 pb-4 pr-8">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#b45309] uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>{authMode === "SIGNIN" ? "AyurSutra Access Portal" : "New Registration Portal"}</span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-[#1b4332] mt-1">
                {step === "OTP_VERIFY"
                  ? "Enter Security OTP"
                  : authMode === "SIGNIN"
                  ? "Sign In to AyurSutra"
                  : "Create Your Account"}
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {step === "OTP_VERIFY"
                  ? `Enter the 6-digit OTP dispatched to your ${otpMethod === "PHONE" ? "mobile number" : "email inbox"}.`
                  : authMode === "SIGNIN"
                  ? "Select your role and enter your registered credentials to log in."
                  : "Fill in your details to register as a new patient, Vaidya doctor, or clinical therapist."}
              </p>
            </div>

            {/* Status / Error Alerts */}
            {error && (
              <div className="p-3.5 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {otpSuccessMessage && step === "OTP_VERIFY" && (
              <div className="p-3.5 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{otpSuccessMessage}</span>
              </div>
            )}

            {step === "DETAILS" ? (
              <div className="space-y-5">
                {/* Role Selection Grid */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {authMode === "SIGNIN" ? "Select Your Access Role" : "Registering Account As"}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          selectedRole === role
                            ? "border-[#1b4332] bg-[#1b4332]/10 ring-2 ring-[#1b4332]/20 font-bold"
                            : "border-gray-200 hover:border-[#1b4332]/40 bg-white"
                        }`}
                      >
                        <p className="text-xs font-bold text-[#1b4332] flex items-center justify-between">
                          <span>{ROLE_LABELS[role]}</span>
                          {selectedRole === role && <CheckCircle2 className="w-3.5 h-3.5 text-[#1b4332]" />}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1 font-medium">{ROLE_DESCRIPTIONS[role]}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Columns */}
                <div className="space-y-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#1b4332]" />
                      <span>{authMode === "SIGNIN" ? "Full Name / Display Name" : "Full Name *"}</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={authMode === "SIGNIN" ? "e.g. Rajesh Kumar (Optional for quick login)" : "e.g. Rajesh Kumar"}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-xs text-gray-900 focus:border-[#1b4332] focus:outline-none font-medium"
                    />
                  </div>

                  {/* Email and Phone Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#1b4332]" />
                        <span>{authMode === "SIGNIN" ? "Email Address" : "Email Address *"}</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rajesh@example.com"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-xs text-gray-900 focus:border-[#1b4332] focus:outline-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#1b4332]" />
                        <span>{authMode === "SIGNIN" ? "Phone Number" : "Phone Number *"}</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-xs text-gray-900 focus:border-[#1b4332] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* OTP Dispatch Target Selector */}
                  <div className="pt-1">
                    <span className="block text-[11px] text-gray-500 mb-1.5 font-bold">Send Security OTP to:</span>
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="otpMethod"
                          checked={otpMethod === "PHONE"}
                          onChange={() => setOtpMethod("PHONE")}
                          className="text-[#1b4332] focus:ring-[#1b4332]"
                        />
                        <span className="text-gray-700 font-semibold">Mobile SMS OTP</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="otpMethod"
                          checked={otpMethod === "EMAIL"}
                          onChange={() => setOtpMethod("EMAIL")}
                          className="text-[#1b4332] focus:ring-[#1b4332]"
                        />
                        <span className="text-gray-700 font-semibold">Email OTP Inbox</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full rounded-xl bg-[#1b4332] py-3.5 text-xs font-extrabold text-white transition hover:bg-[#2d6a4f] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg cursor-pointer border border-[#1b4332]"
                  >
                    <Send className="w-4 h-4 text-[#d4a373]" />
                    <span>{authMode === "SIGNIN" ? "Send Sign In OTP Code" : "Create Account & Send OTP"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectSignIn}
                    disabled={loading}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-gray-200"
                  >
                    {authMode === "SIGNIN"
                      ? `Quick Sign In as ${selectedRole}`
                      : `Quick Register & Access as ${fullName || selectedRole}`}
                  </button>
                </div>

                {/* Bottom Switcher helper */}
                <div className="text-center pt-1 border-t border-gray-100">
                  {authMode === "SIGNIN" ? (
                    <p className="text-xs text-gray-600">
                      New to AyurSutra?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("SIGNUP");
                          setError(null);
                        }}
                        className="text-[#1b4332] font-bold hover:underline cursor-pointer"
                      >
                        Create an Account (Sign Up)
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-gray-600">
                      Already have an AyurSutra account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("SIGNIN");
                          setError(null);
                        }}
                        className="text-[#1b4332] font-bold hover:underline cursor-pointer"
                      >
                        Sign In here
                      </button>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* OTP Verification Step */
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider text-center flex items-center justify-center gap-1">
                    <Smartphone className="w-4 h-4 text-[#1b4332]" />
                    <span>Enter 6-Digit OTP Code</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="e.g. 123456"
                    autoFocus
                    className="w-full text-center font-mono text-3xl font-bold tracking-widest bg-gray-50 border-2 border-[#1b4332] rounded-xl py-3 text-[#1b4332] focus:outline-none shadow-inner"
                  />
                  <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
                    Enter any 6-digit code (e.g. 123456) to verify {authMode === "SIGNIN" ? "sign-in" : "registration"}.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[#1b4332] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend OTP Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("DETAILS")}
                    className="text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
                  >
                    Change Details
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || enteredOtp.length !== 6}
                  className="w-full rounded-xl bg-[#1b4332] py-3.5 text-xs font-extrabold text-white transition hover:bg-[#2d6a4f] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg cursor-pointer border border-[#1b4332]"
                >
                  <Lock className="w-4 h-4 text-[#d4a373]" />
                  <span>{loading ? "Verifying..." : `Verify OTP & Access as ${fullName || selectedRole}`}</span>
                </button>
              </form>
            )}

            <p className="text-center text-[11px] text-gray-400 border-t border-gray-100 pt-3 font-medium">
              AyurSutra Panchakarma OS • Dev mode authentication & OTP flow
            </p>
          </div>
        </div>
      )}

      {/* Floating Scroll to Top / Login Button */}
      {scrolledDown && (
        <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2.5 items-end">
          <button
            onClick={() => openAuthModal("SIGNIN")}
            className="bg-[#d4a373] hover:bg-[#c69363] text-[#1b4332] px-4 py-3 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2 text-xs font-black uppercase tracking-wider border-2 border-[#1b4332]/20 hover:scale-105 cursor-pointer"
            title="Open Login Portal"
          >
            <Lock className="w-4 h-4 text-[#1b4332]" />
            <span>Login Portal</span>
          </button>

          <button
            onClick={scrollToTop}
            className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white p-3 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-emerald-700 hover:scale-105 cursor-pointer"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4 text-[#d4a373]" />
          </button>
        </div>
      )}
    </div>
  );
}
