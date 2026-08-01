# CityMind AI Karnataka - Smart Governance Platform

CityMind AI Karnataka is an enterprise-grade smart governance and predictive analytics system designed for municipal corporation management at state scale.

---

## 🏛️ Platform Architecture

The monorepo contains the following components:

*   `backend/core-api`: Core FastAPI application managing auth, WebSocket feeds, and PostGIS queries.
*   `backend/ai-service`: Python AI microservice triaging complaint texts, visual severity, and embeddings.
*   `backend/celery-worker`: Celery workers processing background dispatches.
*   `frontend/citizen-portal`: Next.js web application for reporting grievances.
*   `frontend/officer-portal`: Next.js mobile-first portal for field responders.
*   `frontend/admin-dashboard`: Next.js state command dashboard for municipal departments.
*   `frontend/ai-intelligence`: Next.js MLOps analytics center.
*   `infrastructure/nginx`: Reverse proxy routing.
*   `database/seed-data`: Karnataka 31 districts, departments (BBMP/BWSSB), and cities seeds.

---

## 🚀 Getting Started

### 1. Environment Configurations
Create `.env` file by copying the template:
```bash
cp .env.example .env
```

### 2. Multi-Container Orchestration
Run the entire platform using Docker Compose:
```bash
docker compose up --build
```
This spins up PostgreSQL, Redis, Nginx, uvicorn backends, and four Next.js portals.

### 3. Verification URLs
*   **API Gateway Port:** `http://localhost`
*   **Citizen Portal:** `http://localhost/citizen`
*   **Officer Portal:** `http://localhost/officer`
*   **Admin Dashboard:** `http://localhost/admin`
*   **AI Intelligence Center:** `http://localhost/ai-dashboard`
*   **API Documentation:** `http://localhost/api/docs`

---

## 🛠️ Demo Workflow (Monsoon Flood Risk Scenario)
1.  **Report Grievance:** Citizen logs a waterlogging ticket in Bengaluru East via the Citizen Portal geocoding picker.
2.  **AI Classification:** NLP Classifier maps the issue to `Disaster Management` (94% confidence) and calculates a severity score of `98`.
3.  **WebSocket Dispatch:** WS streams alert the State Command Center.
4.  **Auto Assignment:** The system matches the ticket to the nearest field responder using PostGIS spatial indexes.
5.  **Evidence & Resolution:** The Officer App captures "before" photos, guides the responder via live GPS, confirms cleanup, and uploads "after" proofs.
6.  **AI Predictions:** The AI Center triggers monsoon flood alerts, alerting citizens and pre-deploying BESCOM/BBMP drainage nodes.
