import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api-client";
import type { PatientProfile } from "@/lib/types";
import { UserPlus, CheckCircle2, Shield } from "lucide-react";

export default function PatientOnboardingPage() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [form, setForm] = useState({ full_name: "", gender: "Male", age: 30, phone: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    api
      .getMyProfile(session.token)
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const created = await api.registerPatient(session.token, form);
      setProfile(created);
      setMessage("Patient EHR profile created successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-1">
              <UserPlus className="w-4 h-4 text-[#d4a373]" />
              <span>MOD-02 Patient Onboarding</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-[#1b4332]">
              Patient Electronic Health Record (EHR) Registration
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Register new patient demographic details. Sensitive vitals are encrypted at rest using AES-256 Fernet encryption.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          {profile ? (
            <div className="ayur-card p-8 space-y-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Profile Active
                </div>
                <span className="text-xs font-mono text-gray-500 font-bold">ID: {profile.patient_id}</span>
              </div>

              <dl className="grid gap-6 sm:grid-cols-2">
                <Field label="Full Name" value={profile.full_name} />
                <Field label="Gender" value={profile.gender} />
                <Field label="Age" value={String(profile.age)} />
                <Field label="Security Status" value="Fernet Encrypted (FLE)" />
              </dl>

              {profile.active_treatment_plan && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                  <p className="text-xs font-bold text-amber-900 uppercase">Active Treatment Plan</p>
                  <p className="text-sm font-bold text-[#1b4332]">{profile.active_treatment_plan.protocol_name}</p>
                  <p className="text-xs text-gray-600">Current Phase: {profile.active_treatment_plan.current_phase}</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ayur-card p-8 space-y-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-lg font-serif font-bold text-[#1b4332]">
                <Shield className="w-5 h-5 text-[#d4a373]" />
                <span>Initialize Patient EHR</span>
              </div>

              <div className="space-y-4 text-xs">
                <Input label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
                
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-[#1b4332] focus:outline-none"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <Input
                  label="Age"
                  type="number"
                  value={String(form.age)}
                  onChange={(v) => setForm({ ...form, age: Number(v) })}
                />

                <Input label="Phone Number (optional)" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              </div>

              {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>}
              {message && <p className="text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">{message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#1b4332] py-3.5 font-bold text-white transition hover:bg-[#2d6a4f] shadow-md disabled:opacity-50 text-sm"
              >
                {loading ? "Creating Profile..." : "Create Patient EHR Profile"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200">
      <dt className="text-[10px] uppercase font-bold text-gray-400">{label}</dt>
      <dd className="mt-1 font-bold text-[#1b4332] text-sm">{value}</dd>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={label !== "Phone Number (optional)"}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-[#1b4332] focus:outline-none"
      />
    </div>
  );
}
