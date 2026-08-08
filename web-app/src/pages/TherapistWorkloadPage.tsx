import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User
} from "lucide-react";

interface TherapistWorkload {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE";
  shiftHours: number; // H_t
  allocatedHours: number; // H_a
  sessionsCount: number;
}

export default function TherapistWorkloadPage() {
  const [therapists] = useState<TherapistWorkload[]>([
    { id: "TH-01", name: "Ramesh Kumar (Sr. Male Therapist)", gender: "MALE", shiftHours: 8, allocatedHours: 6.5, sessionsCount: 5 },
    { id: "TH-02", name: "Sunita Verma (Sr. Female Therapist)", gender: "FEMALE", shiftHours: 8, allocatedHours: 7.0, sessionsCount: 6 },
    { id: "TH-03", name: "Anil Joshi (Male Therapist)", gender: "MALE", shiftHours: 8, allocatedHours: 8.5, sessionsCount: 7 }, // W > 1.0 Warning!
    { id: "TH-04", name: "Meera Nair (Female Therapist)", gender: "FEMALE", shiftHours: 8, allocatedHours: 5.0, sessionsCount: 4 },
  ]);

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-1">
              <Activity className="w-4 h-4 text-[#d4a373]" />
              <span>Phase 2 Sprint 2.2 Workload Balance Engine</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-[#1b4332]">
              Therapist Workload Ratio Analytics (W ≤ 1.0)
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Monitors assigned therapy hours (H_a) against shift limits (H_t) to prevent fatigue during intense Panchakarma procedures.
            </p>
          </div>
        </div>

        {/* Formula Explanation Card */}
        <div className="ayur-card p-6 space-y-2 border-l-4 border-l-[#1b4332]">
          <div className="flex items-center gap-2 font-bold text-sm text-[#1b4332]">
            <Clock className="w-4 h-4 text-[#d4a373]" />
            <span>Workload Ratio Specification Formula</span>
          </div>
          <p className="font-mono text-[#1b4332] text-sm">
            W = H_a / H_t ≤ 1.0
          </p>
          <p className="text-xs text-gray-600">
            If Ratio W &gt; 1.0, the therapist is over-allocated, triggering an automatic clinical warning badge to reassign upcoming sessions.
          </p>
        </div>

        {/* Therapist Roster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {therapists.map((therapist) => {
            const ratio = Number((therapist.allocatedHours / therapist.shiftHours).toFixed(2));
            const isOverworked = ratio > 1.0;
            const percentage = Math.min(100, Math.round(ratio * 100));

            return (
              <div key={therapist.id} className="ayur-card p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1b4332]/10 flex items-center justify-center text-[#1b4332] font-bold text-xs">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#1b4332]">{therapist.name}</h3>
                      <p className="text-xs text-gray-500">{therapist.sessionsCount} Sessions Scheduled Today</p>
                    </div>
                  </div>

                  {isOverworked ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5" /> Overworked (W &gt; 1.0)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Load
                    </span>
                  )}
                </div>

                {/* Hours Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-gray-200">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Shift Hours (H_t)</span>
                    <span className="font-bold text-gray-900 font-mono">{therapist.shiftHours} hrs</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Assigned (H_a)</span>
                    <span className="font-bold text-gray-900 font-mono">{therapist.allocatedHours} hrs</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold block">Ratio (W)</span>
                    <span className={`font-mono font-bold ${isOverworked ? "text-red-600" : "text-emerald-700"}`}>
                      {ratio}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>Shift Capacity</span>
                    <span className="font-mono">{percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isOverworked ? "bg-red-500" : "bg-[#1b4332]"}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
