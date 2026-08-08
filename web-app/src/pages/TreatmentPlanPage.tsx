import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  ClipboardList,
  CheckCircle2,
  Flame,
  Utensils,
  Leaf,
  Shield,
  User
} from "lucide-react";

interface TreatmentTask {
  id: string;
  phase: "PURVAKARMA" | "PRADHANAKARMA" | "PASCHATKARMA";
  title: string;
  description: string;
  prescribedBy: string;
  dayNumber: number;
  completed: boolean;
  notes?: string;
}

export default function TreatmentPlanPage() {
  const [activePhase, setActivePhase] = useState<"PURVAKARMA" | "PRADHANAKARMA" | "PASCHATKARMA">("PURVAKARMA");

  const [tasks, setTasks] = useState<TreatmentTask[]>([
    {
      id: "T-01",
      phase: "PURVAKARMA",
      title: "Internal Snehapana (Medicated Ghee Intake)",
      description: "Increase Mahatriphala Ghrita dosage daily from 30ml to 75ml in morning on empty stomach.",
      prescribedBy: "Vaidya Rajesh Sharma",
      dayNumber: 1,
      completed: true,
      notes: "Digestion normal, mild warmth reported.",
    },
    {
      id: "T-02",
      phase: "PURVAKARMA",
      title: "Sarvanga Abhyanga & Bashpa Sweda",
      description: "Full body synchronised oil massage with Dhanwantaram Thailam followed by herbal steam bath.",
      prescribedBy: "Vaidya Rajesh Sharma",
      dayNumber: 3,
      completed: true,
      notes: "Good sweat achieved, patient felt relaxed.",
    },
    {
      id: "T-03",
      phase: "PRADHANAKARMA",
      title: "Virechana Karma (Therapeutic Purgation)",
      description: "Administer Trivrit Lehyam (30g) at 07:00 AM with warm water. Track Vega (evacuation counts).",
      prescribedBy: "Vaidya Rajesh Sharma",
      dayNumber: 5,
      completed: false,
      notes: "Scheduled for tomorrow morning.",
    },
    {
      id: "T-04",
      phase: "PASCHATKARMA",
      title: "Samsarjana Krama Diet — Day 1 (Peya / Rice Gruel)",
      description: "Warm thin rice gruel without spices or salt. Sip slowly to restore Agni.",
      prescribedBy: "Vaidya Rajesh Sharma",
      dayNumber: 6,
      completed: false,
    },
    {
      id: "T-05",
      phase: "PASCHATKARMA",
      title: "Samsarjana Krama Diet — Day 2 (Vilepi & Akrita Yusha)",
      description: "Thicker rice porridge (Vilepi) for lunch; clear unseasoned green gram soup (Akrita Yusha) for dinner.",
      prescribedBy: "Vaidya Rajesh Sharma",
      dayNumber: 7,
      completed: false,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filteredTasks = tasks.filter((t) => t.phase === activePhase);

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-1">
              <ClipboardList className="w-4 h-4 text-[#d4a373]" />
              <span>Sprint 1.3 Clinical Lifecycle</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-[#1b4332]">
              Panchakarma 3-Phase Progression Care Plan
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Structured clinical workflow guiding patients through Purvakarma preparation, Pradhanakarma main therapy, and Paschatkarma post-dietary recovery.
            </p>
          </div>

          <div className="ayur-card px-4 py-3 flex items-center gap-4 text-xs bg-white shadow-md rounded-2xl border border-gray-200">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Patient Profile</span>
              <span className="font-bold text-[#1b4332] flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#d4a373]" /> Aarav Sharma (Prakriti: Pitta-Vata)
              </span>
            </div>
            <div className="border-l border-gray-200 pl-4">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Agni Status</span>
              <span className="font-bold text-[#1b4332] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#d4a373]" /> Sama Agni (Balanced)
              </span>
            </div>
          </div>
        </div>

        {/* 3-Phase Stepper Visualizer with Shadow Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Phase 1: Purvakarma */}
          <button
            onClick={() => setActivePhase("PURVAKARMA")}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden shadow-md hover:shadow-xl ${
              activePhase === "PURVAKARMA"
                ? "bg-white border-[#1b4332] ring-2 ring-[#1b4332]/20"
                : "bg-white/80 border-gray-200 hover:border-gray-300 opacity-90"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b4332] flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-[#d4a373]" /> Phase 1 (Days 1–4)
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                IN PROGRESS
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif text-[#1b4332]">Purvakarma</h3>
            <p className="text-xs text-gray-600 mt-1">
              Preparatory procedures: Snehana (oleation) & Swedana (sudation) to loosen ama & toxins.
            </p>
          </button>

          {/* Phase 2: Pradhanakarma */}
          <button
            onClick={() => setActivePhase("PRADHANAKARMA")}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden shadow-md hover:shadow-xl ${
              activePhase === "PRADHANAKARMA"
                ? "bg-white border-[#1b4332] ring-2 ring-[#1b4332]/20"
                : "bg-white/80 border-gray-200 hover:border-gray-300 opacity-90"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b4332] flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#2d6a4f]" /> Phase 2 (Day 5)
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold border border-gray-200">
                UPCOMING
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif text-[#1b4332]">Pradhanakarma</h3>
            <p className="text-xs text-gray-600 mt-1">
              Main cleansing therapies: Vamana, Virechana, or Basti procedures for bio-purification.
            </p>
          </button>

          {/* Phase 3: Paschatkarma */}
          <button
            onClick={() => setActivePhase("PASCHATKARMA")}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden shadow-md hover:shadow-xl ${
              activePhase === "PASCHATKARMA"
                ? "bg-white border-[#1b4332] ring-2 ring-[#1b4332]/20"
                : "bg-white/80 border-gray-200 hover:border-gray-300 opacity-90"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b4332] flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-[#2d6a4f]" /> Phase 3 (Days 6–10)
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold border border-gray-200">
                PENDING
              </span>
            </div>
            <h3 className="text-lg font-bold font-serif text-[#1b4332]">Paschatkarma</h3>
            <p className="text-xs text-gray-600 mt-1">
              Post-therapy recovery: Samsarjana Krama dietary regimen & Rasayana rejuvenation.
            </p>
          </button>
        </div>

        {/* Phase Details & Task Checklist */}
        <div className="ayur-card p-6 space-y-6 bg-white shadow-lg rounded-2xl border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#1b4332] flex items-center gap-2">
                <span>Active Clinical Tasks: {activePhase}</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Check off prescribed treatments upon clinical completion. All entries generate Vaidya audit logs.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-gray-500">Completed:</span>
              <span className="text-emerald-800 font-mono bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {filteredTasks.filter((t) => t.completed).length} / {filteredTasks.length}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <p className="text-gray-500 text-xs py-6 text-center">No tasks registered for this phase yet.</p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all shadow-sm ${
                    task.completed
                      ? "bg-slate-50 border-emerald-200 text-gray-700"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                        task.completed
                          ? "bg-[#1b4332] border-[#1b4332] text-white"
                          : "border-gray-300 hover:border-[#1b4332]"
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4
                          className={`font-semibold text-sm ${
                            task.completed ? "line-through text-gray-400" : "text-[#1b4332]"
                          }`}
                        >
                          Day {task.dayNumber}: {task.title}
                        </h4>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {task.prescribedBy}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600">{task.description}</p>

                      {task.notes && (
                        <div className="mt-2 text-[11px] bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-emerald-900 font-mono">
                          <strong>Clinical Observation:</strong> {task.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Samsarjana Krama Dietary Guide Box */}
        <div className="ayur-card p-6 rounded-2xl space-y-3 bg-white shadow-lg border border-amber-200">
          <div className="flex items-center gap-2 text-[#1b4332] text-sm font-bold border-b border-gray-100 pb-2">
            <Utensils className="w-5 h-5 text-[#d4a373]" />
            <span>Samsarjana Krama Dietary Recovery Protocol</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Following Panchakarma bio-cleansing (Pradhanakarma), Agni (digestive fire) is extremely delicate. The strict 7-stage dietary progression must be followed to avoid Ama toxicity:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[#1b4332] font-bold block text-[10px] uppercase">Stage 1: Peya</span>
              <span className="text-gray-600">Thin liquid rice water broth. No salt or spices.</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[#1b4332] font-bold block text-[10px] uppercase">Stage 2: Vilepi</span>
              <span className="text-gray-600">Thick rice gruel. Provides light nourishment.</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[#1b4332] font-bold block text-[10px] uppercase">Stage 3: Akrita Yusha</span>
              <span className="text-gray-600">Clear boiled green gram soup without ghee.</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[#1b4332] font-bold block text-[10px] uppercase">Stage 4: Krita Yusha</span>
              <span className="text-gray-600">Moong soup seasoned with Saindhava salt & ghee.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
