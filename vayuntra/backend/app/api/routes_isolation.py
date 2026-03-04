# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

from fastapi import APIRouter
from app.services.isolation_engine import execute_isolation

router = APIRouter(prefix="/isolation", tags=["Isolation Engine"])


@router.post("/trigger")
def trigger_isolation(data: dict):
    """
    Trigger containment action.
    All actions are logged, explicit, and return JSON status.

    Actions:
    - log_containment: Log-only (safe)
    - terminate_process: Simulated process termination
    - network_segment: Simulated network segmentation
    """
    action = data.get("action", "log_containment")
    target = data.get("target", "unknown")
    trigger_source = data.get("trigger_source", "api")

    return execute_isolation(action, target, trigger_source)


@router.get("/status")
def isolation_status():
    """
    Isolation engine health check.
    """
    return {"engine": "IsolationEngine", "status": "operational", "phase": "1"}
