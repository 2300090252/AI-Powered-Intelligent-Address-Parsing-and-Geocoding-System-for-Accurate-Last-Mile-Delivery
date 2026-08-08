import re
from typing import Dict, Tuple

# Common Hinglish and Regional Indian Address Keyword Dictionary
HINGLISH_RELATIONS = {
    "opp": "Opposite",
    "opposite": "Opposite",
    "samne": "Opposite",
    "saamne": "Opposite",
    "face to face": "Opposite",
    "near": "Near",
    "ke paas": "Near",
    "pass": "Near",
    "paas": "Near",
    "nadek": "Near",
    "pakka": "Near",
    "behind": "Behind",
    "piche": "Behind",
    "peeche": "Behind",
    "backside": "Behind",
    "back side": "Behind",
    "beside": "Beside",
    "bagal me": "Beside",
    "bagal mein": "Beside",
    "next to": "Beside",
    "adjacent": "Beside",
    "inside": "Inside",
    "andar": "Inside",
    "above": "Above",
    "upar": "Above",
    "under": "Under",
    "niche": "Under"
}

INDIAN_CITY_ALIASES = {
    "bangalore": "Bengaluru",
    "bengaluru": "Bengaluru",
    "bombay": "Mumbai",
    "mumbai": "Mumbai",
    "navi mumbai": "Navi Mumbai",
    "calcutta": "Kolkata",
    "kolkata": "Kolkata",
    "madras": "Chennai",
    "chennai": "Chennai",
    "hyderabad": "Hyderabad",
    "secunderabad": "Hyderabad",
    "delhi": "Delhi",
    "new delhi": "New Delhi",
    "gurgaon": "Gurugram",
    "gurugram": "Gurugram",
    "noida": "Noida",
    "greater noida": "Noida",
    "ghaziabad": "Ghaziabad",
    "faridabad": "Faridabad",
    "poona": "Pune",
    "pune": "Pune",
    "ahmedabad": "Ahmedabad",
    "amdavad": "Ahmedabad",
    "jaipur": "Jaipur",
    "surat": "Surat",
    "lucknow": "Lucknow",
    "kanpur": "Kanpur",
    "nagpur": "Nagpur",
    "indore": "Indore",
    "thane": "Thane",
    "bhopal": "Bhopal",
    "visakhapatnam": "Visakhapatnam",
    "vizag": "Visakhapatnam",
    "patna": "Patna",
    "baroda": "Vadodara",
    "vadodara": "Vadodara",
    "trivandrum": "Thiruvananthapuram",
    "thiruvananthapuram": "Thiruvananthapuram",
    "coimbatore": "Coimbatore",
    "kochi": "Kochi",
    "cochin": "Kochi",
    "vijayawada": "Vijayawada",
    "guntur": "Guntur",
    "chandigarh": "Chandigarh",
    "mysore": "Mysuru",
    "mysuru": "Mysuru"
}

INDIAN_CITY_STATE_MAP = {
    "Bengaluru": {"state": "Karnataka", "district": "Bengaluru Urban"},
    "Mumbai": {"state": "Maharashtra", "district": "Mumbai Suburban"},
    "Navi Mumbai": {"state": "Maharashtra", "district": "Thane"},
    "Kolkata": {"state": "West Bengal", "district": "Kolkata"},
    "Chennai": {"state": "Tamil Nadu", "district": "Chennai"},
    "Hyderabad": {"state": "Telangana", "district": "Hyderabad"},
    "Delhi": {"state": "Delhi", "district": "Central Delhi"},
    "New Delhi": {"state": "Delhi", "district": "New Delhi"},
    "Gurugram": {"state": "Haryana", "district": "Gurugram"},
    "Noida": {"state": "Uttar Pradesh", "district": "Gautam Buddha Nagar"},
    "Ghaziabad": {"state": "Uttar Pradesh", "district": "Ghaziabad"},
    "Faridabad": {"state": "Haryana", "district": "Faridabad"},
    "Pune": {"state": "Maharashtra", "district": "Pune"},
    "Ahmedabad": {"state": "Gujarat", "district": "Ahmedabad"},
    "Jaipur": {"state": "Rajasthan", "district": "Jaipur"},
    "Surat": {"state": "Gujarat", "district": "Surat"},
    "Lucknow": {"state": "Uttar Pradesh", "district": "Lucknow"},
    "Kanpur": {"state": "Uttar Pradesh", "district": "Kanpur Nagar"},
    "Nagpur": {"state": "Maharashtra", "district": "Nagpur"},
    "Indore": {"state": "Madhya Pradesh", "district": "Indore"},
    "Thane": {"state": "Maharashtra", "district": "Thane"},
    "Bhopal": {"state": "Madhya Pradesh", "district": "Bhopal"},
    "Visakhapatnam": {"state": "Andhra Pradesh", "district": "Visakhapatnam"},
    "Patna": {"state": "Bihar", "district": "Patna"},
    "Vadodara": {"state": "Gujarat", "district": "Vadodara"},
    "Thiruvananthapuram": {"state": "Kerala", "district": "Thiruvananthapuram"},
    "Coimbatore": {"state": "Tamil Nadu", "district": "Coimbatore"},
    "Kochi": {"state": "Kerala", "district": "Ernakulam"},
    "Vijayawada": {"state": "Andhra Pradesh", "district": "NTR"},
    "Guntur": {"state": "Andhra Pradesh", "district": "Guntur"},
    "Chandigarh": {"state": "Chandigarh", "district": "Chandigarh"},
    "Mysuru": {"state": "Karnataka", "district": "Mysuru"}
}

