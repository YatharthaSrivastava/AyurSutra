import { useState, useMemo } from "react";
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
  X
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

export interface PatientTherapyRecord {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  prakriti: string;
  vikriti: string;
  chiefComplaint: string;
  allergies: string[];
  contactPhone: string;
  therapiesSummary: {
    id: string;
    name: string;
    category: "PURVAKARMA" | "PRADHANAKARMA" | "PASCHATKARMA";
    status: "COMPLETED" | "IN_PROGRESS" | "PRESCRIBED" | "NOT_TAKEN";
    sessionsCompleted: number;
    totalPrescribed: number;
    lastDate?: string;
    formulation?: string;
    outcomeSummary?: string;
  }[];
  sessionLogs: TherapySessionLog[];
}

export default function TherapyTrackerPage() {
  const { session } = useAuth();

  // Multi-patient comprehensive clinical database
  const [patientsData, setPatientsData] = useState<PatientTherapyRecord[]>([
    {
      patientId: "PAT-101",
      patientName: session?.fullName || "Aarav Sharma",
      age: 38,
      gender: "Male",
      prakriti: "Pitta-Vata (पित्त-वात)",
      vikriti: "Severe Vata Aggravation & Sciatica",
      chiefComplaint: "Lower back pain radiating to left leg, insomnia, and hyperacidity",
      allergies: ["Mustard Oil"],
      contactPhone: session?.phone || "+91 98765 43210",
      therapiesSummary: [
        {
          id: "TH-ABH",
          name: "Abhyanga & Swedana (Purvakarma)",
          category: "PURVAKARMA",
          status: "COMPLETED",
          sessionsCompleted: 7,
          totalPrescribed: 7,
          lastDate: "2026-08-05",
          formulation: "Dhanwantharam 101 Taila & Dashamoola Kwatha",
          outcomeSummary: "Vata stiffness fully relieved. Sweat achieved within 15 mins of herbal steam.",
        },
        {
          id: "TH-SHI",
          name: "Shirodhara (Continuous Medicated Stream)",
          category: "PRADHANAKARMA",
          status: "IN_PROGRESS",
          sessionsCompleted: 4,
          totalPrescribed: 7,
          lastDate: "2026-08-08",
          formulation: "Ksheerabala 101 Taila",
          outcomeSummary: "Stress index decreased by 45%. Night awakening episodes resolved.",
        },
        {
          id: "TH-VIR",
          name: "Virechana Karma (Therapeutic Purgation)",
          category: "PRADHANAKARMA",
          status: "COMPLETED",
          sessionsCompleted: 1,
          totalPrescribed: 1,
          lastDate: "2026-07-20",
          formulation: "Trivrit Lehyam (30g) + Triphala Kashaya",
          outcomeSummary: "14 Vega evacuations recorded with Pravara Shuddhi (optimal cleansing).",
        },
        {
          id: "TH-BAS",
          name: "Kashaya & Sneha Basti (Enema Cycle)",
          category: "PRADHANAKARMA",
          status: "PRESCRIBED",
          sessionsCompleted: 0,
          totalPrescribed: 8,
          formulation: "Niruha (Dashamoola) & Anuvasana (Sahacharadi Taila)",
          outcomeSummary: "Scheduled for next week following Shirodhara completion.",
        },
        {
          id: "TH-NAS",
          name: "Nasya Karma (Nasal Herbal Administration)",
          category: "PURVAKARMA",
          status: "COMPLETED",
          sessionsCompleted: 5,
          totalPrescribed: 5,
          lastDate: "2026-06-15",
          formulation: "Anu Thailam (6 drops per nostril)",
          outcomeSummary: "Chronic sinus congestion cleared. Morning headaches relieved.",
        },
        {
          id: "TH-SAM",
          name: "Samsarjana Krama (Dietary Agni Rebuilding)",
          category: "PASCHATKARMA",
          status: "IN_PROGRESS",
          sessionsCompleted: 3,
          totalPrescribed: 7,
          lastDate: "2026-08-09",
          formulation: "Peya (Thin Gruel) -> Vilepi -> Krita Yusha (Lentil Soup)",
          outcomeSummary: "Digestive fire (Agni) smoothly transitioning without bloating.",
        },
      ],
      sessionLogs: [
        {
          id: "LOG-101",
          date: "2026-08-08",
          sessionNumber: 4,
          therapyName: "Shirodhara (Continuous Medicated Stream)",
          category: "PRADHANAKARMA",
          therapist: "Ramesh Kumar (Sr. Lead Therapist)",
          prescribedVaidya: "Dr. Rajesh Sharma (Sr. Vaidya)",
          formulation: "Ksheerabala 101 Taila (Warm 38°C)",
          durationMins: 45,
          vitals: { bp: "120/78 mmHg", pulse: "72 bpm" },
          outcome: "Deep meditative relaxation induced. Patient fell asleep during therapy.",
          notes: "Flow adjusted to continuous rhythmic oscillation across Ajna chakra.",
        },
        {
          id: "LOG-102",
          date: "2026-08-07",
          sessionNumber: 3,
          therapyName: "Shirodhara (Continuous Medicated Stream)",
          category: "PRADHANAKARMA",
          therapist: "Ramesh Kumar",
          prescribedVaidya: "Dr. Rajesh Sharma",
          formulation: "Ksheerabala 101 Taila",
          durationMins: 45,
          vitals: { bp: "122/80 mmHg", pulse: "74 bpm" },
          outcome: "Calm demeanor, pulse softened.",
          notes: "Scalp washed with lukewarm Shikakai water post-therapy.",
        },
        {
          id: "LOG-103",
          date: "2026-08-05",
          sessionNumber: 7,
          therapyName: "Abhyanga & Swedana (Purvakarma)",
          category: "PURVAKARMA",
          therapist: "Ramesh Kumar",
          prescribedVaidya: "Dr. Rajesh Sharma",
          formulation: "Dhanwantharam 101 Taila & Dashamoola steam",
          durationMins: 60,
          vitals: { bp: "118/76 mmHg", pulse: "70 bpm", sweatingTime: "12 mins" },
          outcome: "Samyak Swinna (proper sweating symptoms) achieved on forehead and limbs.",
          notes: "Final oleation day before Shirodhara transition.",
        },
        {
          id: "LOG-104",
          date: "2026-07-20",
          sessionNumber: 1,
          therapyName: "Virechana Karma (Therapeutic Purgation)",
          category: "PRADHANAKARMA",
          therapist: "Ramesh Kumar",
          prescribedVaidya: "Dr. Rajesh Sharma",
          formulation: "Trivrit Lehyam (30g) + Triphala Kashaya (100ml)",
          durationMins: 180,
          vitals: { bp: "116/74 mmHg", pulse: "76 bpm", vegaCount: 14 },
          outcome: "14 Vega discharges recorded. Pitta burning eliminated, tongue pink and clean.",
          notes: "Started Samsarjana Krama with warm Peya at 03:00 PM.",
        },
      ],
    },
    {
      patientId: "PAT-102",
      patientName: "Priya Patel",
      age: 36,
      gender: "Female",
      prakriti: "Vata-Kapha (वात-कफ)",
      vikriti: "Chronic Insomnia & Joint Stiffness",
      chiefComplaint: "Difficulty sleeping for 8 months, stiff neck and knee joints",
      allergies: ["None"],
      contactPhone: "+91 98234 56789",
      therapiesSummary: [
        {
          id: "TH-SHI",
          name: "Shirodhara (Continuous Medicated Stream)",
          category: "PRADHANAKARMA",
          status: "COMPLETED",
          sessionsCompleted: 7,
          totalPrescribed: 7,
          lastDate: "2026-08-07",
          formulation: "Brahmi & Chandanadi Taila",
          outcomeSummary: "Insomnia completely resolved. Deep natural 7.5 hours sleep restored.",
        },
        {
          id: "TH-ABH",
          name: "Abhyanga & Swedana (Purvakarma)",
          category: "PURVAKARMA",
          status: "COMPLETED",
          sessionsCompleted: 5,
          totalPrescribed: 5,
          lastDate: "2026-08-01",
          formulation: "Mahanarayana Taila",
          outcomeSummary: "Joint flexibility improved significantly. Morning stiffness reduced.",
        },
        {
          id: "TH-JAN",
          name: "Janu Basti (Knee Oil Reservoir Therapy)",
          category: "PRADHANAKARMA",
          status: "IN_PROGRESS",
          sessionsCompleted: 3,
          totalPrescribed: 7,
          lastDate: "2026-08-09",
          formulation: "Kottamchukkadi Taila",
          outcomeSummary: "Crepitus in left knee reduced by 60%.",
        },
      ],
      sessionLogs: [
        {
          id: "LOG-201",
          date: "2026-08-09",
          sessionNumber: 3,
          therapyName: "Janu Basti (Knee Oil Reservoir Therapy)",
          category: "PRADHANAKARMA",
          therapist: "Sunita Verma (Sr. Lead Therapist)",
          prescribedVaidya: "Dr. Sunita Verma",
          formulation: "Warm Kottamchukkadi Taila (Black Gram Flour Ring)",
          durationMins: 40,
          vitals: { bp: "114/72 mmHg", pulse: "68 bpm" },
          outcome: "Joint pain on knee flexion decreased noticeably.",
          notes: "Heated oil exchanged every 8 minutes maintaining constant 40°C.",
        },
        {
          id: "LOG-202",
          date: "2026-08-07",
          sessionNumber: 7,
          therapyName: "Shirodhara (Continuous Medicated Stream)",
          category: "PRADHANAKARMA",
          therapist: "Sunita Verma",
          prescribedVaidya: "Dr. Sunita Verma",
          formulation: "Brahmi Taila",
          durationMins: 45,
          vitals: { bp: "116/74 mmHg", pulse: "70 bpm" },
          outcome: "Final Shirodhara completed. Patient feels rested and mentally clear.",
          notes: "Advised to continue evening Brahmi tea and head oleation at home.",
        },
      ],
    },
    {
      patientId: "PAT-103",
      patientName: "Vikram Malhotra",
      age: 51,
      gender: "Male",
      prakriti: "Pitta-Kapha (पित्त-कफ)",
      vikriti: "Metabolic Syndrome & Fatty Liver",
      chiefComplaint: "Sluggish metabolism, high cholesterol, and chronic lethargy",
      allergies: ["Penicillin"],
      contactPhone: "+91 97112 34567",
      therapiesSummary: [
        {
          id: "TH-UDV",
          name: "Udvartana (Dry Herbal Powder Scrub)",
          category: "PURVAKARMA",
          status: "COMPLETED",
          sessionsCompleted: 7,
          totalPrescribed: 7,
          lastDate: "2026-08-02",
          formulation: "Kolakulathadi & Triphala Churna",
          outcomeSummary: "Lymphatic drainage enhanced. Weight reduced by 2.1 kg.",
        },
        {
          id: "TH-VIR",
          name: "Virechana Karma (Therapeutic Purgation)",
          category: "PRADHANAKARMA",
          status: "IN_PROGRESS",
          sessionsCompleted: 1,
          totalPrescribed: 1,
          lastDate: "2026-08-09",
          formulation: "Avipattikar Churna + Castor oil",
          outcomeSummary: "Under observation in Suite 3 with steady hydration.",
        },
      ],
      sessionLogs: [
        {
          id: "LOG-301",
          date: "2026-08-09",
          sessionNumber: 1,
          therapyName: "Virechana Karma (Therapeutic Purgation)",
          category: "PRADHANAKARMA",
          therapist: "Anil Joshi",
          prescribedVaidya: "Dr. Rajesh Sharma",
          formulation: "Avipattikar Churna + Eranda Taila",
          durationMins: 180,
          vitals: { bp: "124/82 mmHg", pulse: "78 bpm", vegaCount: 8 },
          outcome: "Middle phase of elimination. Pitta discharge active.",
          notes: "Warm water sipping every 15 minutes maintained.",
        },
      ],
    },
  ]);

  const isPatientRole = session?.role === "PATIENT";
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    isPatientRole ? "PAT-101" : patientsData[0].patientId
  );

  const [viewTab, setViewTab] = useState<"TIMELINE" | "SUMMARY" | "LOGS">("TIMELINE");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // New Session Log Modal State
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [newTherapyName, setNewTherapyName] = useState("Shirodhara (Continuous Medicated Stream)");
  const [newCategory, setNewCategory] = useState<"PURVAKARMA" | "PRADHANAKARMA" | "PASCHATKARMA">("PRADHANAKARMA");
  const [newSessionNum, setNewSessionNum] = useState(1);
  const [newTherapist, setNewTherapist] = useState("Ramesh Kumar (Sr. Lead Therapist)");
  const [newVaidya, setNewVaidya] = useState("Dr. Rajesh Sharma (Sr. Vaidya)");
  const [newFormulation, setNewFormulation] = useState("Ksheerabala 101 Taila");
  const [newDuration, setNewDuration] = useState(45);
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newBp, setNewBp] = useState("120/80 mmHg");
  const [newPulse, setNewPulse] = useState("72 bpm");
  const [newOutcome, setNewOutcome] = useState("Vata pacified, steady relaxation achieved.");
  const [newNotes, setNewNotes] = useState("Classical protocol followed accurately.");

  // Currently active selected patient
  const currentPatient = useMemo(() => {
    return patientsData.find((p) => p.patientId === selectedPatientId) || patientsData[0];
  }, [patientsData, selectedPatientId]);

  // Filtered session logs
  const filteredLogs = useMemo(() => {
    return currentPatient.sessionLogs.filter((log) => {
      const matchCat = categoryFilter === "ALL" || log.category === categoryFilter;
      const matchSearch =
        !searchQuery.trim() ||
        log.therapyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.therapist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.formulation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.notes.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [currentPatient, categoryFilter, searchQuery]);

  // Filtered therapies summary
  const filteredSummary = useMemo(() => {
    return currentPatient.therapiesSummary.filter((t) => {
      const matchCat = categoryFilter === "ALL" || t.category === categoryFilter;
      const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
      const matchSearch =
        !searchQuery.trim() ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.formulation && t.formulation.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchStatus && matchSearch;
    });
  }, [currentPatient, categoryFilter, statusFilter, searchQuery]);

  // Statistics counters for the active patient
  const patientStats = useMemo(() => {
    const totalPrescribed = currentPatient.therapiesSummary.reduce((acc, t) => acc + t.totalPrescribed, 0);
    const totalCompleted = currentPatient.therapiesSummary.reduce((acc, t) => acc + t.sessionsCompleted, 0);
    const progressPercentage = Math.round((totalCompleted / (totalPrescribed || 1)) * 100);
    const totalLogs = currentPatient.sessionLogs.length;
    return { totalPrescribed, totalCompleted, progressPercentage, totalLogs };
  }, [currentPatient]);

  // Add new session log handler
  const handleAddSessionLog = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: TherapySessionLog = {
      id: `LOG-${Date.now()}`,
      date: newDate,
      sessionNumber: Number(newSessionNum),
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

    setPatientsData((prev) =>
      prev.map((patient) => {
        if (patient.patientId === currentPatient.patientId) {
          // Increment sessions completed if summary exists
          const updatedSummary = patient.therapiesSummary.map((t) => {
            if (t.name.includes(newTherapyName.split(" ")[0])) {
              const newCompleted = Math.min(t.totalPrescribed, t.sessionsCompleted + 1);
              return {
                ...t,
                sessionsCompleted: newCompleted,
                lastDate: newDate,
                status: newCompleted >= t.totalPrescribed ? ("COMPLETED" as const) : ("IN_PROGRESS" as const),
              };
            }
            return t;
          });

          return {
            ...patient,
            therapiesSummary: updatedSummary,
            sessionLogs: [newLog, ...patient.sessionLogs],
          };
        }
        return patient;
      })
    );

    setShowAddLogModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans selection:bg-[#d4a373]/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ========================================================================= */}
        {/* 1. TOP HEADER & PATIENT SELECTOR                                          */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#b45309] uppercase">
              <History className="w-4 h-4 text-[#d4a373]" />
              <span>AyurSutra Clinical EHR • Prior Therapy Intake History</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1b4332] tracking-tight">
              Patient Therapy History & Intake Records
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              Verified clinical timeline of Purvakarma, Pradhanakarma (5 Karmas), and Paschatkarma sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Patient Switcher for Doctors & Admins */}
            {!isPatientRole && (
              <div className="flex items-center gap-2 bg-[#faf6f1] px-3.5 py-2 rounded-2xl border-2 border-[#1b4332]/20 shadow-xs">
                <User className="w-4 h-4 text-[#b45309]" />
                <div className="text-xs">
                  <span className="block text-[9px] uppercase font-black text-gray-500">Patient File:</span>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="bg-transparent font-bold text-[#1b4332] focus:outline-none cursor-pointer pr-1"
                  >
                    {patientsData.map((p) => (
                      <option key={p.patientId} value={p.patientId}>
                        {p.patientName} ({p.patientId}) — {p.prakriti.split(" ")[0]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Print & Log Actions */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-gray-50 text-[#1b4332] text-xs font-bold border-2 border-[#1b4332]/20 shadow-xs cursor-pointer"
              title="Print Therapy History Sheet"
            >
              <Printer className="w-4 h-4 text-[#b45309]" />
              <span className="hidden sm:inline">Export EHR</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddLogModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#1b4332]"
            >
              <Plus className="w-4 h-4 text-[#d4a373]" />
              <span>Record Intake / Session</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PATIENT CLINICAL DOSHA & PROFILE SNAPSHOT CARD                        */}
        {/* ========================================================================= */}
        <div className="bg-[#1b4332] text-white p-6 rounded-3xl border-2 border-emerald-700 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#d4a373] text-[#1b4332] text-xs font-black uppercase tracking-wider">
                {currentPatient.patientId}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20">
                Prakriti: {currentPatient.prakriti}
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-400/30">
                Vikriti: {currentPatient.vikriti}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {currentPatient.patientName}
              </h2>
              <p className="text-xs text-white/80 mt-1 font-medium">
                {currentPatient.age} Years • {currentPatient.gender} • Phone: {currentPatient.contactPhone}
              </p>
            </div>

            <div className="p-3 bg-black/20 rounded-2xl border border-white/10 text-xs space-y-1">
              <span className="text-[10px] text-[#d4a373] font-bold uppercase tracking-wide block">
                Primary Chief Complaint & Diagnosis
              </span>
              <p className="text-white/90 font-medium">{currentPatient.chiefComplaint}</p>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15 backdrop-blur-xs flex flex-col justify-center">
              <span className="text-[10px] text-[#d4a373] uppercase font-bold block">Total Sessions</span>
              <span className="font-serif text-2xl font-bold text-white mt-1">{patientStats.totalCompleted}</span>
              <span className="text-[9px] text-white/60">of {patientStats.totalPrescribed} prescribed</span>
            </div>

            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15 backdrop-blur-xs flex flex-col justify-center">
              <span className="text-[10px] text-amber-300 uppercase font-bold block">Shodhana Progress</span>
              <span className="font-serif text-2xl font-bold text-white mt-1">{patientStats.progressPercentage}%</span>
              <span className="text-[9px] text-emerald-300 font-bold">On Schedule</span>
            </div>

            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15 backdrop-blur-xs flex flex-col justify-center">
              <span className="text-[10px] text-white/70 uppercase font-bold block">Logged Entries</span>
              <span className="font-serif text-2xl font-bold text-white mt-1">{patientStats.totalLogs}</span>
              <span className="text-[9px] text-white/60">EHR Sessions</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. VIEW MODE TABS & FILTERS BAR                                           */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs">
          {/* Main View Tabs */}
          <div className="flex items-center p-1 bg-gray-100 rounded-2xl border border-gray-200">
            <button
              type="button"
              onClick={() => setViewTab("TIMELINE")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewTab === "TIMELINE"
                  ? "bg-[#1b4332] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Clinical Journey</span>
            </button>
            <button
              type="button"
              onClick={() => setViewTab("SUMMARY")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewTab === "SUMMARY"
                  ? "bg-[#1b4332] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Therapies Matrix</span>
            </button>
            <button
              type="button"
              onClick={() => setViewTab("LOGS")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewTab === "LOGS"
                  ? "bg-[#1b4332] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Session EHR Logs</span>
            </button>
          </div>

          {/* Filters and Live Search */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search formulation, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:border-[#1b4332] focus:outline-none w-48 sm:w-56 font-medium"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-gray-200 font-bold text-gray-700 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="PURVAKARMA">Purvakarma (Preparatory)</option>
              <option value="PRADHANAKARMA">Pradhanakarma (5 Karmas)</option>
              <option value="PASCHATKARMA">Paschatkarma (Recovery)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-gray-200 font-bold text-gray-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PRESCRIBED">Prescribed</option>
            </select>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CLINICAL JOURNEY TIMELINE                                          */}
        {/* ========================================================================= */}
        {viewTab === "TIMELINE" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-black text-xl text-[#1b4332] flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-700" />
                <span>Panchakarma Journey & Bio-Purification Milestones</span>
              </h3>
              <span className="text-xs text-gray-500 font-semibold">
                Chronological Medical Sequence
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-800/20">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">
                  No therapy records found matching the filter criteria.
                </div>
              ) : (
                filteredLogs.map((log, idx) => (
                  <div key={log.id} className="relative group">
                    {/* Timeline Node Bullet */}
                    <div className="absolute -left-[27px] sm:-left-[35px] top-1.5 w-6 h-6 rounded-full bg-[#1b4332] text-[#d4a373] flex items-center justify-center text-[10px] font-bold ring-4 ring-white shadow-md">
                      {filteredLogs.length - idx}
                    </div>

                    <div className="bg-[#faf6f1] p-5 rounded-2xl border-2 border-[#1b4332]/10 shadow-xs hover:border-[#1b4332]/30 transition-all space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/60 pb-2.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-[#1b4332] text-white">
                            {log.date}
                          </span>
                          <h4 className="font-serif font-bold text-base text-[#1b4332]">
                            {log.therapyName}
                          </h4>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                            Session #{log.sessionNumber}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-600 font-semibold">
                          <span>BP: <strong className="text-[#1b4332]">{log.vitals.bp}</strong></span>
                          <span>•</span>
                          <span>Pulse: <strong className="text-[#1b4332]">{log.vitals.pulse}</strong></span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-gray-200">
                          <span className="text-[10px] text-gray-500 font-bold uppercase block">Herbal Formulation Administered</span>
                          <p className="font-bold text-[#1b4332] mt-0.5">{log.formulation}</p>
                          <p className="text-[10px] text-gray-500 mt-1">Duration: {log.durationMins} mins • Supervised by {log.prescribedVaidya.split(" ")[0]}</p>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-gray-200">
                          <span className="text-[10px] text-gray-500 font-bold uppercase block">Observed Clinical Outcome</span>
                          <p className="font-bold text-emerald-800 mt-0.5">{log.outcome}</p>
                          <p className="text-[10px] text-gray-500 mt-1">Attended by Therapist: {log.therapist}</p>
                        </div>
                      </div>

                      {log.notes && (
                        <div className="p-2.5 bg-white/80 rounded-xl border border-gray-200 text-xs text-gray-700">
                          <span className="font-bold text-[#b45309]">Vaidya Clinical Note: </span>
                          <span>{log.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: THERAPIES SUMMARY MATRIX                                           */}
        {/* ========================================================================= */}
        {viewTab === "SUMMARY" && (
          <div className="space-y-4">
            {filteredSummary.map((item) => {
              const isDone = item.status === "COMPLETED";
              const isInProgress = item.status === "IN_PROGRESS";
              const pct = Math.round((item.sessionsCompleted / (item.totalPrescribed || 1)) * 100);

              return (
                <div
                  key={item.id}
                  className={`bg-white p-6 rounded-3xl border-2 transition-all shadow-xs space-y-4 ${
                    isDone
                      ? "border-emerald-300 bg-white"
                      : isInProgress
                      ? "border-amber-300 bg-amber-50/20"
                      : "border-gray-200 opacity-80"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 uppercase tracking-wide">
                          {item.category}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-[#1b4332]">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        {item.formulation || "Classical herb-mineral decoction protocol"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-black uppercase border ${
                          isDone
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : isInProgress
                            ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {item.status === "IN_PROGRESS" ? "Active Intake" : item.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar & Stats */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span>Therapy Sessions Progress</span>
                      <span>{item.sessionsCompleted} of {item.totalPrescribed} Sessions ({pct}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isDone ? "bg-emerald-600" : isInProgress ? "bg-amber-500" : "bg-gray-300"
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  {item.outcomeSummary && (
                    <div className="p-3 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/10 text-xs">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">Documented Clinical Response</span>
                      <p className="text-[#1b4332] font-semibold mt-0.5">{item.outcomeSummary}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DETAILED SESSION EHR LOGS TABLE                                    */}
        {/* ========================================================================= */}
        {viewTab === "LOGS" && (
          <div className="bg-white rounded-3xl border-2 border-[#1b4332]/15 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-serif font-black text-lg text-[#1b4332]">
                EHR Session Logs ({filteredLogs.length} Records)
              </h3>
              <span className="text-xs text-gray-500 font-bold">Encrypted DISHA Health Standard</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf6f1] text-[#1b4332] border-b border-gray-200 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Therapy & Session</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Vitals</th>
                    <th className="py-3.5 px-4">Formulation Administered</th>
                    <th className="py-3.5 px-4">Therapist</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{log.date}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#1b4332]">{log.therapyName}</p>
                        <span className="text-[10px] text-[#b45309] font-semibold">Session #{log.sessionNumber}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {log.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-700">
                        <span>{log.vitals.bp}</span> • <span>{log.vitals.pulse}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-800 max-w-[200px] truncate">
                        {log.formulation}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">{log.therapist.split(" ")[0]}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg cursor-pointer"
                        >
                          {expandedLogId === log.id ? "Hide" : "Details"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 4. MODAL: RECORD NEW THERAPY INTAKE SESSION                               */}
      {/* ========================================================================= */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full p-6 sm:p-8 rounded-3xl border-2 border-[#1b4332]/20 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#1b4332]">
                <History className="w-5 h-5 text-[#d4a373]" />
                <h2 className="font-serif font-bold text-xl text-[#1b4332]">
                  Record Therapy Intake for {currentPatient.patientName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddLogModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSessionLog} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Panchakarma Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                  >
                    <option value="PURVAKARMA">Purvakarma (Preparatory Oleation & Steam)</option>
                    <option value="PRADHANAKARMA">Pradhanakarma (Core 5 Bio-Purifications)</option>
                    <option value="PASCHATKARMA">Paschatkarma (Diet & Agni Recovery)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Session Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Therapy Procedure Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shirodhara (Continuous Medicated Stream)"
                  value={newTherapyName}
                  onChange={(e) => setNewTherapyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Session #</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newSessionNum}
                    onChange={(e) => setNewSessionNum(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Patient BP</label>
                  <input
                    type="text"
                    value={newBp}
                    onChange={(e) => setNewBp(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Patient Pulse</label>
                  <input
                    type="text"
                    value={newPulse}
                    onChange={(e) => setNewPulse(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Prescribing Vaidya</label>
                  <input
                    type="text"
                    value={newVaidya}
                    onChange={(e) => setNewVaidya(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Attending Therapist</label>
                  <input
                    type="text"
                    value={newTherapist}
                    onChange={(e) => setNewTherapist(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Herbal Formulation & Oil Used *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ksheerabala 101 Taila & Dashamoola Kwatha"
                  value={newFormulation}
                  onChange={(e) => setNewFormulation(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Observed Clinical Outcome</label>
                <input
                  type="text"
                  placeholder="e.g. Vata stiffness relieved, peaceful sleep induced."
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Clinical Notes & Vaidya Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Add details regarding patient tolerance, Agni strength, or precautions..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-900 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold shadow-lg cursor-pointer"
                >
                  Save & Log to Patient EHR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
