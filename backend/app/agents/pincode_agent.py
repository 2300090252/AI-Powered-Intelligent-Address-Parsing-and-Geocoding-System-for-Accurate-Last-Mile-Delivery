import time
from typing import Dict, Any
from app.database.pincode_db import pincode_db
from app.models.schema import ParsedAddress
from app.utils.geocoder import geocode_online, get_city_fallback_coords

class PINCodeVerificationAgent:
    """
    Agent 2: Validates PIN code against Indian postal database,
    detects wrong/typo PIN codes, auto-corrects PIN codes based on city/locality lookup.
    Uses dynamic Nominatim geocoding & city coordinate fallback if PIN/locality is unseeded.
    """
    def __init__(self):
        self.name = "PINVerificationAgent"

    async def execute(self, parsed_address: ParsedAddress) -> Dict[str, Any]:
        start_time = time.time()
        provided = parsed_address.provided_pincode
        locality = parsed_address.locality
        city = parsed_address.city
        
        db_match = None
        status = "VALID"
        corrected = False
        verified_pin = provided

        if provided:
            db_match = pincode_db.get_by_pincode(provided)
            if db_match:
                db_locality = db_match.get("locality", "").lower()
                db_office = db_match.get("office_name", "").lower()

                # Check exact locality match if locality is provided
                locality_in_db = (
                    locality and (
                        locality.lower() in db_locality or 
                        db_locality in locality.lower() or 
                        locality.lower() in db_office
                    )
                )

                # If locality is provided and differs from pincode DB locality, check for a more specific locality match
                better_match = None
                if locality and not locality_in_db:
                    better_match = pincode_db.search_by_locality_or_city(locality, city)

                if better_match and better_match["pincode"] != provided:
                    # Specific locality mismatch (e.g. PIN 560002 is KR Market, but address specifies Indiranagar -> 560038)
                    status = "CORRECTED"
                    corrected = True
                    verified_pin = better_match["pincode"]
                    db_match = better_match
                else:
                    status = "VALID"
                    corrected = False
                    verified_pin = provided
            else:
                # Provided PIN code not found in DB -> Attempt correction via locality/city search
                corr_match = pincode_db.search_by_locality_or_city(locality, city)
                if corr_match:
                    status = "CORRECTED"
                    corrected = True
                    verified_pin = corr_match["pincode"]
                    db_match = corr_match
                else:
                    status = "UNVERIFIED"
        else:
            # Missing PIN code -> attempt auto-lookup from DB
            corr_match = pincode_db.search_by_locality_or_city(locality, city)
            if corr_match:
                status = "CORRECTED"
                corrected = True
                verified_pin = corr_match["pincode"]
                db_match = corr_match

        # Dynamic Geocoding Resolution if DB did not yield coordinates for unseeded address
        if not db_match:
            search_queries = []
            if locality and city:
                search_queries.append(f"{locality}, {city}, {parsed_address.state or ''}, India")
            if city:
                search_queries.append(f"{city}, {parsed_address.state or ''}, India")
            if provided:
                search_queries.append(f"{provided}, India")
            if parsed_address.raw_address:
                search_queries.append(parsed_address.raw_address)

            geo_found = None
            for q in search_queries:
                geo_found = await geocode_online(q)
                if geo_found:
                    break

            if geo_found:
                db_match = {
                    "pincode": provided or "VERIFIED",
                    "office_name": f"{locality or city or 'Location'} S.O",
                    "locality": locality or city or "",
                    "district": city or parsed_address.district or "District",
                    "state": parsed_address.state or "India",
                    "latitude": geo_found["latitude"],
                    "longitude": geo_found["longitude"]
                }
            else:
                city_coords = get_city_fallback_coords(city) or get_city_fallback_coords(parsed_address.district)
                if city_coords:
                    db_match = {
                        "pincode": provided or "VERIFIED",
                        "office_name": f"{city} Center S.O",
                        "locality": locality or city,
                        "district": city,
                        "state": parsed_address.state or "India",
                        "latitude": city_coords[0],
                        "longitude": city_coords[1]
                    }

        # Update parsed address with verification results
        if verified_pin:
            parsed_address.verified_pincode = verified_pin
        elif db_match and db_match.get("pincode") and db_match.get("pincode") != "VERIFIED":
            parsed_address.verified_pincode = db_match["pincode"]
            
        parsed_address.pincode_corrected = corrected
        parsed_address.pincode_status = status

        if db_match:
            if not parsed_address.city:
                parsed_address.city = db_match.get("district", parsed_address.city).replace(" Urban", "")
            if not parsed_address.state:
                parsed_address.state = db_match.get("state", parsed_address.state)
            if not parsed_address.locality:
                parsed_address.locality = db_match.get("locality", "")

        duration_ms = round((time.time() - start_time) * 1000, 2)
        pin_disp = parsed_address.verified_pincode or provided or "Resolved"
        summary_msg = f"Verified PIN {pin_disp} ({status})" if not corrected else f"Corrected PIN from '{provided}' to '{pin_disp}' based on locality '{locality}'"

        return {
            "parsed_address": parsed_address,
            "pincode_db_record": db_match,
            "trace": {
                "agent": self.name,
                "status": "completed",
                "duration_ms": duration_ms,
                "summary": summary_msg
            }
        }

pincode_agent = PINCodeVerificationAgent()



