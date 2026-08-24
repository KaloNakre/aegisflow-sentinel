from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class IncidentBase(BaseModel):
    severity: str
    message: str
    source: str
    details: Optional[str] = None

class IncidentCreate(IncidentBase):
    pass

class IncidentOut(IncidentBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class SOPBase(BaseModel):
    name: str
    content_parsed: Optional[str] = None
    status: str
    violations: Optional[str] = None

class SOPCreate(SOPBase):
    pass

class SOPOut(SOPBase):
    id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True

class AIModelBase(BaseModel):
    name: str
    type: str
    accuracy: float
    latency: float
    vulnerability_count: int
    request_count: int
    status: str

    model_config = {
        'protected_namespaces': ()
    }

class AIModelCreate(AIModelBase):
    pass

class AIModelOut(AIModelBase):
    id: int

    class Config:
        from_attributes = True

class RuntimeTelemetryBase(BaseModel):
    cpu_usage: float
    memory_usage: float
    gpu_usage: Optional[float] = None
    latency: float

class RuntimeTelemetryOut(RuntimeTelemetryBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class NetworkLogBase(BaseModel):
    source_ip: str
    destination_domain: str
    bytes_sent: int
    bytes_received: int
    status: str

class NetworkLogCreate(NetworkLogBase):
    pass

class NetworkLogOut(NetworkLogBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class CostRecordBase(BaseModel):
    model_name: str
    provider: str
    prompt_tokens: int
    completion_tokens: int
    cost_usd: float

    model_config = {
        'protected_namespaces': ()
    }

class CostRecordCreate(CostRecordBase):
    pass

class CostRecordOut(CostRecordBase):
    id: int
    date: datetime

    class Config:
        from_attributes = True

class TelemetryOverview(BaseModel):
    overallRisk: int
    securityScore: int
    risks: Dict[str, Dict[str, Any]]
    alerts: List[IncidentOut]
    timeline: List[Dict[str, Any]]
