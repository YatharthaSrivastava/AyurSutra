import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  UserCheck,
  Search,
  HeartPulse,
  Sparkles,
  FileText,
  Plus
} from "lucide-react";

interface VaidyaPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  dominantDosha: string;
  vata: number;
  pitta: number;
  kapha: number;
  lastBp: string;
  lastPulse: number;
  treatmentPhase: string;
  assignedTherapist: string;
  clinicalNotes: string;
}

export default function VaidyaPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<VaidyaPatient | null>(null);

  const [patients, setPatients] = useState<VaidyaPatient[]>([
    {
      id: "PAT-001",
      name: "Aarav Sharma",
      age: 42,
      gender: "Male",
      dominantDosha: "Pitta-Vata",
      vata: 35,
      pitta: 45,
      kapha: 20,
      lastBp: "120/80 mmHg",
      lastPulse: 72,
      treatmentPhase: "Purvakarma (Snehana Day 3)",
      assignedTherapist: "Ramesh Kumar",
      clinicalNotes: "Patient responds well to Mahatriphala Ghrita. Mild Pitta heat aggravated in palms; prescribed Chandanadi oil massage.",
    },
    {
      id: "PAT-002",
      name: "Priya Patel",
      age: 36,
      gender: "Female",
      dominantDosha: "Vata-Kapha",
      vata: 50,
      pitta: 20,
      kapha: 30,
      lastBp: "110/75 mmHg",
      lastPulse: 68,
      treatmentPhase: "Pradhanakarma (Shirodhara)",
      assignedTherapist: "Sunita Verma",
      clinicalNotes: "Experiencing deep mental relaxation after 30 mins Taila Dhara. Sleep quality improved significantly.",
    },
    {
      id: "PAT-003",
      name: "Vikram Malhotra",
      age: 55,
      gender: "Male",
      dominantDosha: "Kapha-Pitta",
      vata: 20,
      pitta: 30,
      kapha: 50,
      lastBp: "135/88 mmHg",
      lastPulse: 80,
      treatmentPhase: "Paschatkarma (Samsarjana Krama)",
      assignedTherapist: "Anil Joshi",
      clinicalNotes: "Virechana purgation successful with 14 vegas. Prescribed Peya gruel diet for 2 days.",
    },
  ]);

  const [noteInput, setNoteInput] = useState("");

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNote = () => {
    if (!selectedPatient || !noteInput.trim()) return;

    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id
          ? { ...p, clinicalNotes: `${p.clinicalNotes}\n[${new Date().toLocaleDateString()}] ${noteInput}` }
          : p
      )
    );

    setSelectedPatient((prev) =>
      prev ? { ...prev, clinicalNotes: `${prev.clinicalNotes}\n[${new Date().toLocaleDateString()}] ${noteInput}` } : null
    );

    setNoteInput("");
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-1">
              <UserCheck className="w-4 h-4 text-[#d4a373]" />
              <span>MOD-02 Vaidya Clinical Desk</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-[#1b4332]">
              Assigned Patient Clinical Console
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Monitor assigned EHR profiles, Dosha tripartite balances, vital logs, and prescribe Panchakarma protocols.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#1b4332] shadow-sm"
            />
          </div>
        </div>

        {/* Main Grid: Patient List & Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Patient Cards List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Assigned Patients ({filteredPatients.length})
            </h3>

            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`ayur-card p-5 rounded-2xl cursor-pointer transition-all shadow-md hover:shadow-xl bg-white ${
                  selectedPatient?.id === patient.id
                    ? "border-[#1b4332] ring-2 ring-[#1b4332]/20"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#1b4332] text-base">{patient.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-gray-100 text-gray-600 font-bold">
                        {patient.id}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {patient.age} yrs • {patient.gender} • Dominant:{" "}
                      <strong className="text-[#1b4332]">{patient.dominantDosha}</strong>
                    </p>
                  </div>

                  <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <span>Phase: <strong className="text-[#1b4332]">{patient.treatmentPhase}</strong></span>
                  <span className="flex items-center gap-1 text-gray-700 font-semibold">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> {patient.lastPulse} bpm
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Patient Details & Clinical Log */}
          <div className="lg:col-span-7">
            {selectedPatient ? (
              <div className="ayur-card p-6 space-y-6 bg-white shadow-lg rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold font-serif text-[#1b4332]">{selectedPatient.name}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ID: {selectedPatient.id} • Assigned Therapist: {selectedPatient.assignedTherapist}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Current Vitals</span>
                    <span className="text-xs font-mono text-emerald-800 font-bold">
                      {selectedPatient.lastBp} | {selectedPatient.lastPulse} bpm
                    </span>
                  </div>
                </div>

                {/* Dosha Bar Distribution Chart */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b4332] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#d4a373]" />
                    Prakriti Tripartite Dosha Distribution
                  </h4>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#2d6a4f] font-bold">Vata (Air & Ether)</span>
                        <span className="font-mono text-gray-700 font-bold">{selectedPatient.vata}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div className="h-full bg-[#2d6a4f]" style={{ width: `${selectedPatient.vata}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-rose-600 font-bold">Pitta (Fire & Water)</span>
                        <span className="font-mono text-gray-700 font-bold">{selectedPatient.pitta}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div className="h-full bg-rose-500" style={{ width: `${selectedPatient.pitta}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-emerald-700 font-bold">Kapha (Earth & Water)</span>
                        <span className="font-mono text-gray-700 font-bold">{selectedPatient.kapha}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                        <div className="h-full bg-emerald-600" style={{ width: `${selectedPatient.kapha}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clinical Notes & History */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b4332] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#d4a373]" />
                    Vaidya Clinical Progress Notes
                  </h4>

                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 font-mono text-xs text-gray-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto shadow-inner">
                    {selectedPatient.clinicalNotes}
                  </div>

                  {/* Add note form */}
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={2}
                      placeholder="Type clinical observation, oil prescription, or diet recommendation..."
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:border-[#1b4332] focus:outline-none"
                    ></textarea>
                    <button
                      onClick={handleAddNote}
                      className="flex items-center gap-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all ml-auto shadow-md"
                    >
                      <Plus className="w-4 h-4 text-[#d4a373]" />
                      <span>Append Clinical Note</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="ayur-card p-12 text-center text-gray-500 shadow-md">
                <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm">Select a patient from the assigned roster to inspect EHR clinical notes.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
