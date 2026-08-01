import json
import urllib.request
import uuid

AI_SERVICE_URL = "http://localhost:8081"

def run_test():
    print("=" * 60)
    print("TESTING CITYMIND AI ANALYSIS SERVICE")
    print("=" * 60)

    # 1. Test Model Status
    try:
        print("\n[1/3] Testing GET /api/v1/ai/model-status...")
        req = urllib.request.Request(f"{AI_SERVICE_URL}/api/v1/ai/model-status", method="GET")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print("Response:", json.dumps(data, indent=2))
    except Exception as e:
        print("Model status test failed (is the server running on port 8081?):", e)

    # 2. Test Analyze Complaint
    try:
        print("\n[2/3] Testing POST /api/v1/ai/analyze-complaint...")
        complaint_payload = {
            "complaint_id": str(uuid.uuid4()),
            "description": "Severe flooding and water pipe burst near MG Road metro station, causing massive traffic congestion.",
            "image_url": "https://raw.githubusercontent.com/opencv/opencv/master/samples/data/board.jpg",
            "latitude": 12.9716,
            "longitude": 77.5946
        }
        
        req = urllib.request.Request(
            f"{AI_SERVICE_URL}/api/v1/ai/analyze-complaint",
            data=json.dumps(complaint_payload).encode('utf-8'),
            headers={
                "Content-Type": "application/json",
                "Idempotency-Key": str(uuid.uuid4())
            },
            method="POST"
        )
        
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print("Response:", json.dumps(data, indent=2))
    except Exception as e:
        print("Analyze complaint test failed:", e)

    # 3. Test Check Duplicate
    try:
        print("\n[3/3] Testing POST /api/v1/ai/check-duplicate...")
        duplicate_payload = {
            "description": "Trash overflowing and garbage pile-up near Malleshwaram market.",
            "latitude": 13.0031,
            "longitude": 77.5684,
            "district_id": 250
        }
        
        req = urllib.request.Request(
            f"{AI_SERVICE_URL}/api/v1/ai/check-duplicate",
            data=json.dumps(duplicate_payload).encode('utf-8'),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print("Response:", json.dumps(data, indent=2))
    except Exception as e:
        print("Duplicate check test failed:", e)

if __name__ == "__main__":
    run_test()
