import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import {
  Calendar as CalendarIcon,
  Clock,
  ShieldAlert,
  Plus,
  CheckCircle2,
  Sparkles,
  X,
  Play,
  Search,
  Trash2,
  Edit3,
  CalendarDays,
  Check,
  AlertTriangle
} from "lucide-react";

export interface Appointment {
  id: string;
  patientName: string;
  patientGender: "MALE" | "FEMALE";
  patientAge?: number;
  doshaPrakriti?: "VATA" | "PITTA" | "KAPHA" | "VATA_PITTA" | "TRIDOSHIC";
  contactPhone?: string;
  therapyName: string;
  roomName: string;
  droniId: string;
  therapistName: string;
  therapistGender: "MALE" | "FEMALE";
  startTime: string; // e.g. "09:00"
  durationMins: number; // e.g. 45
  sanitationMins: number; // 15 mins buffer
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  chiefVaidyaOverride?: boolean;
  notes?: string;
}

const THERAPIES_PRESETS: Record<string, { duration: number; sanitation: number; droni: string; recommendedSuite: string }> = {
  "Shirodhara (Taila Dhara)": { duration: 45, sanitation: 15, droni: "DRONI-02 (Bronze Basin)", recommendedSuite: "Suite 2 - Shirodhara Droni" },
  "Abhyanga & Swedana (Purvakarma)": { duration: 60, sanitation: 15, droni: "DRONI-01 (Teakwood)", recommendedSuite: "Suite 1 - Snehana Droni" },
  "Kashaya Basti (Pradhanakarma)": { duration: 45, sanitation: 15, droni: "DRONI-03 (Basti Recliner)", recommendedSuite: "Suite 3 - Basti Karma Unit" },
  "Nasya Karma & Mukha Abhyanga": { duration: 30, sanitation: 15, droni: "DRONI-01 (Teakwood)", recommendedSuite: "Suite 1 - Snehana Droni" },
  "Vamana Karma (Emesis Protocol)": { duration: 90, sanitation: 20, droni: "DRONI-04 (VIP Herbal)", recommendedSuite: "Suite 4 - Panchakarma VIP Room" },
  "Takradhara (Cooling Buttermilk)": { duration: 45, sanitation: 15, droni: "DRONI-02 (Bronze Basin)", recommendedSuite: "Suite 2 - Shirodhara Droni" },
  "Udvartana (Dry Herbal Scrub)": { duration: 45, sanitation: 15, droni: "DRONI-01 (Teakwood)", recommendedSuite: "Suite 1 - Snehana Droni" },
  "Janu / Kati Basti (Local Pool)": { duration: 40, sanitation: 15, droni: "DRONI-03 (Basti Recliner)", recommendedSuite: "Suite 3 - Basti Karma Unit" },
};

const THERAPISTS = [
  { name: "Sunita Verma (Sr. Lead Therapist)", gender: "FEMALE" as const, exp: "8 yrs", specialty: "Shirodhara & Takradhara" },
  { name: "Meera Nair (Female Therapist)", gender: "FEMALE" as const, exp: "5 yrs", specialty: "Abhyanga & Swedana" },
  { name: "Kavita Joshi (Female Therapist)", gender: "FEMALE" as const, exp: "4 yrs", specialty: "Nasya & Basti" },
  { name: "Ramesh Kumar (Sr. Lead Therapist)", gender: "MALE" as const, exp: "9 yrs", specialty: "Abhyanga & Vamana" },
  { name: "Anil Joshi (Male Therapist)", gender: "MALE" as const, exp: "6 yrs", specialty: "Kashaya Basti & Raktamokshana" },
  { name: "Deepak Sharma (Male Therapist)", gender: "MALE" as const, exp: "4 yrs", specialty: "Udvartana & Snehana" },
];

