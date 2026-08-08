import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import time
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

from app.config import settings
from app.models.schema import GeocodeRequest, GeocodeResponse, PresetAddress
from app.orchestrator import orchestrator
from app.database.pincode_db import pincode_db

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Multi-Agent AI System for Messy Indian Address Parsing, PIN Verification, OpenStreetMap Spatial Reasoning & Last-Mile Delivery Geocoding."
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PRESET_ADDRESSES: List[PresetAddress] = [
    PresetAddress(
        id="preset_1",
        title="Hinglish & Landmark Offset (Bengaluru)",
        address="Opposite Ganesh Temple, 10th Main Road, Indiranagar, Bengaluru, 560002",
        description="Contains landmark direction ('Opposite Ganesh Temple') and an incorrect PIN code (560002 instead of 560038 for Indiranagar).",
        category="Hinglish Landmark"
    ),
    PresetAddress(
        id="preset_2",
        title="Colony Name & Missing PIN (Mumbai)",
        address="Behind State Bank ATM, near Lokhandwala Complex, Andheri West, Mumbai",
        description="Informal colony name with Hinglish spatial indicator ('Behind', 'near') and missing PIN code.",
        category="Informal Colony"
    ),
    PresetAddress(
        id="preset_3",
        title="Typo PIN & Regional Name (Delhi NCR)",
        address="Opp CP Metro Gate 3, Connaught Place, New Delhi, 110099",
        description="Abbreviated landmark ('CP Metro'), Hinglish 'Opp', and typo PIN code (110099).",
        category="Metro Landmark"
    ),
    PresetAddress(
        id="preset_4",
        title="Tech Park & Regional Spelling (Hyderabad)",
        address="Near Cyber Towers ke paas, Madhapur, HITEC City, Hyderabad, 500081",
        description="Hinglish double preposition ('ke paas') with tech park landmark.",
        category="Tech Corridor"
    ),
    PresetAddress(
        id="preset_5",
        title="Regional Landmark & Locality (Andhra Pradesh)",
        address="Near Sri lakshmi tirupatama nelayam, Kunchanapalli, Guntur, 522501",
        description="Spatial landmark ('Near Sri lakshmi tirupatama nelayam') in Kunchanapalli, Andhra Pradesh at coordinates (16.463222, 80.620167).",
        category="Andhra Landmark"
    ),
    PresetAddress(
        id="preset_6",
        title="Low Confidence / Ambiguous Address",
        address="Flat 402, Sai Residency, Main Road, India",
        description="Extremely vague address without city, district, or PIN code, triggering low-confidence safety warning flags.",
        category="Ambiguous Case"
    ),
    PresetAddress(
        id="preset_7",
        title="NSA Academy & Opp Gateway Hotel (Vijayawada)",
        address="NSA Academy, Garuda, M.G.Road Opp. Hotel Gateway,Behind Hotel, Labbipet, Vijayawada, Andhra Pradesh 520010",
        description="Complex address with premises, street, spatial landmark ('Opp. Hotel Gateway'), and valid PIN 520010.",
        category="Vijayawada Landmark"
    )
]

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs"
    }

@app.get(f"{settings.API_PREFIX}/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "target_latency": "<500ms"
    }

@app.get(f"{settings.API_PREFIX}/presets", response_model=List[PresetAddress])
async def get_presets():
    return PRESET_ADDRESSES

@app.post(f"{settings.API_PREFIX}/geocode", response_model=GeocodeResponse)
async def geocode_address(request: GeocodeRequest):
    if not request.address or len(request.address.strip()) < 3:
        raise HTTPException(status_code=400, detail="Address input cannot be empty.")
    
    result = await orchestrator.process_address(request.address)
    return result

@app.get(f"{settings.API_PREFIX}/pincode/{{code}}")
async def lookup_pincode(code: str):
    record = pincode_db.get_by_pincode(code)
    if not record:
        raise HTTPException(status_code=404, detail=f"PIN code '{code}' not found in spatial DB.")
    return record

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
