import type { PatientProfile, PrakritiAssessment } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ayursutra-api-v2.onrender.com/api/v1";

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
  health: () => request<{ status: string }>("/health"),
  verifyToken: (token: string) =>
    request<{ uid: string; email: string | null; role: string; full_name: string | null }>(
      "/auth/verify-token",
      { method: "POST" },
      token,
    ),
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
};

export function createDevToken(role: string, uid?: string): string {
  return `dev:${role}:${uid || "demo-user"}`;
}
