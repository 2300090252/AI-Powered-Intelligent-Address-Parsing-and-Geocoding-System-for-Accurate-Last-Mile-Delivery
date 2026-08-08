import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME: str = "Pata AI - Location Intelligence System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # AI API Keys (Optional if running rule-based offline mode)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Database
    DB_PATH: str = os.getenv("DB_PATH", os.path.join(os.path.dirname(__file__), "database", "pincodes.db"))
    
    # OSM Overpass Settings
    OVERPASS_URL: str = "https://overpass-api.de/api/interpreter"
    OVERPASS_TIMEOUT_SEC: float = 0.35  # Strict timeout for sub-500ms SLA
    
    # Global latency SLA target (ms)
    TARGET_LATENCY_MS: int = 500

settings = Settings()
