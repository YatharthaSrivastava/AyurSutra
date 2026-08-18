import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Search,
  FileText,
  Plus,
  Printer,
  ChevronRight,
  X,
  Stethoscope,
  Pill,
  Send
} from "lucide-react";

export interface VaidyaPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contactPhone: string;
  dominantDosha: string;
  vata: number;
  pitta: number;
  kapha: number;
  lastBp: string;
  lastPulse: number;
  temperature: string;
  spo2: string;
  agniStatus: "SAMA" | "MANDA" | "TIKSHNA" | "VISHAMA";
  treatmentPhase: string;
  assignedTherapist: string;
  chiefComplaint: string;
  clinicalNotes: string;
  prescriptions: {
    id: string;
    date: string;
    medicineName: string;
    dosage: string;
    anupana: string;
    timing: string;
  }[];
}

export default function VaidyaPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doshaFilter, setDoshaFilter] = useState("ALL");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("PAT-001");

  // Clinical Patients Data
  const [patients, setPatients] = useState<VaidyaPatient[]>([
    {
      id: "PAT-001",
      name: "Aarav Sharma",
      age: 42,
      gender: "Male",
      contactPhone: "+91 98765 43210",
      dominantDosha: "Pitta-Vata (पित्त-वात)",
      vata: 35,
      pitta: 45,
      kapha: 20,
      lastBp: "120/80 mmHg",
      lastPulse: 72,
      temperature: "98.4 °F",
      spo2: "99%",
      agniStatus: "SAMA",
      treatmentPhase: "Purvakarma (Snehana Day 3)",
      assignedTherapist: "Ramesh Kumar (Sr. Lead Therapist)",
      chiefComplaint: "Chronic lower back stiffness radiating to left thigh, insomnia, occasional acid reflux.",
      clinicalNotes: "[2026-08-05] Patient responded well to 50ml Mahatriphala Ghrita. Mild pitta heat observed in palms; prescribed Chandanadi taila head application.\n[2026-08-08] Snehana digestion time 4.5 hrs. Prepared for Virechana purgation tomorrow.",
      prescriptions: [
        { id: "RX-1", date: "2026-08-08", medicineName: "Mahatriphala Ghrita", dosage: "50 ml", anupana: "Warm Water", timing: "06:30 AM (Empty Stomach)" },
        { id: "RX-2", date: "2026-08-08", medicineName: "Dhanwantharam 101 Taila", dosage: "External", anupana: "Bashpa Sweda", timing: "09:00 AM" },
      ],
    },
    {
      id: "PAT-002",
      name: "Priya Patel",
      age: 36,
      gender: "Female",
      contactPhone: "+91 98234 56789",
      dominantDosha: "Vata-Kapha (वात-कफ)",
      vata: 50,
      pitta: 20,
      kapha: 30,
      lastBp: "110/75 mmHg",
      lastPulse: 68,
      temperature: "98.2 °F",
      spo2: "98%",
      agniStatus: "MANDA",
      treatmentPhase: "Pradhanakarma (Shirodhara Day 4)",
      assignedTherapist: "Sunita Verma (Sr. Lead Therapist)",
      chiefComplaint: "Severe stress-induced insomnia for 8 months and cervical neck stiffness.",
      clinicalNotes: "[2026-08-06] Deep relaxation achieved during 45-min Shirodhara with Brahmi taila.\n[2026-08-08] Sleep quality improved from 3 hours to 7 uninterrupted hours.",
      prescriptions: [
        { id: "RX-3", date: "2026-08-07", medicineName: "Brahmi Vati with Gold", dosage: "1 Tablet", anupana: "Warm Milk", timing: "09:00 PM (Bedtime)" },
        { id: "RX-4", date: "2026-08-07", medicineName: "Ashwagandharishta", dosage: "20 ml", anupana: "Equal Water", timing: "After Meals" },
      ],
    },
    {
      id: "PAT-003",
      name: "Vikram Malhotra",
      age: 55,
      gender: "Male",
      contactPhone: "+91 97112 34567",
      dominantDosha: "Kapha-Pitta (कफ-पित्त)",
      vata: 20,
      pitta: 30,
      kapha: 50,
      lastBp: "135/88 mmHg",
      lastPulse: 80,
      temperature: "98.6 °F",
      spo2: "97%",
      agniStatus: "MANDA",
      treatmentPhase: "Paschatkarma (Samsarjana Krama)",
      assignedTherapist: "Anil Joshi (Male Therapist)",
      chiefComplaint: "Metabolic lethargy, hyperlipidemia, and knee joint osteoarthritis.",
      clinicalNotes: "[2026-08-07] Virechana completed with 14 vegas. Ama toxins cleared successfully.\n[2026-08-09] Patient on Day 2 Vilepi diet. Energy levels recovering nicely.",
      prescriptions: [
        { id: "RX-5", date: "2026-08-08", medicineName: "Triphala Guggulu", dosage: "2 Tablets", anupana: "Warm Water", timing: "Twice daily" },
      ],
    },
  ]);

  // Note & Prescription Form State
  const [noteInput, setNoteInput] = useState("");
  const [showRxModal, setShowRxModal] = useState(false);
  const [newRxName, setNewRxName] = useState("");
  const [newRxDose, setNewRxDose] = useState("");
  const [newRxAnupana, setNewRxAnupana] = useState("Warm Water");
  const [newRxTiming, setNewRxTiming] = useState("After Meals");

  // Selected active patient
  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.treatmentPhase.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDosha = doshaFilter === "ALL" || p.dominantDosha.includes(doshaFilter);
      return matchSearch && matchDosha;
    });
  }, [patients, searchTerm, doshaFilter]);

  // Append time-stamped note
  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const dateStr = new Date().toISOString().split("T")[0];
    const formatted = `[${dateStr}] ${noteInput.trim()}`;

    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id
          ? { ...p, clinicalNotes: `${p.clinicalNotes}
${formatted}` }
          : p
      )
    );

    setNoteInput("");
  };

  // Add new prescription
  const handleAddRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRxName.trim()) return;

    const newRx = {
      id: `RX-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      medicineName: newRxName.trim(),
      dosage: newRxDose.trim() || "As advised",
      anupana: newRxAnupana.trim() || "Warm Water",
      timing: newRxTiming.trim() || "Twice daily",
    };

    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatient.id
          ? { ...p, prescriptions: [newRx, ...p.prescriptions] }
          : p
      )
    );

    setShowRxModal(false);
    setNewRxName("");
    setNewRxDose("");
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans selection:bg-[#d4a373]/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ========================================================================= */}
        {/* TOP HEADER                                                                */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#b45309] uppercase">
              <Stethoscope className="w-4 h-4 text-[#d4a373]" />
              <span>AyurSutra Vaidya Clinical Desk • EHR Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1b4332] tracking-tight">
              Assigned Patients & Clinical Consultation
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              Real-time monitoring of Tri-Dosha balances, vital signs, clinical case notes, and Panchakarma prescriptions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-gray-50 text-[#1b4332] text-xs font-bold border-2 border-[#1b4332]/20 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#b45309]" />
              <span>Export Case File</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN SPLIT CONSOLE: PATIENT DIRECTORY & DETAILED CASE SHEET               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: PATIENTS DIRECTORY (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border-2 border-[#1b4332]/15 shadow-xs space-y-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patient name, ID, phase..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#1b4332] focus:outline-none font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Dosha:</span>
                {["ALL", "Vata", "Pitta", "Kapha"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDoshaFilter(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      doshaFilter === d
                        ? "bg-[#1b4332] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Patients List Cards */}
            <div className="space-y-3">
              {filteredPatients.map((patient) => {
                const isSelected = patient.id === selectedPatient.id;
                return (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-xs space-y-3 ${
                      isSelected
                        ? "bg-white border-[#1b4332] ring-2 ring-[#1b4332]/20 shadow-md"
                        : "bg-white/80 hover:bg-white border-[#1b4332]/10"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-[#b45309] uppercase">{patient.id}</span>
                        <h4 className="font-serif font-bold text-base text-[#1b4332]">{patient.name}</h4>
                        <p className="text-xs text-gray-500 font-medium">{patient.age}y • {patient.gender}</p>
                      </div>
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                        {patient.dominantDosha.split(" ")[0]}
                      </span>
                    </div>

                    <div className="p-2.5 bg-[#faf6f1] rounded-xl border border-[#1b4332]/10 text-xs">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">Active Therapy Phase</span>
                      <p className="font-bold text-[#1b4332] mt-0.5 truncate">{patient.treatmentPhase}</p>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-600 font-medium pt-1">
                      <span>BP: <strong className="text-[#1b4332]">{patient.lastBp}</strong></span>
                      <span>Pulse: <strong className="text-[#1b4332]">{patient.lastPulse} bpm</strong></span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: PATIENT DETAIL CASE SHEET (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header Profile Card */}
            <div className="bg-white p-6 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1b4332] text-white text-[10px] font-bold">
                      {selectedPatient.id}
                    </span>
                    <h2 className="font-serif font-black text-2xl text-[#1b4332]">
                      {selectedPatient.name}
                    </h2>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    {selectedPatient.age} Yrs • {selectedPatient.gender} • Phone: {selectedPatient.contactPhone}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRxModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#d4a373]" />
                  <span>New Prescription</span>
                </button>
              </div>

              {/* Tri-Dosha Tripartite Balance Bars */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">
                  Prakriti Tri-Dosha Assessment (V: {selectedPatient.vata}% | P: {selectedPatient.pitta}% | K: {selectedPatient.kapha}%)
                </span>
                <div className="h-4 rounded-full bg-gray-100 overflow-hidden flex border border-gray-200">
                  <div style={{ width: `${selectedPatient.vata}%` }} className="bg-blue-600 h-full" title={`Vata: ${selectedPatient.vata}%`}></div>
                  <div style={{ width: `${selectedPatient.pitta}%` }} className="bg-rose-500 h-full" title={`Pitta: ${selectedPatient.pitta}%`}></div>
                  <div style={{ width: `${selectedPatient.kapha}%` }} className="bg-emerald-600 h-full" title={`Kapha: ${selectedPatient.kapha}%`}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-600">
                  <span className="text-blue-700">● Vata: {selectedPatient.vata}%</span>
                  <span className="text-rose-700">● Pitta: {selectedPatient.pitta}%</span>
                  <span className="text-emerald-700">● Kapha: {selectedPatient.kapha}%</span>
                </div>
              </div>

              {/* Vitals Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#faf6f1] p-3 rounded-2xl border border-[#1b4332]/10 text-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Blood Pressure</span>
                  <p className="font-bold text-[#1b4332] text-sm mt-0.5">{selectedPatient.lastBp}</p>
                </div>
                <div className="bg-[#faf6f1] p-3 rounded-2xl border border-[#1b4332]/10 text-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Heart Pulse</span>
                  <p className="font-bold text-[#1b4332] text-sm mt-0.5">{selectedPatient.lastPulse} bpm</p>
                </div>
                <div className="bg-[#faf6f1] p-3 rounded-2xl border border-[#1b4332]/10 text-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">SpO2 Oxygen</span>
                  <p className="font-bold text-[#1b4332] text-sm mt-0.5">{selectedPatient.spo2}</p>
                </div>
                <div className="bg-[#faf6f1] p-3 rounded-2xl border border-[#1b4332]/10 text-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">Agni Status</span>
                  <p className="font-bold text-emerald-800 text-sm mt-0.5">{selectedPatient.agniStatus}</p>
                </div>
              </div>

              {/* Chief Complaint */}
              <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200 text-xs">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">Chief Diagnosis & Complaints</span>
                <p className="text-rose-950 font-medium mt-0.5">{selectedPatient.chiefComplaint}</p>
              </div>
            </div>

            {/* Prescriptions & Herbal Medicines Table */}
            <div className="bg-white p-6 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif font-black text-lg text-[#1b4332] flex items-center gap-2">
                  <Pill className="w-5 h-5 text-emerald-700" />
                  <span>Active Ayurvedic Prescriptions</span>
                </h3>
                <span className="text-xs text-gray-500 font-semibold">{selectedPatient.prescriptions.length} Meds</span>
              </div>

              <div className="space-y-2.5">
                {selectedPatient.prescriptions.map((rx) => (
                  <div key={rx.id} className="p-3.5 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/10 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-serif font-bold text-sm text-[#1b4332]">{rx.medicineName}</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">Dose: <strong>{rx.dosage}</strong> • Anupana: <strong>{rx.anupana}</strong></p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 shrink-0">
                      {rx.timing}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Notes & Note Appender */}
            <div className="bg-white p-6 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif font-black text-lg text-[#1b4332] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#b45309]" />
                  <span>Clinical Case Notes & Vaidya Observations</span>
                </h3>
              </div>

              {/* Existing Notes Log */}
              <div className="bg-[#faf6f1] p-4 rounded-2xl border border-[#1b4332]/10 text-xs font-mono whitespace-pre-line text-gray-800 leading-relaxed max-h-48 overflow-y-auto">
                {selectedPatient.clinicalNotes}
              </div>

              {/* Append Note Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type new clinical remark or therapy observation..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#1b4332] focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="px-4 py-2.5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Append
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* NEW PRESCRIPTION MODAL                                                    */}
      {/* ========================================================================= */}
      {showRxModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border-2 border-[#1b4332]/20 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#1b4332]">
                <Pill className="w-5 h-5 text-[#d4a373]" />
                <h2 className="font-serif font-bold text-xl text-[#1b4332]">
                  New Prescription for {selectedPatient.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowRxModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRx} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Classical Medicine / Formulation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahatriphala Ghrita / Brahmi Vati"
                  value={newRxName}
                  onChange={(e) => setNewRxName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. 50 ml / 2 Tablets"
                    value={newRxDose}
                    onChange={(e) => setNewRxDose(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Anupana (Carrier)</label>
                  <input
                    type="text"
                    placeholder="e.g. Warm Water / Milk"
                    value={newRxAnupana}
                    onChange={(e) => setNewRxAnupana(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-medium text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Timing of Administration</label>
                <input
                  type="text"
                  placeholder="e.g. 06:30 AM on empty stomach / Bedtime"
                  value={newRxTiming}
                  onChange={(e) => setNewRxTiming(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-medium text-gray-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowRxModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold shadow-lg cursor-pointer"
                >
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
