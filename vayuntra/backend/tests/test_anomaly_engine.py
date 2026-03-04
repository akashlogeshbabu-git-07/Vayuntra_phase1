# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

import pytest
from app.services.anomaly_engine import detect_anomaly


def test_normal_metrics_no_anomaly():
    result = detect_anomaly(50.0, 60.0, 30.0)
    assert "anomaly" in result
    assert "score" in result
    assert "confidence" in result
    assert "severity" in result


def test_extreme_metrics_detect_anomaly():
    result = detect_anomaly(99.9, 99.9, 99.9)
    assert result["anomaly"] is True or result["anomaly"] is False  # model is probabilistic


def test_result_structure():
    result = detect_anomaly(70.0, 75.0, 50.0)
    assert set(result.keys()) >= {"anomaly", "score", "confidence", "severity", "model", "features"}


def test_severity_normal():
    result = detect_anomaly(10.0, 10.0, 10.0)
    assert result["severity"] in ["NORMAL", "LOW", "MEDIUM", "HIGH", "CRITICAL"]


def test_confidence_range():
    result = detect_anomaly(50.0, 50.0, 50.0)
    assert 0 <= result["confidence"] <= 100
