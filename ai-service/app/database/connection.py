import os
from contextlib import contextmanager
from uuid import UUID
import psycopg2
from psycopg2.pool import SimpleConnectionPool
from psycopg2.extras import RealDictCursor
from app.utils.logger import setup_logger

logger = setup_logger()

class DatabaseManager:
    def __init__(self):
        db_host = os.getenv("DB_HOST", "localhost")
        db_user = os.getenv("DB_USER", "postgres")
        db_pass = os.getenv("DB_PASS", "postgres")
        db_name = os.getenv("DB_NAME", "citymind_grievance")
        
        conn_str = f"host={db_host} user={db_user} password={db_pass} dbname={db_name} sslmode=disable"
        
        logger.info("Initializing Database Pool in AI Service...")
        try:
            self.pool = SimpleConnectionPool(minconn=1, maxconn=10, dsn=conn_str)
        except Exception as e:
            logger.warning(f"Database unavailable for pool: {e}. AI service starting in standalone (mock) database mode.")
            self.pool = None

    @contextmanager
    def get_connection(self):
        if not self.pool:
            raise RuntimeError("Database pool is offline.")
        conn = self.pool.getconn()
        try:
            yield conn
        finally:
            self.pool.putconn(conn)

    def register_model_version(self, model_id: UUID, name: str, version: str, accuracy: float, framework: str):
        if not self.pool:
            return
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    query = """
                        INSERT INTO core_grievance.ai_model_versions (model_id, model_name, version, accuracy, framework, status)
                        VALUES (%s, %s, %s, %s, %s, 'ACTIVE')
                        ON CONFLICT (version) DO UPDATE 
                        SET accuracy = EXCLUDED.accuracy, status = 'ACTIVE'
                    """
                    cur.execute(query, (str(model_id), name, version, accuracy, framework))
                    conn.commit()
        except Exception as e:
            logger.error(f"Error registering model version in database: {e}")

    def save_ai_analysis(self, grievance_id: UUID, district_id: int, model_id: UUID, vision_labels: list, severity: float, priority: float, confidence: float, recommended_dept_id: Optional[UUID], est_hours: float, summary: str):
        if not self.pool:
            return
        try:
            import json
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    query = """
                        INSERT INTO core_grievance.grievance_ai_analysis (
                            id, grievance_id, district_id, model_id, vision_detection_label, 
                            severity_score, priority_score, category_confidence, 
                            recommended_department_id, estimated_resolution_hours, ai_summary
                        ) VALUES (
                            uuid_generate_v4(), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                        )
                        ON CONFLICT (grievance_id) DO UPDATE SET
                            vision_detection_label = EXCLUDED.vision_detection_label,
                            severity_score = EXCLUDED.severity_score,
                            priority_score = EXCLUDED.priority_score,
                            category_confidence = EXCLUDED.category_confidence,
                            estimated_resolution_hours = EXCLUDED.estimated_resolution_hours,
                            ai_summary = EXCLUDED.ai_summary
                    """
                    cur.execute(query, (
                        str(grievance_id), district_id, str(model_id), json.dumps(vision_labels),
                        severity, priority, confidence, str(recommended_dept_id) if recommended_dept_id else None,
                        est_hours, summary
                    ))
                    conn.commit()
                    logger.info(f"AI analysis metrics saved successfully for grievance {grievance_id}")
        except Exception as e:
            logger.error(f"Error saving AI analysis to database: {e}")

    def save_embedding(self, grievance_id: UUID, district_id: int, vector: list, model_version: str):
        if not self.pool:
            return
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    # Convert python float list to postgres pgvector format string '[x,y,z...]'
                    vector_str = "[" + ",".join(map(str, vector)) + "]"
                    query = """
                        INSERT INTO core_grievance.grievance_embeddings (
                            id, grievance_id, district_id, embedding_vector, model_version
                        ) VALUES (
                            uuid_generate_v4(), %s, %s, %s, %s
                        )
                        ON CONFLICT (grievance_id) DO UPDATE SET
                            embedding_vector = EXCLUDED.embedding_vector,
                            model_version = EXCLUDED.model_version
                    """
                    cur.execute(query, (str(grievance_id), district_id, vector_str, model_version))
                    conn.commit()
                    logger.info(f"Vector embeddings saved successfully for grievance {grievance_id}")
        except Exception as e:
            logger.error(f"Error saving embedding to database: {e}")

    def check_similar_grievances(self, vector: list, district_id: int, limit: int = 5) -> list:
        if not self.pool:
            return []
        try:
            with self.get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    vector_str = "[" + ",".join(map(str, vector)) + "]"
                    # Order by pgvector cosine distance operator <=>
                    query = """
                        SELECT grievance_id, (1 - (embedding_vector <=> %s::vector)) as similarity
                        FROM core_grievance.grievance_embeddings
                        WHERE district_id = %s
                        ORDER BY embedding_vector <=> %s::vector
                        LIMIT %s
                    """
                    cur.execute(query, (vector_str, district_id, vector_str, limit))
                    return cur.fetchall()
        except Exception as e:
            logger.error(f"Error searching similarity from pgvector table: {e}")
            return []
