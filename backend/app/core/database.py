from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


async def init_db() -> None:
    global _client, _db
    _client = AsyncIOMotorClient(settings.mongodb_uri, serverSelectionTimeoutMS=2000)
    _db = _client[settings.mongodb_db]
    await _ensure_indexes()


async def close_db() -> None:
    global _client, _db
    if _client:
        _client.close()
    _client = None
    _db = None


def get_db() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("Database not initialized")
    return _db


async def _ensure_indexes() -> None:
    db = get_db()
    try:
        await db.users.create_index("firebase_uid", unique=True)
        await db.patients.create_index("patient_id", unique=True)
        await db.schedules.create_index(
            [("date", 1), ("allocated_room_id", 1), ("time_slot.start_time", 1)],
            unique=True,
        )
        await db.schedules.create_index(
            [("date", 1), ("allocated_therapist_uid", 1), ("time_slot.start_time", 1)],
            unique=True,
        )
    except Exception as e:
        print(f"MongoDB connection notice: {e} (Backend running in standalone API mode)")
