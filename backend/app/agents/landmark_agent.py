import time
from typing import Dict, Any
from app.models.schema import ParsedAddress

class LandmarkExtractionAgent:
    """
    Agent 3: Identifies directional/spatial relationship phrases (e.g. Opposite Ganesh Temple)
    and prepares landmark key phrases for OpenStreetMap search.
    """
    def __init__(self):
        self.name = "LandmarkExtractionAgent"

    async def execute(self, parsed_address: ParsedAddress) -> Dict[str, Any]:
        start_time = time.time()
        
        landmark = parsed_address.landmark
        spatial_rel = parsed_address.spatial_relation or "Near"

        # Determine OSM search category based on landmark name keywords
        l_lower = landmark.lower()
        osm_query_type = "amenity"
        if "temple" in l_lower or "mandir" in l_lower or "church" in l_lower or "mosque" in l_lower or "gurudwara" in l_lower:
            osm_query_type = "place_of_worship"
        elif "bank" in l_lower or "atm" in l_lower:
            osm_query_type = "bank"
        elif "bus" in l_lower or "metro" in l_lower or "station" in l_lower or "stand" in l_lower:
            osm_query_type = "transportation"
        elif "school" in l_lower or "college" in l_lower or "hospital" in l_lower:
            osm_query_type = "facility"

        duration_ms = round((time.time() - start_time) * 1000, 2)
        summary_msg = f"Extracted landmark '{landmark}' with spatial relation '{spatial_rel}' (Query type: {osm_query_type})" if landmark else "No explicit landmark phrase found in input address"

        return {
            "landmark_query": landmark,
            "spatial_relation": spatial_rel,
            "osm_query_type": osm_query_type,
            "trace": {
                "agent": self.name,
                "status": "completed",
                "duration_ms": duration_ms,
                "summary": summary_msg
            }
        }

landmark_agent = LandmarkExtractionAgent()
