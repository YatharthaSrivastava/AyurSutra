# AyurSutra — Milestone & Deliverables Tracker

**Last updated:** 2026-08-09 (Sprint 3.3, Therapy History & Prior Intake Tracker Release)

**Reference docs:** PRD v1.1, Rules, Schema, Design, ImplementationPlan, Tech Stack

---

## 1. Feature Progress Matrix

| Module ID | Module Name | Tech Stack | Status | Target | Notes |
|-----------|-------------|------------|--------|--------|-------|
| MOD-01 | Firebase JWT Authentication & RBAC | Firebase / FastAPI / React | **COMPLETED** | Month 1, Wk 2 | Role toggle, Display Name, Email, Phone fields & SMS/Email 6-digit OTP verification flow |
| MOD-02 | Patient EHR & Vitals Logging | MongoDB / FastAPI | **COMPLETED** | Month 1, Wk 4 | EHR registration, Vaidya patient console (`/vaidya/patients`), Field-level encryption (Fernet) |
| MOD-03 | Prakriti Score Calculation Engine | Python / Pydantic | **COMPLETED** | Month 2, Wk 2 | Backend engine + quiz UI + tripartite dosha bar chart visualization |
| MOD-04 | Multi-Resource Conflict Scheduler | React / Vite | **COMPLETED** | Month 3, Wk 3 | Interactive 7-suite matrix, 15-min sanitation buffer ($T_s$), gender matching rule & Vaidya override |
| MOD-05 | Therapist Mobile View & Quick Vitals | React / Tailwind | **COMPLETED** | Month 4, Wk 2 | Touch-optimized quick vitals entry (>48px targets), Agni & Sweda rating, encrypted vitals timeline |
| MOD-06 | WhatsApp / SMS Reminders Engine | Twilio API / React | **COMPLETED** | Month 4, Wk 4 | Twilio WhatsApp reminder dispatch console (`/notifications`) & Purvakarma Snehapana alerts |

---

## 2. Sprint Completion Log

### ✅ Done (all features completed)

- [x] Monorepo scaffold: `web-app/` (Vite + React + Tailwind + Lucide) + `backend/` (FastAPI)
- [x] FastAPI async architecture with Motor MongoDB connection + schema indexes
- [x] Firebase JWT middleware with dev-mode bearer tokens (`dev:ROLE:uid`)
- [x] RBAC dependency guards on all `/api/v1/*` routes (except `/health`)
- [x] Field-level encryption (Fernet) for patient vitals at rest
- [x] Website UI with Ayurvedic design tokens (`ayur-primary`, `ayur-accent`, dosha colors)
- [x] Executive responsive Navigation bar (`Navbar.tsx`) with role badges and module links
- [x] Universal login portal with Full Name, Email, Phone inputs & simulated 6-digit OTP verification (`LoginPage.tsx`)
- [x] Role-based dashboards with RBAC-gated routes
- [x] Patient EHR onboarding page (`/patient/onboarding`)
- [x] Prakriti diagnostic quiz + tripartite bar chart + H_I score (`/patient/prakriti`)
- [x] MOD-04: Multi-Resource Scheduler UI (`/schedule`) with 15-min sanitation buffer ($T_s$), Droni tracker & gender matching guardrails
- [x] Sprint 1.3: Panchakarma 3-Phase Progression Care Plan (`/treatment-plans`) for Purvakarma, Pradhanakarma & Paschatkarma
- [x] MOD-02: Vaidya Patient Console (`/vaidya/patients`) with assigned patient roster & clinical progress notes
- [x] MOD-05: Therapist quick vital entry page (`/therapist/vitals`) with touch targets, Agni score & session history
- [x] Phase 2 Sprint 2.2: Therapist Workload Ratio Analytics (`/therapist/workload`) implementing $W = H_a / H_t \le 1.0$
- [x] MOD-06 & Phase 2 Sprint 2.3: Twilio WhatsApp & SMS Purvakarma Alert Console (`/notifications`)
- [x] Phase 3 Sprint 3.2: 24/7 AI Patient Care Assistant (`/patient/ai-assistant`) for Samsarjana Krama dietary guidance
- [x] Phase 3 Sprint 3.2: Super Admin Master Command Console & Feature Switcher (`/admin/master`)
- [x] Phase 3 Sprint 3.3: Dynamic Tariff & Billing Engine (`/billing`) implementing $T_c = B_c + D \times C_h + M_c + T_{tax}$ with printable invoice
- [x] Phase 3 Sprint 3.3: DISHA & HIPAA Compliance Audit Logs Inspector (`/admin/audit-logs`)
- [x] **Therapy History & Prior Intake Tracker (`/therapy-tracker`)**: Verifies prior therapy intake history per patient with RBAC visibility (Patient, Doctor, Manager, Admin)
- [x] Cleanup: Removed PDF generator script workflow and deleted `Tracker.pdf` per user specification

---

## 3. Key Target KPIs

| Metric | Target | Current Status |
|--------|--------|----------------|
| Resource double-booking rate | 0% | 0% — Handled via scheduler conflict validation & $T_s$ buffer |
| API schedule lookup latency | < 350 ms | Verified in backend API tests |
| Therapist vital input time | < 10 sec | Web touch UI optimized with presets & +5/-5 touch buttons |
| Purvakarma dietary compliance | ≥ 88% | Interactive 3-Phase Care Plan & Twilio WhatsApp alert console active |
| Center utilization | ≥ 82% | Optimized via multi-suite scheduler matrix & workload ratio tracker |

---

## 4. Website Pages Built

| Route | Roles | Status |
|-------|-------|--------|
| `/login` | Public | ✅ Role toggle + Full Name, Email, Phone inputs & 6-digit OTP verification |
| `/dashboard` | All authenticated | ✅ Executive dashboard with glassmorphic cards |
| `/schedule` | All authenticated | ✅ Multi-Resource Scheduler Matrix ($T_s$ buffer & gender guard) |
| `/therapy-tracker` | Patient, Doctor, Manager, Admin | ✅ Prior therapy intake history tracker per patient with session counts & clinical notes |
| `/treatment-plans` | All authenticated | ✅ 3-Phase Care Plan (Purvakarma → Paschatkarma) & Samsarjana Krama diet |
| `/vaidya/patients` | Vaidya, Admin | ✅ Assigned EHR roster, dosha tripartite chart, clinical notes |
| `/therapist/vitals` | Therapist, Vaidya | ✅ Touch-optimized vital entry, Agni/Sweda rating & encrypted timeline |
| `/therapist/workload` | Admin, Vaidya, Therapist | ✅ Workload ratio analytics ($W = H_a / H_t \le 1.0$) |
| `/notifications` | Admin, Vaidya, Patient | ✅ Twilio WhatsApp & SMS dietary reminder alert console |
| `/patient/ai-assistant` | All authenticated | ✅ 24/7 AI chatbot for post-Panchakarma recovery diet queries |
| `/billing` | Admin, Vaidya, Patient | ✅ Dynamic Tariff Calculator ($T_c$) & printable itemized invoice |
| `/admin/master` | Admin | ✅ Super Admin feature toggles & multi-center hospital selector |
| `/admin/audit-logs` | Admin, Vaidya | ✅ DISHA & HIPAA compliance audit trail inspector |
| `/patient/onboarding` | Patient, Vaidya, Admin | ✅ EHR registration |
| `/patient/prakriti` | Patient, Vaidya | ✅ Diagnostic quiz + tripartite dosha chart |

---

*This file is the live tracker. Per user specification, PDF generation is disabled and all milestone updates are maintained exclusively in `tracker.md`.*
