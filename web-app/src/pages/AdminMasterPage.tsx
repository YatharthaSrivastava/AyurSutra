import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Sliders,
  Shield,
  Building,
  Check,
  X,
  Sparkles,
  Bot,
  MessageSquare
} from "lucide-react";

export default function AdminMasterPage() {
  const [activeCenter, setActiveCenter] = useState("Mumbai Panchakarma Hospital (Main)");
  const [featureToggles, setFeatureToggles] = useState({
    aiAssistant: true,
    whatsappAlerts: true,
    strictGenderMatching: true,
    fernetEncryption: true,
    autoSanitationBuffer: true,
  });

  const toggleFeature = (key: keyof typeof featureToggles) => {
    setFeatureToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const centers = [
    "Mumbai Panchakarma Hospital (Main)",
    "Bengaluru Ayurvedic Wellness Center",
    "Rishikesh Healing & Panchakarma Retreat",
  ];

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-1">
              <Sliders className="w-4 h-4 text-[#d4a373]" />
              <span>Phase 3 Sprint 3.2 Master Command Desk</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-[#1b4332]">
              Super Admin Master Console & Feature Switcher
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Global feature toggles, multi-center hospital management, and master system configurations.
            </p>
          </div>
        </div>

        {/* Center Selector Bar */}
        <div className="ayur-card p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1b4332]">
            <Building className="w-4 h-4 text-[#d4a373]" />
            <span>Active Healthcare Center:</span>
          </div>

          <select
            value={activeCenter}
            onChange={(e) => setActiveCenter(e.target.value)}
            className="rounded-xl border border-gray-200 text-xs font-bold text-gray-900 px-4 py-2 focus:border-[#1b4332] focus:outline-none"
          >
            {centers.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Feature Switches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Assistant */}
          <ToggleCard
            title="24/7 AI Patient Care Assistant"
            description="Enables interactive Paschatkarma dietary guidance chatbot for active patients."
            enabled={featureToggles.aiAssistant}
            onToggle={() => toggleFeature("aiAssistant")}
            icon={Bot}
          />

          {/* WhatsApp Alerts */}
          <ToggleCard
            title="Twilio WhatsApp Reminders"
            description="Automated dietary alert dispatches for Purvakarma ghee protocols."
            enabled={featureToggles.whatsappAlerts}
            onToggle={() => toggleFeature("whatsappAlerts")}
            icon={MessageSquare}
          />

          {/* Strict Gender Guard */}
          <ToggleCard
            title="Strict Gender Guard Enforcement"
            description="Enforces male-to-male and female-to-female therapist matching on scheduler."
            enabled={featureToggles.strictGenderMatching}
            onToggle={() => toggleFeature("strictGenderMatching")}
            icon={Shield}
          />

          {/* Fernet Encryption */}
          <ToggleCard
            title="Fernet AES-256 Field Encryption"
            description="Encrypts patient Nadi pulse, BP, and vitals at rest before database storage."
            enabled={featureToggles.fernetEncryption}
            onToggle={() => toggleFeature("fernetEncryption")}
            icon={Sparkles}
          />
        </div>
      </main>
    </div>
  );
}

function ToggleCard({
  title,
  description,
  enabled,
  onToggle,
  icon: Icon,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  icon: any;
}) {
  return (
    <div className="ayur-card p-6 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332] shrink-0 mt-0.5">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-[#1b4332]">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center shrink-0 ${
          enabled ? "bg-[#1b4332] justify-end" : "bg-gray-200 justify-start"
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-xs">
          {enabled ? <Check className="w-3.5 h-3.5 text-[#1b4332]" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
        </div>
      </button>
    </div>
  );
}
