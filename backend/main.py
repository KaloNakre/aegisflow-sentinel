from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, List
import random
import json
import fitz  # PyMuPDF

from .database import engine, Base, get_db, SessionLocal
from . import models, schemas

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AegisFlow Sentinel API", version="1.0.0")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to seed data
def seed_database_if_empty(db: Session):
    # Check if we already have incidents
    if db.query(models.Incident).first() is not None:
        return

    print("Seeding SQLite database with testing datasets...")

    # 1. Seed AI Models
    models_list = [
        {"name": "gpt-4o", "type": "LLM", "accuracy": 0.96, "latency": 450.5, "vulnerability_count": 2, "request_count": 14205, "status": "Active"},
        {"name": "claude-3-5-sonnet", "type": "LLM", "accuracy": 0.97, "latency": 510.2, "vulnerability_count": 0, "request_count": 8940, "status": "Active"},
        {"name": "llama-3-8b-instruct", "type": "LLM", "accuracy": 0.88, "latency": 120.4, "vulnerability_count": 5, "request_count": 22410, "status": "Active"},
        {"name": "custom-bert-ner", "type": "Classifier", "accuracy": 0.94, "latency": 45.0, "vulnerability_count": 1, "request_count": 45100, "status": "Degraded"},
        {"name": "text-embedding-3-small", "type": "Embedding", "accuracy": 0.99, "latency": 32.1, "vulnerability_count": 0, "request_count": 92100, "status": "Active"},
    ]
    for m in models_list:
        db.add(models.AIModel(**m))

    # 2. Seed SOPs
    sops_list = [
        {
            "name": "PII Protection Policy.pdf",
            "content_parsed": "Standard policy for filtering Personal Identifiable Information (PII) before transmission to public model APIs. Rule: All social security numbers, credit card numbers, and phone numbers must be redacted.",
            "status": "Passed",
            "violations": json.dumps([])
        },
        {
            "name": "System Security Standards.pdf",
            "content_parsed": "Guidelines for model weights access control, runtime encryption, and token limits. Rule: API token keys must be rotated every 30 days.",
            "status": "Warning",
            "violations": json.dumps(["Model custom-bert-ner API key has not been rotated in 45 days"])
        },
        {
            "name": "Data Governance Regulations.pdf",
            "content_parsed": "Rule: Training data must not contain user telemetry logs or session keys without explicit opt-in.",
            "status": "Passed",
            "violations": json.dumps([])
        }
    ]
    for s in sops_list:
        db.add(models.SOP(**s))

    # 3. Seed Incidents
    incidents_list = [
        {
            "severity": "CRITICAL",
            "message": "PII detected in prompt sent to public model",
            "source": "SOP Engine",
            "details": "User input contained phone numbers and email addresses which were not redacted by custom-bert-ner before forwarding.",
            "timestamp": datetime.utcnow() - timedelta(minutes=15)
        },
        {
            "severity": "HIGH",
            "message": "Unusual token volume spike detected",
            "source": "Cost Monitor",
            "details": "Model llama-3-8b-instruct experienced a request spike of 450% from external IP range 198.51.100.12.",
            "timestamp": datetime.utcnow() - timedelta(minutes=45)
        },
        {
            "severity": "MEDIUM",
            "message": "Model degradation detected",
            "source": "Runtime Monitor",
            "details": "Model custom-bert-ner latency rose above SLA boundary of 50ms, currently averaging 120ms.",
            "timestamp": datetime.utcnow() - timedelta(hours=2)
        },
        {
            "severity": "LOW",
            "message": "Minor network anomaly observed",
            "source": "Network Firewall",
            "details": "Outbound connection to non-whitelisted CDN domain raw.githubusercontent.com blocked.",
            "timestamp": datetime.utcnow() - timedelta(hours=4)
        },
        {
            "severity": "INFO",
            "message": "Routine SOP check passed successfully",
            "source": "SOP Engine",
            "details": "Scheduled scan of 4 connected pipelines finished with 0 compliance issues.",
            "timestamp": datetime.utcnow() - timedelta(hours=5)
        }
    ]
    for inc in incidents_list:
        db.add(models.Incident(**inc))

    # 4. Seed Runtime Telemetry (last 20 hours/points)
    now = datetime.utcnow()
    for i in range(20):
        t = now - timedelta(hours=(20-i))
        db.add(models.RuntimeTelemetry(
            timestamp=t,
            cpu_usage=random.uniform(35.0, 75.0),
            memory_usage=random.uniform(55.0, 85.0),
            gpu_usage=random.uniform(40.0, 90.0),
            latency=random.uniform(10.0, 150.0)
        ))

    # 5. Seed Network Logs
    destinations = [
        ("192.168.1.50", "api.openai.com", "Allowed"),
        ("192.168.1.50", "api.anthropic.com", "Allowed"),
        ("192.168.1.55", "huggingface.co", "Allowed"),
        ("192.168.1.60", "unapproved-domain.ru", "Blocked"),
        ("192.168.1.72", "github.com", "Allowed"),
        ("192.168.1.72", "suspicious-tracker.net", "Blocked"),
        ("192.168.1.50", "api.openai.com", "Allowed"),
    ]
    for i, dest in enumerate(destinations):
        db.add(models.NetworkLog(
            timestamp=datetime.utcnow() - timedelta(minutes=i*10),
            source_ip=dest[0],
            destination_domain=dest[1],
            bytes_sent=random.randint(1000, 500000),
            bytes_received=random.randint(5000, 2000000),
            status=dest[2]
        ))

    # 6. Seed Cost Records (last 7 days)
    providers = [
        ("gpt-4o", "OpenAI", 0.005, 0.015),
        ("claude-3-5-sonnet", "Anthropic", 0.003, 0.015),
        ("llama-3-8b-instruct", "Local", 0.0001, 0.0002)
    ]
    for day in range(7):
        date_val = now - timedelta(days=day)
        for model_info in providers:
            prompt_t = random.randint(100000, 800000)
            comp_t = random.randint(50000, 400000)
            cost = (prompt_t * model_info[2] / 1000) + (comp_t * model_info[3] / 1000)
            db.add(models.CostRecord(
                date=date_val,
                model_name=model_info[0],
                provider=model_info[1],
                prompt_tokens=prompt_t,
                completion_tokens=comp_t,
                cost_usd=cost
            ))

    db.commit()
    print("Database seeding completed successfully.")

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()

