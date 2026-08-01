import os
import shutil
import uuid
import logging
from typing import Optional, Dict, List
from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import local components
from repository import Repository
from auth import UserToken, get_current_user, create_jwt, verify_jwt, RoleGuard
from websocket import ws_manager
import ai
from datetime import datetime

# Setup Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CityMind AI - Consolidated Backend",
    description="Consolidated backend running with local JSON storage and in-process AI analysis.",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database repository
repo = Repository()

# Uploads directory setup
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Pydantic schemas for requests
class LoginRequest(BaseModel):
    phone: str
    role: str = "Citizen" # Citizen, Officer, Admin

class OtpVerifyRequest(BaseModel):
    phone_number: str
    otp_code: str = None
    otp_session_id: str = None
    role: str = None

class ComplaintCreateRequest(BaseModel):
    description: str
    latitude: Optional[float] = 12.9716
    longitude: Optional[float] = 77.5946
    location_coordinate: Optional[Dict[str, float]] = None # support front-end nested coordinates
    location_text: Optional[str] = "Incident Location"
    category_id: Optional[str] = None

class ComplaintUpdateRequest(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    department: Optional[str] = None
    officer: Optional[str] = None
    assigned_officer_id: Optional[str] = None
    remarks: Optional[str] = None

class TaskUpdateRequest(BaseModel):
    status: Optional[str] = None
    officer: Optional[str] = None
    assigned_officer_id: Optional[str] = None

# --- API ENDPOINTS ---

# 1. POST /login
@app.post("/login")
def login(req: LoginRequest):
    user = repo.login_user(req.phone, req.role)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
        
    token = create_jwt(user["id"], user["username"], user["role"], user["phone"], user.get("district_id", 250))
    return {
        "status": "success",
        "data": {
            "access_token": token,
            "token_type": "bearer",
            "user": user
        }
    }

# Compatibility alias for Next.js OTP verification
@app.post("/api/v1/auth/otp/verify")
def verify_otp(req: OtpVerifyRequest):
    # Map phone number to appropriate role (since Next.js route passes phone and OTP)
    phone = req.phone_number
    role = req.role or "Citizen"
    if role == "Citizen":
        if phone == "9876543211":
            role = "Officer"
        elif phone == "9876543212":
            role = "Admin"
        
    user = repo.login_user(phone, role)
    if not user:
        raise HTTPException(status_code=404, detail="User profile not registered.")
        
    token = create_jwt(user["id"], user["username"], user["role"], user["phone"], user.get("district_id", 250))
    return {
        "status": "success",
        "data": {
            "access_token": token,
            "user": user
        }
    }

# 2. POST /complaints
@app.post("/complaints", status_code=201)
async def create_complaint(req: ComplaintCreateRequest, current_user: UserToken = Depends(get_current_user)):
    # Handle nested location coordinates if provided
    lat = req.latitude
    lon = req.longitude
    if req.location_coordinate:
        lat = req.location_coordinate.get("latitude", lat)
        lon = req.location_coordinate.get("longitude", lon)
        
    # 1. Local AI classification & prediction
    category, confidence = ai.classify(req.description)
    dept = ai.assign_department(category)
    
    # 2. Find default officer (Shiva Gowda / OFF001)
    officers = repo.storage.find_all("officers")
    officer_id = "2f8dfb2c-63b1-419b-a010-09ab02c1d888" # Default
    if officers:
        officer_id = officers[0]["id"]
        
    # 3. Duplicate check
    all_comps = repo.get_complaints()
    is_duplicate = ai.find_duplicate(req.description, all_comps)
    
    # 4. Save complaint using repository
    # Initially don't know priority, just set it to Medium
    comp = repo.create_complaint(
        citizen_id=current_user.user_id,
        citizen_name=current_user.username,
        description=req.description,
        category=category,
        department=dept,
        priority="Medium",
        officer_id=officer_id if not is_duplicate else None,
        location_text=req.location_text or "Karnataka",
        latitude=lat,
        longitude=lon,
        district_id=current_user.district_id or 250
    )
    
    # --- INCIDENT CLUSTERING & PRIORITY ENGINE ---
    incidents = repo.get_incidents()
    matched_incident = ai.cluster_incident(comp, incidents)
    
    incident_id = None
    if matched_incident:
        incident_id = matched_incident["id"]
        complaint_ids = matched_incident.get("complaint_ids", [])
        if comp["id"] not in complaint_ids:
            complaint_ids.append(comp["id"])
        
        # Recalculate properties
        report_count = len(complaint_ids)
        # Fetch complaints to calc trend
        cluster_comps = [c for c in all_comps + [comp] if c["id"] in complaint_ids]
        trend = ai.calculate_trend(cluster_comps)
        
        # Calculate unresolved hours
        created_at = matched_incident.get("created_at")
        unresolved_hours = 0
        if created_at:
            try:
                dt = datetime.strptime(created_at, "%Y-%m-%d %H:%M:%S")
                unresolved_hours = (datetime.now() - dt).total_seconds() / 3600
            except: pass
            
        score = ai.calculate_priority_score(category, report_count, trend, unresolved_hours)
        priority_level = ai.determine_priority_level(score)
        explanation = ai.generate_explanation(score, priority_level, category, report_count, trend)
        
        recommendations = ai.generate_recommendations(category)
        
        repo.update_incident(incident_id, {
            "complaint_ids": complaint_ids,
            "reports": report_count,
            "trend": trend,
            "priority_score": score,
            "priority": priority_level,
            "explanation": explanation,
            "recommended_actions": recommendations,
            "department": dept,
        })
        
        # Notify officer if HIGH or CRITICAL and wasn't before
        old_priority = matched_incident.get("priority", "LOW")
        if priority_level in ["HIGH", "CRITICAL"] and old_priority not in ["HIGH", "CRITICAL"]:
            repo.save_notification(officer_id, f"🚨 {priority_level} PRIORITY", f"{category} detected at {req.location_text}. Trend: {trend}")
            
    else:
        # Create new incident
        trend = "NEW"
        report_count = 1
        score = ai.calculate_priority_score(category, report_count, trend, 0)
        priority_level = ai.determine_priority_level(score)
        explanation = ai.generate_explanation(score, priority_level, category, report_count, trend)
        recommendations = ai.generate_recommendations(category)
        
        new_inc = repo.create_incident({
            "title": category,
            "category": category,
            "location": req.location_text or "Karnataka",
            "latitude": lat,
            "longitude": lon,
            "district_id": current_user.district_id or 250,
            "complaint_ids": [comp["id"]],
            "reports": report_count,
            "trend": trend,
            "priority_score": score,
            "priority": priority_level,
            "explanation": explanation,
            "recommended_actions": recommendations,
            "department": dept,
            "officer_id": officer_id
        })
        incident_id = new_inc["id"]
        
        if priority_level in ["HIGH", "CRITICAL"]:
            repo.save_notification(officer_id, f"🚨 {priority_level} PRIORITY", f"New {category} incident at {req.location_text}.")

    # Update complaint with calculated priority and incident ID
    comp = repo.update_complaint(comp["id"], {"priority": priority_level, "incident_id": incident_id})
    
    # 5. Save AI Analysis
    ai_data = {
        "category": category,
        "priority": priority_level,
        "department": dept,
        "confidence": confidence,
        "is_duplicate": bool(is_duplicate)
    }
    repo.save_ai_analysis(comp["id"], ai_data)
    
    # 6. Broadcast WS events
    await ws_manager.broadcast_to_room(f"district:{comp['district_id']}", "complaint_created", comp)
    await ws_manager.broadcast_to_room(f"citizen:{current_user.user_id}", "complaint_created", comp)
    
    # Broadcast incident update to AI dashboard
    incidents = repo.get_incidents(comp['district_id'])
    await ws_manager.broadcast_to_room(f"ai_dashboard:{comp['district_id']}", "incidents_updated", incidents)
    
    if officer_id and not is_duplicate:
        await ws_manager.broadcast_to_room(f"officer:{officer_id}", "task_assigned", {"complaint_id": comp["id"]})
        
    return {"status": "success", "data": comp}

# Compatibility alias for Next.js citizen submission
@app.post("/api/v1/grievances", status_code=201)
async def create_grievance_legacy(req: ComplaintCreateRequest, current_user: UserToken = Depends(get_current_user)):
    res = await create_complaint(req, current_user)
    return res

# 3. GET /complaints
@app.get("/complaints")
def get_complaints(citizen_id: Optional[str] = None, district_id: Optional[int] = None, current_user: UserToken = Depends(get_current_user)):
    comps = repo.get_complaints(citizen_id=citizen_id, district_id=district_id)
    return {"status": "success", "data": comps}

# Compatibility aliases for Next.js grievances fetching
@app.get("/api/v1/citizens/{citizen_id}/grievances")
def get_citizen_grievances(citizen_id: str, current_user: UserToken = Depends(get_current_user)):
    return get_complaints(citizen_id=citizen_id, current_user=current_user)

@app.get("/api/v1/districts/{district_id}/grievances")
def get_district_grievances(district_id: int, current_user: UserToken = Depends(get_current_user)):
    return get_complaints(district_id=district_id, current_user=current_user)

# 4. GET /complaints/{id}
@app.get("/complaints/{id}")
def get_complaint(id: str, current_user: UserToken = Depends(get_current_user)):
    comp = repo.get_complaint(id)
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found.")
    return {"status": "success", "data": comp}

# Compatibility alias
@app.get("/api/v1/grievances/{id}")
def get_grievance_legacy(id: str, current_user: UserToken = Depends(get_current_user)):
    return get_complaint(id, current_user)

# 5. PATCH /complaints/{id}
@app.patch("/complaints/{id}")
async def update_complaint(id: str, req: ComplaintUpdateRequest, current_user: UserToken = Depends(get_current_user)):
    updates = req.dict(exclude_unset=True)
    comp = repo.update_complaint(id, updates)
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found.")
        
    # Broadcast websocket updates
    await ws_manager.broadcast_to_room(f"district:{comp['district_id']}", "complaint_updated", comp)
    await ws_manager.broadcast_to_room(f"citizen:{comp['citizen_id']}", "complaint_updated", comp)
    if comp.get("officer"):
        await ws_manager.broadcast_to_room(f"officer:{comp['officer']}", "complaint_updated", comp)
        
    return {"status": "success", "data": comp}

# Compatibility aliases for Next.js status transitions and reassignments
@app.patch("/api/v1/grievances/{id}/status")
async def update_status_legacy(id: str, req: ComplaintUpdateRequest, current_user: UserToken = Depends(get_current_user)):
    return await update_complaint(id, req, current_user)

@app.post("/api/v1/grievances/{id}/assign")
async def assign_officer_legacy(id: str, req: ComplaintUpdateRequest, current_user: UserToken = Depends(get_current_user)):
    return await update_complaint(id, req, current_user)

# 6. GET /tasks
@app.get("/tasks")
def get_tasks(officer_id: Optional[str] = None, current_user: UserToken = Depends(get_current_user)):
    tasks = repo.get_tasks(officer_id=officer_id)
    return {"status": "success", "data": tasks}

# Compatibility alias
@app.get("/api/v1/officer/tasks")
def get_officer_tasks_legacy(current_user: UserToken = Depends(get_current_user)):
    return get_tasks(officer_id=current_user.user_id, current_user=current_user)

# 7. PATCH /tasks/{id}
@app.patch("/tasks/{id}")
async def update_task(id: str, req: TaskUpdateRequest, current_user: UserToken = Depends(get_current_user)):
    updates = req.dict(exclude_unset=True)
    task = repo.update_task(id, updates)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
        
    # Broadcast updates
    comp = repo.get_complaint(task["complaint_id"])
    if comp:
        await ws_manager.broadcast_to_room(f"district:{comp['district_id']}", "complaint_updated", comp)
        await ws_manager.broadcast_to_room(f"citizen:{comp['citizen_id']}", "complaint_updated", comp)
    await ws_manager.broadcast_to_room(f"officer:{current_user.user_id}", "complaint_updated", comp or {})
    
    return {"status": "success", "data": task}

# 7.5 GET /incidents
@app.get("/incidents")
def get_incidents(district_id: int = 250):
    incidents = repo.get_incidents(district_id)
    # Sort by priority score descending
    incidents.sort(key=lambda x: x.get("priority_score", 0), reverse=True)
    return {"status": "success", "data": incidents}

# 8. GET /dashboard
@app.get("/dashboard")
def get_dashboard(district_id: int = 250, current_user: UserToken = Depends(get_current_user)):
    stats = repo.get_dashboard_stats(district_id)
    return {"status": "success", "data": stats}

# Compatibility alias
@app.get("/api/v1/dashboard/statistics")
def get_dashboard_stats_legacy(district_id: int = 250, current_user: UserToken = Depends(get_current_user)):
    return get_dashboard(district_id=district_id, current_user=current_user)

# 9. GET /analytics
@app.get("/analytics")
def get_analytics(district_id: int = 250, current_user: UserToken = Depends(get_current_user)):
    data = repo.get_analytics(district_id)
    return {"status": "success", "data": data}

# Compatibility alias
@app.get("/api/v1/analytics/district")
def get_district_analytics_legacy(district_id: int = 250, current_user: UserToken = Depends(get_current_user)):
    return get_analytics(district_id=district_id, current_user=current_user)

# 10. GET /notifications
@app.get("/notifications")
def get_notifications(user_id: str, current_user: UserToken = Depends(get_current_user)):
    notifs = repo.get_notifications(user_id)
    return {"status": "success", "data": notifs}

# 11. POST /upload
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}-{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"status": "success", "data": {"file_path": f"/uploads/{filename}"}}

