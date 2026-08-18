import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
  ClipboardList,
  Flame,
  Utensils,
  Leaf,
  User,
  Plus,
  Printer,
  Award,
  Check,
  X,
  Search
} from "lucide-react";

export interface TreatmentTask {
  id: string;
  phase: "PURVAKARMA" | "PRADHANAKARMA" | "PASCHATKARMA" | "RASAYANA";
  dayNumber: number;
  timeOfDay: "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";
  timeStr: string;
  title: string;
  formulation: string;
  dosage: string;
  anupana: string; // Carrier, e.g. "Warm Water", "Warm Cow Milk"
  instructions: string;
  dietRestrictions: string;
  prescribedBy: string;
  completed: boolean;
  notes?: string;
}

export interface PatientCarePlan {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  prakriti: string;
  vikriti: string;
  primaryGoal: string;
  currentPhase: "PURVAKARMA" | "PRADHANAKARMA" | "PASCHATKARMA" | "RASAYANA";
  currentDay: number;
  totalDays: number;
  agniStatus: "SAMA (BALANCED)" | "MANDA (SLOW)" | "TIKSHNA (INTENSE)" | "VISHAMA (VARIABLE)";
  koshtha: "KRURA (HARD)" | "MADHYA (MEDIUM)" | "MRIDU (SOFT)";
  tasks: TreatmentTask[];
}

