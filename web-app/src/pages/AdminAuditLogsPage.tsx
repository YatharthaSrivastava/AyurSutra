import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  FileCode,
  ShieldCheck,
  Search
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  userUid: string;
  userRole: string;
  action: string;
  resource: string;
  status: "ALLOWED" | "OVERRIDDEN" | "DENIED";
  ipAddress: string;
}

export default function AdminAuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [auditLogs] = useState<AuditEntry[]>([
    { id: "AUD-9901", timestamp: "2026-08-08 19:42:10", userUid: "dev:VAIDYA:doc-1", userRole: "VAIDYA", action: "READ_ENCRYPTED_VITALS", resource: "/api/v1/patients/me/vitals", status: "ALLOWED", ipAddress: "127.0.0.1" },
    { id: "AUD-9902", timestamp: "2026-08-08 18:30:45", userUid: "dev:VAIDYA:doc-1", userRole: "VAIDYA", action: "CHIEF_VAIDYA_OVERRIDE", resource: "/api/v1/schedules/booking", status: "OVERRIDDEN", ipAddress: "127.0.0.1" },
    { id: "AUD-9903", timestamp: "2026-08-08 17:15:22", userUid: "dev:THERAPIST:th-2", userRole: "THERAPIST", action: "LOG_FERNET_VITALS", resource: "/api/v1/patients/me/vitals", status: "ALLOWED", ipAddress: "127.0.0.1" },
    { id: "AUD-9904", timestamp: "2026-08-08 15:10:05", userUid: "dev:PATIENT:pat-4", userRole: "PATIENT", action: "RUN_PRAKRITI_ENGINE", resource: "/api/v1/prakriti/assess", status: "ALLOWED", ipAddress: "127.0.0.1" },
  ]);

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userUid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#faf6f1] text-[#1b4332] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#1b4332] text-xs font-semibold tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4 text-[#d4a373]" />
              <span>Phase 3 Sprint 3.3 Compliance Inspector</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-[#1b4332]">
              DISHA & HIPAA Clinical Audit Trail Logs
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Immutable audit history tracking Fernet field encryption access, Chief Vaidya overrides, and RBAC security guardrails.
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit action or UID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs text-gray-900 focus:border-[#1b4332] focus:outline-none"
            />
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="ayur-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-serif font-bold text-lg text-[#1b4332] flex items-center gap-2">
              <FileCode className="w-5 h-5 text-[#d4a373]" />
              <span>Security Event Trail</span>
            </h3>
            <span className="text-xs font-mono text-gray-500">Log Count: {filteredLogs.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] border-b border-gray-200">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User UID & Role</th>
                  <th className="p-3">Security Action</th>
                  <th className="p-3">API Resource</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-[#1b4332]">{log.id}</td>
                    <td className="p-3 text-gray-500">{log.timestamp}</td>
                    <td className="p-3 text-gray-900 font-semibold">
                      {log.userUid} <span className="text-[10px] text-gray-400">({log.userRole})</span>
                    </td>
                    <td className="p-3 text-[#1b4332] font-bold">{log.action}</td>
                    <td className="p-3 text-gray-600">{log.resource}</td>
                    <td className="p-3 font-sans">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          log.status === "ALLOWED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : log.status === "OVERRIDDEN"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-red-50 text-red-800 border-red-200"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
