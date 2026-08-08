import time
import re
from typing import Dict, Any, Tuple

# Regional Script & Spatial Terms Dictionary
TELUGU_DICT = {
    "గణేష్ టెంపుల్": "Ganesh Temple",
    "గణేష్ దేవుని గుడి": "Ganesh Temple",
    "వినాయకుడి గుడి": "Vinayaka Temple",
    "పంచాయతీ ఆఫీస్": "Panchayati Office",
    "పంచాయతి ఆఫీస్": "Panchayati Office",
    "ఆటో నగర్": "Auto Nagar",
    "ఆటోనగర్": "Auto Nagar",
    "కుంచనపల్లి": "Kunchanapalli",
    "విజయవాడ": "Vijayawada",
    "గుంటూరు": "Guntur",
    "హైదరాబాద్": "Hyderabad",
    "బెంగళూరు": "Bengaluru",
    "ముంబై": "Mumbai",
    "ఢిల్లీ": "Delhi",
    "లక్నో": "Lucknow",
    "కొచ్చి": "Kochi",
    "చెన్నై": "Chennai",
    "ఆంధ్ర ప్రదేశ్": "Andhra Pradesh",
    "ఆంధ్రప్రదేశ్": "Andhra Pradesh",
    "తెలంగాణ": "Telangana",
    "కర్ణాటక": "Karnataka",
    "ఎదురుగా": "Opposite",
    "ఎదురుగా ఉన్న": "Opposite",
    "సామ్నే": "Opposite",
    "దగ్గర": "Near",
    "దగ్గరలో": "Near",
    "పక్కన": "Beside",
    "వెనుక": "Behind",
    "వెనుక వైపు": "Behind",
    "మెయిన్ రోడ్": "Main Road",
    "కాలనీ": "Colony",
    "నగర్": "Nagar"
}

HINDI_DICT = {
    "गणेश मंदिर": "Ganesh Temple",
    "हनुमान मंदिर": "Hanuman Temple",
    "शिव मंदिर": "Shiv Temple",
    "पंचायत ऑफिस": "Panchayati Office",
    "ऑटो नगर": "Auto Nagar",
    "विजयवाड़ा": "Vijayawada",
    "लखनऊ": "Lucknow",
    "दिल्ली": "Delhi",
    "मुंबई": "Mumbai",
    "बेंगलुरु": "Bengaluru",
    "हैदराबाद": "Hyderabad",
    "उत्तर प्रदेश": "Uttar Pradesh",
    "मध्य प्रदेश": "Madhya Pradesh",
    "के सामने": "Opposite",
    "सामने": "Opposite",
    "के पास": "Near",
    "पास": "Near",
    "के पीछे": "Behind",
    "पीछे": "Behind",
    "के बगल में": "Beside",
    "बगल में": "Beside",
    "मेन रोड": "Main Road",
    "चौराहा": "Junction",
    "कॉलोनी": "Colony"
}

TAMIL_DICT = {
    "விநாயகர் கோவில்": "Vinayagar Temple",
    "கோவில்": "Temple",
    "எதிரில்": "Opposite",
    "அருகில்": "Near",
    "பின்னால்": "Behind",
    "அருகே": "Near",
    "சென்னை": "Chennai",
    "கோவை": "Coimbatore",
    "மதுரை": "Madurai",
    "தமிழ்நாடு": "Tamil Nadu"
}

KANNADA_DICT = {
    "ಗಣೇಶ ದೇವಾಲಯ": "Ganesh Temple",
    "ದೇವಾಲಯ": "Temple",
    "ಎದುರು": "Opposite",
    "ಎದುರಿನಲ್ಲಿ": "Opposite",
    "ಹತ್ತಿರ": "Near",
    "ಹಿಂಭಾಗ": "Behind",
    "ಪಕ್ಕದಲ್ಲಿ": "Beside",
    "ಬೆಂಗಳೂರು": "Bengaluru",
    "ಮೈಸೂರು": "Mysuru",
    "ಕರ್ನಾಟಕ": "Karnataka"
}

MALAYALAM_DICT = {
    "ഗണേശ് ക്ഷേത്രം": "Ganesh Temple",
    "ക്ഷേത്രം": "Temple",
    "എതിർവശത്ത്": "Opposite",
    "അടുത്ത്": "Near",
    "പിന്നിൽ": "Behind",
    "സമീപം": "Near",
    "കൊച്ചി": "Kochi",
    "തിരുവനന്തപുരം": "Thiruvananthapuram",
    "കേരളം": "Kerala"
}

HINGLISH_MAP = [
    (r'\bdaggara\b', 'Near'),
    (r'\bdaaggar\b', 'Near'),
    (r'\beduruga\b', 'Opposite'),
    (r'\bke paas\b', 'Near'),
    (r'\bke pas\b', 'Near'),
    (r'\bke samne\b', 'Opposite'),
    (r'\bsamne\b', 'Opposite'),
    (r'\bke pichhe\b', 'Behind'),
    (r'\bke piche\b', 'Behind'),
    (r'\bpakkana\b', 'Beside'),
    (r'\bbagal mein\b', 'Beside'),
    (r'\bpe\b', 'at'),
    (r'\bke paas ke\b', 'Near')
]

