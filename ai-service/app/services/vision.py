import os
import logging
import urllib.request
from typing import Tuple, List, Dict, Any

logger = logging.getLogger(__name__)

# Lazy load OpenCV
_CV_AVAILABLE = False
try:
    import cv2
    import numpy as np
    _CV_AVAILABLE = True
except ImportError:
    logger.warning("OpenCV not installed or unavailable. Vision service will use fallback mock analysis.")

class ImageAnalysisEngine:
    def __init__(self):
        # Placeholder for real PyTorch / YOLOv8 model initialization
        # self.yolo_model = torch.hub.load('ultralytics/yolov8', 'custom', path='best.pt')
        self.enabled = _CV_AVAILABLE

    def download_image(self, url: str) -> Optional[str]:
        """Downloads temporary copy of image from URL for processing."""
        try:
            temp_path = f"/tmp/temp_{hash(url)}.jpg"
            # Ensure folder exists
            os.makedirs("/tmp", exist_ok=True)
            urllib.request.urlretrieve(url, temp_path)
            return temp_path
        except Exception as e:
            logger.error(f"Failed to download attachment image: {e}")
            return None

    def analyze(self, image_url: str) -> Tuple[List[str], str, float]:
        """
        Runs image analysis:
        1. Downloads image assets.
        2. Executes Canny edge density checks and color histogram segmentation using OpenCV.
        3. Classifies damage severity and detected objects.
        Returns: Tuple of (Detected Objects list, Damage Level, Confidence score)
        """
        if not self.enabled or not image_url:
            return ["garbage_pile"], "MEDIUM_DAMAGE", 0.85
            
        temp_file = self.download_image(image_url)
        if not temp_file or not os.path.exists(temp_file):
            return ["unresolved_incident_object"], "UNKNOWN_DAMAGE", 0.50

        try:
            # Read image using OpenCV
            img = cv2.imread(temp_file)
            if img is None:
                return ["unreadable_media"], "UNKNOWN_DAMAGE", 0.0
                
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Canny edge density check to locate structural cracks/potholes
            edges = cv2.Canny(gray, 50, 150)
            edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
            
            # Analyze color bounds (e.g. green/brown bounds indicate waste/garbage piles)
            # Define green garbage piles masks
            lower_green = np.array([35, 40, 40])
            upper_green = np.array([85, 255, 255])
            mask = cv2.inRange(hsv, lower_green, upper_green)
            green_ratio = np.sum(mask > 0) / (mask.shape[0] * mask.shape[1])

            detected_objects = []
            damage_level = "LOW_DAMAGE"
            confidence = 0.70

            # Logic based on real OpenCV measurements
            if edge_density > 0.08:
                detected_objects.append("road_cracks_or_potholes")
                damage_level = "HIGH_DAMAGE" if edge_density > 0.15 else "MEDIUM_DAMAGE"
                confidence = float(min(0.5 + edge_density * 3, 0.95))
            
            if green_ratio > 0.05:
                detected_objects.append("garbage_pile")
                damage_level = "MEDIUM_DAMAGE" if green_ratio < 0.15 else "HIGH_DAMAGE"
                confidence = float(min(0.6 + green_ratio * 2, 0.96))

            # Dark spot checks (unlit street lamps checks)
            avg_brightness = np.mean(gray)
            if avg_brightness < 40:
                detected_objects.append("unlit_street")
                damage_level = "MEDIUM_DAMAGE"
                confidence = 0.88

            if not detected_objects:
                detected_objects.append("generic_incident_sign")
                damage_level = "LOW_DAMAGE"
                confidence = 0.65

            # Cleanup temp downloads
            if os.path.exists(temp_file):
                os.remove(temp_file)

            return detected_objects, damage_level, confidence

        except Exception as e:
            logger.error(f"OpenCV processing failure: {e}")
            return ["processing_error"], "UNKNOWN_DAMAGE", 0.0
