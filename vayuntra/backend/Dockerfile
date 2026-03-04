# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

FROM python:3.11-slim

# Security: run as non-root
RUN groupadd -r vayuntra && useradd -r -g vayuntra vayuntra

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# Switch to non-root user
USER vayuntra

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
