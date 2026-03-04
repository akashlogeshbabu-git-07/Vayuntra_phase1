# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.metrics import Metric

logger = logging.getLogger(__name__)


def store_metric(db: Session, cpu: float, memory: float, network: float, process_count: float = None) -> Metric:
    """
    Persist telemetry metric to database.
    """
    metric = Metric(
        cpu=cpu,
        memory=memory,
        network=network,
        process_count=process_count,
        timestamp=datetime.utcnow()
    )
    db.add(metric)
    db.commit()
    db.refresh(metric)
    logger.info(f"Metric stored: id={metric.id} cpu={cpu} memory={memory} network={network}")
    return metric


def get_recent_metrics(db: Session, limit: int = 50):
    """
    Retrieve recent metrics for dashboard.
    """
    return db.query(Metric).order_by(Metric.timestamp.desc()).limit(limit).all()
