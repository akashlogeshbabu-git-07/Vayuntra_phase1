# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

from fastapi import APIRouter
from app.services.anomaly_engine import detect_anomaly

router = APIRouter(prefix="/anomaly", tags=["Anomaly Detection"])


@router.post("/detect")
def detect(data: dict):
    """
    Standalone anomaly detection endpoint.
    Does not persist to database — use for testing.
    """
    cpu = float(data.get("cpu", 0))
    memory = float(data.get("memory", 0))
    network = float(data.get("network", 0))

    return detect_anomaly(cpu, memory, network)


@router.get("/status")
def status():
    """
    Anomaly engine health check.
    """
    return {"engine": "IsolationForest", "status": "operational", "version": "1.0.0"}
