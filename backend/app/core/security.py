from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

security = HTTPBearer(auto_error=False)

ROLES = {"PATIENT", "VAIDYA", "THERAPIST", "ADMIN"}


@dataclass
class AuthUser:
    uid: str
    email: str | None
    role: str
    full_name: str | None = None


_firebase_initialized = False


def _init_firebase() -> None:
    global _firebase_initialized
    if _firebase_initialized:
        return
    if settings.dev_mode and not settings.firebase_credentials_path:
        _firebase_initialized = True
        return
    import firebase_admin
    from firebase_admin import credentials

    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.firebase_credentials_path)
        firebase_admin.initialize_app(cred, {"projectId": settings.firebase_project_id})
    _firebase_initialized = True


async def verify_firebase_token(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
) -> AuthUser:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")

    token = credentials.credentials

    if settings.dev_mode:
        if token.startswith("dev:"):
            parts = token.split(":")
            role = parts[1].upper() if len(parts) > 1 else "PATIENT"
            uid = parts[2] if len(parts) > 2 else "dev-user"
            if role not in ROLES:
                raise HTTPException(status.HTTP_403_FORBIDDEN, "Invalid dev role")
            return AuthUser(uid=uid, email=f"{uid}@dev.local", role=role, full_name="Dev User")

    _init_firebase()
    from firebase_admin import auth as firebase_auth

    try:
        decoded = firebase_auth.verify_id_token(token)
    except Exception as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token") from exc

    role = decoded.get("role", "PATIENT").upper()
    if role not in ROLES:
        role = "PATIENT"

    return AuthUser(
        uid=decoded["uid"],
        email=decoded.get("email"),
        role=role,
        full_name=decoded.get("name"),
    )


def require_roles(*allowed: str):
    allowed_set = {role.upper() for role in allowed}

    async def checker(user: Annotated[AuthUser, Depends(verify_firebase_token)]) -> AuthUser:
        if user.role not in allowed_set:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Insufficient permissions")
        return user

    return checker
