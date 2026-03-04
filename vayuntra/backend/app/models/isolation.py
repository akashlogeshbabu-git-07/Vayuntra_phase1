# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from app.database import Base


class IsolationEvent(Base):
    __tablename__ = "isolation_events"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(100), nullable=False)
    trigger_source = Column(String(100), nullable=False)
    target = Column(String(200), nullable=True)
    success = Column(Boolean, default=False)
    audit_timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    correlation_id = Column(String(64), nullable=True)
    operator = Column(String(100), nullable=True, default="system")
