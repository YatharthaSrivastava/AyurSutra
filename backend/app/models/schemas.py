from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class UserRole(str, Enum):
    PATIENT = "PATIENT"
    VAIDYA = "VAIDYA"
    THERAPIST = "THERAPIST"
    ADMIN = "ADMIN"


class TreatmentPhase(str, Enum):
    PURVAKARMA = "Purvakarma"
    PRADHANAKARMA = "Pradhanakarma"
    PASCHATKARMA = "Paschatkarma"


class PrakritiAssessment(BaseModel):
    vata_score: int = Field(ge=0, le=100)
    pitta_score: int = Field(ge=0, le=100)
    kapha_score: int = Field(ge=0, le=100)
    dominant_dosha: str


class ActiveTreatmentPlan(BaseModel):
    protocol_name: str
    current_phase: TreatmentPhase
    start_date: str
    end_date: str
    assigned_vaidya_uid: str
    purvakarma_complete: bool = False


class PatientCreate(BaseModel):
    full_name: str
    gender: str
    age: int = Field(ge=1, le=120)
    phone: str | None = None


class PatientResponse(BaseModel):
    patient_id: str
    firebase_uid: str
    full_name: str
    gender: str
    age: int
    prakriti_assessment: PrakritiAssessment | None = None
    active_treatment_plan: ActiveTreatmentPlan | None = None


class VitalLog(BaseModel):
    bp_sys: int = Field(ge=60, le=250)
    bp_dia: int = Field(ge=40, le=150)
    pulse: int = Field(ge=40, le=200)


class PrakritiQuizAnswer(BaseModel):
    question_id: str
    value: int = Field(ge=1, le=5)


class PrakritiAssessRequest(BaseModel):
    answers: list[PrakritiQuizAnswer]
    symptom_variance: float = Field(default=0.0, ge=0.0, le=1.0)


class PrakritiAssessResponse(BaseModel):
    assessment: PrakritiAssessment
    holistic_health_index: float


class TokenVerifyResponse(BaseModel):
    uid: str
    email: str | None
    role: str
    full_name: str | None = None


class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime
