import time
from typing import Dict, Any, List, Optional
from app.models.schema import ParsedAddress, MatchedLandmark, ConfidenceBreakdown

class ConfidenceScoringAgent:
    """
    Agent 6: Computes multi-factor score (0-100%) and generates alert flags
    to avoid guessing low-confidence locations.
    """
    def __init__(self):
        self.name = "ScoringAgent"

    async def execute(self, parsed_address: ParsedAddress, matched_landmark: Optional[MatchedLandmark]) -> Dict[str, Any]:
        start_time = time.time()
        
        flags: List[str] = []

        # 1. PIN Score (25%)
        if parsed_address.pincode_status == "VALID":
            pin_score = 25.0
        elif parsed_address.pincode_status == "CORRECTED":
            pin_score = 20.0
            flags.append("PINCODE_AUTO_CORRECTED")
        else:
            pin_score = 5.0
            flags.append("UNVERIFIED_PINCODE")

        # 2. Locality Score (25%)
        if parsed_address.locality and parsed_address.city:
            locality_score = 25.0
        elif parsed_address.city:
            locality_score = 15.0
        else:
            locality_score = 5.0
            flags.append("AMBIGUOUS_CITY_LOCALITY")

        # 3. Landmark Score (35%)
        if matched_landmark:
            landmark_score = 35.0
        elif parsed_address.landmark:
            landmark_score = 15.0
            flags.append("UNMATCHED_LANDMARK")
        else:
            landmark_score = 5.0
            flags.append("NO_LANDMARK_PROVIDED")

        # 4. Street / Premises Precision (15%)
        if parsed_address.premises or parsed_address.street:
            precision_score = 15.0
        else:
            precision_score = 5.0

        total_score = int(round(pin_score + locality_score + landmark_score + precision_score))
        total_score = min(100, max(0, total_score))

        if total_score >= 80:
            level = "HIGH"
        elif total_score >= 50:
            level = "MEDIUM"
        else:
            level = "LOW"
            flags.append("FLAGGED_LOW_CONFIDENCE")

        confidence = ConfidenceBreakdown(
            score=total_score,
            level=level,
            flags=flags,
            pincode_match=pin_score,
            locality_match=locality_score,
            landmark_match=landmark_score,
            spatial_precision=precision_score
        )

        duration_ms = round((time.time() - start_time) * 1000, 2)
        summary_msg = f"Confidence score {total_score}% ({level}). Flags: {flags or 'None'}"

        return {
            "confidence": confidence,
            "trace": {
                "agent": self.name,
                "status": "completed",
                "duration_ms": duration_ms,
                "summary": summary_msg
            }
        }

scoring_agent = ConfidenceScoringAgent()