# Compatibility alias for Next.js proof submission
class ProofRequest(BaseModel):
    file_path: str
    file_type: str = "image/jpeg"
    district_id: int = 250

@app.post("/api/v1/grievances/{id}/proof")
async def upload_proof_legacy(id: str, req: ProofRequest, current_user: UserToken = Depends(get_current_user)):
    # Update status to RESOLVED
    comp = repo.update_complaint(id, {
        "status": "RESOLVED",
        "resolved_at": repo.storage.generate_ticket_number() # Mock resolved_at
    })
    if not comp:
        raise HTTPException(status_code=404, detail="Complaint not found.")
        
    await ws_manager.broadcast_to_room(f"district:{req.district_id}", "complaint_updated", comp)
    await ws_manager.broadcast_to_room(f"citizen:{comp['citizen_id']}", "complaint_updated", comp)
    
    return {"status": "success", "data": {"message": "Proof registered successfully. Ticket status transitioned to RESOLVED."}}

@app.post("/api/v1/officers/duty/start")
def start_duty_legacy(current_user: UserToken = Depends(get_current_user)):
    return {"status": "success", "data": {"message": "Duty session started successfully"}}

@app.post("/api/v1/officers/duty/end")
def end_duty_legacy(current_user: UserToken = Depends(get_current_user)):
    return {"status": "success", "data": {"message": "Duty session ended successfully"}}

