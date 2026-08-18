import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
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
  const { session } = useAuth();
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

  // User-driven appointments list
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem("ayursutra_schedules");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "APT-101",
        patientName: session?.fullName || "Aarav Sharma",
        patientGender: "MALE",
        patientAge: 38,
        doshaPrakriti: "VATA",
        contactPhone: session?.phone || "+91 98765 43210",
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
    ];
  });

  useEffect(() => {
    localStorage.setItem("ayursutra_schedules", JSON.stringify(appointments));
  }, [appointments]);

  // Form Fields in Booking Modal
  const [modalPatientName, setModalPatientName] = useState<string>(() => session?.fullName || "Aarav Sharma");
  const [modalPatientGender, setModalPatientGender] = useState<"MALE" | "FEMALE">("MALE");
  const [modalPatientAge, setModalPatientAge] = useState<number>(35);
  const [modalPatientPhone, setModalPatientPhone] = useState<string>(() => session?.phone || "+91 98765 43210");
  const [modalTherapy, setModalTherapy] = useState<string>("Shirodhara (Taila Dhara)");
  const [modalRoom, setModalRoom] = useState<string>("Suite 2 - Shirodhara Droni");
  const [modalTherapist, setModalTherapist] = useState<string>("Sunita Verma (Sr. Lead Therapist)");
  const [modalTime, setModalTime] = useState<string>("09:00");
  const [modalDuration, setModalDuration] = useState<number>(45);
  const [modalSanitation, setModalSanitation] = useState<number>(15);
  const [modalOverride, setModalOverride] = useState<boolean>(false);
  const [modalNotes, setModalNotes] = useState<string>("");
  const [conflictError, setConflictError] = useState<string | null>(null);

  // Check URL query param to pre-select therapy if passed
  useEffect(() => {
    const therapyParam = searchParams.get("therapy");
    if (therapyParam && THERAPIES_PRESETS[therapyParam]) {
      setModalTherapy(therapyParam);
      const preset = THERAPIES_PRESETS[therapyParam];
      setModalRoom(preset.recommendedSuite);
      setModalDuration(preset.duration);
      setModalSanitation(preset.sanitation);
      setShowBookingModal(true);
    }
  }, [searchParams]);

  // Handle Preset Changes
  const handleTherapyChange = (therapy: string) => {
    setModalTherapy(therapy);
    if (THERAPIES_PRESETS[therapy]) {
      const preset = THERAPIES_PRESETS[therapy];
      setModalRoom(preset.recommendedSuite);
      setModalDuration(preset.duration);
      setModalSanitation(preset.sanitation);
    }
  };

  // Open modal for click-to-book on empty grid slot
  const handleSlotClick = (roomName: string, time: string) => {
    setEditingAppointment(null);
    setConflictError(null);
    setModalRoom(roomName);
    setModalTime(time);
    setModalPatientName(session?.fullName || "Aarav Sharma");
    setModalPatientPhone(session?.phone || "+91 98765 43210");
    setShowBookingModal(true);
  };

  // Save or Update Appointment
  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    // Selected therapist object
    const thObj = THERAPISTS.find((t) => t.name === modalTherapist) || THERAPISTS[0];

    // Gender Guardrail Warning check
    if (modalPatientGender !== thObj.gender && !modalOverride) {
      setConflictError(
        `Gender Protocol Guardrail: Patient is ${modalPatientGender} but therapist is ${thObj.gender}. Please match therapist gender or enable Chief Vaidya Override.`
      );
      return;
    }

    if (editingAppointment) {
      // Update existing
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === editingAppointment.id
            ? {
                ...apt,
                patientName: modalPatientName,
                patientGender: modalPatientGender,
                patientAge: modalPatientAge,
                contactPhone: modalPatientPhone,
                therapyName: modalTherapy,
                roomName: modalRoom,
                droniId: THERAPIES_PRESETS[modalTherapy]?.droni || "DRONI-01",
                therapistName: modalTherapist,
                therapistGender: thObj.gender,
                startTime: modalTime,
                durationMins: Number(modalDuration),
                sanitationMins: Number(modalSanitation),
                chiefVaidyaOverride: modalOverride,
                notes: modalNotes,
              }
            : apt
        )
      );
    } else {
      // Create new
      const newApt: Appointment = {
        id: `APT-${Date.now().toString().slice(-4)}`,
        patientName: modalPatientName,
        patientGender: modalPatientGender,
        patientAge: modalPatientAge,
        contactPhone: modalPatientPhone,
        therapyName: modalTherapy,
        roomName: modalRoom,
        droniId: THERAPIES_PRESETS[modalTherapy]?.droni || "DRONI-01",
        therapistName: modalTherapist,
        therapistGender: thObj.gender,
        startTime: modalTime,
        durationMins: Number(modalDuration),
        sanitationMins: Number(modalSanitation),
        status: "SCHEDULED",
        chiefVaidyaOverride: modalOverride,
        notes: modalNotes,
      };
      setAppointments((prev) => [...prev, newApt]);
    }

    setShowBookingModal(false);
    setEditingAppointment(null);
  };

  // Status transitions
  const handleUpdateStatus = (id: string, newStatus: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  // Delete appointment
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to cancel and remove this scheduled session?")) {
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
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

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans selection:bg-[#d4a373]/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ========================================================================= */}
        {/* TOP HEADER & CONTROL ACTIONS                                              */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-[#1b4332]/15 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#b45309] uppercase">
              <Sparkles className="w-4 h-4 text-[#d4a373]" />
              <span>AyurSutra Panchakarma OS • Multi-Resource Scheduler</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1b4332] tracking-tight">
              Zero-Conflict Clinical Therapy Scheduler
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              Synchronized scheduling for Dronis, Suites, and Gender-Matched Therapists with +15m Sanitation Buffers.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/20">
              <button
                type="button"
                onClick={() => setViewMode("TIMELINE")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "TIMELINE" ? "bg-[#1b4332] text-white shadow-xs" : "text-gray-600 hover:text-[#1b4332]"
                }`}
              >
                Timeline Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("CARDS")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "CARDS" ? "bg-[#1b4332] text-white shadow-xs" : "text-gray-600 hover:text-[#1b4332]"
                }`}
              >
                Cards View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("KANBAN")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "KANBAN" ? "bg-[#1b4332] text-white shadow-xs" : "text-gray-600 hover:text-[#1b4332]"
                }`}
              >
                Kanban Flow
              </button>
            </div>

            {/* Book Button */}
            <button
              type="button"
              onClick={() => {
                setEditingAppointment(null);
                setConflictError(null);
                setModalPatientName(session?.fullName || "Aarav Sharma");
                setModalPatientPhone(session?.phone || "+91 98765 43210");
                setShowBookingModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#1b4332]"
            >
              <Plus className="w-4 h-4 text-[#d4a373]" />
              <span>Book New Session</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FILTER & DATE CONTROLS BAR                                                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs items-center">
          {/* Date Picker */}
          <div className="md:col-span-3 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#b45309] shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 focus:border-[#1b4332] focus:outline-none bg-[#faf6f1]"
            />
          </div>

          {/* Suite Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 focus:border-[#1b4332] focus:outline-none bg-white"
            >
              <option value="ALL">All Suites & Dronis (4 Suites)</option>
              {ROOMS_LIST.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} - {r.type}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 focus:border-[#1b4332] focus:outline-none bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="md:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, therapy, therapist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#1b4332] focus:outline-none bg-white font-medium"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: TIMELINE GRID VIEW                                                */}
        {/* ========================================================================= */}
        {viewMode === "TIMELINE" && (
          <div className="bg-white rounded-3xl border-2 border-[#1b4332]/15 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#b45309]" />
                <h3 className="font-serif font-bold text-base text-[#1b4332]">
                  Daily Suite & Droni Occupancy Matrix
                </h3>
              </div>
              <span className="text-[11px] text-gray-500 font-medium">
                Click any empty slot to instant-book.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-gray-500 uppercase text-[10px] font-bold">
                    <th className="py-3 px-4 w-44">Treatment Suite</th>
                    {TIME_SLOTS.map((time) => (
                      <th key={time} className="py-3 px-2 text-center font-mono w-24">
                        {time}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ROOMS_LIST.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#1b4332] bg-[#faf6f1]/60">
                        <div className="text-xs font-serif font-bold">{room.name}</div>
                        <div className="text-[10px] text-gray-500 font-normal">{room.type}</div>
                        <div className="text-[9px] text-[#b45309] font-mono mt-0.5">{room.droni}</div>
                      </td>

                      {TIME_SLOTS.map((time) => {
                        const slotApt = filteredAppointments.find(
                          (apt) => apt.roomName === room.id && apt.startTime === time
                        );

                        if (slotApt) {
                          const isCompleted = slotApt.status === "COMPLETED";
                          const isInProgress = slotApt.status === "IN_PROGRESS";

                          return (
                            <td key={time} className="p-1.5 align-top">
                              <div
                                onClick={() => {
                                  setEditingAppointment(slotApt);
                                  setModalPatientName(slotApt.patientName);
                                  setModalPatientGender(slotApt.patientGender);
                                  setModalTherapy(slotApt.therapyName);
                                  setModalRoom(slotApt.roomName);
                                  setModalTherapist(slotApt.therapistName);
                                  setModalTime(slotApt.startTime);
                                  setModalDuration(slotApt.durationMins);
                                  setModalSanitation(slotApt.sanitationMins);
                                  setModalNotes(slotApt.notes || "");
                                  setShowBookingModal(true);
                                }}
                                className={`p-2 rounded-xl border text-[11px] space-y-1 cursor-pointer transition-all hover:scale-102 shadow-xs ${
                                  isCompleted
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                                    : isInProgress
                                    ? "bg-amber-50 border-amber-300 text-amber-950 ring-2 ring-amber-200 animate-pulse"
                                    : "bg-[#1b4332]/10 border-[#1b4332]/30 text-[#1b4332]"
                                }`}
                              >
                                <p className="font-bold truncate">{slotApt.patientName}</p>
                                <p className="text-[10px] truncate text-gray-600">{slotApt.therapyName.split(" (")[0]}</p>
                                <div className="flex items-center justify-between text-[9px] text-gray-500 pt-1 border-t border-black/10">
                                  <span>{slotApt.durationMins}m</span>
                                  <span className="font-bold uppercase text-[8px]">{slotApt.status}</span>
                                </div>
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td key={time} className="p-1.5 align-middle text-center">
                            <button
                              type="button"
                              onClick={() => handleSlotClick(room.id, time)}
                              className="w-full h-14 rounded-xl border border-dashed border-gray-300 hover:border-[#1b4332] hover:bg-[#faf6f1] text-gray-400 hover:text-[#1b4332] text-[10px] flex items-center justify-center transition-all cursor-pointer font-bold"
                            >
                              + Book
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DETAILED CARDS VIEW                                               */}
        {/* ========================================================================= */}
        {viewMode === "CARDS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-5 rounded-3xl border-2 border-[#1b4332]/15 shadow-xs hover:border-[#1b4332]/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2.5">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 block">{apt.id}</span>
                    <h4 className="font-serif font-bold text-base text-[#1b4332]">{apt.patientName}</h4>
                    <p className="text-[11px] text-gray-500 font-medium">{apt.patientGender} • {apt.contactPhone}</p>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                      apt.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : apt.status === "IN_PROGRESS"
                        ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-700">
                  <p className="font-bold text-[#1b4332]">{apt.therapyName}</p>
                  <p className="text-[11px] text-gray-600">🏛️ {apt.roomName} ({apt.droniId})</p>
                  <p className="text-[11px] text-gray-600">👤 Therapist: {apt.therapistName}</p>
                  <p className="text-[11px] font-mono font-bold text-[#b45309]">
                    ⏰ {apt.startTime} ({apt.durationMins}m therapy + {apt.sanitationMins}m buffer)
                  </p>
                  {apt.notes && <p className="text-[10px] text-gray-500 italic bg-[#faf6f1] p-2 rounded-lg">"{apt.notes}"</p>}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    {apt.status !== "IN_PROGRESS" && apt.status !== "COMPLETED" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(apt.id, "IN_PROGRESS")}
                        className="p-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 cursor-pointer"
                        title="Start Session"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {apt.status !== "COMPLETED" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(apt.id, "COMPLETED")}
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                        title="Complete Session"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(apt.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: KANBAN FLOW VIEW                                                  */}
        {/* ========================================================================= */}
        {viewMode === "KANBAN" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["SCHEDULED", "IN_PROGRESS", "COMPLETED"] as const).map((statusKey) => {
              const columnApts = filteredAppointments.filter((a) => a.status === statusKey);
              return (
                <div key={statusKey} className="bg-white p-5 rounded-3xl border-2 border-[#1b4332]/15 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h4 className="font-serif font-bold text-sm text-[#1b4332] uppercase tracking-wide">
                      {statusKey} ({columnApts.length})
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {columnApts.map((apt) => (
                      <div key={apt.id} className="p-3.5 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/15 space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-[#1b4332]">{apt.patientName}</p>
                          <span className="font-mono text-[10px] text-[#b45309] font-bold">{apt.startTime}</span>
                        </div>
                        <p className="text-[11px] text-gray-700">{apt.therapyName}</p>
                        <p className="text-[10px] text-gray-500">{apt.roomName}</p>
                        <div className="flex justify-end gap-1.5 pt-1 border-t border-black/5">
                          {statusKey === "SCHEDULED" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(apt.id, "IN_PROGRESS")}
                              className="px-2 py-1 rounded bg-amber-500 text-white font-bold text-[10px] cursor-pointer"
                            >
                              Start
                            </button>
                          )}
                          {statusKey === "IN_PROGRESS" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(apt.id, "COMPLETED")}
                              className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* BOOKING / EDIT MODAL                                                      */}
      {/* ========================================================================= */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border-2 border-[#1b4332]/20 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#1b4332]">
                <CalendarDays className="w-5 h-5 text-[#d4a373]" />
                <h2 className="font-serif font-bold text-xl text-[#1b4332]">
                  {editingAppointment ? "Edit Scheduled Session" : "Book Panchakarma Therapy Session"}
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

            {conflictError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{conflictError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAppointment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={modalPatientName}
                    onChange={(e) => setModalPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Patient Gender *</label>
                  <select
                    value={modalPatientGender}
                    onChange={(e) => setModalPatientGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                  >
                    <option value="MALE">Male (पुरुष)</option>
                    <option value="FEMALE">Female (स्त्री)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Patient Age</label>
                  <input
                    type="number"
                    min={1}
                    max={110}
                    value={modalPatientAge}
                    onChange={(e) => setModalPatientAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={modalPatientPhone}
                    onChange={(e) => setModalPatientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Therapy Protocol *</label>
                <select
                  value={modalTherapy}
                  onChange={(e) => handleTherapyChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                >
                  {Object.keys(THERAPIES_PRESETS).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Assigned Suite & Droni *</label>
                  <select
                    value={modalRoom}
                    onChange={(e) => setModalRoom(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                  >
                    {ROOMS_LIST.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} - {r.type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Assigned Therapist *</label>
                  <select
                    value={modalTherapist}
                    onChange={(e) => setModalTherapist(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                  >
                    {THERAPISTS.map((th) => (
                      <option key={th.name} value={th.name}>
                        {th.name} ({th.gender})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Start Time</label>
                  <select
                    value={modalTime}
                    onChange={(e) => setModalTime(e.target.value)}
                    className="w-full px-2 py-2 border-2 border-gray-200 rounded-xl font-mono font-bold"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration (m)</label>
                  <input
                    type="number"
                    value={modalDuration}
                    onChange={(e) => setModalDuration(Number(e.target.value))}
                    className="w-full px-2 py-2 border-2 border-gray-200 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sanitation (m)</label>
                  <input
                    type="number"
                    value={modalSanitation}
                    onChange={(e) => setModalSanitation(Number(e.target.value))}
                    className="w-full px-2 py-2 border-2 border-gray-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Clinical Notes / Taila Specification</label>
                <textarea
                  rows={2}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="e.g. Warm Ksheerabala 101 taila, monitor BP before and after..."
                  className="w-full px-3.5 py-2 border-2 border-gray-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="override"
                  checked={modalOverride}
                  onChange={(e) => setModalOverride(e.target.checked)}
                  className="rounded text-[#1b4332] focus:ring-[#1b4332]"
                />
                <label htmlFor="override" className="text-gray-600 text-[11px] font-medium cursor-pointer">
                  Chief Vaidya Override (Bypass strict gender guardrails if emergency)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold shadow-lg cursor-pointer"
                >
                  {editingAppointment ? "Save Changes" : "Confirm Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
