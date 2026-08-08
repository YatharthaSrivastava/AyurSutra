from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import get_db
from app.core.security import AuthUser, require_roles
from app.models.schemas import PrakritiAssessRequest, PrakritiAssessResponse
from app.services.prakriti_engine import assess_prakriti

router = APIRouter(prefix="/prakriti", tags=["prakriti"])


@router.post("/assess", response_model=PrakritiAssessResponse)
async def run_prakriti_assessment(
    payload: PrakritiAssessRequest,
    user: Annotated[AuthUser, Depends(require_roles("PATIENT", "VAIDYA"))],
) -> PrakritiAssessResponse:
    if len(payload.answers) < 3:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Minimum 3 answers required")

    result = assess_prakriti(payload)

    try:
        db = get_db()
        await db.patients.update_one(
            {"firebase_uid": user.uid},
            {"$set": {"prakriti_assessment": result.assessment.model_dump()}},
            upsert=False,
        )
    except Exception as err:
        print(f"MongoDB notice: {err}")

    return result
