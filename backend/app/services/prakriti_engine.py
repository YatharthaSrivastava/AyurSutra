from datetime import datetime, timezone

from app.models.schemas import PrakritiAssessment, PrakritiAssessRequest, PrakritiAssessResponse

# Question weights: vata, pitta, kapha influence per answer (1-5 scale)
QUESTION_DOSHA_MAP: dict[str, tuple[float, float, float]] = {
    "q1": (1.0, 0.2, 0.1),  # body frame / weight tendency
    "q2": (0.2, 1.0, 0.1),  # skin / heat tolerance
    "q3": (0.1, 0.2, 1.0),  # stamina / sleep depth
    "q4": (1.0, 0.3, 0.2),  # digestion irregularity
    "q5": (0.3, 1.0, 0.2),  # appetite intensity
    "q6": (0.2, 0.3, 1.0),  # mood stability
    "q7": (1.0, 0.4, 0.1),  # anxiety / restlessness
    "q8": (0.2, 1.0, 0.3),  # irritability
    "q9": (0.1, 0.2, 1.0),  # lethargy tendency
}


def _dominant_dosha(vata: int, pitta: int, kapha: int) -> str:
    scores = [("Vata", vata), ("Pitta", pitta), ("Kapha", kapha)]
    scores.sort(key=lambda item: item[1], reverse=True)
    if scores[0][1] == scores[1][1]:
        return f"{scores[0][0]}-{scores[1][0]}"
    return scores[0][0]


def assess_prakriti(payload: PrakritiAssessRequest) -> PrakritiAssessResponse:
    vata_raw = 0.0
    pitta_raw = 0.0
    kapha_raw = 0.0

    for answer in payload.answers:
        weights = QUESTION_DOSHA_MAP.get(answer.question_id, (0.33, 0.33, 0.34))
        vata_raw += weights[0] * answer.value
        pitta_raw += weights[1] * answer.value
        kapha_raw += weights[2] * answer.value

    total = vata_raw + pitta_raw + kapha_raw or 1.0
    vata_score = round(vata_raw / total * 100)
    pitta_score = round(pitta_raw / total * 100)
    kapha_score = max(0, 100 - vata_score - pitta_score)

    assessment = PrakritiAssessment(
        vata_score=vata_score,
        pitta_score=pitta_score,
        kapha_score=kapha_score,
        dominant_dosha=_dominant_dosha(vata_score, pitta_score, kapha_score),
    )

    # H_I = sum(w_v*V + w_p*P + w_k*K) * (1 - sigma_sym)
    w_v, w_p, w_k = 0.35, 0.35, 0.30
    holistic = (
        w_v * vata_score + w_p * pitta_score + w_k * kapha_score
    ) * (1 - payload.symptom_variance)

    return PrakritiAssessResponse(
        assessment=assessment,
        holistic_health_index=round(holistic, 2),
    )


def generate_patient_id() -> str:
    year = datetime.now(timezone.utc).year
    suffix = datetime.now(timezone.utc).strftime("%H%M%S")
    return f"AYU-{year}-{suffix}"
