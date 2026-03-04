# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

import logging
import uuid
from datetime import datetime

audit_logger = logging.getLogger("vayuntra.audit")


def log_audit_event(event_type: str, details: dict, user_id: str = "system", ip_address: str = "internal"):
    """
    Write an immutable audit event.
    All anomaly detections, isolation triggers, and API actions are recorded here.

    NIST AU-2 / SOC 2 CC7.2 aligned.
    """
    event = {
        "event_type": event_type,
        "correlation_id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat(),
        "user_id": user_id,
        "ip_address": ip_address,
        "details": details
    }
    audit_logger.info(event)
    return event
