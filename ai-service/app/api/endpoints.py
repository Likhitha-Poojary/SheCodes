from fastapi import APIRouter, HTTPException, Depends, status
from uuid import UUID

from app.models.schemas import (
    AnalyzeComplaintRequest, AnalyzeComplaintResponse,
    CheckDuplicateRequest, CheckDuplicateResponse,
    AnalyzeImageRequest, AnalyzeImageResponse,
    ModelStatusResponse
)
from app.database.connection import DatabaseManager
from app.preprocessing.text_clean import clean_text
from app.services.classifier import ComplaintClassifier
from app.services.vision import ImageAnalysisEngine
from app.services.priority import PriorityPredictor
from app.services.severity import SeverityScorer
from app.services.routing import DepartmentRouter
from app.services.resolution_time import ResolutionTimePredictor
from app.services.duplicate import DuplicateDetector
from app.utils.logger import setup_logger

logger = setup_logger()
router = APIRouter(prefix="/api/v1/ai")

# Singleton managers
db_mgr = DatabaseManager()
classifier = ComplaintClassifier()
vision_engine = ImageAnalysisEngine()
duplicate_detector = DuplicateDetector(db_mgr)

# Register model version upon service boot
db_mgr.register_model_version(
    model_id=classifier.model.model_id if hasattr(classifier.model, "model_id") else UUID("f3b92c81-80a1-432d-9861-12c82f9d8a31"),
    name="Complaint Triage Multitask Engine",
    version="v2.1",
    accuracy=94.50,
    framework="PyTorch / HuggingFace"
)

@router.post(
    "/analyze-complaint",
    response_model=AnalyzeComplaintResponse,
    status_code=status.HTTP_200_OK
)
async def analyze_complaint(req: AnalyzeComplaintRequest):
    logger.info(f"AI analysis requested for grievance {req.complaint_id}")
    
    # 1. Preprocessing
    cleaned_desc = clean_text(req.description)
    
    # 2. Text Classification & Embeddings
    category, confidence, vector = classifier.classify(cleaned_desc)
    
    # 3. Vision Analysis
    detected_objects, damage_level, cv_confidence = [], "UNKNOWN_DAMAGE", 0.0
    if req.image_url:
        detected_objects, damage_level, cv_confidence = vision_engine.analyze(req.image_url)
        
    # 4. Severity Scoring (0-100)
    severity_score = SeverityScorer.calculate(damage_level, cv_confidence, req.description)
    
    # 5. Priority Routing
    priority = PriorityPredictor.predict(category, damage_level, is_near_critical_facility=False, duplicate_count=0)
    
    # 6. Department Mapping
    dept_info = DepartmentRouter.get_department(category)
    
    # 7. SLA Estimation
    sla_hours, sla_str = ResolutionTimePredictor.predict(category, priority, severity_score)
    
    # 8. Duplicate Detection (pgvector check)
    # We resolve the district ID (needed for SQL partition pruning)
    district_id = 250 # Default Bengaluru code fallback
    if db_mgr.pool:
        try:
            with db_mgr.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT district_id FROM core_gis.taluks
                        WHERE ST_Contains(taluk_boundary, ST_SetSRID(ST_MakePoint(%s, %s), 4326))
                        LIMIT 1
                    """, (req.longitude, req.latitude))
                    res = cur.fetchone()
                    if res:
                        district_id = res[0]
        except Exception as e:
            logger.error(f"Error checking coordinates district during AI endpoints routing: {e}")

    is_duplicate, duplicate_prob, duplicate_of_id = duplicate_detector.evaluate(vector, district_id)
    
    # 9. Database Updates
    # Save the analysis statistics and vector embeddings directly to PostgreSQL
    model_uuid = UUID("f3b92c81-80a1-432d-9861-12c82f9d8a31")
    db_mgr.save_ai_analysis(
        grievance_id=req.complaint_id,
        district_id=district_id,
        model_id=model_uuid,
        vision_labels=detected_objects,
        severity=float(severity_score),
        priority=float(80.0 if priority == "CRITICAL" else 60.0 if priority == "HIGH" else 40.0 if priority == "MEDIUM" else 20.0),
        confidence=confidence,
        recommended_dept_id=None, # Derived at runtime from DB references
        est_hours=float(sla_hours),
        summary=f"Automated AI classification routed to {dept_info['dept_name']}."
    )
    db_mgr.save_embedding(
        grievance_id=req.complaint_id,
        district_id=district_id,
        vector=vector,
        model_version="v2.1"
    )
    
    # 10. AI Explanation Construction
    explanation = f"Complaint classified under '{category}' with {confidence*100:.1f}% confidence. "
    if req.image_url and detected_objects:
        explanation += f"Image analysis identified {', '.join(detected_objects)} ({damage_level.replace('_', ' ').lower()}). "
    explanation += f"SLA resolved to {sla_str} based on {priority.lower()} priority status."

    return AnalyzeComplaintResponse(
        category=category,
        confidence=confidence,
        severity=severity_score,
        priority=priority,
        department=dept_info["dept_name"],
        estimated_time=sla_str,
        duplicate_probability=duplicate_prob,
        explanation=explanation
    )

@router.post("/check-duplicate", response_model=CheckDuplicateResponse)
async def check_duplicate(req: CheckDuplicateRequest):
    cleaned = clean_text(req.description)
    vector = classifier.get_embeddings(cleaned)
    is_duplicate, duplicate_prob, duplicate_of_id = duplicate_detector.evaluate(vector, req.district_id)
    return CheckDuplicateResponse(
        is_duplicate=is_duplicate,
        duplicate_probability=duplicate_prob,
        duplicate_of_id=duplicate_of_id
    )

@router.post("/analyze-image", response_model=AnalyzeImageResponse)
async def analyze_image(req: AnalyzeImageRequest):
    detected, level, confidence = vision_engine.analyze(req.image_url)
    return AnalyzeImageResponse(
        detected_objects=detected,
        damage_level=level,
        confidence=confidence
    )

@router.get("/model-status", response_model=ModelStatusResponse)
async def model_status():
    return ModelStatusResponse(
        model_id=UUID("f3b92c81-80a1-432d-9861-12c82f9d8a31"),
        model_name="Complaint Triage Multitask Engine",
        version="v2.1",
        accuracy=94.50,
        framework="PyTorch / HuggingFace",
        status="ACTIVE"
    )
