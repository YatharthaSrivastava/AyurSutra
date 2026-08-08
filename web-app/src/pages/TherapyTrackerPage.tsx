import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/lib/types";
import {
  History,
  CheckCircle2,
  Clock,
  User,
  Sparkles,
  Calendar,
  AlertCircle,
  FileText,
  Filter
} from "lucide-react";

interface PatientTherapyRecord {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  prakriti: string;
  therapies: {
    id: string;
    name: string;
    category: "PURVAKARMA" | "PRADHANAKARMA" | "PASCHATKARMA";
    takenStatus: "COMPLETED" | "IN_PROGRESS" | "NOT_TAKEN";
    sessionsCompleted: number;
    lastCompletedDate?: string;
    prescribedVaidya?: string;
    attendingTherapist?: string;
    clinicalOutcome?: string;
    historyLog?: { date: string; sessionNumber: number; therapist: string; notes: string }[];
  }[];
}

export default function TherapyTrackerPage() {
  const { session } = useAuth();
  if (!session) return null;

  // Mock multi-patient database for Vaidya/Manager/Admin, or self for Patient
  const [patientsData] = useState<PatientTherapyRecord[]>([
    {
      patientId: "PAT-101",
      patientName: "Aarav Sharma",
      age: 35,
      gender: "Male",
      prakriti: "Pitta-Vata",
      therapies: [
        {
          id: "TH-ABH",
          name: "Abhyanga & Swedana (Full Body Herb-Oil Massage & Steam)",
          category: "PURVAKARMA",
          takenStatus: "COMPLETED",
          sessionsCompleted: 7,
          lastCompletedDate: "2026-08-05",
          prescribedVaidya: "Vaidya Rajesh Sharma",
          attendingTherapist: "Ramesh Kumar (Sr. Male Therapist)",
          clinicalOutcome: "Vata stiffness relieved. Skin hydration improved.",
          historyLog: [
            { date: "2026-08-05", sessionNumber: 7, therapist: "Ramesh Kumar", notes: "Final Purvakarma session. Sweat achieved in 15 mins." },
            { date: "2026-08-04", sessionNumber: 6, therapist: "Ramesh Kumar", notes: "Dhanwantaram oil absorbed rapidly." },
            { date: "2026-08-01", sessionNumber: 1, therapist: "Ramesh Kumar", notes: "Initial Snehana started with 30ml ghee." },
          ],
        },
        {
          id: "TH-SHI",
          name: "Shirodhara (Continuous Medicated Oil Stream on Forehead)",
          category: "PRADHANAKARMA",
          takenStatus: "IN_PROGRESS",
          sessionsCompleted: 3,
          lastCompletedDate: "2026-08-08",
          prescribedVaidya: "Vaidya Rajesh Sharma",
          attendingTherapist: "Ramesh Kumar",
          clinicalOutcome: "Stress index decreased by 40%. Sleep quality normalized.",
          historyLog: [
            { date: "2026-08-08", sessionNumber: 3, therapist: "Ramesh Kumar", notes: "45 mins Kshiradhara. Deep meditative state induced." },
            { date: "2026-08-07", sessionNumber: 2, therapist: "Ramesh Kumar", notes: "30 mins Tailadhara on forehead point." },
          ],
        },
        {
          id: "TH-VIR",
          name: "Virechana Karma (Therapeutic Herbal Purgation)",
          category: "PRADHANAKARMA",
          takenStatus: "COMPLETED",
          sessionsCompleted: 1,
          lastCompletedDate: "2026-07-20",
          prescribedVaidya: "Vaidya Rajesh Sharma",
          attendingTherapist: "Ramesh Kumar",
          clinicalOutcome: "14 Vega evacuations recorded. Pitta toxins successfully expelled.",
          historyLog: [
            { date: "2026-07-20", sessionNumber: 1, therapist: "Ramesh Kumar", notes: "Trivrit Lehyam administered at 07:00 AM. Pulse stable." },
          ],
        },
        {
          id: "TH-BAS",
          name: "Kashaya Basti (Medicated Enema Therapy)",
          category: "PRADHANAKARMA",
          takenStatus: "NOT_TAKEN",
          sessionsCompleted: 0,
        },
        {
          id: "TH-NAS",
          name: "Nasya Karma (Nasal Herbal Drops Administration)",
          category: "PURVAKARMA",
          takenStatus: "COMPLETED",
          sessionsCompleted: 5,
          lastCompletedDate: "2026-06-15",
          prescribedVaidya: "Vaidya Rajesh Sharma",
          attendingTherapist: "Anil Joshi",
          clinicalOutcome: "Sinus congestion cleared. Headaches resolved.",
          historyLog: [
            { date: "2026-06-15", sessionNumber: 5, therapist: "Anil Joshi", notes: "Anu Thailam 6 drops per nostril." },
          ],
        },
        {
          id: "TH-KAT",
          name: "Kati Basti (Lumbar Warm Oil Reservoir Therapy)",
          category: "PRADHANAKARMA",
          takenStatus: "NOT_TAKEN",
          sessionsCompleted: 0,
        },
        {
          id: "TH-SAM",
          name: "Samsarjana Krama Diet Protocol (Peya to Krita Yusha)",
          category: "PASCHATKARMA",
          takenStatus: "IN_PROGRESS",
          sessionsCompleted: 2,
          lastCompletedDate: "2026-08-08",
          prescribedVaidya: "Vaidya Rajesh Sharma",
          clinicalOutcome: "Agni (digestive fire) gradually rebuilding on Day 2 Vilepi diet.",
        },
      ],
    },
    {
      patientId: "PAT-102",
      patientName: "Priya Patel",
      age: 36,
      gender: "Female",
      prakriti: "Vata-Kapha",
      therapies: [
        {
          id: "TH-SHI",
          name: "Shirodhara (Continuous Medicated Oil Stream on Forehead)",
          category: "PRADHANAKARMA",
          takenStatus: "COMPLETED",
          sessionsCompleted: 7,
          lastCompletedDate: "2026-08-07",
          prescribedVaidya: "Vaidya Sunita Verma",
          attendingTherapist: "Meera Nair",
          clinicalOutcome: "Insomnia completely resolved. Vata pacified.",
        },
        {
          id: "TH-ABH",
          name: "Abhyanga & Swedana (Full Body Herb-Oil Massage & Steam)",
          category: "PURVAKARMA",
          takenStatus: "COMPLETED",
          sessionsCompleted: 5,
          lastCompletedDate: "2026-08-01",
          prescribedVaidya: "Vaidya Sunita Verma",
          attendingTherapist: "Sunita Verma",
          clinicalOutcome: "Joint mobility enhanced.",
        },
        {
          id: "TH-VIR",
          name: "Virechana Karma (Therapeutic Herbal Purgation)",
          category: "PRADHANAKARMA",
          takenStatus: "NOT_TAKEN",
          sessionsCompleted: 0,
        },
      ],
    },
  ]);

  // Determine current active patient view
  const isPatientRole = session.role === "PATIENT";
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    isPatientRole ? "PAT-101" : patientsData[0].patientId
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [expandedTherapyId, setExpandedTherapyId] = useState<string | null>(null);

  const activePatientRecord =
    patientsData.find((p) => p.patientId === selectedPatientId) || patientsData[0];

  const filteredTherapies = activePatientRecord.therapies.filter((t) => {
    const matchesCat = categoryFilter === "ALL" || t.category === categoryFilter;
    const matchesStat = statusFilter === "ALL" || t.takenStatus === statusFilter;
    return matchesCat && matchesStat;
  });

  const completedCount = activePatientRecord.therapies.filter((t) => t.takenStatus === "COMPLETED").length;
  const activeCount = activePatientRecord.therapies.filter((t) => t.takenStatus === "IN_PROGRESS").length;
  const notTakenCount = activePatientRecord.therapies.filter((t) => t.takenStatus === "NOT_TAKEN").length;

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-1">
              <History className="w-4 h-4 text-[#d4a373]" />
              <span>Panchakarma Clinical History Module</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-[#1b4332]">
              Therapy History & Prior Intake Tracker
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Comprehensive clinical tracker verifying whether a patient has previously undergone specific Panchakarma therapies.
            </p>
          </div>

          {/* Patient Selector (For Doctor, Manager, Admin) */}
          {!isPatientRole && (
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-200 shadow-md">
              <User className="w-4 h-4 text-[#d4a373] ml-1" />
              <div className="text-xs">
                <span className="block text-[10px] uppercase font-bold text-gray-400">Select Patient Record</span>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="bg-transparent font-bold text-[#1b4332] focus:outline-none pr-2 cursor-pointer"
                >
                  {patientsData.map((p) => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.patientName} ({p.patientId}) — {p.prakriti}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Patient Summary Header Card */}
        <div className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Role Access: {ROLE_LABELS[session.role]}</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">
              {activePatientRecord.patientName} <span className="text-sm font-sans font-normal text-[#d4a373]">({activePatientRecord.patientId})</span>
            </h2>
            <p className="text-xs text-white/80">
              Age: <strong>{activePatientRecord.age} yrs</strong> • Gender: <strong>{activePatientRecord.gender}</strong> • Prakriti: <strong className="text-[#d4a373]">{activePatientRecord.prakriti}</strong>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
              <span className="text-[10px] text-[#d4a373] uppercase font-bold block">Taken / Completed</span>
              <span className="font-serif text-2xl font-bold text-white">{completedCount}</span>
            </div>

            <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
              <span className="text-[10px] text-amber-300 uppercase font-bold block">Currently Active</span>
              <span className="font-serif text-2xl font-bold text-white">{activeCount}</span>
            </div>

            <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
              <span className="text-[10px] text-white/60 uppercase font-bold block">Not Taken</span>
              <span className="font-serif text-2xl font-bold text-white/70">{notTakenCount}</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#d4a373]" />
            <span className="text-xs font-bold text-gray-500">Filter Category:</span>
            {["ALL", "PURVAKARMA", "PRADHANAKARMA", "PASCHATKARMA"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  categoryFilter === cat
                    ? "bg-[#1b4332] text-white font-bold shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Intake Status:</span>
            {["ALL", "COMPLETED", "IN_PROGRESS", "NOT_TAKEN"].map((stat) => (
              <button
                key={stat}
                onClick={() => setStatusFilter(stat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  statusFilter === stat
                    ? "bg-[#1b4332] text-white font-bold shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {stat === "COMPLETED" ? "Taken" : stat === "IN_PROGRESS" ? "Active" : stat === "NOT_TAKEN" ? "Not Taken" : "All Status"}
              </button>
            ))}
          </div>
        </div>

        {/* Therapy Tracker Cards Grid */}
        <div className="space-y-4">
          {filteredTherapies.map((therapy) => {
            const isTaken = therapy.takenStatus === "COMPLETED";
            const isActive = therapy.takenStatus === "IN_PROGRESS";
            const isNotTaken = therapy.takenStatus === "NOT_TAKEN";
            const isExpanded = expandedTherapyId === therapy.id;

            return (
              <div
                key={therapy.id}
                className={`ayur-card p-6 rounded-2xl space-y-4 shadow-md hover:shadow-xl transition-all border ${
                  isTaken
                    ? "bg-white border-[#2d6a4f]/30"
                    : isActive
                    ? "bg-amber-50/40 border-amber-300/80"
                    : "bg-gray-50/70 border-gray-200 opacity-75"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-gray-600 border border-gray-200">
                        {therapy.category}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-[#1b4332]">{therapy.name}</h3>
                    </div>
                    {therapy.lastCompletedDate && (
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#d4a373]" />
                        <span>Last Session Date: <strong className="text-[#1b4332]">{therapy.lastCompletedDate}</strong></span>
                        <span>•</span>
                        <span>Prescribed by: <strong className="text-[#1b4332]">{therapy.prescribedVaidya}</strong></span>
                      </p>
                    )}
                  </div>

                  {/* Prior Intake Status Badge */}
                  <div className="flex items-center gap-3 shrink-0">
                    {isTaken && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Taken ({therapy.sessionsCompleted} Sessions Completed)</span>
                      </span>
                    )}

                    {isActive && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold text-xs shadow-sm animate-pulse">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Currently Active ({therapy.sessionsCompleted} Sessions Done)</span>
                      </span>
                    )}

                    {isNotTaken && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 border border-gray-300 font-bold text-xs shadow-sm">
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                        <span>Not Taken Previously</span>
                      </span>
                    )}

                    {therapy.historyLog && therapy.historyLog.length > 0 && (
                      <button
                        onClick={() => setExpandedTherapyId(isExpanded ? null : therapy.id)}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1b4332] hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#d4a373]" />
                        <span>{isExpanded ? "Hide Logs" : "View Session History"}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Clinical Outcome & Attending Details */}
                {therapy.clinicalOutcome && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Clinical Outcome & Observations</span>
                    <p className="font-semibold text-[#1b4332]">{therapy.clinicalOutcome}</p>
                  </div>
                )}

                {/* Expanded Session History Log */}
                {isExpanded && therapy.historyLog && (
                  <div className="pt-2 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b4332] flex items-center gap-1.5">
                      <History className="w-4 h-4 text-[#d4a373]" />
                      Detailed Session Intake History Log
                    </h4>

                    <div className="space-y-2">
                      {therapy.historyLog.map((log) => (
                        <div key={log.sessionNumber} className="p-3 bg-white rounded-xl border border-gray-200 text-xs space-y-1 shadow-sm font-mono">
                          <div className="flex justify-between items-center text-[#1b4332] font-bold">
                            <span>Session #{log.sessionNumber} — Date: {log.date}</span>
                            <span className="text-gray-500 font-normal">Attending: {log.therapist}</span>
                          </div>
                          <p className="text-gray-600 text-[11px]">{log.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