# Enpoints
@app.get("/api/telemetry", response_model=schemas.TelemetryOverview)
def get_telemetry(db: Session = Depends(get_db)):
    # Calculate overall metrics
    incidents = db.query(models.Incident).all()
    models_db = db.query(models.AIModel).all()
    sops = db.query(models.SOP).all()
    telemetry_logs = db.query(models.RuntimeTelemetry).order_by(models.RuntimeTelemetry.timestamp.desc()).limit(1).first()

    # Calculate overall security score based on active incidents
    critical_count = sum(1 for inc in incidents if inc.severity == "CRITICAL")
    high_count = sum(1 for inc in incidents if inc.severity == "HIGH")
    medium_count = sum(1 for inc in incidents if inc.severity == "MEDIUM")
    
    security_score = 100 - (critical_count * 15) - (high_count * 8) - (medium_count * 3)
    security_score = max(30, min(100, security_score))

    overall_risk = 100 - security_score

    # Construct risks breakdowns
    risks = {
        "security": {"value": 10 + critical_count * 12, "trend": "up" if critical_count > 0 else "stable"},
        "sop": {"value": 45 if any(s.status == "Warning" for s in sops) else 15, "trend": "stable"},
        "model": {"value": 15 if any(m.status == "Degraded" for m in models_db) else 5, "trend": "stable"},
        "data": {"value": 2 + critical_count * 20, "trend": "up" if critical_count > 0 else "down"},
        "runtime": {"value": int(telemetry_logs.cpu_usage / 8) if telemetry_logs else 10, "trend": "stable"},
        "network": {"value": 15, "trend": "stable"},
        "agent": {"value": 20, "trend": "down"},
        "cost": {"value": 60, "trend": "up"},
    }

    # Fetch alerts (CRITICAL or HIGH incidents)
    alerts = db.query(models.Incident).filter(models.Incident.severity.in_(["CRITICAL", "HIGH"])).order_by(models.Incident.timestamp.desc()).all()

    # Construct timeline
    timeline = []
    for inc in sorted(incidents, key=lambda x: x.timestamp, reverse=True)[:5]:
        status_map = {"CRITICAL": "critical", "HIGH": "critical", "MEDIUM": "warning", "LOW": "warning", "INFO": "passed"}
        timeline.append({
            "id": f"t_{inc.id}",
            "time": inc.timestamp.strftime("%H:%M"),
            "message": inc.message,
            "status": status_map.get(inc.severity, "info")
        })

    return {
        "overallRisk": overall_risk,
        "securityScore": security_score,
        "risks": risks,
        "alerts": [schemas.IncidentOut.from_orm(a) for a in alerts],
        "timeline": timeline
    }

