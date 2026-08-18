import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import {
  MessageSquare,
  Send,
  Clock,
  Plus,
  Search,
  X
} from "lucide-react";

export interface NotificationLog {
  id: string;
  recipientName: string;
  phone: string;
  type: "PURVAKARMA_DIET" | "SESSION_REMINDER" | "PASCHATKARMA_DIET" | "CLINICAL_ALERT";
  messageText: string;
  dispatchTime: string;
  status: "DELIVERED" | "SENT" | "READ" | "PENDING";
  channel: "WHATSAPP" | "SMS" | "IN_APP";
}

export default function NotificationsPage() {
  const [recipientName, setRecipientName] = useState("Aarav Sharma");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [alertType, setAlertType] = useState<"PURVAKARMA_DIET" | "SESSION_REMINDER" | "PASCHATKARMA_DIET" | "CLINICAL_ALERT">("PURVAKARMA_DIET");
  const [channel, setChannel] = useState<"WHATSAPP" | "SMS" | "IN_APP">("WHATSAPP");
  const [customNotes, setCustomNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  const [logs, setLogs] = useState<NotificationLog[]>([
    {
      id: "TW-801",
      recipientName: "Aarav Sharma",
      phone: "+91 98765 43210",
      type: "PURVAKARMA_DIET",
      channel: "WHATSAPP",
      messageText: "🔔 AyurSutra Alert: Please consume 50ml Mahatriphala Ghrita with warm water at 06:30 AM tomorrow on empty stomach. Avoid cold water and direct air-conditioning.",
      dispatchTime: "08:00 PM Today",
      status: "READ",
    },
    {
      id: "TW-802",
      recipientName: "Priya Patel",
      phone: "+91 98234 56789",
      type: "SESSION_REMINDER",
      channel: "WHATSAPP",
      messageText: "🌿 AyurSutra Reminder: Your Shirodhara therapy is scheduled tomorrow at 10:30 AM in Suite 2 with Therapist Sunita Verma. Please arrive 10 minutes prior.",
      dispatchTime: "06:15 PM Today",
      status: "DELIVERED",
    },
    {
      id: "TW-803",
      recipientName: "Vikram Malhotra",
      phone: "+91 97112 34567",
      type: "PASCHATKARMA_DIET",
      channel: "SMS",
      messageText: "🍲 AyurSutra Diet Alert: Samsarjana Krama Day 2 — Please take warm Vilepi (semi-thick rice porridge) for lunch and Akrita Yusha (unseasoned mung soup) for dinner.",
      dispatchTime: "11:30 AM Today",
      status: "DELIVERED",
    },
    {
      id: "TW-804",
      recipientName: "Ananya Roy",
      phone: "+91 99887 76655",
      type: "CLINICAL_ALERT",
      channel: "IN_APP",
      messageText: "⚠️ Vaidya Note: Vital pulse check required at 04:00 PM post-Nasya karma procedure.",
      dispatchTime: "02:00 PM Today",
      status: "SENT",
    },
  ]);

  const handleDispatchAlert = (e: React.FormEvent) => {
    e.preventDefault();

    let text = "";
    if (alertType === "PURVAKARMA_DIET") {
      text = `🔔 AyurSutra Snehapana Alert: Consume prescribed ghee at dawn on empty stomach with warm water. ${customNotes}`;
    } else if (alertType === "SESSION_REMINDER") {
      text = `🌿 AyurSutra Reminder: Panchakarma therapy session scheduled. Please report to your assigned treatment suite. ${customNotes}`;
    } else if (alertType === "PASCHATKARMA_DIET") {
      text = `🍲 AyurSutra Diet Care: Follow Samsarjana Krama dietary stage carefully to kindle digestive Agni. ${customNotes}`;
    } else {
      text = `⚠️ AyurSutra Clinical Alert: Vaidya consultation or vital sign inspection required. ${customNotes}`;
    }

    const newLog: NotificationLog = {
      id: `TW-${801 + logs.length}`,
      recipientName,
      phone,
      type: alertType,
      channel,
      messageText: text,
      dispatchTime: "Just now",
      status: "SENT",
    };

    setLogs([newLog, ...logs]);
    setCustomNotes("");
    setShowDispatchModal(false);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchType = typeFilter === "ALL" || log.type === typeFilter;
      const matchSearch =
        !searchTerm.trim() ||
        log.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.phone.includes(searchTerm) ||
        log.messageText.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    });
  }, [logs, typeFilter, searchTerm]);

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
              <MessageSquare className="w-4 h-4 text-[#d4a373]" />
              <span>AyurSutra Twilio & WhatsApp Gateway • Clinical Alert Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1b4332] tracking-tight">
              Patient Notifications & Dietary Alerts
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              Automated Twilio WhatsApp reminders for Snehapana ghee intake, Samsarjana diet schedules, and therapy calls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDispatchModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#1b4332]"
            >
              <Plus className="w-4 h-4 text-[#d4a373]" />
              <span>Send New Alert</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KPI METRIC CARDS                                                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg border border-emerald-200 shadow-inner">
              {logs.length}
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Total Dispatches</p>
              <p className="text-sm font-serif font-black text-[#1b4332]">All Channels</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border-2 border-emerald-500/20 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg border border-emerald-200 shadow-inner">
              {logs.filter(l => l.status === "READ" || l.status === "DELIVERED").length}
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-700 uppercase">Delivered & Read</p>
              <p className="text-sm font-serif font-black text-[#1b4332]">98% Delivery Rate</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#faf6f1] text-[#1b4332] flex items-center justify-center font-bold text-lg border border-[#1b4332]/20 shadow-inner">
              WhatsApp
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Primary Channel</p>
              <p className="text-sm font-serif font-black text-[#1b4332]">Twilio Business API</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-lg border border-amber-200 shadow-inner">
              Auto
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-700 uppercase">Dietary Reminders</p>
              <p className="text-sm font-serif font-black text-[#1b4332]">Automated Triggers</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FILTER & SEARCH BAR                                                       */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border-2 border-[#1b4332]/15 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setTypeFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                typeFilter === "ALL"
                  ? "bg-[#1b4332] text-white border-[#1b4332]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              All Alerts ({logs.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("PURVAKARMA_DIET")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                typeFilter === "PURVAKARMA_DIET"
                  ? "bg-[#1b4332] text-white border-[#1b4332]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              Snehapana Diet
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("SESSION_REMINDER")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                typeFilter === "SESSION_REMINDER"
                  ? "bg-[#1b4332] text-white border-[#1b4332]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              Session Calls
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("PASCHATKARMA_DIET")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                typeFilter === "PASCHATKARMA_DIET"
                  ? "bg-[#1b4332] text-white border-[#1b4332]"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
              }`}
            >
              Paschatkarma Diet
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, phone, text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:border-[#1b4332] focus:outline-none w-56 font-medium"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NOTIFICATIONS LOGS LIST                                                   */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white p-5 rounded-3xl border-2 border-[#1b4332]/15 shadow-xs hover:border-[#1b4332]/30 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-[#1b4332] text-white">
                    {log.channel}
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#1b4332]">
                    {log.recipientName}
                  </h4>
                  <span className="text-xs text-gray-500 font-mono font-medium">({log.phone})</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                    {log.type}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{log.dispatchTime}</span>
                  <span className="px-2 py-0.5 rounded font-black text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {log.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#faf6f1] rounded-2xl border border-[#1b4332]/10 text-xs text-gray-800 leading-relaxed font-medium">
                {log.messageText}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* DISPATCH MODAL                                                            */}
      {/* ========================================================================= */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl border-2 border-[#1b4332]/20 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-[#1b4332]">
                <Send className="w-5 h-5 text-[#d4a373]" />
                <h2 className="font-serif font-bold text-xl text-[#1b4332]">
                  Dispatch Patient Alert
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchAlert} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number (with Country Code) *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Alert Category</label>
                  <select
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-[#1b4332]"
                  >
                    <option value="PURVAKARMA_DIET">Purvakarma Snehapana Diet</option>
                    <option value="SESSION_REMINDER">Session & Suite Reminder</option>
                    <option value="PASCHATKARMA_DIET">Paschatkarma Samsarjana Diet</option>
                    <option value="CLINICAL_ALERT">Clinical Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Delivery Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-800"
                  >
                    <option value="WHATSAPP">Twilio WhatsApp</option>
                    <option value="SMS">Direct SMS</option>
                    <option value="IN_APP">In-App Notification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Custom Details / Specific Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Please take 45ml Mahatriphala Ghrita with warm water only..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-900 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Alert Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
