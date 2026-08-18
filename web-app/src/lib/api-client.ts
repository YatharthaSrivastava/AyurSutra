import type { PatientProfile, PrakritiAssessment } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.detail || response.statusText, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  health: () => request<{ status: string; database?: string }>("/health"),

  // Authentication & User Accounts (Stored in MongoDB)
  signUp: (data: { full_name: string; email: string; phone: string; password: string; role?: string; prakriti_hint?: string }) =>
    request<{ token: string; user: any }>("/auth/signup", { method: "POST", body: JSON.stringify(data) }),

  signIn: (data: { identifier: string; password: string }) =>
    request<{ token: string; user: any }>("/auth/signin", { method: "POST", body: JSON.stringify(data) }),

  sendOtp: (data: { identifier: string; method?: string }) =>
    request<{ status: string; message: string; dev_otp_hint?: string }>("/auth/otp/send", { method: "POST", body: JSON.stringify(data) }),

  verifyOtp: (data: { identifier: string; otp: string }) =>
    request<{ token: string; user: any }>("/auth/otp/verify", { method: "POST", body: JSON.stringify(data) }),

  verifyToken: (token: string) =>
    request<{ uid: string; email: string | null; role: string; full_name: string | null }>(
      "/auth/verify-token",
      { method: "POST" },
      token,
    ),

  // Patients EHR
  registerPatient: (token: string, data: { full_name: string; gender: string; age: number; phone?: string }) =>
    request<PatientProfile>("/patients", { method: "POST", body: JSON.stringify(data) }, token),

  getMyProfile: (token: string) => request<PatientProfile>("/patients/me", {}, token),

  assessPrakriti: (
    token: string,
    answers: { question_id: string; value: number }[],
    symptomVariance = 0.05,
  ) =>
    request<{ assessment: PrakritiAssessment; holistic_health_index: number }>(
      "/prakriti/assess",
      {
        method: "POST",
        body: JSON.stringify({ answers, symptom_variance: symptomVariance }),
      },
      token,
    ),

  logVitals: (token: string, vitals: { bp_sys: number; bp_dia: number; pulse: number }) =>
    request("/patients/me/vitals", { method: "POST", body: JSON.stringify(vitals) }, token),

  // Schedules (Stored in MongoDB)
  getSchedules: (date?: string, room?: string) =>
    request<any[]>(`/schedules?${date ? `date=${date}` : ""}${room ? `&room=${room}` : ""}`),

  createSchedule: (data: any) =>
    request<any>("/schedules", { method: "POST", body: JSON.stringify(data) }),

  // Invoices & Billing (Stored in MongoDB)
  getInvoices: () => request<any[]>("/billing/invoices"),

  createInvoice: (data: any) =>
    request<any>("/billing/invoices", { method: "POST", body: JSON.stringify(data) }),
};

export function createDevToken(role: string, uid?: string): string {
  return `dev:${role}:${uid || "demo-user"}`;
}
