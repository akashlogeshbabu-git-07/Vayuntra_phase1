# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

from sqlalchemy import Column, Integer, Float, DateTime
from datetime import datetime
from app.database import Base


class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    cpu = Column(Float, nullable=False)
    memory = Column(Float, nullable=False)
    network = Column(Float, nullable=False)
    process_count = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
