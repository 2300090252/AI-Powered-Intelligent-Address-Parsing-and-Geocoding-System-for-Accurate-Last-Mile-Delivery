import sqlite3
import os
from typing import List, Dict, Any

SAMPLE_PINCODE_DATA: List[Dict[str, Any]] = [
    # Bengaluru
    {"pincode": "560038", "office_name": "Indiranagar H.O", "locality": "Indiranagar", "district": "Bengaluru Urban", "state": "Karnataka", "latitude": 12.9784, "longitude": 77.6408},
    {"pincode": "560034", "office_name": "Koramangala I.K.", "locality": "Koramangala", "district": "Bengaluru Urban", "state": "Karnataka", "latitude": 12.9352, "longitude": 77.6245},
    {"pincode": "560066", "office_name": "Whitefield S.O", "locality": "Whitefield", "district": "Bengaluru Urban", "state": "Karnataka", "latitude": 12.9698, "longitude": 77.7500},
    {"pincode": "560001", "office_name": "Bengaluru G.P.O", "locality": "MG Road", "district": "Bengaluru Urban", "state": "Karnataka", "latitude": 12.9774, "longitude": 77.5986},
    {"pincode": "560002", "office_name": "City Market S.O", "locality": "KR Market", "district": "Bengaluru Urban", "state": "Karnataka", "latitude": 12.9657, "longitude": 77.5772},
    {"pincode": "560100", "office_name": "Electronic City S.O", "locality": "Electronic City", "district": "Bengaluru Urban", "state": "Karnataka", "latitude": 12.8452, "longitude": 77.6602},
    {"pincode": "560076", "office_name": "BTM Layout S.O", "locality": "BTM Layout", "district": "Bengaluru Urban", "state": "Karnataka", "latitude": 12.9166, "longitude": 77.6101},

    # Andhra Pradesh / Guntur / Vijayawada
    {"pincode": "522501", "office_name": "Kunchanapalli S.O", "locality": "Kunchanapalli", "district": "Guntur", "state": "Andhra Pradesh", "latitude": 16.463222, "longitude": 80.620167},
    {"pincode": "520010", "office_name": "Labbipet S.O", "locality": "Labbipet", "district": "NTR", "state": "Andhra Pradesh", "latitude": 16.5085, "longitude": 80.6382},
    {"pincode": "520001", "office_name": "Vijayawada H.O", "locality": "Governorpet", "district": "NTR", "state": "Andhra Pradesh", "latitude": 16.5062, "longitude": 80.6480},
    {"pincode": "522002", "office_name": "Guntur Collectorate", "locality": "Nagarampalem", "district": "Guntur", "state": "Andhra Pradesh", "latitude": 16.3067, "longitude": 80.4365},
    {"pincode": "530001", "office_name": "Visakhapatnam H.O", "locality": "Town Hall", "district": "Visakhapatnam", "state": "Andhra Pradesh", "latitude": 17.7041, "longitude": 83.2977},

    # Mumbai / Thane
    {"pincode": "400053", "office_name": "Andheri West H.O", "locality": "Andheri West", "district": "Mumbai Suburban", "state": "Maharashtra", "latitude": 19.1363, "longitude": 72.8277},
    {"pincode": "400050", "office_name": "Bandra West S.O", "locality": "Bandra West", "district": "Mumbai Suburban", "state": "Maharashtra", "latitude": 19.0596, "longitude": 72.8295},
    {"pincode": "400001", "office_name": "Mumbai G.P.O", "locality": "Fort", "district": "Mumbai City", "state": "Maharashtra", "latitude": 18.9401, "longitude": 72.8347},
    {"pincode": "400014", "office_name": "Dadar T.T. S.O", "locality": "Dadar", "district": "Mumbai City", "state": "Maharashtra", "latitude": 19.0178, "longitude": 72.8478},
    {"pincode": "400076", "office_name": "Powai I.I.T. S.O", "locality": "Powai", "district": "Mumbai Suburban", "state": "Maharashtra", "latitude": 19.1176, "longitude": 72.9060},

    # Delhi / NCR / Gurugram / Noida
    {"pincode": "110001", "office_name": "Connaught Place H.O", "locality": "Connaught Place", "district": "New Delhi", "state": "Delhi", "latitude": 28.6315, "longitude": 77.2167},
    {"pincode": "110016", "office_name": "Hauz Khas S.O", "locality": "Hauz Khas", "district": "South Delhi", "state": "Delhi", "latitude": 28.5494, "longitude": 77.2001},
    {"pincode": "122001", "office_name": "Gurgaon H.O", "locality": "DLF Phase 1", "district": "Gurugram", "state": "Haryana", "latitude": 28.4595, "longitude": 77.0266},
    {"pincode": "122002", "office_name": "DLF Cyber City S.O", "locality": "DLF Cyber City", "district": "Gurugram", "state": "Haryana", "latitude": 28.4950, "longitude": 77.0895},
    {"pincode": "201301", "office_name": "Noida Sector 16", "locality": "Sector 16", "district": "Gautam Buddha Nagar", "state": "Uttar Pradesh", "latitude": 28.5708, "longitude": 77.3261},

    # Hyderabad / Telangana
    {"pincode": "500081", "office_name": "HITEC City S.O", "locality": "Madhapur", "district": "Hyderabad", "state": "Telangana", "latitude": 17.4435, "longitude": 78.3772},
    {"pincode": "500034", "office_name": "Banjara Hills S.O", "locality": "Banjara Hills", "district": "Hyderabad", "state": "Telangana", "latitude": 17.4156, "longitude": 78.4347},
    {"pincode": "500032", "office_name": "Gachibowli S.O", "locality": "Gachibowli", "district": "Hyderabad", "state": "Telangana", "latitude": 17.4401, "longitude": 78.3489},

    # Chennai / Tamil Nadu
    {"pincode": "600040", "office_name": "Anna Nagar West H.O", "locality": "Anna Nagar", "district": "Chennai", "state": "Tamil Nadu", "latitude": 13.0850, "longitude": 80.2101},
    {"pincode": "600017", "office_name": "T.Nagar H.O", "locality": "T.Nagar", "district": "Chennai", "state": "Tamil Nadu", "latitude": 13.0418, "longitude": 80.2341},

    # Pune / Maharashtra
    {"pincode": "411038", "office_name": "Kothrud S.O", "locality": "Kothrud", "district": "Pune", "state": "Maharashtra", "latitude": 18.5074, "longitude": 73.8077},
    {"pincode": "411057", "office_name": "Hinjewadi S.O", "locality": "Hinjewadi", "district": "Pune", "state": "Maharashtra", "latitude": 18.5912, "longitude": 73.7389},

    # Kolkata / West Bengal
    {"pincode": "700091", "office_name": "Salt Lake Sector V", "locality": "Salt Lake", "district": "North 24 Parganas", "state": "West Bengal", "latitude": 22.5726, "longitude": 88.4319},
    {"pincode": "700016", "office_name": "Park Street S.O", "locality": "Park Street", "district": "Kolkata", "state": "West Bengal", "latitude": 22.5532, "longitude": 88.3524},

    # Gujarat (Ahmedabad / Surat / Vadodara)
    {"pincode": "380009", "office_name": "Navrangpura H.O", "locality": "Navrangpura", "district": "Ahmedabad", "state": "Gujarat", "latitude": 23.0366, "longitude": 72.5611},
    {"pincode": "395007", "office_name": "Vesu S.O", "locality": "Vesu", "district": "Surat", "state": "Gujarat", "latitude": 21.1448, "longitude": 72.7725},

    # Rajasthan (Jaipur)
    {"pincode": "302017", "office_name": "Malviya Nagar S.O", "locality": "Malviya Nagar", "district": "Jaipur", "state": "Rajasthan", "latitude": 26.8524, "longitude": 75.8143},

    # Uttar Pradesh (Lucknow / Kanpur)
    {"pincode": "226010", "office_name": "Gomti Nagar S.O", "locality": "Gomti Nagar", "district": "Lucknow", "state": "Uttar Pradesh", "latitude": 26.8489, "longitude": 80.9984}
]

def seed_database(db_path: str):
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pincodes (
        pincode TEXT PRIMARY KEY,
        office_name TEXT NOT NULL,
        locality TEXT,
        district TEXT NOT NULL,
        state TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_district ON pincodes(district);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_locality ON pincodes(locality);")

    for item in SAMPLE_PINCODE_DATA:
        cursor.execute("""
        INSERT OR REPLACE INTO pincodes (pincode, office_name, locality, district, state, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (item["pincode"], item["office_name"], item["locality"], item["district"], item["state"], item["latitude"], item["longitude"]))

    conn.commit()
    conn.close()
    print(f"Database successfully seeded at: {db_path}")

if __name__ == "__main__":
    db_file = os.path.join(os.path.dirname(__file__), "pincodes.db")
    seed_database(db_file)
