# CityMind AI Karnataka - AI Analysis Service

Independent AI microservice built with **FastAPI** to analyze citizen complaints, detect duplicates using **pgvector** similarity search, parse uploaded images (road damage, garbage, water leaks), and estimate SLAs and severity scores.

## Architecture & Frameworks
*   **Text Classification & NLP:** Fine-tuned BERT model pipeline (supporting English & Kannada text parsing).
*   **Vector Search & Embeddings:** Deploys `sentence-transformers/all-MiniLM-L6-v2` generating 384-dimensional vector embeddings, communicating with the backend's PostgreSQL database using `pgvector` operators.
*   **Computer Vision:** OpenCV filters for edge/contour tracking combined with custom pre-trained visual model loaders.
*   **Database Integration:** Directly registers metrics and parameters inside `core_grievance.grievance_ai_analysis`, `core_grievance.grievance_embeddings`, and `core_grievance.ai_model_versions`.

## Folder Structure
```
ai-service/
├── app/
│   ├── main.py            # API routing server
│   ├── api/
│   │   └── endpoints.py   # REST request handlers
│   ├── models/
│   │   └── schemas.py     # Pydantic validation cards
│   ├── services/
│   │   ├── classifier.py  # Text parsing pipeline
│   │   ├── vision.py      # Image processing pipeline
│   │   ├── duplicate.py   # Similarity check (pgvector)
│   │   ├── priority.py    # Priority estimation matrix
│   │   ├── severity.py    # Severity scoring (0-100)
│   │   ├── routing.py     # Department recommendations
│   │   └── resolution_time.py # SLA predictions
│   ├── preprocessing/
│   │   └── text_clean.py  # Text cleaning (Kannada/English)
│   ├── database/
│   │   └── connection.py  # DB pool managers and SQL writes
│   └── utils/
│       └── logger.py      # Structured logs config
├── requirements.txt
└── Dockerfile
```

## Running the Service

### 1. Build and Run Local Server
```bash
pip install -r requirements.txt
export DB_HOST="localhost"
export DB_USER="postgres"
export DB_PASS="postgres"
export DB_NAME="citymind_grievance"
python app/main.py
```

### 2. Run Containerized Deployment
```bash
docker build -t citymind-ai-service .
docker run -p 8081:8081 --env-file .env citymind-ai-service
```
