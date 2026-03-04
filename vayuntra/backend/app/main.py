# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes_metrics, routes_anomaly, routes_isolation
from app.core.logging_config import setup_logging
from app.config import LOG_LEVEL
from app.database import engine, Base

# Initialize structured logging
setup_logging(LOG_LEVEL)

# Create DB tables (Phase 1 — Alembic migrations in Phase 2)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Vayuntra",
    description="ML-Driven Autonomous Anomaly Detection & AI Remediation System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS — restrict to frontend origin in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(routes_metrics.router)
app.include_router(routes_anomaly.router)
app.include_router(routes_isolation.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "system": "Vayuntra",
        "status": "operational",
        "version": "1.0.0",
        "phase": "1"
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
