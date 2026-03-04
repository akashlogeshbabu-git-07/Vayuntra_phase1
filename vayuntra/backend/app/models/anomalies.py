# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

from sqlalchemy import Column, Integer, Float, Boolean, DateTime, ForeignKey, String
from datetime import datetime
from app.database import Base


class Anomaly(Base):
    __tablename__ = "anomalies"

    id = Column(Integer, primary_key=True, index=True)
    metric_id = Column(Integer, ForeignKey("metrics.id"), nullable=True)
    score = Column(Float, nullable=False)
    is_anomaly = Column(Boolean, nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(String(20), nullable=False, default="LOW")
    source = Column(String(100), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