const ROOMS_LIST = [
  { id: "Suite 1 - Snehana Droni", name: "Suite 1", type: "Snehana & Swedana", droni: "DRONI-01 (Teakwood)", color: "emerald" },
  { id: "Suite 2 - Shirodhara Droni", name: "Suite 2", type: "Shirodhara & Takradhara", droni: "DRONI-02 (Bronze Basin)", color: "amber" },
  { id: "Suite 3 - Basti Karma Unit", name: "Suite 3", type: "Basti & Virechana", droni: "DRONI-03 (Basti Recliner)", color: "sky" },
  { id: "Suite 4 - Panchakarma VIP Room", name: "Suite 4", type: "All-in-One VIP", droni: "DRONI-04 (VIP Herbal)", color: "purple" },
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

export default function SchedulePage() {
  const [searchParams] = useSearchParams();

  // Selected date state (defaults to today's date)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });

  const [selectedRoom, setSelectedRoom] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"TIMELINE" | "CARDS" | "KANBAN">("TIMELINE");

  // Modal State
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Initial Mock Appointments adhering to classical clinical protocols
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "APT-101",
      patientName: "Aarav Sharma",
      patientGender: "MALE",
      patientAge: 38,
      doshaPrakriti: "VATA",
      contactPhone: "+91 98765 43210",
      therapyName: "Abhyanga & Swedana (Purvakarma)",
      roomName: "Suite 1 - Snehana Droni",
      droniId: "DRONI-01 (Teakwood)",
      therapistName: "Ramesh Kumar (Sr. Lead Therapist)",
      therapistGender: "MALE",
      startTime: "09:00",
      durationMins: 60,
      sanitationMins: 15,
      status: "COMPLETED",
      notes: "Classical Dashamoola decoction with Sesame Dhanwantharam taila.",
    },
    {
      id: "APT-102",
      patientName: "Priya Patel",
      patientGender: "FEMALE",
      patientAge: 42,
      doshaPrakriti: "PITTA",
      contactPhone: "+91 98234 56789",
      therapyName: "Shirodhara (Taila Dhara)",
      roomName: "Suite 2 - Shirodhara Droni",
      droniId: "DRONI-02 (Bronze Basin)",
      therapistName: "Sunita Verma (Sr. Lead Therapist)",
      therapistGender: "FEMALE",
      startTime: "10:30",
      durationMins: 45,
      sanitationMins: 15,
      status: "IN_PROGRESS",
      notes: "Ksheerabala 101 taila, continuous oscillation for insomnia relief.",
    },
    {
      id: "APT-103",
      patientName: "Vikram Malhotra",
      patientGender: "MALE",
      patientAge: 51,
      doshaPrakriti: "VATA_PITTA",
      contactPhone: "+91 97112 34567",
      therapyName: "Kashaya Basti (Pradhanakarma)",
      roomName: "Suite 3 - Basti Karma Unit",
      droniId: "DRONI-03 (Basti Recliner)",
      therapistName: "Anil Joshi (Male Therapist)",
      therapistGender: "MALE",
      startTime: "11:45",
      durationMins: 45,
      sanitationMins: 15,
      status: "SCHEDULED",
      notes: "Niruha Basti preparation: Honey, rock salt, Sneha, kalka, kwatha.",
    },
    {
      id: "APT-104",
      patientName: "Ananya Roy",
      patientGender: "FEMALE",
      patientAge: 29,
      doshaPrakriti: "KAPHA",
      contactPhone: "+91 99887 76655",
      therapyName: "Nasya Karma & Mukha Abhyanga",
      roomName: "Suite 1 - Snehana Droni",
      droniId: "DRONI-01 (Teakwood)",
      therapistName: "Meera Nair (Female Therapist)",
      therapistGender: "FEMALE",
      startTime: "14:00",
      durationMins: 30,
      sanitationMins: 15,
      status: "SCHEDULED",
      notes: "Shadbindu taila administration for chronic sinusitis.",
    },
    {
      id: "APT-105",
      patientName: "Suresh Gupta",
      patientGender: "MALE",
      patientAge: 55,
      doshaPrakriti: "TRIDOSHIC",
      contactPhone: "+91 98450 11223",
      therapyName: "Vamana Karma (Emesis Protocol)",
      roomName: "Suite 4 - Panchakarma VIP Room",
      droniId: "DRONI-04 (VIP Herbal)",
      therapistName: "Ramesh Kumar (Sr. Lead Therapist)",
      therapistGender: "MALE",
      startTime: "08:00",
      durationMins: 90,
      sanitationMins: 20,
      status: "COMPLETED",
      notes: "Madanaphala yoga administered under Chief Vaidya supervision.",
    },
  ]);

  // Booking Form State
  const [formPatientName, setFormPatientName] = useState("");
  const [formPatientGender, setFormPatientGender] = useState<"MALE" | "FEMALE">("FEMALE");
  const [formPatientAge, setFormPatientAge] = useState<number>(35);
  const [formDosha, setFormDosha] = useState<"VATA" | "PITTA" | "KAPHA" | "VATA_PITTA" | "TRIDOSHIC">("VATA");
  const [formContactPhone, setFormContactPhone] = useState("+91 98765 43210");
  const [formTherapy, setFormTherapy] = useState("Shirodhara (Taila Dhara)");
  const [formRoom, setFormRoom] = useState("Suite 2 - Shirodhara Droni");
  const [formTherapist, setFormTherapist] = useState("Sunita Verma (Sr. Lead Therapist)");
  const [formTherapistGender, setFormTherapistGender] = useState<"MALE" | "FEMALE">("FEMALE");
  const [formStartTime, setFormStartTime] = useState("11:00");
  const [formDuration, setFormDuration] = useState(45);
  const [formSanitation, setFormSanitation] = useState(15);
  const [formNotes, setFormNotes] = useState("");
  const [overrideChiefVaidya, setOverrideChiefVaidya] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // URL Query Sync (e.g. from homepage redirect)
  useEffect(() => {
    const therapyParam = searchParams.get("therapy");
    if (therapyParam && THERAPIES_PRESETS[therapyParam]) {
      setFormTherapy(therapyParam);
      const preset = THERAPIES_PRESETS[therapyParam];
      setFormDuration(preset.duration);
      setFormSanitation(preset.sanitation);
      setFormRoom(preset.recommendedSuite);
      setShowBookingModal(true);
    }
  }, [searchParams]);

  // When therapy selection changes in form, auto-sync defaults
  const handleTherapyChange = (therapyName: string) => {
    setFormTherapy(therapyName);
    const preset = THERAPIES_PRESETS[therapyName];
    if (preset) {
      setFormDuration(preset.duration);
      setFormSanitation(preset.sanitation);
      setFormRoom(preset.recommendedSuite);
    }
  };

  // When patient gender changes, auto-select a gender-matched therapist
  const handlePatientGenderChange = (gender: "MALE" | "FEMALE") => {
    setFormPatientGender(gender);
    setFormTherapistGender(gender);
    const matched = THERAPISTS.find((t) => t.gender === gender);
    if (matched) {
      setFormTherapist(matched.name);
    }
  };

  // Open modal for a fresh slot or editing
  const openNewBookingModal = (defaultTime?: string, defaultRoom?: string) => {
    setEditingAppointment(null);
    setBookingError(null);
    setFormPatientName("");
    setFormPatientGender("FEMALE");
    setFormTherapistGender("FEMALE");
    setFormTherapist("Sunita Verma (Sr. Lead Therapist)");
    setFormTherapy("Shirodhara (Taila Dhara)");
    setFormDuration(45);
    setFormSanitation(15);
    setFormRoom(defaultRoom || "Suite 2 - Shirodhara Droni");
    setFormStartTime(defaultTime || "10:00");
    setFormNotes("");
    setOverrideChiefVaidya(false);
    setShowBookingModal(true);
  };

  const openEditBookingModal = (apt: Appointment) => {
    setEditingAppointment(apt);
    setBookingError(null);
    setFormPatientName(apt.patientName);
    setFormPatientGender(apt.patientGender);
    setFormPatientAge(apt.patientAge || 35);
    setFormDosha(apt.doshaPrakriti || "VATA");
    setFormContactPhone(apt.contactPhone || "");
    setFormTherapy(apt.therapyName);
    setFormRoom(apt.roomName);
    setFormTherapist(apt.therapistName);
    setFormTherapistGender(apt.therapistGender);
    setFormStartTime(apt.startTime);
    setFormDuration(apt.durationMins);
    setFormSanitation(apt.sanitationMins);
    setFormNotes(apt.notes || "");
    setOverrideChiefVaidya(!!apt.chiefVaidyaOverride);
    setShowBookingModal(true);
  };

  // Conflict Checking Engine
  const checkConflicts = (startTime: string, duration: number, sanitation: number, room: string, therapist: string, excludeId?: string) => {
    const [startH, startM] = startTime.split(":").map(Number);
    const newStartMinutes = startH * 60 + startM;
    const newEndMinutes = newStartMinutes + duration + sanitation;

    for (const apt of appointments) {
      if (excludeId && apt.id === excludeId) continue;
      if (apt.status === "CANCELLED") continue;

      const [aptH, aptM] = apt.startTime.split(":").map(Number);
      const aptStartMinutes = aptH * 60 + aptM;
      const aptEndMinutes = aptStartMinutes + apt.durationMins + apt.sanitationMins;

      // Overlap condition
      const hasOverlap = Math.max(newStartMinutes, aptStartMinutes) < Math.min(newEndMinutes, aptEndMinutes);

      if (hasOverlap) {
        if (apt.roomName === room) {
          return `Suite Conflict: "${room}" is already reserved by ${apt.patientName} (${apt.startTime} - ${Math.floor(aptEndMinutes/60)}:${String(aptEndMinutes%60).padStart(2, "0")}, including 15m T_s buffer).`;
        }
        if (apt.therapistName === therapist) {
          return `Therapist Conflict: ${therapist} is assigned to another patient at this time.`;
        }
      }
    }
    return null;
  };

  // Handle Save Appointment
  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    // 1. Gender Matching Validation Rule
    if (formPatientGender !== formTherapistGender && !overrideChiefVaidya) {
      setBookingError(
        "Gender Guardrail Violation: Classical Shastra mandates gender-matched therapists (Male-Male, Female-Female). Enable Chief Vaidya Override to proceed."
      );
      return;
    }

    // 2. Conflict Engine Check
    const conflict = checkConflicts(
      formStartTime,
      formDuration,
      formSanitation,
      formRoom,
      formTherapist,
      editingAppointment ? editingAppointment.id : undefined
    );

    if (conflict && !overrideChiefVaidya) {
      setBookingError(`${conflict} Please adjust time, select another suite, or apply Chief Vaidya Override.`);
      return;
    }

    const matchedPreset = THERAPIES_PRESETS[formTherapy];
    const droni = matchedPreset ? matchedPreset.droni : "DRONI-01 (Standard)";

    if (editingAppointment) {
      // Update existing
      setAppointments(
        appointments.map((a) =>
          a.id === editingAppointment.id
            ? {
                ...a,
                patientName: formPatientName.trim() || "Patient",
                patientGender: formPatientGender,
                patientAge: formPatientAge,
                doshaPrakriti: formDosha,
                contactPhone: formContactPhone,
                therapyName: formTherapy,
                roomName: formRoom,
                droniId: droni,
                therapistName: formTherapist,
                therapistGender: formTherapistGender,
                startTime: formStartTime,
                durationMins: formDuration,
                sanitationMins: formSanitation,
                notes: formNotes,
                chiefVaidyaOverride: overrideChiefVaidya,
              }
            : a
        )
      );
    } else {
      // Create new
      const newApt: Appointment = {
        id: `APT-${101 + appointments.length}`,
        patientName: formPatientName.trim() || "New Patient",
        patientGender: formPatientGender,
        patientAge: formPatientAge,
        doshaPrakriti: formDosha,
        contactPhone: formContactPhone,
        therapyName: formTherapy,
        roomName: formRoom,
        droniId: droni,
        therapistName: formTherapist,
        therapistGender: formTherapistGender,
        startTime: formStartTime,
        durationMins: formDuration,
        sanitationMins: formSanitation,
        status: "SCHEDULED",
        chiefVaidyaOverride: overrideChiefVaidya,
        notes: formNotes,
      };
      setAppointments([...appointments, newApt]);
    }

    setShowBookingModal(false);
  };

  // Status transitions
  const updateAppointmentStatus = (id: string, newStatus: Appointment["status"]) => {
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  const deleteAppointment = (id: string) => {
    if (confirm("Are you sure you want to remove this scheduled Panchakarma session?")) {
      setAppointments(appointments.filter((a) => a.id !== id));
    }
  };

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchRoom = selectedRoom === "ALL" || apt.roomName === selectedRoom;
      const matchStatus = statusFilter === "ALL" || apt.status === statusFilter;
      const matchSearch =
        !searchQuery.trim() ||
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.therapyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.therapistName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRoom && matchStatus && matchSearch;
    });
  }, [appointments, selectedRoom, statusFilter, searchQuery]);

  // Statistics counters
  const stats = useMemo(() => {
    const total = appointments.length;
    const inProgress = appointments.filter((a) => a.status === "IN_PROGRESS").length;
    const completed = appointments.filter((a) => a.status === "COMPLETED").length;
    const scheduled = appointments.filter((a) => a.status === "SCHEDULED").length;
    const rate = Math.round(((completed + inProgress) / (total || 1)) * 100);
    return { total, inProgress, completed, scheduled, rate };
  }, [appointments]);

  // Quick Date Pill Selector Generator
  const datePills = useMemo(() => {
    const list = [];
    const base = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const label =
        i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      list.push({ iso, label });
    }
    return list;
  }, []);

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans selection:bg-[#d4a373]/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ========================================================================= */}
        {/* TOP HEADER & ACTION BAR                                                   */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#b45309] uppercase">
              <Sparkles className="w-4 h-4 text-[#d4a373]" />
              <span>AyurSutra Clinical OS • Multi-Resource Scheduler</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1b4332] tracking-tight">
              Panchakarma Treatment & Droni Scheduler
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              Zero-conflict engine enforcing 15-min sanitation buffers (T_s), Droni allocation, and gender guardrails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Navigator */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold text-[#1b4332] focus:outline-none shadow-xs"
              />
            </div>

            {/* Quick View Mode Switcher */}
            <div className="flex items-center p-1 bg-gray-100 rounded-2xl border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode("TIMELINE")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "TIMELINE"
                    ? "bg-[#1b4332] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Gantt Timeline Grid"
              >
                Timeline
              </button>
              <button
                type="button"
                onClick={() => setViewMode("CARDS")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "CARDS"
                    ? "bg-[#1b4332] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="List Cards View"
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode("KANBAN")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "KANBAN"
                    ? "bg-[#1b4332] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Status Kanban Board"
              >
                Board
              </button>
            </div>

            {/* Book Session Button */}
            <button
              type="button"
              onClick={() => openNewBookingModal()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#1b4332]"
            >
              <Plus className="w-4 h-4 text-[#d4a373]" />
              <span>Book Therapy Session</span>
            </button>
          </div>
        </div>

        {/* Quick Date Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide shrink-0 mr-1">
            Quick Date:
          </span>
          {datePills.map((dp) => (
            <button
              key={dp.iso}
              type="button"
              onClick={() => setSelectedDate(dp.iso)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border-2 ${
                selectedDate === dp.iso
                  ? "bg-[#1b4332] text-white border-[#1b4332] shadow-sm scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
              }`}
            >
              {dp.label}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* KPI COUNTERS & CLINICAL GUARDRAILS METRICS                                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg border border-emerald-200 shadow-inner">
              {stats.total}
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Total Sessions</p>
              <p className="text-sm font-serif font-black text-[#1b4332]">Scheduled Today</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border-2 border-amber-500/20 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-lg border border-amber-200 animate-pulse shadow-inner">
              {stats.inProgress}
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-700 uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                In Droni Therapy
              </p>
              <p className="text-sm font-serif font-black text-[#1b4332]">Active Now</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-lg border border-blue-200 shadow-inner">
              {stats.completed}
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Completed</p>
              <p className="text-sm font-serif font-black text-[#1b4332]">Shodhana Done</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#faf6f1] text-[#1b4332] flex items-center justify-center font-bold text-lg border border-[#1b4332]/20 shadow-inner">
              {stats.rate}%
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Droni Utilization</p>
              <p className="text-sm font-serif font-black text-[#1b4332]">Efficiency Rate</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FILTERS & SEARCH BAR                                                      */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs">
          {/* Suite Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setSelectedRoom("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border-2 ${
                selectedRoom === "ALL"
                  ? "bg-[#1b4332] text-white border-[#1b4332]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              All Suites (4)
            </button>
            {ROOMS_LIST.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRoom(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border-2 ${
                  selectedRoom === r.id
                    ? "bg-[#1b4332] text-white border-[#1b4332]"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {/* Search and Status Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, therapy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:border-[#1b4332] focus:outline-none w-44 sm:w-56 font-medium"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-gray-200 font-bold text-gray-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: TIMELINE MATRIX (Gantt Schedule Grid)                             */}
        {/* ========================================================================= */}
        {viewMode === "TIMELINE" && (
          <div className="bg-white rounded-3xl border-2 border-[#1b4332]/15 shadow-sm p-4 sm:p-6 overflow-x-auto">
            <div className="min-w-[760px] space-y-3">
              {/* Header Suites Columns */}
              <div className="grid grid-cols-5 gap-3 pb-3 border-b-2 border-gray-100 text-xs font-bold">
                <div className="text-gray-400 uppercase tracking-wider pl-2">Time Slot</div>
                {ROOMS_LIST.map((room) => (
                  <div key={room.id} className="space-y-0.5">
                    <p className="text-[#1b4332] font-serif font-black text-sm">{room.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium line-clamp-1">{room.type}</p>
                  </div>
                ))}
              </div>

              {/* Time Slots Rows */}
              {TIME_SLOTS.map((time) => {
                const hourNum = parseInt(time.split(":")[0]);
                return (
                  <div key={time} className="grid grid-cols-5 gap-3 items-stretch min-h-[72px] py-1 border-b border-gray-100/70">
                    {/* Time Label Column */}
                    <div className="flex items-center text-xs font-mono font-bold text-gray-500 pl-2">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      <span>{time}</span>
                    </div>

                    {/* Suite Slots */}
                    {ROOMS_LIST.map((room) => {
                      // Find appointment starting in this hour slot
                      const apt = filteredAppointments.find(
                        (a) => a.roomName === room.id && parseInt(a.startTime.split(":")[0]) === hourNum
                      );

                      if (apt) {
                        return (
                          <div
                            key={room.id}
                            className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between shadow-xs ${
                              apt.status === "COMPLETED"
                                ? "bg-emerald-50/80 border-emerald-300"
                                : apt.status === "IN_PROGRESS"
                                ? "bg-amber-50/90 border-amber-400 ring-2 ring-amber-300 animate-pulse"
                                : "bg-[#faf6f1] border-[#1b4332]/20 hover:border-[#1b4332]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <span className="text-[10px] font-black text-[#b45309] uppercase block">
                                  {apt.startTime} ({apt.durationMins}m)
                                </span>
                                <p className="text-xs font-bold text-[#1b4332] line-clamp-1">
                                  {apt.patientName}
                                </p>
                              </div>
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                                  apt.status === "COMPLETED"
                                    ? "bg-emerald-200 text-emerald-900"
                                    : apt.status === "IN_PROGRESS"
                                    ? "bg-amber-200 text-amber-900"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {apt.status === "IN_PROGRESS" ? "ACTIVE" : apt.status}
                              </span>
                            </div>

                            <p className="text-[10px] text-gray-600 line-clamp-1 font-medium mt-1">
                              {apt.therapyName}
                            </p>

                            {/* Quick Action Pills */}
                            <div className="flex items-center justify-between gap-1 pt-2 mt-1 border-t border-black/5">
                              <span className="text-[9px] text-gray-500 font-semibold truncate">
                                👨‍⚕️ {apt.therapistName.split(" ")[0]}
                              </span>
                              <div className="flex items-center gap-1">
                                {apt.status === "SCHEDULED" && (
                                  <button
                                    type="button"
                                    onClick={() => updateAppointmentStatus(apt.id, "IN_PROGRESS")}
                                    className="p-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[9px] font-bold cursor-pointer"
                                    title="Start Therapy"
                                  >
                                    <Play className="w-2.5 h-2.5" />
                                  </button>
                                )}
                                {apt.status === "IN_PROGRESS" && (
                                  <button
                                    type="button"
                                    onClick={() => updateAppointmentStatus(apt.id, "COMPLETED")}
                                    className="p-1 rounded bg-blue-700 hover:bg-blue-800 text-white text-[9px] font-bold cursor-pointer"
                                    title="Complete Session"
                                  >
                                    <Check className="w-2.5 h-2.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => openEditBookingModal(apt)}
                                  className="p-1 rounded hover:bg-gray-200 text-gray-700 text-[9px] cursor-pointer"
                                  title="Edit / Reschedule"
                                >
                                  <Edit3 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // Empty Slot - Click to reserve
                      return (
                        <button
                          key={room.id}
                          type="button"
                          onClick={() => openNewBookingModal(time, room.id)}
                          className="h-full min-h-[58px] rounded-2xl border border-dashed border-gray-200 hover:border-[#1b4332] hover:bg-[#faf6f1]/60 transition-all flex items-center justify-center text-gray-300 hover:text-[#1b4332] group cursor-pointer"
                          title={`Click to book ${room.name} at ${time}`}
                        >
                          <span className="text-[11px] font-bold opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                            <Plus className="w-3.5 h-3.5" /> Book {time}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: CARDS DETAILED LIST VIEW                                          */}
        {/* ========================================================================= */}
        {viewMode === "CARDS" && (
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border-2 border-[#1b4332]/15 text-center text-gray-500 shadow-sm">
                <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-semibold">No appointments found matching the criteria.</p>
                <button
                  type="button"
                  onClick={() => openNewBookingModal()}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5 text-[#d4a373]" /> Book First Session
                </button>
              </div>
            ) : (
              filteredAppointments.map((apt) => {
                const genderMatch = apt.patientGender === apt.therapistGender;
                return (
                  <div
                    key={apt.id}
                    className="bg-white p-6 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm hover:border-[#1b4332]/40 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#1b4332] text-[#d4a373] flex flex-col items-center justify-center font-bold text-xs shadow-md">
                          <span className="text-white text-sm font-mono font-black">{apt.startTime}</span>
                          <span className="text-[10px] text-[#d4a373] font-semibold">{apt.durationMins}m</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-serif font-bold text-lg text-[#1b4332]">
                              {apt.therapyName}
                            </h3>
                            <span
                              className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border uppercase tracking-wider ${
                                apt.status === "COMPLETED"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : apt.status === "IN_PROGRESS"
                                  ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                                  : "bg-[#faf6f1] text-[#1b4332] border-[#1b4332]/20"
                              }`}
                            >
                              {apt.status === "IN_PROGRESS" ? "Therapy In Progress" : apt.status}
                            </span>
                          </div>

                          <p className="text-xs text-gray-600 mt-1 flex items-center gap-3 flex-wrap font-medium">
                            <span>Patient: <strong className="text-[#1b4332] font-bold">{apt.patientName}</strong> ({apt.patientGender}, {apt.patientAge || 35}y)</span>
                            <span>•</span>
                            <span>{apt.roomName}</span>
                            <span>•</span>
                            <span>Prakriti: <strong className="text-[#b45309]">{apt.doshaPrakriti || "VATA"}</strong></span>
                          </p>
                        </div>
                      </div>

                      {/* Gender Guardrail Tag */}
                      <div className="flex items-center gap-2">
                        {genderMatch ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Gender Guard Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                            Chief Vaidya Override
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/10 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">Assigned Therapist</span>
                        <p className="font-bold text-[#1b4332] mt-0.5">{apt.therapistName}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">Droni Allocation</span>
                        <p className="font-bold text-[#1b4332] mt-0.5">{apt.droniId}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">Clinical Notes</span>
                        <p className="font-medium text-gray-700 mt-0.5 line-clamp-1">{apt.notes || "Standard Shastra formulation protocol"}</p>
                      </div>
                    </div>

                    {/* Visual 15m Buffer & Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <div className="w-full sm:w-1/2 flex items-center gap-2 text-[11px]">
                        <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden flex border border-gray-300">
                          <div className="h-full bg-[#1b4332]" style={{ width: "75%" }} title="Therapy Session"></div>
                          <div className="h-full bg-[#d4a373]" style={{ width: "25%" }} title="15-min Sanitation Buffer"></div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#1b4332] whitespace-nowrap">
                          +15m T_s Sanitation Locked
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end">
                        {apt.status === "SCHEDULED" && (
                          <button
                            type="button"
                            onClick={() => updateAppointmentStatus(apt.id, "IN_PROGRESS")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" /> Start Therapy
                          </button>
                        )}

                        {apt.status === "IN_PROGRESS" && (
                          <button
                            type="button"
                            onClick={() => updateAppointmentStatus(apt.id, "COMPLETED")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Completed
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openEditBookingModal(apt)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Reschedule
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteAppointment(apt.id)}
                          className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs cursor-pointer"
                          title="Cancel / Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: KANBAN STATUS BOARD                                               */}
        {/* ========================================================================= */}
        {viewMode === "KANBAN" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scheduled Column */}
            <div className="bg-gray-100/80 p-4 rounded-3xl border-2 border-gray-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-300">
                <span className="font-serif font-black text-sm text-[#1b4332]">Scheduled ({appointments.filter(a => a.status === "SCHEDULED").length})</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#1b4332]"></span>
              </div>
              <div className="space-y-3">
                {appointments.filter(a => a.status === "SCHEDULED").map(apt => (
                  <div key={apt.id} className="bg-white p-4 rounded-2xl border-2 border-[#1b4332]/10 shadow-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold text-[#b45309]">{apt.startTime}</span>
                      <span className="text-[10px] font-bold text-gray-500">{apt.roomName.split(" - ")[0]}</span>
                    </div>
                    <p className="text-xs font-bold text-[#1b4332]">{apt.patientName}</p>
                    <p className="text-[11px] text-gray-600">{apt.therapyName}</p>
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.id, "IN_PROGRESS")}
                      className="w-full mt-2 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3" /> Start
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-amber-50/70 p-4 rounded-3xl border-2 border-amber-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-300">
                <span className="font-serif font-black text-sm text-amber-900">In Droni Therapy ({appointments.filter(a => a.status === "IN_PROGRESS").length})</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              </div>
              <div className="space-y-3">
                {appointments.filter(a => a.status === "IN_PROGRESS").map(apt => (
                  <div key={apt.id} className="bg-white p-4 rounded-2xl border-2 border-amber-400 shadow-xs space-y-2 ring-1 ring-amber-300">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-black text-amber-700">ACTIVE: {apt.startTime}</span>
                      <span className="text-[10px] font-bold text-amber-800">{apt.roomName.split(" - ")[0]}</span>
                    </div>
                    <p className="text-xs font-bold text-[#1b4332]">{apt.patientName}</p>
                    <p className="text-[11px] text-gray-600">{apt.therapyName}</p>
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.id, "COMPLETED")}
                      className="w-full mt-2 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Complete & Clean
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Column */}
            <div className="bg-emerald-50/70 p-4 rounded-3xl border-2 border-emerald-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-300">
                <span className="font-serif font-black text-sm text-emerald-900">Completed Shodhana ({appointments.filter(a => a.status === "COMPLETED").length})</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              </div>
              <div className="space-y-3">
                {appointments.filter(a => a.status === "COMPLETED").map(apt => (
                  <div key={apt.id} className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-xs space-y-2 opacity-90">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold text-emerald-700">{apt.startTime}</span>
                      <span className="text-[10px] font-bold text-emerald-800">Done</span>
                    </div>
                    <p className="text-xs font-bold text-[#1b4332]">{apt.patientName}</p>
                    <p className="text-[11px] text-gray-600">{apt.therapyName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* BOOKING / EDITING MODAL (With Conflict Checks & Guardrails)                */}
      {/* ========================================================================= */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full p-6 sm:p-8 rounded-3xl border-2 border-[#1b4332]/20 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#1b4332]">
                <CalendarIcon className="w-5 h-5 text-[#d4a373]" />
                <h2 className="font-serif font-bold text-xl text-[#1b4332]">
                  {editingAppointment ? "Reschedule Panchakarma Session" : "Book New Panchakarma Session"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conflict / Error Banner */}
            {bookingError && (
              <div className="p-3.5 bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl text-xs flex items-start gap-2.5 font-medium">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{bookingError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAppointment} className="space-y-4 text-xs">
              {/* Patient Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Sharma"
                    value={formPatientName}
                    onChange={(e) => setFormPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-900 font-semibold focus:border-[#1b4332] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Patient Gender (Strict Matching)</label>
                  <select
                    value={formPatientGender}
                    onChange={(e) => handlePatientGenderChange(e.target.value as "MALE" | "FEMALE")}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                  >
                    <option value="FEMALE">Female Patient</option>
                    <option value="MALE">Male Patient</option>
                  </select>
                </div>
              </div>

              {/* Therapy Preset Selector */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Panchakarma Classical Therapy *</label>
                <select
                  value={formTherapy}
                  onChange={(e) => handleTherapyChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-[#1b4332] font-black"
                >
                  {Object.keys(THERAPIES_PRESETS).map((t) => (
                    <option key={t} value={t}>
                      {t} ({THERAPIES_PRESETS[t].duration} mins + {THERAPIES_PRESETS[t].sanitation}m T_s)
                    </option>
                  ))}
                </select>
              </div>

              {/* Suite & Start Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Treatment Suite & Droni</label>
                  <select
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                  >
                    {ROOMS_LIST.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.id} ({r.droni})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Start Time (24h)</label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-mono font-bold text-[#1b4332]"
                  />
                </div>
              </div>

              {/* Therapist Selection (Filtered by Gender) */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Ayurvedic Therapist</label>
                <select
                  value={formTherapist}
                  onChange={(e) => {
                    const selected = THERAPISTS.find((t) => t.name === e.target.value);
                    if (selected) {
                      setFormTherapist(selected.name);
                      setFormTherapistGender(selected.gender);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                >
                  {THERAPISTS.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} ({t.gender}, {t.specialty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Clinical Formulation & Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Dhanwantharam 101 taila with Dashamoola Kwatha"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-800 font-medium"
                />
              </div>

              {/* Chief Vaidya Override Card */}
              <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-200 space-y-1">
                <label className="flex items-center gap-2.5 text-amber-900 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overrideChiefVaidya}
                    onChange={(e) => setOverrideChiefVaidya(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1b4332] focus:ring-[#1b4332]"
                  />
                  <span>Chief Vaidya Emergency Override (Log in Audit Trail)</span>
                </label>
                <p className="text-[10px] text-gray-600 pl-6">
                  Allows bypassing gender-guardrails or overlapping buffers in emergency protocols with mandatory DISHA audit logging.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold shadow-lg transition-all cursor-pointer"
                >
                  {editingAppointment ? "Update & Save Changes" : "Confirm & Lock Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