LOCALITY_SUFFIXES = [
    "nagar", "colony", "puram", "peth", "gali", "chowk", "chawk", "bazar", "bazaar",
    "road", "marg", "layout", "sector", "phase", "enclave", "society", "complex",
    "apartment", "building", "bhawan", "bhavan", "vihar", "kunj", "wada", "halli",
    "city", "park", "towers", "tower", "plaza", "circle", "cross", "junction", "hub",
    "estate", "center", "centre", "square", "heights", "residency", "gardens", "hills", "pur",
    "palli", "palem", "nilayam", "nelayam", "nivas"
]

def normalize_hinglish_text(text: str) -> str:
    """Cleans up text, removes extra whitespace and standardizes common address prefixes."""
    cleaned = text.strip()
    cleaned = re.sub(r'\s+', ' ', cleaned)
    cleaned = re.sub(r',\s*,', ',', cleaned)
    return cleaned

def extract_pincode_regex(text: str) -> str:
    """Extract 6-digit Indian PIN code using regex."""
    matches = re.findall(r'\b[1-9][0-9]{5}\b', text)
    return matches[0] if matches else ""

def clean_landmark_name(landmark: str) -> str:
    """Strips leading/trailing spatial relationship words (e.g. 'Cyber Towers ke paas' -> 'Cyber Towers')."""
    if not landmark:
        return ""
    cleaned = landmark.strip()
    # Remove spatial keywords from start or end
    for key in HINGLISH_RELATIONS.keys():
        cleaned = re.sub(r'^\b' + re.escape(key) + r'\b\s*', '', cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r'\s*\b' + re.escape(key) + r'\b$', '', cleaned, flags=re.IGNORECASE)
    return cleaned.strip(' :,.-')

def parse_spatial_relation(text: str) -> Tuple[str, str]:
    """
    Extracts spatial relationship phrase (e.g. 'Opposite Ganesh Temple' -> ('Opposite', 'Ganesh Temple')).
    Also cleans up duplicate Hinglish prepositions like 'Near Cyber Towers ke paas'.
    """
    lower_text = text.lower()
    
    # Priority check for multi-word or compound spatial relations
    found_relation = ""
    target_landmark = ""

    for key, relation in HINGLISH_RELATIONS.items():
        pattern = r'\b' + re.escape(key) + r'\b'
        match = re.search(pattern, lower_text)
        if match:
            found_relation = relation
            start_idx = match.start()
            end_idx = match.end()
            
            # If keyword is at start: "Opposite Ganesh Temple" or "Near Cyber Towers ke paas"
            remainder = text[end_idx:].strip(' :,.-')
            if remainder:
                landmark_part = re.split(r'[,;\n]', remainder)[0]
                target_landmark = clean_landmark_name(landmark_part)
                if target_landmark:
                    return found_relation, target_landmark

            # If keyword is at end: "Cyber Towers ke paas"
            prefix = text[:start_idx].strip(' :,.-')
            if prefix:
                landmark_part = re.split(r'[,;\n]', prefix)[-1]
                target_landmark = clean_landmark_name(landmark_part)
                if target_landmark:
                    return found_relation, target_landmark

    return found_relation, target_landmark

