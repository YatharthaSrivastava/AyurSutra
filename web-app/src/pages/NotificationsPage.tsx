import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  MessageSquare,
  Send,
  CheckCheck,
  Clock,
  Bell,
  Phone,
  User
} from "lucide-react";

interface NotificationLog {
  id: string;
  recipientName: string;
  phone: string;
  type: "PURVAKARMA_DIET" | "SESSION_REMINDER" | "PASCHATKARMA_DIET";
  messageText: string;
  dispatchTime: string;
  status: "DELIVERED" | "SENT" | "READ";
}

export default function NotificationsPage() {
  const [recipientName, setRecipientName] = useState("Aarav Sharma");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [alertType, setAlertType] = useState<"PURVAKARMA_DIET" | "SESSION_REMINDER" | "PASCHATKARMA_DIET">("PURVAKARMA_DIET");
  const [customNotes, setCustomNotes] = useState("");

  const [logs, setLogs] = useState<NotificationLog[]>([
    {
      id: "TW-801",
      recipientName: "Aarav Sharma",
      phone: "+91 98765 43210",
      type: "PURVAKARMA_DIET",
      messageText: "🔔 AyurSutra Alert: Please consume 45ml Mahatriphala Ghrita with warm water at 06:30 AM tomorrow on empty stomach.",
      dispatchTime: "08:00 PM Today",
      status: "READ",
    },
    {
      id: "TW-802",
      recipientName: "Priya Patel",
      phone: "+91 98765 12345",
      type: "SESSION_REMINDER",
      messageText: "🌿 AyurSutra Reminder: Your Shirodhara therapy is scheduled tomorrow at 10:30 AM in Suite 2 with Therapist Sunita Verma.",
      dispatchTime: "06:15 PM Today",
      status: "DELIVERED",
    },
  ]);

  const handleDispatchAlert = (e: React.FormEvent) => {
    e.preventDefault();

    let text = "";
    if (alertType === "PURVAKARMA_DIET") {
      text = `🔔 AyurSutra Alert: Please consume prescribed Snehapana ghee on empty stomach tomorrow morning. Drink warm water only. ${customNotes}`;
    } else if (alertType === "SESSION_REMINDER") {
      text = `🌿 AyurSutra Reminder: Your Panchakarma therapy session is scheduled for tomorrow. Please arrive 10 mins prior. ${customNotes}`;
    } else {
      text = `🍵 AyurSutra Diet Alert: Paschatkarma Day 2 — Prepare Vilepi (thick rice gruel) for lunch and Akrita Yusha for dinner. ${customNotes}`;
    }

    const newLog: NotificationLog = {
      id: `TW-${803 + logs.length}`,
      recipientName,
      phone,
      type: alertType,
      messageText: text,
      dispatchTime: "Just now",
      status: "SENT",
    };

    setLogs([newLog, ...logs]);
    setCustomNotes("");
  };

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-1">
              <MessageSquare className="w-4 h-4 text-[#d4a373]" />
              <span>MOD-06 Twilio Integration Engine</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-[#1b4332]">
              WhatsApp & SMS Purvakarma Alert Console
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Automated Twilio WhatsApp dietary reminder dispatch and therapy session alerts for Panchakarma patients.
            </p>
          </div>
        </div>

        {/* Dispatch Form & Logs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Dispatch Panel */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleDispatchAlert} className="ayur-card p-6 space-y-4">
              <div className="flex items-center gap-2 font-serif font-bold text-lg text-[#1b4332] border-b border-gray-100 pb-3">
                <Bell className="w-5 h-5 text-[#d4a373]" />
                <span>Send WhatsApp Reminder</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#1b4332]" />
                    <span>Patient Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-900 focus:border-[#1b4332] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#1b4332]" />
                    <span>WhatsApp Mobile Number</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 font-mono text-gray-900 focus:border-[#1b4332] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Reminder Category</label>
                  <select
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-gray-900"
                  >
                    <option value="PURVAKARMA_DIET">Purvakarma Snehapana Intake Alert</option>
                    <option value="SESSION_REMINDER">Therapy Session Appointment Reminder</option>
                    <option value="PASCHATKARMA_DIET">Paschatkarma Samsarjana Diet Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Additional Clinical Note</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Remember to drink 2 glasses of warm water after intake."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-gray-900 focus:border-[#1b4332] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#1b4332] py-3 text-sm font-semibold text-white transition hover:bg-[#2d6a4f] flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Twilio WhatsApp Alert</span>
              </button>
            </form>
          </div>

          {/* Message Dispatch Logs */}
          <div className="lg:col-span-7">
            <div className="ayur-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#1b4332] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#d4a373]" />
                  <span>Twilio Message Dispatch Log</span>
                </h3>
                <span className="text-xs text-gray-500 font-mono">Total Sent: {logs.length}</span>
              </div>

              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-[#1b4332]">
                        <span>{log.recipientName}</span>
                        <span className="font-mono text-gray-500">({log.phone})</span>
                      </div>
                      <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                        <CheckCheck className="w-3.5 h-3.5" /> {log.status}
                      </span>
                    </div>

                    <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200 font-mono text-[11px] leading-relaxed">
                      {log.messageText}
                    </p>

                    <div className="text-[10px] text-gray-400 text-right">
                      ID: {log.id} • {log.dispatchTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
