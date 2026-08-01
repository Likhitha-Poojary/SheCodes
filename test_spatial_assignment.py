import math

# Distance formula (haversine) to compute exact kilometers
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def run_spatial_assignment():
    # MG Road, Bengaluru crossing
    complaint_lat = 12.9754
    complaint_lon = 77.6062
    
    # Active officers listing
    officers = [
        {"id": "OFF-BLR-001", "name": "Shiva Gowda", "dept": "dept-bbmp", "lat": 12.9780, "lon": 77.5940},
        {"id": "OFF-BLR-002", "name": "Manjunath K", "dept": "dept-bwssb", "lat": 12.9712, "lon": 77.6105},
        {"id": "OFF-BLR-003", "name": "Ramesh Kumar", "dept": "dept-bescom", "lat": 12.9250, "lon": 77.6500}
    ]
    
    print("="*50)
    print("GIS Proximity Routing Assignment Test")
    print("="*50)
    print(f"Complaint Location: Bangalore Urban ({complaint_lat}, {complaint_lon})")
    
    nearest_officer = None
    min_dist = float('inf')
    
    for off in officers:
        dist = haversine_distance(complaint_lat, complaint_lon, off['lat'], off['lon'])
        print(f"Checking Officer {off['id']} ({off['name']}) - Distance: {dist:.2f} km")
        if dist < min_dist:
            min_dist = dist
            nearest_officer = off
            
    if nearest_officer:
        # Compute ETA assuming 25km/h traffic speed
        eta_minutes = int((min_dist / 25.0) * 60) + 5
        
        print("\nSpatial Assignment Results:")
        print(f"- Assigned Officer: {nearest_officer['name']}")
        print(f"- Officer ID: {nearest_officer['id']}")
        print(f"- Department: {nearest_officer['dept']}")
        print(f"- Distance: {min_dist:.2f} km")
        print(f"- Computed ETA: {eta_minutes} minutes")
    else:
        print("No active officers found nearby.")
    print("="*50)

if __name__ == "__main__":
    run_spatial_assignment()
