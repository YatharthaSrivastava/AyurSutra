export type UserRole = "PATIENT" | "VAIDYA" | "ADMIN" | "THERAPIST";

export interface AuthSession {
  token: string;
  uid: string;
  email: string;
  phone?: string;
  role: UserRole;
  fullName: string;
}

export interface PrakritiAssessment {
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
  dominant_dosha: string;
}

export interface PatientProfile {
  patient_id: string;
  firebase_uid: string;
  full_name: string;
  gender: string;
  age: number;
  prakriti_assessment?: PrakritiAssessment;
  active_treatment_plan?: {
    protocol_name: string;
    current_phase: string;
    start_date: string;
    end_date: string;
  };
}

export interface PrakritiQuestion {
  id: string;
  text: string;
  doshaHint: string;
}

export const PRAKRITI_QUESTIONS: PrakritiQuestion[] = [
  { id: "q1", text: "My body frame tends to be thin or variable.", doshaHint: "Vata" },
  { id: "q2", text: "I feel warm easily and prefer cooler environments.", doshaHint: "Pitta" },
  { id: "q3", text: "I have steady energy and deep, long sleep.", doshaHint: "Kapha" },
  { id: "q4", text: "My digestion is irregular with bloating.", doshaHint: "Vata" },
  { id: "q5", text: "My appetite is strong and I get irritable when hungry.", doshaHint: "Pitta" },
  { id: "q6", text: "I am calm, steady, and slow to anger.", doshaHint: "Kapha" },
  { id: "q7", text: "I experience anxiety or restlessness often.", doshaHint: "Vata" },
  { id: "q8", text: "I am competitive and sharp-minded.", doshaHint: "Pitta" },
  { id: "q9", text: "I tend toward lethargy or procrastination.", doshaHint: "Kapha" },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  PATIENT: "Patient",
  VAIDYA: "Doctor (Vaidya)",
  ADMIN: "Hospital Manager",
  THERAPIST: "Therapist",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  PATIENT: "View therapy schedules, Prakriti quiz, diet instructions",
  VAIDYA: "Consultation desk, therapy prescription, clinical progress",
  ADMIN: "Resource management, rosters, billing & invoicing",
  THERAPIST: "Daily therapy execution and vital logging",
};