@app.post("/incidents/{id}/notify")
async def notify_officer(id: str):
    try:
        incidents = repo.get_incidents()
        incident = next((i for i in incidents if i["id"] == id), None)
        if not incident:
            raise HTTPException(status_code=404, detail="Incident not found")
            
        # Log a notification (using a dummy officer or existing assigned officer if any)
        officer_id = incident.get("officer_id", "unassigned")
        repo.save_notification(
            officer_id,
            f"🚨 CRITICAL INCIDENT ALERT: {incident.get('category')}",
            f"Please respond immediately to {incident.get('location')}. Priority: {incident.get('priority')}"
        )
        
        return {"status": "success", "message": f"Officer notified for incident {id}"}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error notifying officer: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 12. GET /health
@app.get("/health")
def health():
    return {"status": "healthy", "service": "consolidated-core-api"}

# Compatibility route for AI model status
@app.get("/api/health")
def health_legacy():
    return health()

# --- WEBSOCKET CONNECTION ---
@app.websocket("/ws/grievances/{room_name}")
async def websocket_endpoint(websocket: WebSocket, room_name: str):
    await ws_manager.connect(websocket, room_name)
    try:
        while True:
            # Keep connection open, client doesn't need to send logic
            data = await websocket.receive_text()
            logger.info(f"WebSocket incoming text in room {room_name}: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, room_name)

# --- INITIALIZATION ---
def initialize_incidents():
    comps = repo.get_complaints()
    incidents = repo.get_incidents()
    if not incidents and comps:
        logger.info(f"Initializing {len(comps)} existing complaints into AI incident clusters...")
        for comp in comps:
            # We don't want to duplicate logic, so we just run the same logic as create_complaint
            matched = ai.cluster_incident(comp, repo.get_incidents())
            if matched:
                incident_id = matched["id"]
                complaint_ids = matched.get("complaint_ids", [])
                if comp["id"] not in complaint_ids:
                    complaint_ids.append(comp["id"])
                
                report_count = len(complaint_ids)
                cluster_comps = [c for c in comps if c["id"] in complaint_ids]
                trend = ai.calculate_trend(cluster_comps)
                
                created_at = matched.get("created_at")
                unresolved_hours = 0
                if created_at:
                    try:
                        dt = datetime.strptime(created_at, "%Y-%m-%d %H:%M:%S")
                        unresolved_hours = (datetime.now() - dt).total_seconds() / 3600
                    except: pass
                    
                cat = comp.get("category") or comp.get("title") or "General"
                score = ai.calculate_priority_score(cat, report_count, trend, unresolved_hours)
                priority_level = ai.determine_priority_level(score)
                explanation = ai.generate_explanation(score, priority_level, cat, report_count, trend)
                recommendations = ai.generate_recommendations(cat)
                
                repo.update_incident(incident_id, {
                    "complaint_ids": complaint_ids,
                    "reports": report_count,
                    "trend": trend,
                    "priority_score": score,
                    "priority": priority_level,
                    "explanation": explanation,
                    "recommended_actions": recommendations,
                    "department": comp.get("department", "General"),
                })
                repo.update_complaint(comp["id"], {"priority": priority_level, "incident_id": incident_id})
            else:
                trend = "NEW"
                report_count = 1
                cat = comp.get("category") or comp.get("title") or "General"
                score = ai.calculate_priority_score(cat, report_count, trend, 0)
                priority_level = ai.determine_priority_level(score)
                explanation = ai.generate_explanation(score, priority_level, cat, report_count, trend)
                recommendations = ai.generate_recommendations(cat)
                
                new_inc = repo.create_incident({
                    "title": cat,
                    "category": cat,
                    "location": comp.get("location_text", comp.get("location", "Karnataka")),
                    "latitude": comp.get("latitude"),
                    "longitude": comp.get("longitude"),
                    "district_id": comp.get("district_id", 250),
                    "complaint_ids": [comp["id"]],
                    "reports": report_count,
                    "trend": trend,
                    "priority_score": score,
                    "priority": priority_level,
                    "explanation": explanation,
                    "recommended_actions": recommendations,
                    "department": comp.get("department", "General"),
                    "officer_id": comp.get("officer_id")
                })
                repo.update_complaint(comp["id"], {"priority": priority_level, "incident_id": new_inc["id"]})
        logger.info("Incident initialization complete.")

# Run initialization on startup
initialize_incidents()
