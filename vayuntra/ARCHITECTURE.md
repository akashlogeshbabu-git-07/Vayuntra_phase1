# Architecture Decision Record — Vayuntra

## System Architecture

### Design Principles

1. **Separation of Concerns** — Each module handles a single responsibility
2. **Environment Parity** — Docker ensures dev/prod consistency
3. **Auditability First** — Every action is logged with correlation IDs
4. **No Runtime Training** — ML model is pre-trained; no live retraining in API path
5. **Stateless API** — All state persisted to PostgreSQL; API is horizontally scalable

---

## Component Rationale

### PostgreSQL
- Enterprise-aligned relational integrity
- ACID compliance for audit trail
- Future: partitioning for time-series metrics at scale

### FastAPI
- Async-capable, high throughput
- Auto-generated OpenAPI documentation
- Type-safe request/response via Pydantic schemas

### Isolation Forest (Scikit-learn)
- Unsupervised anomaly detection — no labeled data required
- Efficient on high-dimensional telemetry
- Configurable contamination parameter for sensitivity tuning
- **No live retraining in API runtime** — model artifact loaded at startup

### Docker
- Environment parity across dev/staging/production
- Non-root execution for security hardening
- Compose for local orchestration; Kubernetes-ready for enterprise

### React + Vite
- Component-driven SOC dashboard architecture
- Fast HMR for development velocity
- Modular page/component structure for scalability

---

## Data Flow

```
[System Telemetry] 
    → POST /metrics/
    → AnomalyEngine.detect_anomaly(cpu, memory, network)
    → IsolationForest.predict()
    → Persist to PostgreSQL (metrics + anomalies tables)
    → Return JSON response
    → Frontend polls / receives anomaly flag
    → IsolationEngine triggered if anomaly == True
    → Audit log entry written
```

---

## Security Architecture

- Secrets: ENV vars only (Phase 1) → HashiCorp Vault (Phase 2)
- TLS: Planned for Phase 2 (Nginx reverse proxy)
- RBAC: Placeholder in frontend; enforcement in Phase 2
- Logging: Structured JSON; immutable append-only design
- Container: Non-root user; minimal base image

---

## Scalability Path

| Stage | Deployment |
|---|---|
| Phase 1 | Docker Compose (single host) |
| Phase 2 | Kubernetes (multi-node) |
| Phase 3 | Managed cloud (EKS/AKS/GKE) |

---

## Future Extraction Candidates

The modular backend design allows extraction to microservices:

- `anomaly-service` — ML inference only
- `isolation-service` — Containment actions only
- `audit-service` — Immutable log sink
- `telemetry-ingestor` — Metrics collection only
