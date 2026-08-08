# Pata AI · Production Deployment Guide (Vercel + Render)

This guide provides step-by-step instructions for deploying the **Pata AI Address Intelligence System** to production using **Vercel** for the React frontend and **Render / Railway** for the FastAPI backend.

---

## System Architecture

```
┌──────────────────────────────────────┐       HTTPS / JSON       ┌──────────────────────────────────────┐
│  React + Vite Frontend (Vercel)      │ ───────────────────────> │  FastAPI Multi-Agent Backend (Render)│
│  - Regional Language Detection UI    │                          │  - RegionalLanguageAgent (Step 0)   │
│  - Interactive Map & Layer Control   │ <─────────────────────── │  - AddressParsingAgent (Step 1)     │
│  - AI Validation Report & Gauge      │       CORS Enabled       │  - PincodeAgent & LandmarkAgent     │
│  - AI Candidate Locations (1, 2, 3)  │                          │  - OpenStreetMap & Consensus Engine  │
└──────────────────────────────────────┘                          └──────────────────────────────────────┘
```

---

## 1. Backend Deployment (Render / Railway)

Because FastAPI relies on Python, SQLite, and asynchronous worker tasks, the backend is configured for 1-click hosting on **Render** (or **Railway**).

### Option A: Deploy on Render (Recommended)
1. **Push your project to GitHub**.
2. Log into [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**.
6. Once deployed, copy your production backend URL:
   `https://pata-ai-backend.onrender.com`

---

## 2. Frontend Deployment (Vercel)

The frontend is built with **React**, **Vite**, **Tailwind CSS**, and **Leaflet**, pre-configured for Vercel hosting.

### Deploying via Vercel Dashboard
1. Log into [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** → **Project**.
2. Import your GitHub repository.
3. Select the `frontend` folder as the **Root Directory**.
4. Set **Framework Preset**: `Vite`.
5. Under **Environment Variables**, add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://pata-ai-backend.onrender.com` (Replace with your backend URL)
6. Click **Deploy**.

---

## 3. Configuration Files Reference

### `frontend/vercel.json`
```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### `frontend/.env.example`
```env
VITE_API_BASE_URL=https://pata-ai-backend.onrender.com
```

### `backend/requirements.txt`
```text
fastapi==0.110.0
uvicorn[standard]==0.28.0
pydantic==2.6.4
httpx==0.27.0
requests==2.31.0
python-dotenv==1.0.1
```

### `backend/Procfile`
```text
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## 4. Local Build & Test Verification

Before pushing to production, verify the production build locally:

```bash
# 1. Build frontend bundle
cd frontend
npm run build

# 2. Preview production build
npm run preview
```

---

## 5. Verification Checklist

- [x] **CORS Configured**: FastAPI `CORSMiddleware` enables cross-origin requests from Vercel domains.
- [x] **Dynamic API URL**: Frontend uses `import.meta.env.VITE_API_BASE_URL` with local fallback.
- [x] **SPA Routing**: `vercel.json` rewrite rule prevents 404 errors on deep route reloads.
- [x] **Tailwind CSS Bundled**: Production build compiles Tailwind styles cleanly.
- [x] **No Hardcoded Localhost**: Replaced hardcoded backend URLs in `App.jsx`.