export default function TreatmentPlanPage() {
  const { session } = useAuth();
  const isPatient = session?.role === "PATIENT";

  // Multi-patient care plan database
  const [plansData, setPlansData] = useState<PatientCarePlan[]>([
    {
      patientId: "PAT-101",
      patientName: "Aarav Sharma",
      age: 38,
      gender: "Male",
      prakriti: "Pitta-Vata (पित्त-वात)",
      vikriti: "Severe Vata Aggravation & Sciatica",
      primaryGoal: "Bio-Purification (Shodhana) and Sciatica Nerve Decompression",
      currentPhase: "PURVAKARMA",
      currentDay: 4,
      totalDays: 21,
      agniStatus: "SAMA (BALANCED)",
      koshtha: "MADHYA (MEDIUM)",
      tasks: [
        {
          id: "TK-01",
          phase: "PURVAKARMA",
          dayNumber: 1,
          timeOfDay: "MORNING",
          timeStr: "06:30 AM",
          title: "Internal Snehapana (Deepana & Pachana Initial Ghee)",
          formulation: "Mahatriphala Ghrita (Murchita)",
          dosage: "30 ml",
          anupana: "Warm Ginger Infused Water",
          instructions: "Consume on empty stomach. Walk 100 paces. No solid food until hunger is felt.",
          dietRestrictions: "Strictly warm liquids, avoid dairy, cold items, and day sleep.",
          prescribedBy: "Dr. Rajesh Sharma (Sr. Vaidya)",
          completed: true,
          notes: "Tolerated well. Mild warmth in upper abdomen, digested in 4 hours.",
        },
        {
          id: "TK-02",
          phase: "PURVAKARMA",
          dayNumber: 2,
          timeOfDay: "MORNING",
          timeStr: "06:30 AM",
          title: "Progressive Snehapana Dose Escalation",
          formulation: "Mahatriphala Ghrita",
          dosage: "50 ml",
          anupana: "Warm Water with Cumin",
          instructions: "Consume at dawn. Rest in a warm, breeze-free room.",
          dietRestrictions: "Light Peya (thin rice soup) only after proper appetite strikes.",
          prescribedBy: "Dr. Rajesh Sharma",
          completed: true,
          notes: "Digestion took 5.5 hours. Belching without smell confirmed.",
        },
        {
          id: "TK-03",
          phase: "PURVAKARMA",
          dayNumber: 3,
          timeOfDay: "MORNING",
          timeStr: "09:00 AM",
          title: "Sarvanga Abhyanga & Bashpa Swedana",
          formulation: "Dhanwantharam 101 Taila & Dashamoola Steam",
          dosage: "100 ml oil application",
          anupana: "External Therapy",
          instructions: "Synchronised 7-position oleation followed by 15 mins herbal steam chamber.",
          dietRestrictions: "Warm spiced soup (Yusha) after bath.",
          prescribedBy: "Dr. Rajesh Sharma",
          completed: true,
          notes: "Profuse sweating achieved on forehead and back. Joint stiffness lessened.",
        },
        {
          id: "TK-04",
          phase: "PURVAKARMA",
          dayNumber: 4,
          timeOfDay: "EVENING",
          timeStr: "04:30 PM",
          title: "Pre-Purgation Snehana Assessment",
          formulation: "Warm Ksheerabala Head Massage & Foot Oleation (Pada Abhyanga)",
          dosage: "Local application",
          anupana: "External",
          instructions: "Prepare stomach and mind for tomorrow's Virechana Shodhana.",
          dietRestrictions: "Very light dinner of boiled rice & pomegranate juice before 7:00 PM.",
          prescribedBy: "Dr. Rajesh Sharma",
          completed: false,
          notes: "Scheduled for this afternoon.",
        },
        {
          id: "TK-05",
          phase: "PRADHANAKARMA",
          dayNumber: 5,
          timeOfDay: "MORNING",
          timeStr: "07:00 AM",
          title: "Virechana Karma (Therapeutic Herbal Purgation)",
          formulation: "Trivrit Lehyam + Triphala Decoction",
          dosage: "30 grams + 100 ml",
          anupana: "Lukewarm Water",
          instructions: "Administer on empty stomach in Suite 3. Vaidya will count vegas (evacuations).",
          dietRestrictions: "No food during purgation. Warm water sips as advised.",
          prescribedBy: "Dr. Rajesh Sharma",
          completed: false,
        },
        {
          id: "TK-06",
          phase: "PASCHATKARMA",
          dayNumber: 6,
          timeOfDay: "MORNING",
          timeStr: "11:00 AM",
          title: "Samsarjana Krama Phase 1: Peya (Thin Rice Gruel)",
          formulation: "Red Sali Rice Gruel (Unsalted)",
          dosage: "150 ml bowl",
          anupana: "Freshly Prepared Warm",
          instructions: "Sip slowly to gradually kindle dormant digestive Agni post-cleansing.",
          dietRestrictions: "No oils, no salt, no chili, no dairy.",
          prescribedBy: "Dr. Rajesh Sharma",
          completed: false,
        },
        {
          id: "TK-07",
          phase: "PASCHATKARMA",
          dayNumber: 7,
          timeOfDay: "AFTERNOON",
          timeStr: "01:00 PM",
          title: "Samsarjana Krama Phase 2: Vilepi & Akrita Yusha",
          formulation: "Semi-thick Rice Porridge & Clear Mung Soup",
          dosage: "1 small bowl each",
          anupana: "Warm Water",
          instructions: "Take mindfully in a calm environment.",
          dietRestrictions: "Light spices (pinch of roasted cumin & rock salt permitted).",
          prescribedBy: "Dr. Rajesh Sharma",
          completed: false,
        },
        {
          id: "TK-08",
          phase: "RASAYANA",
          dayNumber: 15,
          timeOfDay: "NIGHT",
          timeStr: "09:00 PM",
          title: "Rasayana & Dhatu Rejuvenation Protocol",
          formulation: "Brahma Rasayana & Ashwagandha Lehyam",
          dosage: "10 grams",
          anupana: "Warm A2 Cow Milk with Saffron",
          instructions: "Bedtime consumption to nourish nerve tissues and strengthen Ojas.",
          dietRestrictions: "Wholesome Satvic diet with ghee, seasonal fruits, and soaked almonds.",
          prescribedBy: "Dr. Rajesh Sharma",
          completed: false,
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
      primaryGoal: "Manas Shanti (Mental Peace), Vata Pacification, and Sleep Normalization",
      currentPhase: "PRADHANAKARMA",
      currentDay: 8,
      totalDays: 14,
      agniStatus: "SAMA (BALANCED)",
      koshtha: "MRIDU (SOFT)",
      tasks: [
        {
          id: "TK-201",
          phase: "PURVAKARMA",
          dayNumber: 1,
          timeOfDay: "MORNING",
          timeStr: "08:30 AM",
          title: "Shiro Abhyanga & Pada Abhyanga",
          formulation: "Brahmi & Chandanadi Taila",
          dosage: "40 ml",
          anupana: "External",
          instructions: "Calming scalp massage focused on Sahasrara & Ajna marma points.",
          dietRestrictions: "Warm, grounding khichdi.",
          prescribedBy: "Dr. Sunita Verma",
          completed: true,
          notes: "Immediate relaxation and reduction in forehead tension.",
        },
        {
          id: "TK-202",
          phase: "PRADHANAKARMA",
          dayNumber: 8,
          timeOfDay: "MORNING",
          timeStr: "10:30 AM",
          title: "Shirodhara (Continuous Medicated Stream)",
          formulation: "Ksheerabala 101 Taila",
          dosage: "Continuous Flow (45 Mins)",
          anupana: "External Shirodhara Droni",
          instructions: "Therapist maintains steady 38°C temperature with gentle oscillation.",
          dietRestrictions: "Avoid refrigerated drinks, direct breeze, and screen time for 2 hours.",
          prescribedBy: "Dr. Sunita Verma",
          completed: true,
          notes: "Patient entered deep alpha-state rest during session.",
        },
      ],
    },
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    isPatient ? "PAT-101" : plansData[0].patientId
  );
  const [activePhase, setActivePhase] = useState<"ALL" | "PURVAKARMA" | "PRADHANAKARMA" | "PASCHATKARMA" | "RASAYANA">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Adding New Task/Instruction
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskPhase, setNewTaskPhase] = useState<"PURVAKARMA" | "PRADHANAKARMA" | "PASCHATKARMA" | "RASAYANA">("PURVAKARMA");
  const [newTaskDay, setNewTaskDay] = useState<number>(1);
  const [newTaskTime, setNewTaskTime] = useState<"MORNING" | "AFTERNOON" | "EVENING" | "NIGHT">("MORNING");
  const [newTaskTimeStr, setNewTaskTimeStr] = useState("07:00 AM");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskFormulation, setNewTaskFormulation] = useState("");
  const [newTaskDosage, setNewTaskDosage] = useState("");
  const [newTaskAnupana, setNewTaskAnupana] = useState("Warm Water");
  const [newTaskInstructions, setNewTaskInstructions] = useState("");
  const [newTaskDiet, setNewTaskDiet] = useState("Warm satvic food only");

  // Current Patient
  const activePlan = useMemo(() => {
    return plansData.find((p) => p.patientId === selectedPatientId) || plansData[0];
  }, [plansData, selectedPatientId]);

  // Toggle completion of a task
  const toggleTask = (taskId: string) => {
    setPlansData((prev) =>
      prev.map((plan) => {
        if (plan.patientId === activePlan.patientId) {
          return {
            ...plan,
            tasks: plan.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
          };
        }
        return plan;
      })
    );
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return activePlan.tasks.filter((t) => {
      const matchPhase = activePhase === "ALL" || t.phase === activePhase;
      const matchSearch =
        !searchQuery.trim() ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.formulation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.instructions.toLowerCase().includes(searchQuery.toLowerCase());
      return matchPhase && matchSearch;
    });
  }, [activePlan, activePhase, searchQuery]);

  // Stats calculation
  const planStats = useMemo(() => {
    const total = activePlan.tasks.length;
    const completed = activePlan.tasks.filter((t) => t.completed).length;
    const pct = Math.round((completed / (total || 1)) * 100);
    return { total, completed, pct };
  }, [activePlan]);

  // Handle Add New Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: TreatmentTask = {
      id: `TK-${Date.now()}`,
      phase: newTaskPhase,
      dayNumber: Number(newTaskDay),
      timeOfDay: newTaskTime,
      timeStr: newTaskTimeStr,
      title: newTaskTitle.trim() || "Prescribed Care Instruction",
      formulation: newTaskFormulation.trim() || "Standard Ayurvedic Herb Formulation",
      dosage: newTaskDosage.trim() || "As directed by Vaidya",
      anupana: newTaskAnupana.trim() || "Warm Water",
      instructions: newTaskInstructions.trim() || "Follow clinical instructions carefully.",
      dietRestrictions: newTaskDiet.trim() || "Satvic diet, avoid heavy spices.",
      prescribedBy: session?.fullName ? `Dr. ${session.fullName}` : "Chief Vaidya",
      completed: false,
    };

    setPlansData((prev) =>
      prev.map((plan) => {
        if (plan.patientId === activePlan.patientId) {
          return {
            ...plan,
            tasks: [...plan.tasks, newTask],
          };
        }
        return plan;
      })
    );

    setShowAddTaskModal(false);
    setNewTaskTitle("");
    setNewTaskFormulation("");
    setNewTaskDosage("");
    setNewTaskInstructions("");
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans selection:bg-[#d4a373]/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ========================================================================= */}
        {/* TOP HEADER & PATIENT SELECTOR                                             */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#b45309] uppercase">
              <ClipboardList className="w-4 h-4 text-[#d4a373]" />
              <span>AyurSutra Clinical Care Plan • Shodhana Protocol Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1b4332] tracking-tight">
              Panchakarma Multi-Phase Care Plan & Daily Tasks
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              Structured clinical progression through Purvakarma, Pradhanakarma, Paschatkarma, and Rasayana rejuvenation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Patient Switcher for Doctors */}
            {!isPatient && (
              <div className="flex items-center gap-2 bg-[#faf6f1] px-3.5 py-2 rounded-2xl border-2 border-[#1b4332]/20 shadow-xs">
                <User className="w-4 h-4 text-[#b45309]" />
                <div className="text-xs">
                  <span className="block text-[9px] uppercase font-black text-gray-500">Patient Plan:</span>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="bg-transparent font-bold text-[#1b4332] focus:outline-none cursor-pointer pr-1"
                  >
                    {plansData.map((p) => (
                      <option key={p.patientId} value={p.patientId}>
                        {p.patientName} ({p.patientId})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-gray-50 text-[#1b4332] text-xs font-bold border-2 border-[#1b4332]/20 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#b45309]" />
              <span className="hidden sm:inline">Print Care Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddTaskModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#1b4332]"
            >
              <Plus className="w-4 h-4 text-[#d4a373]" />
              <span>Prescribe Daily Task</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PATIENT CARE GOAL & PROGRESS HERO CARD                                    */}
        {/* ========================================================================= */}
        <div className="bg-[#1b4332] text-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-700 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#d4a373] text-[#1b4332] text-xs font-black uppercase tracking-wider">
                  {activePlan.patientId} • Day {activePlan.currentDay} of {activePlan.totalDays}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20">
                  Prakriti: {activePlan.prakriti}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-300/30">
                  Agni: {activePlan.agniStatus}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {activePlan.patientName} — Treatment Care Protocol
              </h2>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                <strong>Clinical Objective:</strong> {activePlan.primaryGoal}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-xs shrink-0">
              <div className="text-right">
                <p className="text-[10px] text-[#d4a373] uppercase font-bold">Overall Completion</p>
                <p className="text-2xl font-serif font-bold text-white">{planStats.pct}%</p>
                <p className="text-[10px] text-white/70">{planStats.completed} of {planStats.total} Tasks Done</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Flame className="w-7 h-7 text-[#d4a373]" />
              </div>
            </div>
          </div>

          {/* Phase Stepper Cards (Clickable Filter) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setActivePhase("PURVAKARMA")}
              className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer ${
                activePhase === "PURVAKARMA"
                  ? "bg-white text-[#1b4332] shadow-lg border-white font-bold"
                  : "bg-white/5 text-white/90 hover:bg-white/10 border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold opacity-80">Phase 1 (Days 1–4)</span>
                <Leaf className="w-3.5 h-3.5 text-[#d4a373]" />
              </div>
              <p className="font-serif font-bold text-sm mt-1">Purvakarma</p>
              <p className="text-[10px] opacity-75 mt-0.5">Snehana & Swedana</p>
            </button>

            <button
              type="button"
              onClick={() => setActivePhase("PRADHANAKARMA")}
              className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer ${
                activePhase === "PRADHANAKARMA"
                  ? "bg-white text-[#1b4332] shadow-lg border-white font-bold"
                  : "bg-white/5 text-white/90 hover:bg-white/10 border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold opacity-80">Phase 2 (Days 5–10)</span>
                <Flame className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <p className="font-serif font-bold text-sm mt-1">Pradhanakarma</p>
              <p className="text-[10px] opacity-75 mt-0.5">Core 5 Shodhana Karmas</p>
            </button>

            <button
              type="button"
              onClick={() => setActivePhase("PASCHATKARMA")}
              className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer ${
                activePhase === "PASCHATKARMA"
                  ? "bg-white text-[#1b4332] shadow-lg border-white font-bold"
                  : "bg-white/5 text-white/90 hover:bg-white/10 border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold opacity-80">Phase 3 (Days 11–14)</span>
                <Utensils className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <p className="font-serif font-bold text-sm mt-1">Paschatkarma</p>
              <p className="text-[10px] opacity-75 mt-0.5">Samsarjana Diet Recovery</p>
            </button>

            <button
              type="button"
              onClick={() => setActivePhase("RASAYANA")}
              className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer ${
                activePhase === "RASAYANA"
                  ? "bg-white text-[#1b4332] shadow-lg border-white font-bold"
                  : "bg-white/5 text-white/90 hover:bg-white/10 border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold opacity-80">Phase 4 (Days 15–21)</span>
                <Award className="w-3.5 h-3.5 text-purple-300" />
              </div>
              <p className="font-serif font-bold text-sm mt-1">Rasayana</p>
              <p className="text-[10px] opacity-75 mt-0.5">Rejuvenation & Ojas</p>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TASK FILTER BAR                                                           */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setActivePhase("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border-2 ${
                activePhase === "ALL"
                  ? "bg-[#1b4332] text-white border-[#1b4332]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              All Phases ({activePlan.tasks.length})
            </button>
            <button
              type="button"
              onClick={() => setActivePhase("PURVAKARMA")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border-2 ${
                activePhase === "PURVAKARMA"
                  ? "bg-[#1b4332] text-white border-[#1b4332]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              Purvakarma
            </button>
            <button
              type="button"
              onClick={() => setActivePhase("PRADHANAKARMA")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border-2 ${
                activePhase === "PRADHANAKARMA"
                  ? "bg-[#1b4332] text-white border-[#1b4332]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              Pradhanakarma
            </button>
            <button
              type="button"
              onClick={() => setActivePhase("PASCHATKARMA")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border-2 ${
                activePhase === "PASCHATKARMA"
                  ? "bg-[#1b4332] text-white border-[#1b4332]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              Paschatkarma
            </button>
            <button
              type="button"
              onClick={() => setActivePhase("RASAYANA")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border-2 ${
                activePhase === "RASAYANA"
                  ? "bg-[#1b4332] text-white border-[#1b4332]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              Rasayana
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search instructions or formulation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:border-[#1b4332] focus:outline-none w-56 font-medium"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TREATMENT TASKS LIST                                                      */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border-2 border-[#1b4332]/15 text-center text-gray-500 shadow-sm">
              <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-semibold">No treatment tasks found for this phase.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white p-6 rounded-3xl border-2 transition-all shadow-xs space-y-4 ${
                  task.completed
                    ? "border-emerald-300 bg-white opacity-90"
                    : "border-[#1b4332]/20 hover:border-[#1b4332]/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        task.completed
                          ? "bg-emerald-700 text-white"
                          : "border-2 border-gray-300 hover:border-[#1b4332] text-transparent"
                      }`}
                      title={task.completed ? "Mark as Incomplete" : "Mark as Completed"}
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#1b4332] text-white">
                          Day {task.dayNumber} • {task.timeStr}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                          {task.phase}
                        </span>
                        <h3 className={`font-serif font-bold text-base text-[#1b4332] ${task.completed ? "line-through text-gray-400" : ""}`}>
                          {task.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 font-medium">
                        Prescribed by: <strong className="text-[#1b4332]">{task.prescribedBy}</strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-black uppercase border shrink-0 ${
                      task.completed
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-amber-50 text-amber-800 border-amber-300"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending Action"}
                  </span>
                </div>

                {/* Formulation & Guidelines Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/10 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Formulation & Dosage</span>
                    <p className="font-bold text-[#1b4332] mt-0.5">{task.formulation}</p>
                    <p className="text-[10px] text-gray-600">Dose: {task.dosage} • Anupana: {task.anupana}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Clinical Instructions</span>
                    <p className="text-gray-800 font-medium mt-0.5">{task.instructions}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">Dietary Rule (Pathya / Apathya)</span>
                    <p className="text-amber-900 font-semibold mt-0.5">{task.dietRestrictions}</p>
                  </div>
                </div>

                {task.notes && (
                  <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                    <span className="font-bold">Patient Response / Observation: </span>
                    <span>{task.notes}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* ADD TASK MODAL                                                            */}
      {/* ========================================================================= */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full p-6 sm:p-8 rounded-3xl border-2 border-[#1b4332]/20 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#1b4332]">
                <ClipboardList className="w-5 h-5 text-[#d4a373]" />
                <h2 className="font-serif font-bold text-xl text-[#1b4332]">
                  Prescribe Care Instruction for {activePlan.patientName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phase *</label>
                  <select
                    value={newTaskPhase}
                    onChange={(e) => setNewTaskPhase(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                  >
                    <option value="PURVAKARMA">Purvakarma</option>
                    <option value="PRADHANAKARMA">Pradhanakarma</option>
                    <option value="PASCHATKARMA">Paschatkarma</option>
                    <option value="RASAYANA">Rasayana</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Day #</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={newTaskDay}
                    onChange={(e) => setNewTaskDay(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Time of Day</label>
                  <select
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                  >
                    <option value="MORNING">Morning</option>
                    <option value="AFTERNOON">Afternoon</option>
                    <option value="EVENING">Evening</option>
                    <option value="NIGHT">Night</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Time Label</label>
                  <input
                    type="text"
                    value={newTaskTimeStr}
                    onChange={(e) => setNewTaskTimeStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Task Title / Procedure *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Internal Snehapana Dose Escalation"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Formulation & Medicine</label>
                  <input
                    type="text"
                    placeholder="e.g. Mahatriphala Ghrita"
                    value={newTaskFormulation}
                    onChange={(e) => setNewTaskFormulation(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. 50 ml"
                    value={newTaskDosage}
                    onChange={(e) => setNewTaskDosage(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Anupana (Carrier)</label>
                  <input
                    type="text"
                    placeholder="e.g. Warm Water / Milk"
                    value={newTaskAnupana}
                    onChange={(e) => setNewTaskAnupana(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-medium text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Clinical Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Instructions for patient or attending therapist..."
                  value={newTaskInstructions}
                  onChange={(e) => setNewTaskInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Dietary Restrictions (Pathya / Apathya)</label>
                <input
                  type="text"
                  placeholder="e.g. Warm ginger water only until appetite strikes."
                  value={newTaskDiet}
                  onChange={(e) => setNewTaskDiet(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-900 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold shadow-lg cursor-pointer"
                >
                  Add to Patient Care Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
