import requests
import time

BASE_URL = "http://localhost:8085"

def login(phone, role):
    res = requests.post(f"{BASE_URL}/login", json={"phone": phone, "role": role})
    return res.json()["data"]["access_token"]

def submit_complaint(token, description, lat, lon):
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "description": description,
        "latitude": lat,
        "longitude": lon,
        "location_text": "Ward 45"
    }
    res = requests.post(f"{BASE_URL}/complaints", json=payload, headers=headers)
    return res.json()

def get_incidents(token):
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(f"{BASE_URL}/incidents", headers=headers)
    return res.json()["data"]

print("Logging in...")
token = login("9876543210", "Citizen")

print("--- SCENARIO 1: Single normal complaint ---")
submit_complaint(token, "There is a small pothole on the main road", 12.971, 77.594)

print("--- SCENARIO 2: Multiple related flood reports ---")
submit_complaint(token, "Flood water entering houses", 12.972, 77.595)
submit_complaint(token, "Severe flooding on the street", 12.972, 77.596)

print("--- SCENARIO 3: Rapidly increasing reports ---")
for i in range(4):
    submit_complaint(token, f"Flood water is getting deeper {i}", 12.972, 77.595)

print("--- SCENARIO 4: Critical emergency (Fire) ---")
submit_complaint(token, "Huge fire in building with people inside", 12.980, 77.600)

print("--- Fetching AI Priority Queue ---")
incidents = get_incidents(token)
for i, inc in enumerate(incidents):
    print(f"#{i+1} {inc['priority']} ({inc['priority_score']}) - {inc['category']}")
    print(f"  Reports: {inc['reports']} | Trend: {inc['trend']}")
    print(f"  Auth: {inc['department']}")
    print(f"  Reason: {inc['explanation']}")
    print("-" * 30)

