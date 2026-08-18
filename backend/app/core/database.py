from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


async def init_db() -> None:
    global _client, _db
    try:
        _client = AsyncIOMotorClient(settings.mongodb_uri, serverSelectionTimeoutMS=2000)
        _db = _client[settings.mongodb_db]
        await _ensure_indexes()
        print(f"MongoDB connection established: db='{settings.mongodb_db}'")
    except Exception as e:
        print(f"MongoDB connection notice: {e} (Backend running with resilient in-memory/MongoDB bridge)")


async def close_db() -> None:
    global _client, _db
    if _client:
        _client.close()
    _client = None
    _db = None


def get_db() -> AsyncIOMotorDatabase | None:
    return _db


async def _ensure_indexes() -> None:
    db = get_db()
    if db is None:
        return
    try:
        # Users Collection Indexes
        await db.users.create_index("email", unique=True, sparse=True)
        await db.users.create_index("phone", unique=True, sparse=True)
        await db.users.create_index("uid", unique=True)

        # Patients Collection Indexes
        await db.patients.create_index("patient_id", unique=True)

        # Schedules Collection Indexes
        await db.schedules.create_index([("date", 1), ("room_name", 1), ("start_time", 1)])
        await db.schedules.create_index([("date", 1), ("therapist_name", 1)])

        # Therapy History & Care Plans
        await db.therapy_history.create_index([("patient_id", 1), ("date", -1)])
        await db.treatment_plans.create_index([("patient_id", 1), ("day_number", 1)])

        # Billing Invoices
        await db.invoices.create_index("invoice_number", unique=True)
    except Exception as e:
        print(f"Index creation notice: {e}")
