import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
  History,
  User,
  FileText,
  Plus,
  Search,
  Printer,
  Leaf,
  Activity,
  Layers,
  X,
  Edit3,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export interface TherapySessionLog {
  id: string;
  date: string;
  sessionNumber: number;
  therapyName: string;
  category: "PURVAKARMA" | "PRADHANAKARMA" | "PASCHATKARMA";
  therapist: string;
  prescribedVaidya: string;
  formulation: string;
  durationMins: number;
  vitals: {
    bp: string;
    pulse: string;
    vegaCount?: number;
    sweatingTime?: string;
  };
  outcome: string;
  notes: string;
}

export interface PatientProfileData {
  patientId: string;
  patientName: string;
  age: number | "";
  gender: string;
  prakriti: string;
  vikriti: string;
  chiefComplaint: string;
  allergies: string;
  contactPhone: string;
}

export default function TherapyTrackerPage() {
  const { session } = useAuth();
  const activeName = session?.fullName || "Aarav Sharma";
  const activePhone = session?.phone || "+91 98765 43210";

  // Patient Clinical Profile (loaded from localStorage or initialized with real user details)
  const [profile, setProfile] = useState<PatientProfileData>(() => {
    const saved = localStorage.getItem(`ayursutra_patient_profile_${session?.uid || "default"}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      patientId: `PAT-${session?.uid?.slice(-4) || "101"}`,
      patientName: activeName,
      age: 35,
      gender: "Male",
      prakriti: "Pitta-Vata (पित्त-वात)",
      vikriti: "Vata & Pitta Imbalance",
      chiefComplaint: "Digestive sluggishness, joint stiffness, and stress",
      allergies: "None",
      contactPhone: activePhone,
    };
  });

  useEffect(() => {
    localStorage.setItem(`ayursutra_patient_profile_${session?.uid || "default"}`, JSON.stringify(profile));
  }, [profile, session?.uid]);

  // Session Logs (Loaded from storage or user recorded)
  const [sessionLogs, setSessionLogs] = useState<TherapySessionLog[]>(() => {
    const saved = localStorage.getItem(`ayursutra_session_logs_${session?.uid || "default"}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "LOG-101",
        date: "2026-08-15",
        sessionNumber: 1,
        therapyName: "Abhyanga & Swedana (Purvakarma)",
        category: "PURVAKARMA",
        therapist: "Ramesh Kumar (Sr. Lead Therapist)",
        prescribedVaidya: "Dr. Rajesh Sharma (Sr. Vaidya)",
        formulation: "Dhanwantharam 101 Taila & Dashamoola herbal steam",
        durationMins: 60,
        vitals: { bp: "120/78 mmHg", pulse: "72 bpm", sweatingTime: "12 mins" },
        outcome: "Samyak Swinna achieved. Body stiffness substantially relieved.",
        notes: "Full body oleation followed by classical Bashpa Sweda steam box.",
      },
      {
        id: "LOG-102",
        date: "2026-08-17",
        sessionNumber: 2,
        therapyName: "Shirodhara (Taila Dhara)",
        category: "PRADHANAKARMA",
        therapist: "Sunita Verma (Sr. Lead Therapist)",
        prescribedVaidya: "Dr. Rajesh Sharma (Sr. Vaidya)",
        formulation: "Ksheerabala 101 Taila (Warm 38°C)",
        durationMins: 45,
        vitals: { bp: "118/76 mmHg", pulse: "70 bpm" },
        outcome: "Deep mental tranquility. Patient rested peacefully throughout the stream.",
        notes: "Continuous rhythmic stream across forehead for stress & insomnia relief.",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(`ayursutra_session_logs_${session?.uid || "default"}`, JSON.stringify(sessionLogs));
  }, [sessionLogs, session?.uid]);

  // Modals & Active Tab
  const [activeTab, setActiveTab] = useState<"JOURNEY" | "MATRIX" | "LOGS">("JOURNEY");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showRecordSessionModal, setShowRecordSessionModal] = useState(false);

  // Profile Edit State
  const [editAge, setEditAge] = useState<number | "">(profile.age);
  const [editGender, setEditGender] = useState(profile.gender);
  const [editPrakriti, setEditPrakriti] = useState(profile.prakriti);
  const [editVikriti, setEditVikriti] = useState(profile.vikriti);
  const [editComplaint, setEditComplaint] = useState(profile.chiefComplaint);
  const [editAllergies, setEditAllergies] = useState(profile.allergies);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      age: editAge,
      gender: editGender,
      prakriti: editPrakriti,
      vikriti: editVikriti,
      chiefComplaint: editComplaint,
      allergies: editAllergies,
    });
    setShowEditProfileModal(false);
  };

  // Record Session State
  const [newTherapyName, setNewTherapyName] = useState("Abhyanga & Swedana (Purvakarma)");
  const [newCategory, setNewCategory] = useState<"PURVAKARMA" | "PRADHANAKARMA" | "PASCHATKARMA">("PURVAKARMA");
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [newTherapist, setNewTherapist] = useState("Ramesh Kumar (Sr. Lead Therapist)");
  const [newVaidya, setNewVaidya] = useState("Dr. Rajesh Sharma (Sr. Vaidya)");
  const [newFormulation, setNewFormulation] = useState("Dhanwantharam 101 Taila");
  const [newDuration, setNewDuration] = useState(45);
  const [newBp, setNewBp] = useState("120/80 mmHg");
  const [newPulse, setNewPulse] = useState("72 bpm");
  const [newOutcome, setNewOutcome] = useState("Procedure well tolerated with optimal relaxation.");
  const [newNotes, setNewNotes] = useState("");

  const handleRecordSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: TherapySessionLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      date: newDate,
      sessionNumber: sessionLogs.length + 1,
      therapyName: newTherapyName,
      category: newCategory,
      therapist: newTherapist,
      prescribedVaidya: newVaidya,
      formulation: newFormulation,
      durationMins: Number(newDuration),
      vitals: { bp: newBp, pulse: newPulse },
      outcome: newOutcome,
      notes: newNotes,
    };

    setSessionLogs([newLog, ...sessionLogs]);
    setShowRecordSessionModal(false);
  };

  // Filtered session logs
  const filteredLogs = useMemo(() => {
    return sessionLogs.filter((log) => {
      return (
        !searchTerm.trim() ||
        log.therapyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.therapist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.outcome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [sessionLogs, searchTerm]);

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans selection:bg-[#d4a373]/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ========================================================================= */}
        {/* TOP HEADER & ACTIONS                                                      */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#b45309] uppercase">
              <History className="w-4 h-4 text-[#d4a373]" />
              <span>AyurSutra Clinical EHR • Prior Therapy Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1b4332] tracking-tight">
              Patient Therapy History & Longitudinal Intake Log
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              Verified clinical records of Panchakarma procedures, vital responses, and dosage outcomes.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-gray-50 text-[#1b4332] text-xs font-bold border-2 border-[#1b4332]/20 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#b45309]" />
              <span className="hidden sm:inline">Print EHR</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRecordSessionModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#1b4332]"
            >
              <Plus className="w-4 h-4 text-[#d4a373]" />
              <span>Record New Session</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PATIENT CLINICAL BANNER (USER-EDITABLE - NO ASSUMED VALUES)               */}
        {/* ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1b4332] text-[#d4a373] flex items-center justify-center font-bold text-lg shadow-md">
                <User className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-serif font-black text-2xl text-[#1b4332]">{profile.patientName}</h2>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                    {profile.patientId}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {profile.gender} • {profile.age ? `${profile.age} Years` : "Age not specified"} • Phone: {profile.contactPhone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditAge(profile.age);
                  setEditGender(profile.gender);
                  setEditPrakriti(profile.prakriti);
                  setEditVikriti(profile.vikriti);
                  setEditComplaint(profile.chiefComplaint);
                  setEditAllergies(profile.allergies);
                  setShowEditProfileModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#1b4332]/20 hover:border-[#1b4332] text-[#1b4332] text-xs font-bold bg-[#faf6f1] transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#b45309]" />
                <span>Edit Health Details</span>
              </button>
            </div>
          </div>

          {/* Clinical Profile Badges */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3.5 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/10 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Prakriti Constitution</span>
              <p className="font-bold text-[#1b4332] text-xs">{profile.prakriti}</p>
            </div>

            <div className="p-3.5 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/10 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Current Vikriti</span>
              <p className="font-bold text-amber-900 text-xs">{profile.vikriti || "None reported"}</p>
            </div>

            <div className="p-3.5 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/10 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Chief Health Complaints</span>
              <p className="font-bold text-gray-800 text-xs truncate" title={profile.chiefComplaint}>{profile.chiefComplaint || "General wellness"}</p>
            </div>

            <div className="p-3.5 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/10 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Known Allergies</span>
              <p className="font-bold text-red-700 text-xs">{profile.allergies || "None"}</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW NAVIGATION TABS                                                      */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("JOURNEY")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "JOURNEY" ? "bg-[#1b4332] text-white shadow-xs" : "text-gray-600 hover:text-[#1b4332]"
              }`}
            >
              Clinical Journey Timeline
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("LOGS")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "LOGS" ? "bg-[#1b4332] text-white shadow-xs" : "text-gray-600 hover:text-[#1b4332]"
              }`}
            >
              Session Logs Table ({sessionLogs.length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search session logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:border-[#1b4332] focus:outline-none w-56 font-medium"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CLINICAL JOURNEY TIMELINE                                          */}
        {/* ========================================================================= */}
        {activeTab === "JOURNEY" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#1b4332]">
                Chronological Panchakarma Progression
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                {sessionLogs.length} Recorded Sessions
              </span>
            </div>

            {sessionLogs.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#faf6f1] text-[#1b4332] flex items-center justify-center mx-auto border-2 border-[#1b4332]/20">
                  <History className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#1b4332]">No Therapy Sessions Logged Yet</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Record your first completed therapy session or schedule an upcoming appointment.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRecordSessionModal(true)}
                    className="px-5 py-2.5 bg-[#1b4332] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    + Record First Session
                  </button>
                  <Link
                    to="/schedule"
                    className="px-5 py-2.5 border-2 border-[#1b4332] text-[#1b4332] text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-8 border-l-2 border-[#1b4332]/20 space-y-8">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="relative space-y-2">
                    <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-[#1b4332] border-4 border-white text-white flex items-center justify-center shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373]"></div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 uppercase">
                          {log.category}
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#1b4332]">{log.therapyName}</h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#b45309] bg-[#faf6f1] px-2.5 py-1 rounded-lg border border-gray-200">
                        {log.date} • Session #{log.sessionNumber}
                      </span>
                    </div>

                    <div className="p-4 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/10 space-y-2 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-700">
                        <p><strong>Formulation:</strong> {log.formulation}</p>
                        <p><strong>Therapist:</strong> {log.therapist}</p>
                        <p><strong>Prescribed By:</strong> {log.prescribedVaidya}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono font-bold text-emerald-800 bg-white p-2 rounded-xl border border-gray-200">
                        <span>Vitals: BP {log.vitals.bp}</span>
                        <span>Pulse: {log.vitals.pulse}</span>
                        <span>Duration: {log.durationMins} mins</span>
                      </div>

                      <p className="text-gray-800 font-medium"><strong>Clinical Outcome:</strong> {log.outcome}</p>
                      {log.notes && <p className="text-gray-500 italic text-[11px]">"{log.notes}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SESSION LOGS TABLE                                                 */}
        {/* ========================================================================= */}
        {activeTab === "LOGS" && (
          <div className="bg-white rounded-3xl border-2 border-[#1b4332]/15 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-[#1b4332]">
                Detailed Session Log Records
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b-2 border-gray-200 text-gray-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-3">Date / #</th>
                    <th className="py-3 px-3">Therapy & Category</th>
                    <th className="py-3 px-3">Formulation</th>
                    <th className="py-3 px-3">Therapist / Doctor</th>
                    <th className="py-3 px-3">Vitals</th>
                    <th className="py-3 px-3">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#b45309]">
                        {log.date}
                        <span className="block text-[10px] text-gray-400">S#{log.sessionNumber}</span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-[#1b4332]">{log.therapyName}</p>
                        <span className="text-[10px] text-gray-500 uppercase">{log.category}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-700">{log.formulation}</td>
                      <td className="py-3 px-3">
                        <p className="text-gray-900">{log.therapist}</p>
                        <span className="text-[10px] text-gray-500">{log.prescribedVaidya}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-emerald-800">
                        {log.vitals.bp} • {log.vitals.pulse}
                      </td>
                      <td className="py-3 px-3 text-gray-700 text-[11px]">{log.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT CLINICAL PROFILE (NO ASSUMED DATA)                          */}
      {/* ========================================================================= */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border-2 border-[#1b4332]/20 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#1b4332]">
                <Edit3 className="w-5 h-5 text-[#d4a373]" />
                <h2 className="font-serif font-bold text-xl text-[#1b4332]">
                  Edit Health & Clinical Details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Gender</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                  >
                    <option value="Male">Male (पुरुष)</option>
                    <option value="Female">Female (स्त्री)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Prakriti (Constitution)</label>
                  <select
                    value={editPrakriti}
                    onChange={(e) => setEditPrakriti(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                  >
                    <option value="Vata (वात)">Vata (वात)</option>
                    <option value="Pitta (पित्त)">Pitta (पित्त)</option>
                    <option value="Kapha (कफ)">Kapha (कफ)</option>
                    <option value="Pitta-Vata (पित्त-वात)">Pitta-Vata (पित्त-वात)</option>
                    <option value="Vata-Kapha (वात-कफ)">Vata-Kapha (वात-कफ)</option>
                    <option value="Tridoshic (त्रिदोषज)">Tridoshic (त्रिदोषज)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Vikriti (Imbalance)</label>
                  <input
                    type="text"
                    value={editVikriti}
                    onChange={(e) => setEditVikriti(e.target.value)}
                    placeholder="e.g. Vata Aggravation"
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Chief Health Complaints</label>
                <textarea
                  rows={2}
                  value={editComplaint}
                  onChange={(e) => setEditComplaint(e.target.value)}
                  placeholder="e.g. Lower back pain, insomnia, hyperacidity..."
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Known Allergies (Oils/Herbs/Foods)</label>
                <input
                  type="text"
                  value={editAllergies}
                  onChange={(e) => setEditAllergies(e.target.value)}
                  placeholder="e.g. Mustard oil, sesame, dust (or None)"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold shadow-lg cursor-pointer"
                >
                  Save Health Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RECORD NEW THERAPY SESSION                                       */}
      {/* ========================================================================= */}
      {showRecordSessionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border-2 border-[#1b4332]/20 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#1b4332]">
                <Plus className="w-5 h-5 text-[#d4a373]" />
                <h2 className="font-serif font-bold text-xl text-[#1b4332]">
                  Record Completed Therapy Session
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowRecordSessionModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordSession} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Therapy Name *</label>
                  <input
                    type="text"
                    required
                    value={newTherapyName}
                    onChange={(e) => setNewTherapyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Panchakarma Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                  >
                    <option value="PURVAKARMA">Purvakarma (Preparatory)</option>
                    <option value="PRADHANAKARMA">Pradhanakarma (Main)</option>
                    <option value="PASCHATKARMA">Paschatkarma (Post-Care)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Session Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Medicated Oils / Formulations *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhanwantharam 101 Taila, Ksheerabala..."
                  value={newFormulation}
                  onChange={(e) => setNewFormulation(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Assigned Therapist</label>
                  <input
                    type="text"
                    value={newTherapist}
                    onChange={(e) => setNewTherapist(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Supervising Vaidya</label>
                  <input
                    type="text"
                    value={newVaidya}
                    onChange={(e) => setNewVaidya(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Blood Pressure (BP)</label>
                  <input
                    type="text"
                    placeholder="e.g. 120/80 mmHg"
                    value={newBp}
                    onChange={(e) => setNewBp(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Pulse (bpm)</label>
                  <input
                    type="text"
                    placeholder="e.g. 72 bpm"
                    value={newPulse}
                    onChange={(e) => setNewPulse(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Clinical Outcome & Patient Response</label>
                <textarea
                  rows={2}
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  placeholder="e.g. Patient experienced deep relaxation, sweating achieved in 15 mins..."
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowRecordSessionModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold shadow-lg cursor-pointer"
                >
                  Save Session Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
