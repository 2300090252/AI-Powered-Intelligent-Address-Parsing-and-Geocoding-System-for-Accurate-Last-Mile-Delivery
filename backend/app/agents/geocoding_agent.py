import time
from typing import Dict, Any, Optional
from app.utils.spatial import apply_spatial_offset
from app.utils.geocoder import geocode_online
from app.models.schema import MatchedLandmark, ParsedAddress

class GeocodingConsensusAgent:
    """
    Agent 5: Synthesizes final precise latitude/longitude by fusing landmark geometry,
    directional vector offsets (e.g. 'Opposite' -> 25m perpendicular offset),
    online Nominatim geocoding resolution, and PIN centroid.
    """
    def __init__(self):
        self.name = "GeocodingAgent"

    async def execute(
        self, 
        parsed_address: ParsedAddress, 
        matched_landmark: Optional[MatchedLandmark], 
        pincode_lat: float, 
        pincode_lon: float
    ) -> Dict[str, Any]:
        start_time = time.time()
        
        relation = parsed_address.spatial_relation or "Near"
        
        if matched_landmark:
            # Base pin on OSM Landmark Node + apply spatial offset vector
            base_lat = matched_landmark.latitude
            base_lon = matched_landmark.longitude
            final_lat, final_lon = apply_spatial_offset(base_lat, base_lon, relation, offset_meters=25.0)
            strategy = f"Landmark offset geometry ({relation} '{matched_landmark.name}')"
        else:
            # Try Online Geocoding lookup with raw/parsed address queries
            queries_to_try = []
            if parsed_address.raw_address:
                queries_to_try.append(parsed_address.raw_address)
            
            raw_text = parsed_address.raw_address or ""
            words = raw_text.split()
            if len(words) > 2:
                queries_to_try.append(" ".join(words[1:]))
                queries_to_try.append(" ".join(words[2:]))

            if parsed_address.locality and parsed_address.city:
                queries_to_try.append(f"{parsed_address.locality}, {parsed_address.city}")
            if parsed_address.street and parsed_address.city:
                queries_to_try.append(f"{parsed_address.street}, {parsed_address.city}")

            online_match = None
            for q in queries_to_try:
                if q and len(q.strip()) > 3:
                    online_match = await geocode_online(q)
                    if online_match:
                        break
            
            if online_match:
                final_lat = online_match["latitude"]
                final_lon = online_match["longitude"]
                strategy = f"Direct Nominatim OSM resolution ('{online_match.get('display_name', '')[:40]}...')"
            else:
                # Fallback to PIN / Locality spatial centroid
                final_lat = pincode_lat
                final_lon = pincode_lon
                strategy = f"Locality PIN code centroid geometry ({parsed_address.verified_pincode})"

        duration_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "latitude": final_lat,
            "longitude": final_lon,
            "strategy": strategy,
            "trace": {
                "agent": self.name,
                "status": "completed",
                "duration_ms": duration_ms,
                "summary": f"Calculated pin ({final_lat}, {final_lon}) using {strategy}"
            }
        }

geocoding_agent = GeocodingConsensusAgent()
