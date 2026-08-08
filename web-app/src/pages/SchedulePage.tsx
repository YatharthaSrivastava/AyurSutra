import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar as CalendarIcon,
  Clock,
  UserCheck,
  ShieldAlert,
  Plus,
  CheckCircle2,
  Sparkles,
  MapPin,
  X,
  AlertCircle
} from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  patientGender: "MALE" | "FEMALE";
  therapyName: string;
  roomName: string;
  droniId: string;
  therapistName: string;
  therapistGender: "MALE" | "FEMALE";
  startTime: string; // e.g. "09:00"
  durationMins: number; // e.g. 45
  sanitationMins: number; // 15 mins buffer
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
  chiefVaidyaOverride?: boolean;
}

export default function SchedulePage() {
  const { session } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<string>("2026-08-09");
  const [selectedRoom, setSelectedRoom] = useState<string>("ALL");
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

  // Initial Mock Schedule Data adhering to Panchakarma rules
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "APT-101",
      patientName: "Aarav Sharma",
      patientGender: "MALE",
      therapyName: "Abhyanga & Swedana (Purvakarma)",
      roomName: "Suite 1 - Snehana Droni",
      droniId: "DRONI-01 (Teakwood)",
      therapistName: "Ramesh Kumar (Sr. Male Therapist)",
      therapistGender: "MALE",
      startTime: "09:00",
      durationMins: 60,
      sanitationMins: 15,
      status: "COMPLETED",
    },
    {
      id: "APT-102",
      patientName: "Priya Patel",
      patientGender: "FEMALE",
      therapyName: "Shirodhara (Taila Dhara)",
      roomName: "Suite 2 - Shirodhara Droni",
      droniId: "DRONI-02 (Bronze Basin)",
      therapistName: "Sunita Verma (Sr. Female Therapist)",
      therapistGender: "FEMALE",
      startTime: "10:30",
      durationMins: 45,
      sanitationMins: 15,
      status: "IN_PROGRESS",
    },
    {
      id: "APT-103",
      patientName: "Vikram Malhotra",
      patientGender: "MALE",
      therapyName: "Kashaya Basti (Pradhanakarma)",
      roomName: "Suite 3 - Basti Karma Unit",
      droniId: "DRONI-03 (Standard)",
      therapistName: "Anil Joshi (Male Therapist)",
      therapistGender: "MALE",
      startTime: "11:45",
      durationMins: 45,
      sanitationMins: 15,
      status: "SCHEDULED",
    },
    {
      id: "APT-104",
      patientName: "Ananya Roy",
      patientGender: "FEMALE",
      therapyName: "Nasya Karma & Mukha Abhyanga",
      roomName: "Suite 1 - Snehana Droni",
      droniId: "DRONI-01 (Teakwood)",
      therapistName: "Meera Nair (Female Therapist)",
      therapistGender: "FEMALE",
      startTime: "14:00",
      durationMins: 45,
      sanitationMins: 15,
      status: "SCHEDULED",
    },
  ]);

  // New Booking Form State
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientGender, setNewPatientGender] = useState<"MALE" | "FEMALE">("FEMALE");
  const [newTherapy, setNewTherapy] = useState("Shirodhara (Taila Dhara)");
  const [newRoom, setNewRoom] = useState("Suite 2 - Shirodhara Droni");
  const [newTherapist, setNewTherapist] = useState("Sunita Verma (Sr. Female Therapist)");
  const [newTherapistGender, setNewTherapistGender] = useState<"MALE" | "FEMALE">("FEMALE");
  const [newStartTime, setNewStartTime] = useState("15:30");
  const [overrideChiefVaidya, setOverrideChiefVaidya] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Read URL query parameter if redirected from homepage slideshow
  useEffect(() => {
    const therapyParam = searchParams.get("therapy");
    if (therapyParam) {
      setNewTherapy(therapyParam);
      setShowBookingModal(true);
    }
  }, [searchParams]);

  const roomsList = [
    "Suite 1 - Snehana Droni",
    "Suite 2 - Shirodhara Droni",
    "Suite 3 - Basti Karma Unit",
    "Suite 4 - Panchakarma VIP Room",
  ];

  const filteredAppointments = appointments.filter((apt) =>
    selectedRoom === "ALL" ? true : apt.roomName === selectedRoom
  );

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    // Gender Matching Validation Rule
    if (newPatientGender !== newTherapistGender && !overrideChiefVaidya) {
      setBookingError(
        "Gender Mismatch Error: Panchakarma protocols require gender-matched therapists (Male-Male, Female-Female). Enable Chief Vaidya Override to bypass with audit log."
      );
      return;
    }

    const newApt: Appointment = {
      id: `APT-${105 + appointments.length}`,
      patientName: newPatientName || "New Patient",
      patientGender: newPatientGender,
      therapyName: newTherapy,
      roomName: newRoom,
      droniId: newRoom.includes("Suite 1") ? "DRONI-01 (Teakwood)" : "DRONI-02 (Bronze Basin)",
      therapistName: newTherapist,
      therapistGender: newTherapistGender,
      startTime: newStartTime,
      durationMins: 45,
      sanitationMins: 15,
      status: "SCHEDULED",
      chiefVaidyaOverride: overrideChiefVaidya,
    };

    setAppointments([...appointments, newApt]);
    setShowBookingModal(false);
    setNewPatientName("");
    setOverrideChiefVaidya(false);
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4 text-[#d4a373]" />
              <span>MOD-04 Panchakarma Engine</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-[#1b4332]">
              Multi-Resource Conflict Scheduler
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Zero-conflict scheduling with automated 15-min sanitation buffers (T_s), Droni tracking, and therapist gender-matching guardrails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#1b4332] shadow-md"
            />
            {["VAIDYA", "ADMIN", "PATIENT"].includes(session?.role || "") && (
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex items-center gap-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-medium px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all"
              >
                <Plus className="w-4 h-4 text-[#d4a373]" />
                <span>Book Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Rules Banner with Box Shadows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="ayur-card p-5 flex items-start gap-3.5 border-l-4 border-l-[#d4a373] shadow-md hover:shadow-xl transition-all">
            <Clock className="w-5 h-5 text-[#d4a373] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#1b4332]">15-Min Sanitation Buffer (T_s)</h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Automatically appended to each session for herbal oil cleansing & linen change.
              </p>
            </div>
          </div>

          <div className="ayur-card p-5 flex items-start gap-3.5 border-l-4 border-l-[#1b4332] shadow-md hover:shadow-xl transition-all">
            <UserCheck className="w-5 h-5 text-[#1b4332] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#1b4332]">Gender Matching Enforcement</h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Strict male-to-male & female-to-female therapist assignment per Shastra guidelines.
              </p>
            </div>
          </div>

          <div className="ayur-card p-5 flex items-start gap-3.5 border-l-4 border-l-[#2d6a4f] shadow-md hover:shadow-xl transition-all">
            <MapPin className="w-5 h-5 text-[#2d6a4f] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#1b4332]">Droni & Room Allocation</h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Real-time tracking of specialized Teakwood & Bronze Dronis across treatment suites.
              </p>
            </div>
          </div>
        </div>

        {/* Room Filter Selector */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Filter Suite:</span>
            <button
              onClick={() => setSelectedRoom("ALL")}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all shadow-sm ${
                selectedRoom === "ALL"
                  ? "bg-[#1b4332] text-white font-bold shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm"
              }`}
            >
              All Suites (4)
            </button>
            {roomsList.map((room) => (
              <button
                key={room}
                onClick={() => setSelectedRoom(room)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap shadow-sm ${
                  selectedRoom === room
                    ? "bg-[#1b4332] text-white font-bold shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm"
                }`}
              >
                {room}
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-600 flex items-center gap-4 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-sm"></span> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-sm"></span> In Therapy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2d6a4f] shadow-sm"></span> Scheduled
            </span>
          </div>
        </div>

        {/* Appointments List / Matrix Timeline */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="ayur-card p-12 text-center text-gray-500 shadow-md">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm">No scheduled therapy sessions for this suite on {selectedDate}.</p>
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const genderMatch = apt.patientGender === apt.therapistGender;
              return (
                <div key={apt.id} className="ayur-card p-6 rounded-2xl space-y-4 shadow-md hover:shadow-xl transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3.5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#1b4332]/10 border border-[#1b4332]/20 flex items-center justify-center font-bold text-[#1b4332] text-xs shadow-inner">
                        {apt.startTime}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[#1b4332] text-base">{apt.therapyName}</h3>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                              apt.status === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : apt.status === "IN_PROGRESS"
                                ? "bg-amber-50 text-amber-800 border-amber-200 animate-pulse"
                                : "bg-[#e8f5e9] text-[#1b4332] border-[#c8e6c9]"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-2">
                          <span>Patient: <strong className="text-[#1b4332]">{apt.patientName}</strong> ({apt.patientGender})</span>
                          <span>•</span>
                          <span>{apt.roomName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {genderMatch ? (
                        <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Gender Guard Matched
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 font-semibold shadow-sm">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          Chief Vaidya Override
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Resource Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-gray-200 shadow-inner">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Assigned Therapist</span>
                      <span className="text-gray-900 font-medium">{apt.therapistName}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Specialized Droni</span>
                      <span className="text-[#1b4332] font-bold">{apt.droniId}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Session Timeline</span>
                      <span className="text-gray-900 font-medium">
                        {apt.durationMins} mins therapy + {apt.sanitationMins} mins sanitation
                      </span>
                    </div>
                  </div>

                  {/* Visual Sanitation Buffer Bar */}
                  <div className="flex items-center gap-2 text-[11px]">
                    <div className="flex-1 h-3 rounded-full bg-emerald-100 overflow-hidden flex border border-emerald-200 shadow-inner">
                      <div className="h-full bg-[#1b4332]" style={{ width: "80%" }} title="Therapy Session"></div>
                      <div className="h-full bg-[#d4a373]" style={{ width: "20%" }} title="15-min Sanitation Buffer"></div>
                    </div>
                    <span className="text-[#1b4332] font-mono text-[10px] font-bold whitespace-nowrap">
                      +15m T_s Sanitation Blocked
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="ayur-card max-w-lg w-full p-6 shadow-2xl relative space-y-4 bg-white rounded-2xl border border-gray-200">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#1b4332] font-serif text-lg font-bold">
              <CalendarIcon className="w-5 h-5 text-[#d4a373]" />
              <span>Book Panchakarma Session</span>
            </div>

            {bookingError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{bookingError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:border-[#1b4332] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Patient Gender</label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as "MALE" | "FEMALE")}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-900"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Panchakarma Therapy</label>
                <select
                  value={newTherapy}
                  onChange={(e) => setNewTherapy(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-900 font-bold text-[#1b4332]"
                >
                  <option value="Vamana (Emesis Therapy)">Vamana (Emesis Therapy)</option>
                  <option value="Shirodhara (Taila Dhara)">Shirodhara (Taila Dhara)</option>
                  <option value="Abhyanga & Swedana (Purvakarma)">Abhyanga & Swedana (Purvakarma)</option>
                  <option value="Kashaya Basti (Pradhanakarma)">Kashaya Basti (Pradhanakarma)</option>
                  <option value="Nasya Karma & Mukha Abhyanga">Nasya Karma & Mukha Abhyanga</option>
                  <option value="Virechana Karma Preparation">Virechana Karma Preparation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Treatment Suite</label>
                  <select
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-900"
                  >
                    {roomsList.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Therapist Gender</label>
                  <select
                    value={newTherapistGender}
                    onChange={(e) => {
                      const gender = e.target.value as "MALE" | "FEMALE";
                      setNewTherapistGender(gender);
                      setNewTherapist(
                        gender === "FEMALE"
                          ? "Sunita Verma (Sr. Female Therapist)"
                          : "Ramesh Kumar (Sr. Male Therapist)"
                      );
                    }}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-900"
                  >
                    <option value="FEMALE">Female Therapist</option>
                    <option value="MALE">Male Therapist</option>
                  </select>
                </div>
              </div>

              {/* Chief Vaidya Override Checkbox */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                <label className="flex items-center gap-2 text-gray-800 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overrideChiefVaidya}
                    onChange={(e) => setOverrideChiefVaidya(e.target.checked)}
                    className="rounded text-[#1b4332] focus:ring-[#1b4332]"
                  />
                  <span>Chief Vaidya Emergency Override (Log Audit Note)</span>
                </label>
                <p className="text-[10px] text-gray-500 mt-1">
                  Bypasses strict gender matching or room conflict for emergency clinical procedures.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white rounded-xl font-medium shadow-md"
                >
                  Confirm & Reserve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
