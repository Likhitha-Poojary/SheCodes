import numpy as np
from typing import Tuple, Dict, List
from app.utils.logger import setup_logger

logger = setup_logger()

# We load SentenceTransformers lazily to prevent server startup lags when models download
_MODEL_INSTANCE = None

def get_sentence_model():
    global _MODEL_INSTANCE
    if _MODEL_INSTANCE is None:
        try:
            from sentence_transformers import SentenceTransformer
            logger.info("Loading SentenceTransformer model 'all-MiniLM-L6-v2'...")
            _MODEL_INSTANCE = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            logger.error(f"Failed to load SentenceTransformer: {e}. Model fallback to mock.")
            _MODEL_INSTANCE = None
    return _MODEL_INSTANCE

# Standardized CityMind Categories
CIVIC_CATEGORIES = {
    "GARBAGE": "Garbage dump, waste management, littering issues",
    "ROADS": "Potholes, broken roads, pavement cracks, street hazards",
    "WATER": "Water leakages, water supply interruptions, BWSSB pipeline issues",
    "ELECTRICITY": "Power cuts, broken transformers, low hanging wires, BESCOM issues",
    "DRAINAGE": "Drainage overflow, sewage blocks, open manholes",
    "TRAFFIC": "Traffic signal malfunctioning, illegal parking, congestion",
    "POLLUTION": "Industrial waste, noise pollution, water contamination",
    "PUBLIC_SAFETY": "Stray dog menace, street light dark spots, safety hazards",
    "OTHER": "General complaints, civic requests, miscellaneous issues"
}

class ComplaintClassifier:
    def __init__(self):
        self.model = get_sentence_model()
        self.category_keys = list(CIVIC_CATEGORIES.keys())
        
        # Pre-compute embeddings for target categories for fast distance comparison
        if self.model:
            logger.info("Pre-calculating category vector embeddings...")
            descriptions = [CIVIC_CATEGORIES[k] for k in self.category_keys]
            self.category_embeddings = self.model.encode(descriptions, normalize_embeddings=True)
        else:
            self.category_embeddings = None

    def get_embeddings(self, text: str) -> List[float]:
        """Generates raw 384-dimensional text embedding vector."""
        if not self.model:
            # Deterministic mock vector generation if model fails to load offline
            import random
            random.seed(sum(ord(c) for c in text))
            raw = [random.uniform(-1.0, 1.0) for _ in range(384)]
            norm = sum(x*x for x in raw) ** 0.5
            return [x/norm for x in raw]
            
        vector = self.model.encode([text], normalize_embeddings=True)[0]
        return vector.tolist()

    def classify(self, text: str) -> Tuple[str, float, List[float]]:
        """
        Classifies grievance text against target categories using Cosine Similarity.
        Returns: Tuple (Category Code, Confidence Score, Text Vector Embeddings)
        """
        text_vector = self.get_embeddings(text)
        
        if self.category_embeddings is None:
            # Standalone fallback matcher
            text_lower = text.lower()
            if "pothole" in text_lower or "road" in text_lower:
                return "ROADS", 0.94, text_vector
            if "water" in text_lower or "leak" in text_lower:
                return "WATER", 0.92, text_vector
            if "garbage" in text_lower or "waste" in text_lower:
                return "GARBAGE", 0.95, text_vector
            return "OTHER", 0.70, text_vector

        # Calculate cosine similarity: CategoryEmbeddings (N x 384) dot TextVector (384 x 1)
        similarities = np.dot(self.category_embeddings, np.array(text_vector))
        
        # Normalize scores to pseudo-probabilities via Softmax
        exp_scores = np.exp(similarities * 10) # Scaling factor to polarize differences
        probabilities = exp_scores / np.sum(exp_scores)
        
        best_index = int(np.argmax(probabilities))
        predicted_category = self.category_keys[best_index]
        confidence = float(probabilities[best_index])
        
        return predicted_category, confidence, text_vector
