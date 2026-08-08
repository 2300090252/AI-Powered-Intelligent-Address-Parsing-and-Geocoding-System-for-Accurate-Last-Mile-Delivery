import sqlite3
import os
from typing import Optional, Dict, Any, List
from app.config import settings
from app.database.seed_pincodes import seed_database

class PincodeDatabase:
    def __init__(self, db_path: str = settings.DB_PATH):
        self.db_path = db_path
        seed_database(self.db_path)

    def _get_connection(self):
        return sqlite3.connect(self.db_path)

    def get_by_pincode(self, pincode: str) -> Optional[Dict[str, Any]]:
        if not pincode:
            return None
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT pincode, office_name, locality, district, state, latitude, longitude FROM pincodes WHERE pincode = ?", (pincode,))
        row = cursor.fetchone()
        conn.close()

        if row:
            return {
                "pincode": row[0],
                "office_name": row[1],
                "locality": row[2],
                "district": row[3],
                "state": row[4],
                "latitude": row[5],
                "longitude": row[6]
            }
        return None

    def search_by_locality_or_city(self, locality: str, city: str = "") -> Optional[Dict[str, Any]]:
        conn = self._get_connection()
        cursor = conn.cursor()
        
        # Priority 1: Exact match on locality
        if locality:
            cursor.execute("SELECT pincode, office_name, locality, district, state, latitude, longitude FROM pincodes WHERE LOWER(locality) LIKE LOWER(?)", (f"%{locality}%",))
            row = cursor.fetchone()
            if row:
                conn.close()
                return {
                    "pincode": row[0],
                    "office_name": row[1],
                    "locality": row[2],
                    "district": row[3],
                    "state": row[4],
                    "latitude": row[5],
                    "longitude": row[6]
                }
                
        # Priority 2: City / District match
        search_term = city or locality
        if search_term:
            cursor.execute("SELECT pincode, office_name, locality, district, state, latitude, longitude FROM pincodes WHERE LOWER(district) LIKE LOWER(?) OR LOWER(office_name) LIKE LOWER(?)", (f"%{search_term}%", f"%{search_term}%"))
            row = cursor.fetchone()
            if row:
                conn.close()
                return {
                    "pincode": row[0],
                    "office_name": row[1],
                    "locality": row[2],
                    "district": row[3],
                    "state": row[4],
                    "latitude": row[5],
                    "longitude": row[6]
                }

        conn.close()
        return None

pincode_db = PincodeDatabase()