@app.get("/api/incidents", response_model=list[schemas.IncidentOut])
def get_incidents(severity: Optional[str] = None, source: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Incident)
    if severity:
        query = query.filter(models.Incident.severity == severity)
    if source:
        query = query.filter(models.Incident.source == source)
    return query.order_by(models.Incident.timestamp.desc()).all()

@app.post("/api/incidents", response_model=schemas.IncidentOut)
def create_incident(incident: schemas.IncidentCreate, db: Session = Depends(get_db)):
    db_incident = models.Incident(
        severity=incident.severity,
        message=incident.message,
        source=incident.source,
        details=incident.details,
        timestamp=datetime.utcnow()
    )
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

@app.get("/api/sops", response_model=list[schemas.SOPOut])
def get_sops(db: Session = Depends(get_db)):
    return db.query(models.SOP).order_by(models.SOP.uploaded_at.desc()).all()

@app.post("/api/sops/upload")
def upload_sop(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        # Read PDF using PyMuPDF
        contents = file.file.read()
        doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        
        # Look for compliance rules
        violations = []
        status = "Passed"
        
        # Run dummy checking algorithm based on the parsed PDF rules
        text_lower = text.lower()
        if "must redaction" in text_lower or "redacted" in text_lower:
            # check if there is an active incident of PII leak
            pii_leak = db.query(models.Incident).filter(models.Incident.message.contains("PII")).first()
            if pii_leak:
                violations.append("Active PII incidents conflict with required Redaction rules.")
                status = "Critical"
                
        if "encryption" in text_lower and "key" in text_lower:
            violations.append("Key rotation schedule is not automated in current configurations.")
            status = "Warning"

        sop_db = models.SOP(
            name=file.filename,
            content_parsed=text[:1000] + ("..." if len(text) > 1000 else ""),
            status=status,
            violations=json.dumps(violations),
            uploaded_at=datetime.utcnow()
        )
        db.add(sop_db)
        db.commit()
        db.refresh(sop_db)
        return {"filename": file.filename, "status": status, "violations": violations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models", response_model=list[schemas.AIModelOut])
def get_models(db: Session = Depends(get_db)):
    return db.query(models.AIModel).all()

@app.get("/api/runtime", response_model=list[schemas.RuntimeTelemetryOut])
def get_runtime(db: Session = Depends(get_db)):
    # Return last 20 runtime entries
    return db.query(models.RuntimeTelemetry).order_by(models.RuntimeTelemetry.timestamp.desc()).limit(20).all()

@app.get("/api/network", response_model=list[schemas.NetworkLogOut])
def get_network(db: Session = Depends(get_db)):
    return db.query(models.NetworkLog).order_by(models.NetworkLog.timestamp.desc()).all()

@app.get("/api/cost", response_model=list[schemas.CostRecordOut])
def get_cost(db: Session = Depends(get_db)):
    return db.query(models.CostRecord).order_by(models.CostRecord.date.desc()).all()

@app.get("/api/huggingface/models")
def get_huggingface_models():
    # Return mock or direct live statistics from Hugging Face Hub for cyber-themed NLP/LLM models
    models_metadata = [
        {
            "name": "meta-llama/Meta-Llama-3-8B-Instruct",
            "likes": 4820,
            "downloads": 142010,
            "author": "meta-llama",
            "safety_rating": "Passed",
            "type": "Text Generation"
        },
        {
            "name": "microsoft/codebert-base",
            "likes": 1205,
            "downloads": 89402,
            "author": "microsoft",
            "safety_rating": "Warning",
            "type": "Fill Mask"
        },
        {
            "name": "ybelkada/pix2struct-base",
            "likes": 320,
            "downloads": 12410,
            "author": "ybelkada",
            "safety_rating": "Passed",
            "type": "Image to Text"
        },
        {
            "name": "security-analyst/bert-vuln-detector",
            "likes": 150,
            "downloads": 8205,
            "author": "security-analyst",
            "safety_rating": "Passed",
            "type": "Text Classification"
        }
    ]
    return models_metadata

@app.post("/api/seed")
def force_seed(db: Session = Depends(get_db)):
    # Clear tables and re-seed
    db.query(models.Incident).delete()
    db.query(models.AIModel).delete()
    db.query(models.SOP).delete()
    db.query(models.RuntimeTelemetry).delete()
    db.query(models.NetworkLog).delete()
    db.query(models.CostRecord).delete()
    db.commit()
    seed_database_if_empty(db)
    return {"message": "Database forced seeded successfully!"}

