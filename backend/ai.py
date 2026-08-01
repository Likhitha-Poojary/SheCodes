import random
from typing import Optional, List, Tuple, Dict
from datetime import datetime, timedelta

# Categories and base severities
CATEGORY_SEVERITY = {
    "Flood": 90,
    "Fire": 95,
    "Road damage": 60,
    "Water leakage": 50,
    "Garbage accumulation": 30,
    "Electrical hazard": 85,
    "Traffic obstruction": 40,
    "Infrastructure damage": 75,
    "General civic issue": 20
}

DEPARTMENTS = {
    "Flood": "Disaster Management",
    "Fire": "Fire Department",
    "Road damage": "Public Works",
    "Water leakage": "BWSSB",
    "Garbage accumulation": "BBMP Sanitation",
    "Electrical hazard": "BESCOM",
    "Traffic obstruction": "Traffic Police",
    "Infrastructure damage": "BBMP Engineering",
    "General civic issue": "BBMP"
}

RECOMMENDATIONS = {
    "Flood": [
        "Immediate field assessment.",
        "Assess rescue requirement.",
        "Check affected roads for closure.",
        "Check electrical hazards.",
        "Consider traffic diversion."
    ],
    "Fire": [
        "Dispatch fire engines immediately.",
        "Evacuate surrounding buildings.",
        "Notify emergency medical services."
    ],
    "Electrical hazard": [
        "Cut power to the affected grid immediately.",
        "Dispatch repair crew.",
        "Cordon off the area."
    ],
    "Road damage": [
        "Place warning barricades.",
        "Assess for temporary patching.",
        "Divert heavy traffic if structural damage exists."
    ],
    "Water leakage": [
        "Shut off local water mains.",
        "Dispatch repair crew.",
        "Assess road undermining risk."
    ]
}

def classify(text: str) -> Tuple[str, float]:
    """Classifies narrative text to category and confidence level."""
    text_lower = text.lower()
    if any(w in text_lower for w in ["fire", "smoke", "burn"]):
        return "Fire", 0.95
    elif any(w in text_lower for w in ["flood", "waterlogging", "submerged", "drowning"]):
        return "Flood", 0.92
    elif any(w in text_lower for w in ["electric", "spark", "shock", "wire", "power"]):
        return "Electrical hazard", 0.94
    elif any(w in text_lower for w in ["pothole", "road", "street", "crater", "pavement", "crack"]):
        return "Road damage", 0.90
    elif any(w in text_lower for w in ["water", "leak", "pipe", "sewage", "drain"]):
        return "Water leakage", 0.88
    elif any(w in text_lower for w in ["garbage", "trash", "waste", "bin", "dump"]):
        return "Garbage accumulation", 0.90
    elif any(w in text_lower for w in ["traffic", "block", "jam", "accident"]):
        return "Traffic obstruction", 0.85
    elif any(w in text_lower for w in ["collapse", "bridge", "building", "infrastructure"]):
        return "Infrastructure damage", 0.90
    return "General civic issue", 0.75

def assign_department(category: str) -> str:
    return DEPARTMENTS.get(category, "BBMP")

def generate_recommendations(category: str) -> List[str]:
    return RECOMMENDATIONS.get(category, ["Assess situation.", "Update status."])

def calculate_priority_score(category: str, report_count: int, trend: str, unresolved_hours: float) -> int:
    base_score = CATEGORY_SEVERITY.get(category, 20)
    
    # Factor 1: Number of reports (up to +30 points)
    report_multiplier = min(report_count * 2, 30)
    
    # Factor 2: Trend
    trend_modifier = 0
    if trend == "RAPIDLY INCREASING":
        trend_modifier = 20
    elif trend == "INCREASING":
        trend_modifier = 10
    elif trend == "DECREASING":
        trend_modifier = -10
        
    # Factor 3: Duration unresolved (up to +20 points)
    duration_modifier = min(int(unresolved_hours), 20)
    
    score = base_score + report_multiplier + trend_modifier + duration_modifier
    return min(max(score, 0), 100) # Clamp between 0-100

def determine_priority_level(score: int) -> str:
    if score >= 85: return "CRITICAL"
    if score >= 65: return "HIGH"
    if score >= 40: return "MEDIUM"
    return "LOW"

def calculate_trend(complaints: List[dict]) -> str:
    if len(complaints) < 2:
        return "NEW"
        
    now = datetime.now()
    recent_count = 0
    old_count = 0
    
    for c in complaints:
        try:
            dt = datetime.strptime(c.get("created_at", ""), "%Y-%m-%d %H:%M:%S")
            hours_diff = (now - dt).total_seconds() / 3600
            if hours_diff <= 24:
                recent_count += 1
            elif hours_diff <= 72:
                old_count += 1
        except:
            pass
            
    if recent_count > 5 and recent_count >= old_count * 3:
        return "RAPIDLY INCREASING"
    elif recent_count > old_count:
        return "INCREASING"
    elif recent_count == old_count and recent_count > 0:
        return "STABLE"
    else:
        return "DECREASING"

def generate_explanation(score: int, level: str, category: str, report_count: int, trend: str) -> str:
    reasons = []
    reasons.append(f"{report_count} related report(s) detected.")
    if trend in ["RAPIDLY INCREASING", "INCREASING"]:
        reasons.append(f"Reports are {trend.lower()}.")
    if CATEGORY_SEVERITY.get(category, 0) >= 70:
        reasons.append("High intrinsic safety/infrastructure risk.")
    
    explanation = f"Prioritized as {level} because: " + " ".join(reasons)
    return explanation

def predict_priority(category: str, description: str) -> str:
    score = calculate_priority_score(category, 1, "NEW", 0)
    return determine_priority_level(score)

def find_duplicate(description: str, complaints: List[dict]) -> Optional[dict]:
    words = set(description.lower().split())
    if len(words) < 3: return None
    for c in complaints:
        if c.get("deleted"): continue
        c_desc = c.get("description", "").lower()
        c_words = set(c_desc.split())
        if not c_words: continue
        overlap = words.intersection(c_words)
        if len(overlap) > len(words) * 0.6:
            return c
    return None

def cluster_incident(new_complaint: dict, existing_incidents: List[dict]) -> Optional[dict]:
    """Find an existing incident that this complaint belongs to based on location/category."""
    c_cat = new_complaint.get("category", "")
    c_title = new_complaint.get("title", "")
    lat = new_complaint.get("latitude")
    lon = new_complaint.get("longitude")
    
    for inc in existing_incidents:
        if inc.get("status") in ["Resolved", "RESOLVED", "Closed", "CLOSED"]:
            continue
            
        i_cat = inc.get("category", "")
        i_title = inc.get("title", "")
        
        # Match if any of the category/title fields intersect
        match_cat = False
        if c_cat and (c_cat == i_cat or c_cat == i_title): match_cat = True
        if c_title and (c_title == i_cat or c_title == i_title): match_cat = True
        if not c_cat and not c_title: match_cat = True # fallback
            
        if match_cat:
            # Simple distance check (very rough estimation)
            i_lat = inc.get("latitude")
            i_lon = inc.get("longitude")
            if lat and lon and i_lat and i_lon:
                lat_diff = abs(lat - i_lat)
                lon_diff = abs(lon - i_lon)
                # approx 0.02 degrees is ~2km
                if lat_diff < 0.02 and lon_diff < 0.02:
                    return inc
    return None