class RegionalLanguageAgent:
    """
    Agent 0: Regional Language Support Agent.
    Detects input script/language (Telugu, Hindi, Tamil, Kannada, Malayalam, Hinglish, English).
    Translates & transliterates non-English & Hinglish regional text into standardized English.
    """
    def __init__(self):
        self.name = "RegionalLanguageAgent"

    def detect_language(self, text: str) -> Tuple[str, bool]:
        # Check script ranges
        if re.search(r'[\u0C00-\u0C7F]', text):
            return "Telugu", True
        elif re.search(r'[\u0900-\u097F]', text):
            return "Hindi", True
        elif re.search(r'[\u0B80-\u0BFF]', text):
            return "Tamil", True
        elif re.search(r'[\u0C80-\u0CFF]', text):
            return "Kannada", True
        elif re.search(r'[\u0D00-\u0D7F]', text):
            return "Malayalam", True
        
        # Check Hinglish keywords in Roman script
        text_lower = text.lower()
        hinglish_keywords = ["daggara", "eduruga", "ke paas", "ke pas", "samne", "pakkana", "pichhe", "piche", "ke pichhe", "opp temple"]
        if any(kw in text_lower for kw in hinglish_keywords):
            return "Hinglish", True

        return "English", False

    def translate_address(self, text: str, lang: str) -> str:
        translated = text

        if lang == "Telugu":
            # Apply Telugu dictionary replacements
            for tel, eng in TELUGU_DICT.items():
                translated = translated.replace(tel, eng)

            # Re-order spatial relation if present (e.g., "Ganesh Temple Opposite" -> "Opposite Ganesh Temple")
            translated = re.sub(r'([A-Za-z0-9\s]+)\s+Opposite\b', r'Opposite \1', translated, flags=re.I)
            translated = re.sub(r'([A-Za-z0-9\s]+)\s+Near\b', r'Near \1', translated, flags=re.I)
            translated = re.sub(r'([A-Za-z0-9\s]+)\s+Behind\b', r'Behind \1', translated, flags=re.I)
            translated = re.sub(r'([A-Za-z0-9\s]+)\s+Beside\b', r'Beside \1', translated, flags=re.I)

        elif lang == "Hindi":
            for hin, eng in HINDI_DICT.items():
                translated = translated.replace(hin, eng)
            
            translated = re.sub(r'([A-Za-z0-9\s]+)\s+Opposite\b', r'Opposite \1', translated, flags=re.I)
            translated = re.sub(r'([A-Za-z0-9\s]+)\s+Near\b', r'Near \1', translated, flags=re.I)

        elif lang == "Tamil":
            for tam, eng in TAMIL_DICT.items():
                translated = translated.replace(tam, eng)

        elif lang == "Kannada":
            for kan, eng in KANNADA_DICT.items():
                translated = translated.replace(kan, eng)

        elif lang == "Malayalam":
            for mal, eng in MALAYALAM_DICT.items():
                translated = translated.replace(mal, eng)

        elif lang == "Hinglish":
            for pattern, replacement in HINGLISH_MAP:
                translated = re.sub(pattern, replacement, translated, flags=re.I)
            
            # Post-process Hinglish word order (e.g. "Ganesh Temple daggara" -> "Near Ganesh Temple")
            translated = re.sub(r'([A-Za-z0-9\s]+)\s+Near\b', r'Near \1', translated, flags=re.I)
            translated = re.sub(r'([A-Za-z0-9\s]+)\s+Opposite\b', r'Opposite \1', translated, flags=re.I)

        # Cleanup extra commas and spaces
        translated = re.sub(r'\s+', ' ', translated).strip()
        translated = re.sub(r',\s*,', ',', translated)
        return translated

    async def execute(self, address_text: str) -> Dict[str, Any]:
        start_time = time.time()
        
        detected_lang, is_required = self.detect_language(address_text)
        
        if is_required:
            translated_text = self.translate_address(address_text, detected_lang)
        else:
            translated_text = address_text.strip()

        duration_ms = round((time.time() - start_time) * 1000, 2)

        summary_msg = (
            f"Detected language '{detected_lang}'. Translated into English: '{translated_text}'."
            if is_required
            else f"Detected language '{detected_lang}'. Input is standard English; no translation needed."
        )

        return {
            "language_info": {
                "detected_language": detected_lang,
                "original_address": address_text,
                "translated_address": translated_text,
                "translation_required": is_required
            },
            "translated_address": translated_text,
            "trace": {
                "agent": self.name,
                "status": "completed",
                "duration_ms": duration_ms,
                "summary": summary_msg
            }
        }

language_agent = RegionalLanguageAgent()
