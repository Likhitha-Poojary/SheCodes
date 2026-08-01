import os
import shutil
import uuid
import logging
import random
from typing import Optional, Dict, List
from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import local components
from repository import Repository
from auth import UserToken, get_current_user, create_jwt, verify_jwt, RoleGuard
from websocket import ws_manager
import ai

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

class ComplaintCreateRequest(BaseModel):
    description: str
    latitude: Optional[float] = 12.9716
    longitude: Optional[float] = 77.5946
    location_coordinate: Optional[Dict[str, float]] = None # support front-end nested coordinates
    location_text: Optional[str] = "Incident Location"
    category_id: Optional[str] = None
    priority: Optional[str] = None
    image_url: Optional[str] = None

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
    phone = req.phone_number.replace("+91", "").strip()
    
    # 1. Search storage for existing user with this phone
    all_users = repo.storage.find_all("users")
    matched_user = next((u for u in all_users if u.get("phone") == phone and not u.get("deleted")), None)
    
    if not matched_user:
        # Officer phone alias mapping
        officer_map = {
            "9876543210": {"id": "2f8dfb2c-63b1-419b-a010-09ab02c1d888", "username": "officer_shiva"},
            "9876543211": {"id": "2f8dfb2c-63b1-419b-a010-09ab02c1d888", "username": "officer_shiva"},
            "8888888888": {"id": "off-gowda", "username": "officer_gowda"},
            "9988776655": {"id": "off-lakshmi", "username": "officer_lakshmi"},
            "7777777777": {"id": "off-rameesh", "username": "officer_rameesh"},
            "6655443322": {"id": "off-suresh", "username": "officer_suresh"}
        }
        
        if phone in officer_map:
            matched_user = {
                "id": officer_map[phone]["id"],
                "username": officer_map[phone]["username"],
                "phone": phone,
                "role": "FIELD_OFFICER",
                "district_id": 250
            }
        else:
            role = "Admin" if phone == "9876543212" else "Officer" if "98765" in phone else "Citizen"
            matched_user = repo.login_user(phone, role)
            
    if not matched_user:
        matched_user = {
            "id": f"off-{phone}",
            "username": f"officer_{phone}",
            "phone": phone,
            "role": "FIELD_OFFICER",
            "district_id": 250
        }
        
    token = create_jwt(matched_user["id"], matched_user["username"], matched_user.get("role", "FIELD_OFFICER"), matched_user["phone"], matched_user.get("district_id", 250))
    return {
        "status": "success",
        "data": {
            "access_token": token,
            "user": matched_user
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
        
    # Decode base64 image if present
    image_bytes = None
    if req.image_url and req.image_url.startswith("data:image/"):
        try:
            import base64
            header, encoded = req.image_url.split(",", 1)
            image_bytes = base64.b64decode(encoded)
        except Exception:
            pass

    # Run AI validation using SigLIP + ST
    validation = ai.validate_complaint(
        selected_category=req.category,
        description=req.description,
        image=image_bytes
    )

    category = validation["text_prediction"]
    confidence = validation["text_confidence"]
    priority = req.priority or ai.predict_priority(category, req.description, req.image_url)
    dept = ai.assign_department(category, lat, lon)
    
    # 2. Duplicate check
    all_comps = repo.get_complaints()
    duplicate_record = ai.find_duplicate(req.description, all_comps)
    is_duplicate = duplicate_record is not None
    validation["duplicate"] = is_duplicate
    validation["duplicate_id"] = duplicate_record["id"] if is_duplicate else None

    # 3. Save complaint using repository (Created as PENDING/SUBMITTED until Admin assigns an officer)
    comp = repo.create_complaint(
        citizen_id=current_user.user_id,
        citizen_name=current_user.username,
        description=req.description,
        category=category,
        department=dept,
        priority=priority,
        officer_id=None,
        location_text=req.location_text or "Karnataka",
        latitude=lat,
        longitude=lon,
        district_id=current_user.district_id or 250,
        image_url=req.image_url
    )
    officer_id = None
    
    # 4. Save AI Analysis
    ai_data = {
        "selected_category": req.category,
        "predicted_text_category": category,
        "predicted_image_category": validation["image_prediction"],
        "text_confidence": confidence,
        "image_confidence": validation["image_confidence"],
        "validation_status": validation["validation_status"],
        "duplicate_found": validation["duplicate"],
        "duplicate_id": validation["duplicate_id"],
        "priority": priority,
        "department": dept
    }
    repo.save_ai_analysis(comp["id"], ai_data)
    
    # 5. Broadcast WS events
    await ws_manager.broadcast_to_room(f"district:{comp['district_id']}", "complaint_created", comp)
    await ws_manager.broadcast_to_room(f"citizen:{current_user.user_id}", "complaint_created", comp)
    if officer_id and not validation["duplicate"]:
        await ws_manager.broadcast_to_room(f"officer:{officer_id}", "task_assigned", {"complaint_id": comp["id"]})
        
    return {"status": "success", "data": comp}

# Compatibility alias for Next.js citizen submission
@app.post("/api/v1/grievances", status_code=201)
async def create_grievance_legacy(req: ComplaintCreateRequest, current_user: UserToken = Depends(get_current_user)):
    res = await create_complaint(req, current_user)
    return res

class TriageRequest(BaseModel):
    description: Optional[str] = ""
    image_url: Optional[str] = None
    image_name: Optional[str] = None
    latitude: Optional[float] = 12.9716
    longitude: Optional[float] = 77.5946

@app.post("/api/v1/ai/triage")
def triage_grievance(req: TriageRequest):
    # Only validate sentence if description is substantial
    if req.description and len(req.description) >= 10 and not ai.is_meaningful(req.description):
        return {
            "status": "error",
            "error": {
                "detail": "Not a proper sentence. Please describe the grievance clearly."
            }
        }
    
    desc_to_classify = req.description or "general inquiry"
    category, confidence = ai.classify_text(desc_to_classify)
    
    detected_image_category = None
    image_bytes = None
    if req.image_url and req.image_url.startswith("data:image/"):
        try:
            import base64
            header, encoded = req.image_url.split(",", 1)
            image_bytes = base64.b64decode(encoded)
            pred_img, img_conf = ai.classify_image(image_bytes)
            detected_image_category = pred_img.upper().replace(" ", "_")
        except Exception as e:
            print("Failed to decode base64 image in triage:", e)
            
    # Fallback keyword matching
    if not detected_image_category:
        img_ref = req.image_name or req.image_url or ""
        name_lower = img_ref.lower()
        if "road" in name_lower or "pothole" in name_lower or "street" in name_lower or "crack" in name_lower:
            detected_image_category = "ROAD_POTHOLE"
        elif "water" in name_lower or "leak" in name_lower or "pipe" in name_lower or "drain" in name_lower or "flood" in name_lower:
            detected_image_category = "WATER_PIPE_LEAK"
        elif "light" in name_lower or "dark" in name_lower or "lamp" in name_lower:
            detected_image_category = "STREETLIGHT_OUT"
        elif "garbage" in name_lower or "trash" in name_lower or "waste" in name_lower or "dump" in name_lower or "refuse" in name_lower:
            detected_image_category = "GARBAGE_DUMP"

    priority = ai.predict_priority(category, desc_to_classify, req.image_name)
    dept = ai.assign_department(category, req.latitude, req.longitude)
    
    eta = "3 days"
    if priority == "HIGH":
        eta = "24 hours"
    elif priority == "MEDIUM":
        eta = "2 days"
    else:
        eta = "5 days"
        
    return {
        "status": "success",
        "data": {
            "category": category,
            "priority": priority,
            "department": dept,
            "estimated_time": eta,
            "confidence": confidence,
            "detected_image_category": detected_image_category
        }
    }

class ValidateComplaintRequest(BaseModel):
    description: str
    selected_category: str
    image: Optional[str] = None

@app.post("/validate-complaint")
@app.post("/api/v1/ai/validate-complaint")
def validate_complaint_api(req: ValidateComplaintRequest):
    image_bytes = None
    if req.image and req.image.startswith("data:image/"):
        try:
            import base64
            header, encoded = req.image.split(",", 1)
            image_bytes = base64.b64decode(encoded)
        except Exception as e:
            print("Failed to decode base64 image in validate:", e)
            
    result = ai.validate_complaint(
        selected_category=req.selected_category,
        description=req.description,
        image=image_bytes
    )
    
    # Log the validation result inside backend/storage/ai_analysis.json
    try:
        log_data = {
            "selected_category": req.selected_category,
            "predicted_text_category": result["text_prediction"],
            "predicted_image_category": result["image_prediction"],
            "text_confidence": result["text_confidence"],
            "image_confidence": result["image_confidence"],
            "validation_status": result["validation_status"],
            "duplicate_found": result["duplicate"],
            "duplicate_id": result["duplicate_id"]
        }
        temp_id = f"VAL-{random.randint(100000, 999999)}"
        repo.save_ai_analysis(temp_id, log_data)
    except Exception as e:
        print("Error logging validation to ai_analysis.json:", e)
        
    return result

@app.get("/api/v1/categories")
def get_categories():
    return ai.CATEGORIES

@app.get("/api/v1/ai/report")
def get_ai_report():
    return ai.generate_ai_report()

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
        
    # Merge AI analysis logs dynamically
    try:
        analyses = repo.storage.find_all("ai_analysis")
        analysis = next((a for a in analyses if str(a.get("complaint_id")) == str(comp["id"]) or str(a.get("id")) == str(comp["id"])), None)
        if analysis:
            comp["ai_analysis"] = analysis
    except Exception as e:
        print("Error fetching ai_analysis details:", e)
        
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
