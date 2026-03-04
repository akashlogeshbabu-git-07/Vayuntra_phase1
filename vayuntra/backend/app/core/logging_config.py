# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

import logging
import json
from datetime import datetime


class JSONFormatter(logging.Formatter):
    """
    Structured JSON logging formatter.
    Outputs machine-readable logs for SIEM ingestion.
    """

    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry)


def setup_logging(log_level: str = "INFO"):
    """
    Initialize structured logging for the application.
    Logs are JSON-formatted for immutability and SIEM compatibility.
    """
    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())

    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))
    root_logger.handlers = [handler]

    logging.getLogger("uvicorn.access").handlers = [handler]
