import math
from typing import Tuple

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance in meters between two points on Earth.
    """
    R = 6371000.0  # Radius of earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def apply_spatial_offset(lat: float, lon: float, relation: str, offset_meters: float = 25.0) -> Tuple[float, float]:
    """
    Applies spatial offset vector based on relation keyword (Opposite, Behind, Beside, Near).
    """
    rel = relation.lower().strip()
    
    # Offsets in meters (d_lat ~ meters / 111111, d_lon ~ meters / (111111 * cos(lat)))
    meters_per_deg_lat = 111111.0
    meters_per_deg_lon = 111111.0 * math.cos(math.radians(lat))
    
    if "opposite" in rel or "opp" in rel or "samne" in rel:
        # Move across street (~25m South-East offset)
        lat_offset = -15.0 / meters_per_deg_lat
        lon_offset = 15.0 / meters_per_deg_lon
    elif "behind" in rel or "piche" in rel or "back" in rel:
        # Move back (~30m North offset)
        lat_offset = 30.0 / meters_per_deg_lat
        lon_offset = 0.0
    elif "beside" in rel or "next" in rel or "bagal" in rel or "paas" in rel:
        # Move adjacent (~20m East offset)
        lat_offset = 0.0
        lon_offset = 20.0 / meters_per_deg_lon
    elif "inside" in rel or "andar" in rel:
        # Exact target location
        lat_offset = 0.0
        lon_offset = 0.0
    else:
        # Generic small random jitter / default estimate
        lat_offset = 10.0 / meters_per_deg_lat
        lon_offset = 10.0 / meters_per_deg_lon

    return (round(lat + lat_offset, 6), round(lon + lon_offset, 6))

def get_bounding_box(lat: float, lon: float, radius_km: float = 2.0) -> Tuple[float, float, float, float]:
    """
    Returns (min_lat, min_lon, max_lat, max_lon) bounding box for spatial OSM queries.
    """
    lat_change = radius_km / 111.0
    lon_change = radius_km / (111.0 * math.cos(math.radians(lat)))
    return (
        round(lat - lat_change, 5),
        round(lon - lon_change, 5),
        round(lat + lat_change, 5),
        round(lon + lon_change, 5)
    )
