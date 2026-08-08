from fastapi import APIRouter, Depends

from app.core.security import AuthUser, verify_firebase_token
from app.models.schemas import TokenVerifyResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/verify-token", response_model=TokenVerifyResponse)
async def verify_token(user: AuthUser = Depends(verify_firebase_token)) -> TokenVerifyResponse:
    return TokenVerifyResponse(
        uid=user.uid,
        email=user.email,
        role=user.role,
        full_name=user.full_name,
    )
