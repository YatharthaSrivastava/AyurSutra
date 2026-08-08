# AyurSutra (आयुसूत्र)

Enterprise Panchakarma hospital management platform.

## Structure

```
ayursutra/
├── web-app/     # Vite + React + Tailwind (website)
├── backend/     # FastAPI + Motor + Firebase Auth
└── tracker.md   # Live implementation progress
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload --port 8000
```

### Web App

```bash
cd web-app
npm install
copy .env.example .env
npm run dev
```

Open http://localhost:5173

## Docs Reference

See `tracker.md` for module status and remaining work.
