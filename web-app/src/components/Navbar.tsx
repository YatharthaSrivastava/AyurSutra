import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/lib/types";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import {
  Calendar,
  Activity,
  UserCheck,
  FileText,
  HeartPulse,
  Sparkles,
  LogOut,
  User,
  Shield,
  ClipboardList,
  MessageSquare,
  Sliders,
  ShieldCheck,
  History
} from "lucide-react";

export function Navbar() {
  const { session, logout } = useAuth();
  const location = useLocation();

  if (!session) return null;

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: Activity, roles: ["PATIENT", "VAIDYA", "ADMIN", "THERAPIST"] },
    { path: "/schedule", label: "Scheduler", icon: Calendar, roles: ["PATIENT", "VAIDYA", "ADMIN", "THERAPIST"] },
    { path: "/therapy-tracker", label: "Therapy History", icon: History, roles: ["PATIENT", "VAIDYA", "ADMIN", "THERAPIST"] },
    { path: "/treatment-plans", label: "Treatment Care", icon: ClipboardList, roles: ["PATIENT", "VAIDYA", "ADMIN", "THERAPIST"] },
    { path: "/vaidya/patients", label: "Vaidya Clinical", icon: UserCheck, roles: ["VAIDYA", "ADMIN"] },
    { path: "/therapist/vitals", label: "Therapist Vitals", icon: HeartPulse, roles: ["THERAPIST", "VAIDYA"] },
    { path: "/therapist/workload", label: "Workload", icon: Activity, roles: ["ADMIN", "VAIDYA", "THERAPIST"] },
    { path: "/notifications", label: "Alerts", icon: MessageSquare, roles: ["ADMIN", "VAIDYA", "PATIENT"] },
    { path: "/billing", label: "Billing", icon: FileText, roles: ["ADMIN", "VAIDYA", "PATIENT"] },
    { path: "/admin/master", label: "Master", icon: Sliders, roles: ["ADMIN"] },
    { path: "/admin/audit-logs", label: "Audit Logs", icon: ShieldCheck, roles: ["ADMIN", "VAIDYA"] },
    { path: "/patient/prakriti", label: "Prakriti Quiz", icon: Sparkles, roles: ["PATIENT", "VAIDYA"] },
  ];

  const filteredLinks = navLinks.filter((link) => link.roles.includes(session.role));

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#1b4332] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-[#d4a373] flex items-center justify-center font-serif text-lg font-bold text-[#1b4332] shadow">
              आ
            </div>
            <div>
              <span className="text-xl font-bold font-serif text-white tracking-tight leading-none block">
                AyurSutra
              </span>
              <span className="block text-[10px] tracking-widest text-[#d4a373] uppercase font-bold font-sans mt-0.5">
                आयुसूत्र PANCHAKARMA
              </span>
            </div>
          </Link>

          {/* Nav Items (Clean Flex Wrap without Slider/Scrollbar) */}
          <nav className="hidden lg:flex items-center flex-wrap gap-1">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                    active
                      ? "bg-[#d4a373] text-[#1b4332] shadow-sm font-bold"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#d4a373]">
              <Shield className="w-3.5 h-3.5" />
              <span>{ROLE_LABELS[session.role]}</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-white/20">
              <div className="w-8 h-8 rounded-full bg-[#d4a373] text-[#1b4332] flex items-center justify-center text-xs font-bold shadow">
                {session.fullName ? session.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <span className="hidden md:inline text-xs font-medium text-white truncate max-w-[120px]">
                {session.fullName}
              </span>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-0.5"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar (Grid without horizontal slider) */}
        <div className="lg:hidden grid grid-cols-4 gap-1 py-2 border-t border-white/10 text-center">
          {filteredLinks.slice(0, 8).map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center justify-center p-1 rounded-md text-[10px] font-medium transition-colors ${
                  active ? "text-[#d4a373] font-bold bg-white/10" : "text-white/80 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5 mb-0.5" />
                <span className="truncate w-full">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
    <FloatingChatbot />
    </>
  );
}
