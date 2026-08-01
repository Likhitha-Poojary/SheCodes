from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional, List, Dict, Any

# --- analyze-complaint schemas ---
class AnalyzeComplaintRequest(BaseModel):
    complaint_id: UUID
    description: str = Field(..., description="Grievance description text")
    image_url: Optional[str] = Field(None, description="Uploaded image URL")
    latitude: float
    longitude: float

class AnalyzeComplaintResponse(BaseModel):
    category: str
    confidence: float
    severity: int
    priority: str
    department: str
    estimated_time: str
    duplicate_probability: float
    explanation: str

# --- check-duplicate schemas ---
class CheckDuplicateRequest(BaseModel):
    description: str
    latitude: float
    longitude: float
    district_id: int

class CheckDuplicateResponse(BaseModel):
    is_duplicate: bool
    duplicate_probability: float
    duplicate_of_id: Optional[UUID] = None

# --- analyze-image schemas ---
class AnalyzeImageRequest(BaseModel):
    image_url: str

class AnalyzeImageResponse(BaseModel):
    detected_objects: List[str]
    damage_level: str
    confidence: float

# --- model-status schemas ---
class ModelStatusResponse(BaseModel):
    model_id: UUID
    model_name: str
    version: str
    accuracy: float
    framework: str
    status: str
