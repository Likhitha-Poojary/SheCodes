from uuid import UUID
from typing import Tuple, Optional
from app.database.connection import DatabaseManager
from app.utils.logger import setup_logger

logger = setup_logger()

class DuplicateDetector:
    def __init__(self, db_mgr: DatabaseManager):
        self.db = db_mgr

    def evaluate(self, vector: list, district_id: int, threshold: float = 0.82) -> Tuple[bool, float, Optional[UUID]]:
        """
        Queries the database pgvector index for candidates.
        Returns: Tuple of (Is Duplicate, Similarity Probability, Parent Grievance ID)
        """
        if not self.db.pool:
            logger.warning("Database offline. Skipping duplicate evaluation.")
            return False, 0.0, None
            
        try:
            candidates = self.db.check_similar_grievances(vector, district_id, limit=1)
            if not candidates:
                return False, 0.0, None
                
            match = candidates[0]
            similarity = float(match['similarity'])
            
            logger.info(f"Duplicate candidate check: ID {match['grievance_id']} has similarity score {similarity:.4f}")
            
            if similarity >= threshold:
                return True, similarity, UUID(match['grievance_id'])
                
            return False, similarity, None
            
        except Exception as e:
            logger.error(f"Duplicate check query failure: {e}")
            return False, 0.0, None
