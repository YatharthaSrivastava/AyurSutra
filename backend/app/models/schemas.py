from datetime import datetime
from enum import Enum
from typing import Any, List, Optional
from pydantic import BaseModel, Field, EmailStr


class UserRole(str, Enum):
    PATIENT = "PATIENT"
    VAIDYA = "VAIDYA"
    THERAPIST = "THERAPIST"
    ADMIN = "ADMIN"


class TreatmentPhase(str, Enum):
    PURVAKARMA = "PURVAKARMA"
    PRADHANAKARMA = "PRADHANAKARMA"
    PASCHATKARMA = "PASCHATKARMA"
    RASAYANA = "RASAYANA"


# ---------------------------------------------------------------------------
# AUTHENTICATION & USER SCHEMAS
# ---------------------------------------------------------------------------

class UserSignUpRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str = Field(min_length=6)
    role: UserRole = UserRole.PATIENT
    prakriti_hint: Optional[str] = None


class UserSignInRequest(BaseModel):
    identifier: str  # Email or Phone
    password: str


class OTPRequest(BaseModel):
    identifier: str  # Email or Phone
    method: str = "PHONE"  # "PHONE" or "EMAIL"


class OTPVerifyRequest(BaseModel):
    identifier: str
    otp: str


class UserResponse(BaseModel):
    id: str
    uid: str
    full_name: str
    email: str
    phone: str
    role: UserRole
    created_at: datetime
    last_login: Optional[datetime] = None


class AuthResponse(BaseModel):
    token: str
    user: UserResponse


class TokenVerifyResponse(BaseModel):
    uid: str
    email: Optional[str] = None
    role: str
    full_name: Optional[str] = None


# ---------------------------------------------------------------------------
# PATIENT & EHR SCHEMAS
# ---------------------------------------------------------------------------

class PrakritiAssessment(BaseModel):
    vata_score: int = Field(ge=0, le=100)
    pitta_score: int = Field(ge=0, le=100)
    kapha_score: int = Field(ge=0, le=100)
    dominant_dosha: str


class PatientProfile(BaseModel):
    patient_id: str
    user_id: Optional[str] = None
    full_name: str
    age: int
    gender: str
    contact_phone: str
    prakriti: str
    vikriti: Optional[str] = None
    chief_complaint: Optional[str] = None
    allergies: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ---------------------------------------------------------------------------
# APPOINTMENTS & SCHEDULING SCHEMAS
# ---------------------------------------------------------------------------

class AppointmentCreate(BaseModel):
    patient_name: str
    patient_gender: str  # "MALE" | "FEMALE"
    therapy_name: str
    room_name: str
    droni_id: str
    therapist_name: str
    therapist_gender: str
    start_time: str
    date: str
    duration_mins: int = 45
    sanitation_mins: int = 15
    chief_vaidya_override: bool = False
    notes: Optional[str] = None


class AppointmentResponse(AppointmentCreate):
    id: str
    status: str = "SCHEDULED"  # "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ---------------------------------------------------------------------------
# THERAPY HISTORY SCHEMAS
# ---------------------------------------------------------------------------

class TherapySessionLogCreate(BaseModel):
    patient_id: str
    therapy_name: str
    category: TreatmentPhase
    session_number: int
    date: str
    therapist: str
    prescribed_vaidya: str
    formulation: str
    duration_mins: int
    bp: str
    pulse: str
    outcome: str
    notes: Optional[str] = None


class TherapySessionLogResponse(TherapySessionLogCreate):
    id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ---------------------------------------------------------------------------
# TREATMENT CARE PLAN SCHEMAS
# ---------------------------------------------------------------------------

class TreatmentTaskCreate(BaseModel):
    patient_id: str
    phase: TreatmentPhase
    day_number: int
    time_str: str
    time_of_day: str
    title: str
    formulation: str
    dosage: str
    anupana: str
    instructions: str
    diet_restrictions: str
    prescribed_by: str


class TreatmentTaskResponse(TreatmentTaskCreate):
    id: str
    completed: bool = False
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ---------------------------------------------------------------------------
# THERAPIST WORKLOAD SCHEMAS
# ---------------------------------------------------------------------------

class TherapistWorkloadResponse(BaseModel):
    id: str
    name: str
    gender: str
    specialty: str
    shift_hours: float
    allocated_hours: float
    sessions_count: int
    assigned_suite: str
    workload_ratio: float


class RebalanceWorkloadRequest(BaseModel):
    source_therapist_id: str
    target_therapist_id: str
    transfer_hours: float


# ---------------------------------------------------------------------------
# NOTIFICATIONS & DISPATCH SCHEMAS
# ---------------------------------------------------------------------------

class NotificationDispatch(BaseModel):
    recipient_name: str
    phone: str
    type: str  # "PURVAKARMA_DIET" | "SESSION_REMINDER" | "PASCHATKARMA_DIET" | "CLINICAL_ALERT"
    channel: str = "WHATSAPP"
    message_text: str


class NotificationResponse(NotificationDispatch):
    id: str
    dispatch_time: str
    status: str = "SENT"


# ---------------------------------------------------------------------------
# BILLING & INVOICE SCHEMAS
# ---------------------------------------------------------------------------

class MedicineItem(BaseModel):
    name: str
    quantity: int
    unit_price: float


class InvoiceCreate(BaseModel):
    patient_id: str
    patient_name: str
    invoice_date: str
    base_package_cost: float
    package_name: str
    duration_days: int
    daily_room_tariff: float
    suite_name: str
    medicines: List[MedicineItem] = []
    discount_amount: float = 0.0
    tax_rate: float = 18.0


class InvoiceResponse(InvoiceCreate):
    id: str
    invoice_number: str
    room_total: float
    medicines_total: float
    subtotal: float
    tax_amount: float
    total_cost: float
    payment_status: str = "PAID"
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ---------------------------------------------------------------------------
# GENERAL HEALTH
# ---------------------------------------------------------------------------

class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime
    database: str = "connected"
