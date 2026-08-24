from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from .database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    severity = Column(String, nullable=False) # INFO, LOW, MEDIUM, HIGH, CRITICAL
    message = Column(String, nullable=False)
    source = Column(String, nullable=False) # e.g. SOP Engine, Runtime Monitor, Network Firewall
    details = Column(Text, nullable=True)

class SOP(Base):
    __tablename__ = "sops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    content_parsed = Column(Text, nullable=True)
    status = Column(String, default="Warning") # Passed, Warning, Critical
    violations = Column(Text, nullable=True) # JSON or string of violations
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class AIModel(Base):
    __tablename__ = "ai_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    type = Column(String, nullable=False) # e.g. LLM, Classifier, Embedding
    accuracy = Column(Float, default=1.0)
    latency = Column(Float, default=0.0) # in ms
    vulnerability_count = Column(Integer, default=0)
    request_count = Column(Integer, default=0)
    status = Column(String, default="Active") # Active, Degraded, Paused

class RuntimeTelemetry(Base):
    __tablename__ = "runtime_telemetry"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    cpu_usage = Column(Float, nullable=False)
    memory_usage = Column(Float, nullable=False)
    gpu_usage = Column(Float, nullable=True)
    latency = Column(Float, nullable=False)

class NetworkLog(Base):
    __tablename__ = "network_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    source_ip = Column(String, nullable=False)
    destination_domain = Column(String, nullable=False)
    bytes_sent = Column(Integer, default=0)
    bytes_received = Column(Integer, default=0)
    status = Column(String, default="Allowed") # Allowed, Blocked, Flagged

class CostRecord(Base):
    __tablename__ = "cost_records"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    model_name = Column(String, nullable=False)
    provider = Column(String, nullable=False) # e.g. OpenAI, Anthropic, Local
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    cost_usd = Column(Float, default=0.0)
