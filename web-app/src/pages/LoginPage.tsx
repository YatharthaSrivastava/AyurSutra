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
  ChevronDown,
  ArrowUp,
  Award,
  Activity,
  CheckCircle,
  FileText,
  Calendar,
  HeartPulse,
  Bot
} from "lucide-react";

const ROLES: UserRole[] = ["PATIENT", "VAIDYA", "ADMIN", "THERAPIST"];

export default function LoginPage() {
  const { session, loginWithDevRole, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("PATIENT");

  // Inputs initialized as empty strings with placeholders
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpMethod, setOtpMethod] = useState<"PHONE" | "EMAIL">("PHONE");

  // OTP State
  const [step, setStep] = useState<"DETAILS" | "OTP_VERIFY">("DETAILS");
  const [enteredOtp, setEnteredOtp] = useState<string>("");
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Send OTP handler
  const handleSendOtp = () => {
    setError(null);
    if (!fullName.trim()) {
      setError("Please enter your display full name.");
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

    setStep("OTP_VERIFY");
    const target = otpMethod === "PHONE" ? phone : email;
    const channel = otpMethod === "PHONE" ? "mobile SMS" : "email inbox";
    setOtpSuccessMessage(`Security OTP dispatched to ${target}. Please check your ${channel}.`);
  };

  // Verify OTP and complete sign-in
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    // Accept any 6-digit number or code
    if (enteredOtp.trim().length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }

    try {
      await loginWithDevRole(selectedRole, fullName, email, phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete authentication.");
    }
  };

  // Direct bypass sign-in
  const handleDirectSignIn = async () => {
    setError(null);
    if (!fullName.trim()) {
      setError("Please enter your display full name.");
      return;
    }
    try {
      await loginWithDevRole(selectedRole, fullName, email, phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in.");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans scroll-smooth">
      {/* ========================================================================= */}
      {/* 1. HERO AUTHENTICATION SECTION (Parallax Background & Scroll Effects)    */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Background High-Res AyurSutra Branding Image — Fixed Parallax Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/assets/images/ayursutra_branding_hero.jpg"
            alt="AyurSutra Panchakarma Therapy Background"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          {/* Soft, crisp vignette gradient preserving 100% image clarity */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b4332]/80 via-[#1b4332]/50 to-black/40"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-8">
          {/* Left Column: AyurSutra Branding & 4 Pillars with Scroll Transition Fade */}
          <div className="lg:col-span-6 space-y-6 text-white p-6 sm:p-8 bg-[#1b4332]/75 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl transition-all duration-700 hover:shadow-3xl transform hover:-translate-y-1">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#d4a373] text-[#1b4332] text-xs font-extrabold tracking-widest uppercase shadow-md animate-pulse">
                <Sparkles className="w-4 h-4 text-[#1b4332]" />
                <span>AYURSUTRA DIGITAL OS</span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="w-16 h-16 rounded-2xl bg-[#d4a373] text-[#1b4332] flex items-center justify-center font-serif text-3xl font-extrabold shadow-xl shrink-0 transition-transform duration-500 hover:rotate-6">
                  आ
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-white tracking-tight leading-none drop-shadow-md">
                    AyurSutra
                  </h1>
                  <p className="text-sm sm:text-base font-serif italic text-[#d4a373] font-semibold mt-1">
                    Panchakarma Therapy for Holistic Healing
                  </p>
                </div>
              </div>
            </div>

            <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-lg font-medium bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              A digital platform for Panchakarma management, connected patient care, zero-conflict therapy scheduling, and 24/7 AI-guided recovery.
            </p>

            {/* 4 Pillars Grid (Exact match with Reference Screenshot Top-Left) */}
            <div className="grid grid-cols-2 gap-3 pt-2 max-w-lg">
              <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/30 text-center space-y-1.5 shadow-lg hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full bg-[#d4a373] text-[#1b4332] flex items-center justify-center mx-auto font-bold shadow">
                  <Leaf className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-serif font-extrabold text-white">Detoxify Body</h4>
                <p className="text-[10px] text-white/80 font-semibold">Purge toxins (Ama)</p>
              </div>

              <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/30 text-center space-y-1.5 shadow-lg hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full bg-[#d4a373] text-[#1b4332] flex items-center justify-center mx-auto font-bold shadow">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-serif font-extrabold text-white">Balance Doshas</h4>
                <p className="text-[10px] text-white/80 font-semibold">Vata - Pitta - Kapha</p>
              </div>

              <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/30 text-center space-y-1.5 shadow-lg hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full bg-[#d4a373] text-[#1b4332] flex items-center justify-center mx-auto font-bold shadow">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-serif font-extrabold text-white">Rejuvenate Mind</h4>
                <p className="text-[10px] text-white/80 font-semibold">Restore Manas peace</p>
              </div>

              <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/30 text-center space-y-1.5 shadow-lg hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full bg-[#d4a373] text-[#1b4332] flex items-center justify-center mx-auto font-bold shadow">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-serif font-extrabold text-white">Nurture Soul</h4>
                <p className="text-[10px] text-white/80 font-semibold">Holistic well-being</p>
              </div>
            </div>
          </div>

          {/* Right Column: Universal Authentication Glass Card */}
          <div className="lg:col-span-6 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-white/90 transition-all duration-500 hover:shadow-3xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#1b4332]">
                  {step === "DETAILS" ? "Universal Login Portal" : "Enter Security OTP"}
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {step === "DETAILS"
                    ? "Select your access role and enter registration details."
                    : `Enter the 6-digit OTP code sent to your ${otpMethod === "PHONE" ? "mobile number" : "email address"}.`}
                </p>
              </div>
              <span className="px-3.5 py-1 bg-[#1b4332] text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow">
                <Shield className="w-3.5 h-3.5 text-[#d4a373]" />
                {ROLE_LABELS[selectedRole]}
              </span>
            </div>

            {/* Status / Error Alerts */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {otpSuccessMessage && step === "OTP_VERIFY" && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{otpSuccessMessage}</span>
              </div>
            )}

            {step === "DETAILS" ? (
              <div className="space-y-5">
                {/* Role Selection Grid */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Select Access Role
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
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
                      <span>Display Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs text-gray-900 focus:border-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 font-medium"
                    />
                  </div>

                  {/* Email and Phone Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#1b4332]" />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rajesh@example.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs text-gray-900 focus:border-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#1b4332]" />
                        <span>Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs text-gray-900 focus:border-[#1b4332] focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 font-mono"
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
                    disabled={loading || !fullName.trim()}
                    className="w-full rounded-xl bg-[#1b4332] py-3.5 text-xs font-extrabold text-white transition hover:bg-[#2d6a4f] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-4 h-4 text-[#d4a373]" />
                    <span>Send Security OTP Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectSignIn}
                    disabled={loading || !fullName.trim()}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Direct Sign In ({fullName || "User"})
                  </button>
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
                    className="w-full text-center font-mono text-3xl font-bold tracking-widest bg-gray-50 border-2 border-[#1b4332] rounded-xl py-3 text-[#1b4332] focus:outline-none shadow-inner"
                  />
                  <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
                    Enter any 6-digit code (e.g. 123456) to verify sign-in.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[#1b4332] hover:underline flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend OTP Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("DETAILS")}
                    className="text-gray-500 hover:text-gray-800 font-medium"
                  >
                    Change Mobile / Email
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || enteredOtp.length !== 6}
                  className="w-full rounded-xl bg-[#1b4332] py-3.5 text-xs font-extrabold text-white transition hover:bg-[#2d6a4f] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Lock className="w-4 h-4 text-[#d4a373]" />
                  <span>{loading ? "Verifying..." : `Verify OTP & Access as ${fullName}`}</span>
                </button>
              </form>
            )}

            <p className="text-center text-[11px] text-gray-400 border-t border-gray-100 pt-4 font-medium">
              AyurSutra Panchakarma OS • Dev mode authentication & OTP flow
            </p>
          </div>
        </div>

        {/* Scroll Indicator Down Button */}
        <button
          onClick={() => {
            const el = document.getElementById("login-features-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 hover:text-white flex flex-col items-center gap-1 text-[11px] font-bold tracking-wider uppercase animate-bounce cursor-pointer z-20"
        >
          <span>Scroll to Explore Platform Features</span>
          <ChevronDown className="w-5 h-5 text-[#d4a373]" />
        </button>
      </section>

      {/* ========================================================================= */}
      {/* 2. SCROLL REVEAL SECTION: PLATFORM FEATURE CARDS GRID                     */}
      {/* ========================================================================= */}
      <section id="login-features-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1b4332]/10 text-[#1b4332] text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-[#d4a373]" />
            <span>Panchakarma Clinical Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1b4332]">
            Intelligent Operating System for Panchakarma Centers
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed font-medium">
            Designed for Vaidyas, Therapists, Patients, and Hospital Admins to coordinate therapies, vitals, scheduling, and dietary recovery.
          </p>
        </div>

        {/* Feature Cards Grid with Scroll Hover Elevation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="ayur-card p-6 rounded-3xl bg-white shadow-md border border-gray-200/80 space-y-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1b4332]">Multi-Resource Scheduler</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Zero-conflict scheduling for rooms, Teakwood/Bronze Dronis, and gender-matched therapists with 15-min sanitation buffer (T_s).
            </p>
          </div>

          <div className="ayur-card p-6 rounded-3xl bg-white shadow-md border border-gray-200/80 space-y-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1b4332]">Therapist Touch Vitals</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Touch-optimized BP, Nadi pulse, and Agni/Sweda score logging designed for therapy room touchscreens.
            </p>
          </div>

          <div className="ayur-card p-6 rounded-3xl bg-white shadow-md border border-gray-200/80 space-y-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1b4332]">24/7 AI Care Assistant</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Interactive AI chatbot guiding patients through the 4-stage Samsarjana Krama recovery diet and clinical rules.
            </p>
          </div>

          <div className="ayur-card p-6 rounded-3xl bg-white shadow-md border border-gray-200/80 space-y-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1b4332]">AES-256 Data Protection</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Field-level Fernet encryption for clinical vitals and DISHA/HIPAA audit trail event logs.
            </p>
          </div>
        </div>

        {/* Quality Guarantee Footer Bar */}
        <div className="bg-[#1b4332] text-white p-8 rounded-3xl shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Safe & Traditional</h4>
              <p className="text-[11px] text-white/70">Rooted in ancient Shastras</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Expert Practitioners</h4>
              <p className="text-[11px] text-white/70">Certified Ayurvedic Vaidyas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Pure & Natural</h4>
              <p className="text-[11px] text-white/70">Highest quality formulations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">DISHA Compliant</h4>
              <p className="text-[11px] text-white/70">Full encryption & audit trails</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Scroll to Top Button */}
      {scrolledDown && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2 text-xs font-bold animate-bounce border border-emerald-700"
          title="Back to Login"
        >
          <ArrowUp className="w-4 h-4 text-[#d4a373]" />
          <span>Back to Login</span>
        </button>
      )}
    </div>
  );
}
