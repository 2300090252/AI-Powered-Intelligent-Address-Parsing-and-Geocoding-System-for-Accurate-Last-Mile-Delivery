import httpx
from typing import Optional, Dict, Any, Tuple

CITY_COORDINATES = {
    "bengaluru": (12.9784, 77.6408),
    "bangalore": (12.9784, 77.6408),
    "mumbai": (19.0760, 72.8777),
    "mumbai suburban": (19.1363, 72.8277),
    "navi mumbai": (19.0330, 73.0297),
    "delhi": (28.6139, 77.2090),
    "new delhi": (28.6139, 77.2090),
    "kolkata": (22.5726, 88.3639),
    "chennai": (13.0827, 80.2707),
    "hyderabad": (17.3850, 78.4867),
    "pune": (18.5204, 73.8567),
    "ahmedabad": (23.0225, 72.5714),
    "jaipur": (26.9124, 75.7873),
    "surat": (21.1702, 72.8311),
    "lucknow": (26.8467, 80.9462),
    "kanpur": (26.4499, 80.3319),
    "nagpur": (21.1458, 79.0882),
    "indore": (22.7196, 75.8577),
    "thane": (19.2183, 72.9781),
    "bhopal": (23.2599, 77.4126),
    "visakhapatnam": (17.6868, 83.2185),
    "patna": (25.5941, 85.1376),
    "vadodara": (22.3072, 73.1812),
    "thiruvananthapuram": (8.5241, 76.9366),
    "trivandrum": (8.5241, 76.9366),
    "coimbatore": (11.0168, 76.9558),
    "kochi": (9.9312, 76.2673),
    "cochin": (9.9312, 76.2673),
    "vijayawada": (16.5062, 80.6480),
    "guntur": (16.3067, 80.4365),
    "chandigarh": (30.7333, 76.7794),
    "mysuru": (12.2958, 76.6394),
    "mysore": (12.2958, 76.6394),
    "noida": (28.5708, 77.3261),
    "gurugram": (28.4595, 77.0266),
    "gurgaon": (28.4595, 77.0266),
    "ghaziabad": (28.6692, 77.4538),
    "faridabad": (28.4089, 77.3178),
    "gwalior": (26.2183, 78.1828),
    "jodhpur": (26.2389, 73.0243),
    "dehradun": (30.3165, 78.0322),
    "shimla": (31.1048, 77.1734),
    "ranchi": (23.3441, 85.3096),
    "bhubaneswar": (20.2961, 85.8245),
    "guwahati": (26.1445, 91.7362),
    "agra": (27.1767, 78.0081),
    "varanasi": (25.3176, 82.9739),
    "nashik": (19.9975, 73.7898),
    "rajkot": (22.3039, 70.8022),
    "ludhiana": (30.9010, 75.8573),
    "amritsar": (31.6340, 74.8723),
    "madurai": (9.9252, 78.1198)
}

async def geocode_online(query: str) -> Optional[Dict[str, Any]]:
    """
    Query OpenStreetMap Nominatim API for exact latitude/longitude of any address, locality, city or PIN.
    """
    if not query or len(query.strip()) < 2:
        return None

    url = "https://nominatim.openstreetmap.org/search"
    headers = {"User-Agent": "PataAI-IntelligentGeocoder/1.0 (contact@pata.ai)"}
    params = {"q": query.strip(), "format": "json", "limit": 1}

    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(url, params=params, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                if data and len(data) > 0:
                    first = data[0]
                    return {
                        "latitude": float(first["lat"]),
                        "longitude": float(first["lon"]),
                        "display_name": first.get("display_name", "")
                    }
    except Exception:
        pass
    return None

def get_city_fallback_coords(city_name: str) -> Optional[Tuple[float, float]]:
    """Returns fallback coordinates for major Indian cities if offline/unresolved."""
    if not city_name:
        return None
    return CITY_COORDINATES.get(city_name.lower().strip())
