import base64
import hashlib
from typing import Any

from cryptography.fernet import Fernet

from app.core.config import settings


def _get_fernet() -> Fernet:
    digest = hashlib.sha256(settings.fle_encryption_key.encode()).digest()
    key = base64.urlsafe_b64encode(digest)
    return Fernet(key)


def encrypt_field(value: str) -> str:
    return _get_fernet().encrypt(value.encode()).decode()


def decrypt_field(value: str) -> str:
    return _get_fernet().decrypt(value.encode()).decode()


def encrypt_vitals(vitals: dict[str, Any]) -> dict[str, Any]:
    encrypted = {}
    for key, val in vitals.items():
        encrypted[key] = encrypt_field(str(val))
    return encrypted


def decrypt_vitals(vitals: dict[str, Any]) -> dict[str, int | float]:
    decrypted: dict[str, int | float] = {}
    for key, val in vitals.items():
        raw = decrypt_field(str(val))
        decrypted[key] = int(raw) if raw.isdigit() else float(raw)
    return decrypted
