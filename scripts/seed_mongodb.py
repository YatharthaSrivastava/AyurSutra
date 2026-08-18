import asyncio
import hashlib
import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Automatically load backend/.env
env_file = os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')
if os.path.exists(env_file):
    load_dotenv(env_file)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "ayursutra")


def _hash_password(pwd: str) -> str:
    return hashlib.sha256(pwd.encode("utf-8")).hexdigest()


async def seed():
    print(f"Connecting to MongoDB at {MONGODB_URI} (db: {MONGODB_DB})...")
    client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
    db = client[MONGODB_DB]

    # 1. Seed Users (All 4 Clinical Roles)
    users = [
        {
            "uid": "usr-patient-101",
            "full_name": "Aarav Sharma",
            "email": "patient@ayursutra.org",
            "phone": "+91 98765 43210",
            "password_hash": _hash_password("Password@123"),
            "role": "PATIENT",
            "prakriti_hint": "Pitta-Vata",
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow(),
        },
        {
            "uid": "usr-vaidya-201",
            "full_name": "Dr. Rajesh Sharma (Sr. Vaidya)",
            "email": "vaidya@ayursutra.org",
            "phone": "+91 98234 56789",
            "password_hash": _hash_password("Password@123"),
            "role": "VAIDYA",
            "prakriti_hint": "Vata-Pitta",
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow(),
        },
        {
            "uid": "usr-therapist-301",
            "full_name": "Ramesh Kumar (Sr. Lead Therapist)",
            "email": "therapist@ayursutra.org",
            "phone": "+91 97112 34567",
            "password_hash": _hash_password("Password@123"),
            "role": "THERAPIST",
            "prakriti_hint": "Kapha-Pitta",
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow(),
        },
        {
            "uid": "usr-admin-401",
            "full_name": "Hospital Superintendent (Admin)",
            "email": "admin@ayursutra.org",
            "phone": "+91 99887 76655",
            "password_hash": _hash_password("Password@123"),
            "role": "ADMIN",
            "prakriti_hint": "Tridoshic",
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow(),
        },
    ]

    for u in users:
        await db.users.update_one({"email": u["email"]}, {"$set": u}, upsert=True)
    print("✅ Seeded Users collection with Patient, Vaidya, Therapist, and Admin demo accounts!")

    # 2. Seed Patients EHR
    patients = [
        {
            "patient_id": "PAT-101",
            "full_name": "Aarav Sharma",
            "age": 38,
            "gender": "Male",
            "contact_phone": "+91 98765 43210",
            "prakriti": "Pitta-Vata (पित्त-वात)",
            "vikriti": "Severe Vata Aggravation & Sciatica",
            "chief_complaint": "Lower back pain radiating to left leg, insomnia, and hyperacidity",
            "allergies": ["Mustard Oil"],
            "created_at": datetime.utcnow(),
        },
        {
            "patient_id": "PAT-102",
            "full_name": "Priya Patel",
            "age": 36,
            "gender": "Female",
            "contact_phone": "+91 98234 56789",
            "prakriti": "Vata-Kapha (वात-कफ)",
            "vikriti": "Chronic Insomnia & Joint Stiffness",
            "chief_complaint": "Difficulty sleeping for 8 months, stiff neck and knee joints",
            "allergies": ["None"],
            "created_at": datetime.utcnow(),
        },
    ]

    for p in patients:
        await db.patients.update_one({"patient_id": p["patient_id"]}, {"$set": p}, upsert=True)
    print("✅ Seeded Patients collection with comprehensive clinical records!")

    client.close()
    print("🎉 MongoDB seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
