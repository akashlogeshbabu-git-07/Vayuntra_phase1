# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.anomaly_engine import detect_anomaly
from app.services.collector import store_metric, get_recent_metrics

router = APIRouter(prefix="/metrics", tags=["Metrics"])


@router.post("/")
def submit_metrics(data: dict, db: Session = Depends(get_db)):
    """
    Submit system telemetry for anomaly analysis.
    Stores metric and returns anomaly detection result.
    """
    cpu = float(data.get("cpu", 0))
    memory = float(data.get("memory", 0))
    network = float(data.get("network", 0))
    process_count = data.get("process_count")

    # Store metric
    metric = store_metric(db, cpu, memory, network, process_count)

    # Detect anomaly
    result = detect_anomaly(cpu, memory, network)
    result["metric_id"] = metric.id

    return result


@router.get("/recent")
def get_metrics(limit: int = 50, db: Session = Depends(get_db)):
    """
    Retrieve recent telemetry metrics.
    """
    metrics = get_recent_metrics(db, limit)
    return [
        {
            "id": m.id,
            "cpu": m.cpu,
            "memory": m.memory,
            "network": m.network,
            "timestamp": m.timestamp.isoformat()
        }
        for m in metrics
    ]
