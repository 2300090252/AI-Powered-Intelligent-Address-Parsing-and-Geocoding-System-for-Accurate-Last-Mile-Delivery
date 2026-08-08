from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class GeocodeRequest(BaseModel):
    address: str = Field(..., example="Opposite Ganesh Temple, 10th Main, Indiranagar, Bengaluru, 560002")
    language_preference: Optional[str] = Field("auto", example="auto")

class LanguageInfo(BaseModel):
    detected_language: str  # "English", "Hinglish", "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam"
    translated_address: str
    original_address: str
    translation_required: bool

class ParsedAddress(BaseModel):
    raw_address: str
    premises: str = ""
    street: str = ""
    landmark: str = ""
    spatial_relation: str = ""  # e.g., Opposite, Behind, Near, Beside
    locality: str = ""
    city: str = ""
    district: str = ""
    state: str = ""
    provided_pincode: str = ""
    verified_pincode: str = ""
    pincode_corrected: bool = False
    pincode_status: str = "VALID"  # VALID, CORRECTED, UNVERIFIED, MISSING

class MatchedLandmark(BaseModel):
    name: str
    category: str = "POI"
    osm_id: Optional[int] = None
    latitude: float
    longitude: float
    distance_meters: float

class ConfidenceBreakdown(BaseModel):
    score: int  # 0 to 100
    level: str  # HIGH, MEDIUM, LOW
    flags: List[str] = []
    pincode_match: float
    locality_match: float
    landmark_match: float
    spatial_precision: float

class AgentTraceStep(BaseModel):
    agent: str
    status: str
    duration_ms: float
    summary: str

# AI Validation Report Schemas
class CompletenessItem(BaseModel):
    field: str
    present: bool
    value: str = ""

class AICorrectionItem(BaseModel):
    field: str
    original: str
    corrected: str
    type: str = "correction"  # "correction", "verified", "standardization"

class ValidationStatusBadge(BaseModel):
    label: str
    status: bool  # True = success (✔), False = warning/error (⚠)

class BusinessImpact(BaseModel):
    delivery_success: str
    calls_saved: str
    time_saved: str
    delivery_confidence: str

class ValidationReport(BaseModel):
    completeness: List[CompletenessItem]
    completeness_percentage: int
    corrections: List[AICorrectionItem]
    has_corrections: bool
    validation_status: List[ValidationStatusBadge]
    confidence_score: int
    confidence_level: str
    reasoning: List[str]
    business_impact: BusinessImpact

# AI Candidate Location Schema
class CandidateLocation(BaseModel):
    id: str
    rank: int
    landmark: str
    full_address: str
    latitude: float
    longitude: float
    confidence: int
    confidence_level: str
    reasoning: str
    distance: str
    is_selected: bool

class GeocodeResult(BaseModel):
    latitude: float
    longitude: float
    formatted_address: str
    parsed_address: ParsedAddress
    matched_landmark: Optional[MatchedLandmark] = None
    confidence: ConfidenceBreakdown
    explanation: str
    agent_trace: List[AgentTraceStep]
    validation_report: Optional[ValidationReport] = None
    language_info: Optional[LanguageInfo] = None
    candidate_locations: List[CandidateLocation] = []

class GeocodeResponse(BaseModel):
    status: str
    execution_time_ms: float
    result: GeocodeResult

class PresetAddress(BaseModel):
    id: str
    title: str
    address: str
    description: str
    category: str
