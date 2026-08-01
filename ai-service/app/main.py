import os
import time
import uuid
from fastapi import FastAPI, Request
from app.api.endpoints import router
from app.utils.logger import setup_logger

logger = setup_logger()

app = FastAPI(
    title="CityMind AI Karnataka - AI Microservice",
    description="Independent AI Microservice running NLP classifiers, OpenCV vision triage, and pgvector checking.",
    version="1.1.0"
)

# Correlation ID middleware
@app.middleware("http")
async def correlation_middleware(request: Request, call_next):
    start = time.time()
    corr_id = request.headers.get("X-Correlation-ID", f"ai-{uuid.uuid4()}")
    logger.info(f"[{corr_id}] Ingress {request.method} {request.url.path}")
    
    response = await call_next(request)
    
    response.headers["X-Correlation-ID"] = corr_id
    logger.info(f"[{corr_id}] Egress completed in {time.time() - start:.4f}s")
    return response

# Register routers
app.include_router(router)

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "healthy", "service": "ai-analysis-service"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8081))
    logger.info(f"Starting CityMind AI Service on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
