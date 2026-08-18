import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_db
from app.models.schemas import InvoiceCreate, InvoiceResponse

router = APIRouter(prefix="/billing", tags=["billing"])


@router.get("/invoices", response_model=List[InvoiceResponse])
async def get_invoices():
    db: AsyncIOMotorDatabase | None = get_db()
    if db is None:
        return []

    cursor = db.invoices.find().sort("created_at", -1)
    invoices = []
    async for doc in cursor:
        doc["id"] = str(doc.get("_id", doc.get("id", str(uuid.uuid4()))))
        invoices.append(InvoiceResponse(**doc))
    return invoices


@router.post("/invoices", response_model=InvoiceResponse)
async def create_invoice(invoice: InvoiceCreate):
    db: AsyncIOMotorDatabase | None = get_db()
    
    # Calculate values
    room_total = invoice.duration_days * invoice.daily_room_tariff
    medicines_total = sum(m.quantity * m.unit_price for m in invoice.medicines)
    subtotal = invoice.base_package_cost + room_total + medicines_total
    taxable = max(0.0, subtotal - invoice.discount_amount)
    tax_amount = round((taxable * invoice.tax_rate) / 100.0, 2)
    total_cost = round(taxable + tax_amount, 2)

    inv_id = f"INV-{uuid.uuid4().hex[:6].upper()}"
    doc = invoice.model_dump()
    doc["id"] = inv_id
    doc["invoice_number"] = f"INV-2026-{uuid.uuid4().hex[:4].upper()}"
    doc["room_total"] = room_total
    doc["medicines_total"] = medicines_total
    doc["subtotal"] = subtotal
    doc["tax_amount"] = tax_amount
    doc["total_cost"] = total_cost
    doc["payment_status"] = "PAID"
    doc["created_at"] = datetime.utcnow()

    if db is not None:
        await db.invoices.insert_one(doc)

    return InvoiceResponse(**doc)
