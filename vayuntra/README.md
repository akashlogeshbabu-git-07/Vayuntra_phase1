# VAYUNTRA

**ML-Driven Autonomous Anomaly Detection & AI Remediation System**

> Enterprise-grade cybersecurity platform — Phase 1 (50% Completion)

---

## Executive Summary

Vayuntra is an AI-powered autonomous anomaly detection and remediation system designed for enterprise-scale deployment. It leverages unsupervised machine learning (Isolation Forest) to detect behavioral deviations in system telemetry, trigger automated isolation workflows, and maintain a full audit trail aligned to NIST 800-53 and SOC 2 controls.

---

## Architecture Overview

```
Telemetry Ingestion → Anomaly Engine (Isolation Forest) → Decision Layer → Isolation Engine → Audit Log
                                        ↓
                              PostgreSQL (Persistent Store)
                                        ↓
                          React SOC Dashboard (Frontend)
```

---

## System Components

| Component | Technology | Status |
|---|---|---|
| Backend API | FastAPI (Python) | ✅ Phase 1 |
| Database | PostgreSQL 15 | ✅ Phase 1 |
| Anomaly Engine | Scikit-learn Isolation Forest | ✅ Phase 1 |
| Containerization | Docker + Docker Compose | ✅ Phase 1 |
| Frontend Dashboard | React + Vite | ✅ Phase 1 |
| CI/CD Pipeline | GitHub Actions | ✅ Phase 1 |
| Isolation Engine | Process Containment | ✅ Phase 1 |
| RBAC | Role-Based Access | 🔜 Phase 2 |
| LLM Remediation | AI Auto-Remediation | 🔜 Phase 3 |
| Federated Learning | Multi-node ML | 🔜 Phase 3 |

---

## Tech Stack

- **Backend**: Python 3.11, FastAPI, SQLAlchemy, Alembic
- **Database**: PostgreSQL 15
- **ML Engine**: Scikit-learn (Isolation Forest)
- **Frontend**: React 18, Vite, Tailwind CSS
- **Infrastructure**: Docker, Docker Compose
- **CI/CD**: GitHub Actions, Trivy (security scan)
- **License**: Apache License 2.0

---

## Deployment

### Local (Development)

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/vayuntra.git
cd vayuntra

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Run stack
docker compose -f infrastructure/docker-compose.yml up --build
```

### Access Points

| Service | URL |
|---|---|
| API (Swagger) | http://localhost:8000/docs |
| Frontend Dashboard | http://localhost:5173 |
| PostgreSQL | localhost:5432 |

---

## Security Posture

- No secrets committed to repository
- Environment variable injection only
- Non-root Docker containers
- Append-only audit logging design
- Branch protection enforced (main/develop)
- Signed commits required
- Trivy vulnerability scan in CI/CD

---

## Compliance Alignment

### NIST 800-53

| Control | Implementation |
|---|---|
| AC-6 | Least privilege (RBAC placeholder) |
| AU-2 | Audit event logging |
| SC-8 | TLS encryption (Phase 2) |
| CM-2 | Configuration management via ENV |
| SI-4 | System monitoring (anomaly engine) |

### SOC 2

- Change management via PR workflow
- Structured logging controls
- Secure deployment pipeline
- Environment segregation

---

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| Phase 1 | Core API + ML Engine + Dashboard + Docker | ✅ 50% |
| Phase 2 | RBAC + TLS + Structured Logging + Kubernetes | 🔜 |
| Phase 3 | LLM Remediation + Federated Learning + Multi-tenant | 🔜 |
| Enterprise | Managed Cloud Deployment + SOC Integration | 🔜 |

---

## Contribution Model

See `CONTRIBUTING.md`. All contributions require:
- Feature branch off `develop`
- PR review (minimum 1 approver)
- CI/CD pass
- Security scan pass

---

## Reporting Vulnerabilities

See `SECURITY.md`. Do NOT open public issues for security vulnerabilities.

Contact: security@vayuntra.internal

---

## License

Copyright 2026 Vayuntra  
Licensed under the Apache License, Version 2.0  
See `LICENSE` for full terms.
