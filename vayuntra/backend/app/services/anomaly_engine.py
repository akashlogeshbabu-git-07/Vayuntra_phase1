# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

import numpy as np
import logging
from sklearn.ensemble import IsolationForest

logger = logging.getLogger(__name__)

# Phase 1: In-memory model initialization
# Production: Load pre-trained artifact from ML_MODEL_PATH
# IMPORTANT: No live retraining in API runtime

model = IsolationForest(
    n_estimators=200,
    contamination=0.1,
    random_state=42
)

# Dummy training for Phase 1 demo
# Phase 2: Replace with trained artifact loaded via joblib
X_train = np.random.rand(500, 3)
X_train = np.vstack([X_train, np.random.rand(50, 3) * 10])  # inject anomaly class
model.fit(X_train)

logger.info("AnomalyEngine: Isolation Forest model initialized")


def detect_anomaly(cpu: float, memory: float, network: float) -> dict:
    """
    Run anomaly detection on telemetry sample.
    Returns structured result with anomaly flag, score, confidence, and severity.
    """
    sample = np.array([[cpu, memory, network]])
    prediction = model.predict(sample)
    score = float(model.decision_function(sample)[0])

    is_anomaly = prediction[0] == -1

    # Confidence: normalize score to 0-100 range
    # Lower score = higher confidence of anomaly
    raw_confidence = max(0.0, min(1.0, 0.5 - score))
    confidence = round(raw_confidence * 100, 2)

    # Severity classification
    if not is_anomaly:
        severity = "NORMAL"
    elif confidence < 30:
        severity = "LOW"
    elif confidence < 60:
        severity = "MEDIUM"
    elif confidence < 80:
        severity = "HIGH"
    else:
        severity = "CRITICAL"

    result = {
        "anomaly": is_anomaly,
        "score": round(score, 6),
        "confidence": confidence,
        "severity": severity,
        "model": "IsolationForest",
        "features": {"cpu": cpu, "memory": memory, "network": network}
    }

    logger.info(f"AnomalyEngine result: anomaly={is_anomaly} severity={severity} score={score:.4f}")
    return result
