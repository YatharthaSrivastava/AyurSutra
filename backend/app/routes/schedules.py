import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_db
from app.models.schemas import AppointmentCreate, AppointmentResponse

router = APIRouter(prefix="/schedules", tags=["schedules"])


@router.get("", response_model=List[AppointmentResponse])
async def get_schedules(date: Optional[str] = None, room: Optional[str] = None):
    db: AsyncIOMotorDatabase | None = get_db()
    if db is None:
        return []

    query = {}
    if date:
        query["date"] = date
    if room and room != "ALL":
        query["room_name"] = room

    cursor = db.schedules.find(query).sort("start_time", 1)
    appointments = []
    async for doc in cursor:
        doc["id"] = str(doc.get("_id", doc.get("id", str(uuid.uuid4()))))
        appointments.append(AppointmentResponse(**doc))
    return appointments


@router.post("", response_model=AppointmentResponse)
async def create_schedule(appointment: AppointmentCreate):
    db: AsyncIOMotorDatabase | None = get_db()
    apt_id = f"APT-{uuid.uuid4().hex[:6].upper()}"
    doc = appointment.model_dump()
    doc["id"] = apt_id
    doc["status"] = "SCHEDULED"
    doc["created_at"] = datetime.utcnow()

    if db is not None:
        await db.schedules.insert_one(doc)

    return AppointmentResponse(**doc)


@router.patch("/{apt_id}/status")
async def update_status(apt_id: str, new_status: str):
    db: AsyncIOMotorDatabase | None = get_db()
    if db is not None:
        await db.schedules.update_one(
            {"$or": [{"id": apt_id}, {"_id": apt_id}]},
            {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
        )
    return {"status": "SUCCESS", "id": apt_id, "new_status": new_status}
