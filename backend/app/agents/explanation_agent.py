import time
from typing import Dict, Any, Optional
from app.models.schema import ParsedAddress, MatchedLandmark, ConfidenceBreakdown

class ExplanationAgent:
    """
    Agent 7: Generates natural language reasoning for delivery riders & dispatchers,
    explaining why the pin was selected and detailing any PIN corrections or landmark offsets.
    """
    def __init__(self):
        self.name = "ExplanationAgent"

    async def execute(
        self, 
        parsed_address: ParsedAddress, 
        matched_landmark: Optional[MatchedLandmark], 
        confidence: ConfidenceBreakdown
    ) -> Dict[str, Any]:
        start_time = time.time()
        
        parts = []
        parts.append(f"Confidence level: {confidence.level} ({confidence.score}%).")

        if matched_landmark:
            parts.append(f"Matched real landmark '{matched_landmark.name}' on OpenStreetMap.")
            if parsed_address.spatial_relation:
                parts.append(f"Applied spatial vector offset for '{parsed_address.spatial_relation}' (~25m across street/road).")
        else:
            parts.append(f"Geocoded to locality centroid ({parsed_address.locality}, {parsed_address.city}).")

        if parsed_address.pincode_corrected:
            parts.append(f"PIN code was corrected from '{parsed_address.provided_pincode}' to verified PIN '{parsed_address.verified_pincode}' based on spatial DB lookup.")

        if "FLAGGED_LOW_CONFIDENCE" in confidence.flags:
            parts.append("WARNING: Low confidence result. Delivery driver should verify with customer before arrival.")

        explanation = " ".join(parts)

        duration_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "explanation": explanation,
            "trace": {
                "agent": self.name,
                "status": "completed",
                "duration_ms": duration_ms,
                "summary": "Generated delivery driver explanation string."
            }
        }

explanation_agent = ExplanationAgent()
