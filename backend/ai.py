import random
from typing import Optional, List, Tuple

def classify(text: str) -> Tuple[str, float]:
    """
    Classifies narrative text to category and confidence level.
    """
    text_lower = text.lower()
    if any(w in text_lower for w in ["pothole", "road", "street", "crater", "pavement"]):
        return "ROAD_POTHOLE", 0.95
    elif any(w in text_lower for w in ["water", "leak", "pipe", "flooding", "sewage", "drain", "bwssb"]):
        return "WATER_PIPE_LEAK", 0.92
    elif any(w in text_lower for w in ["light", "dark", "streetlight", "bulb"]):
        return "STREETLIGHT_OUT", 0.94
    elif any(w in text_lower for w in ["garbage", "trash", "waste", "bin", "dump"]):
        return "GARBAGE_DUMP", 0.90
    return "GENERAL_CIVIC_ISSUE", 0.75

def predict_priority(category: str, description: str) -> str:
    """
    Predicts priority level ('High', 'Medium', 'Low') for a complaint.
    """
    desc_lower = description.lower()
    if any(w in desc_lower for w in ["urgent", "emergency", "accident", "injured", "danger", "critical", "blocking"]):
        return "High"
    if category in ["ROAD_POTHOLE", "WATER_PIPE_LEAK"]:
        return "High"
    if category in ["GARBAGE_DUMP", "STREETLIGHT_OUT"]:
        return "Medium"
    return "Low"

def assign_department(category: str) -> str:
    """
    Assigns department based on category.
    """
    if category == "ROAD_POTHOLE":
        return "BBMP"
    elif category == "WATER_PIPE_LEAK":
        return "BWSSB"
    elif category == "STREETLIGHT_OUT":
        return "BESCOM"
    elif category == "GARBAGE_DUMP":
        return "BBMP"
    return "BBMP"

def find_duplicate(description: str, complaints: List[dict]) -> Optional[dict]:
    """
    Checks if a complaint is a duplicate. Returns the duplicate complaint dict if found, else None.
    """
    words = set(description.lower().split())
    if len(words) < 3:
        return None
        
    for c in complaints:
        if c.get("deleted"):
            continue
        c_desc = c.get("description", "").lower()
        c_words = set(c_desc.split())
        if not c_words:
            continue
            
        overlap = words.intersection(c_words)
        if len(overlap) > len(words) * 0.6:  # 60% word overlap threshold
            return c
            
    return None
