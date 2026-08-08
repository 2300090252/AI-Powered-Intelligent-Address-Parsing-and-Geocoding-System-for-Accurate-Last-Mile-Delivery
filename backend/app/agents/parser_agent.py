import time
import re
from typing import Dict, Any
from app.models.schema import ParsedAddress
from app.utils.hinglish import (
    normalize_hinglish_text, 
    extract_pincode_regex, 
    parse_spatial_relation,
    INDIAN_CITY_ALIASES,
    INDIAN_CITY_STATE_MAP,
    LOCALITY_SUFFIXES
)
from app.database.pincode_db import pincode_db

INDIAN_STATES = [
    "karnataka", "maharashtra", "delhi", "haryana", "telangana", "tamil nadu", 
    "west bengal", "uttar pradesh", "andhra pradesh", "gujarat", "rajasthan", 
    "kerala", "bihar", "madhya pradesh", "punjab", "odisha", "assam", "chandigarh"
]

class AddressParsingAgent:
    """
    Agent 1: Parses messy Indian addresses into structured components.
    Normalizes Hinglish keywords, extracts landmarks, spatial relations, and PIN code.
    Dynamically maps cities, states, and pincodes without hardcoded defaults.
    """
    def __init__(self):
        self.name = "AddressParsingAgent"

    async def execute(self, address_text: str) -> Dict[str, Any]:
        start_time = time.time()
        cleaned_text = normalize_hinglish_text(address_text)
        
        # 1. Extract PIN code via Regex
        pincode = extract_pincode_regex(cleaned_text)
        
        # 2. Extract Spatial Relation & Landmark
        relation, landmark = parse_spatial_relation(cleaned_text)
        
        # 3. Rule-based component extraction
        parts = [p.strip() for p in cleaned_text.split(',') if p.strip()]
        
        city = ""
        district = ""
        state = ""
        locality = ""
        premises = ""
        street = ""

        # Scan parts backwards to detect City, State, Locality
        for part in reversed(parts):
            p_lower = part.lower().strip()
            # Remove pincode from part string if present
            if pincode and pincode in p_lower:
                p_lower = p_lower.replace(pincode, '').strip()

            # Check city alias
            if not city:
                for alias, std_city in INDIAN_CITY_ALIASES.items():
                    if alias == p_lower or f" {alias}" in p_lower or f"{alias} " in p_lower:
                        city = std_city
                        if city in INDIAN_CITY_STATE_MAP:
                            state = INDIAN_CITY_STATE_MAP[city]["state"]
                            district = INDIAN_CITY_STATE_MAP[city]["district"]
                        break
            
            # Check state
            if not state:
                for s in INDIAN_STATES:
                    if s in p_lower:
                        state = part.title()
                        break

            # Check locality
            if not locality and p_lower:
                # Exclude if part is pure city name or pincode or state
                if city and city.lower() in p_lower:
                    continue
                if any(s in p_lower for s in INDIAN_STATES):
                    continue
                if landmark and landmark.lower() in p_lower:
                    continue
                
                # If part has a locality suffix or is a distinct neighborhood segment
                if any(suf in p_lower for suf in LOCALITY_SUFFIXES) or (len(parts) >= 3 and part != parts[0]):
                    locality = part.strip()

        # If pincode was found, perform quick lookup to populate missing structural fields
        db_match = None
        if pincode:
            db_match = pincode_db.get_by_pincode(pincode)
            if db_match:
                if not city:
                    city = db_match.get("district", "").replace(" Urban", "")
                if not state:
                    state = db_match.get("state", "")
                if not district:
                    district = db_match.get("district", "")
                if not locality:
                    locality = db_match.get("locality", "")

        # Extract premises, street, and refine landmark / locality from parts
        unclaimed_parts = []
        for part in parts:
            p_lower = part.lower().strip()
            clean_p_lower = p_lower.replace(pincode, '').strip() if pincode else p_lower
            
            # Skip if part is purely city, state, or pincode
            if (city and city.lower() == clean_p_lower) or \
               (state and state.lower() == clean_p_lower) or \
               (pincode and clean_p_lower == ""):
                continue

            # Check if part contains spatial relation / landmark
            if landmark and landmark.lower() in p_lower:
                # Strip out the landmark and spatial preposition to leave street name if present
                street_candidate = re.sub(r'\b(opp|opposite|near|behind|beside|next to|samne)\b.*', '', part, flags=re.IGNORECASE).strip(' :,.-')
                if street_candidate and street_candidate.lower() not in [city.lower(), state.lower(), locality.lower()]:
                    street = street_candidate
                continue
            
            # Check if part is equal to locality
            if locality and (locality.lower() == clean_p_lower or clean_p_lower in locality.lower()):
                continue
                
            # Check if part has street suffix (e.g. "M.G.Road", "Main St")
            if any(suf in p_lower for suf in ["road", "marg", "st", "street", "lane", "flyover", "highway", "bypass"]):
                if not street:
                    street = part.strip()
                continue
                
            # If not city/state/pincode/landmark/locality/street, collect as premises
            unclaimed_parts.append(part.strip())

        if unclaimed_parts and not premises:
            premises = ", ".join(unclaimed_parts)

        parsed = ParsedAddress(
            raw_address=address_text,
            premises=premises,
            street=street,
            landmark=landmark,
            spatial_relation=relation,
            locality=locality,
            city=city,
            district=district,
            state=state,
            provided_pincode=pincode,
            verified_pincode=pincode,
            pincode_corrected=False,
            pincode_status="UNVERIFIED"
        )

        duration_ms = round((time.time() - start_time) * 1000, 2)
        return {
            "parsed_address": parsed,
            "trace": {
                "agent": self.name,
                "status": "completed",
                "duration_ms": duration_ms,
                "summary": f"Parsed address components: Locality='{parsed.locality}', City='{parsed.city}', Landmark='{parsed.landmark}'"
            }
        }

parser_agent = AddressParsingAgent()

