# Compliance Mapping — Vayuntra Phase 1

## NIST SP 800-53 Rev 5

| Control ID | Control Name | Vayuntra Implementation | Status |
|---|---|---|---|
| AC-6 | Least Privilege | RBAC UI placeholders; enforcement Phase 2 | 🔜 Partial |
| AU-2 | Event Logging | Structured JSON logging on all API events | ✅ Phase 1 |
| AU-9 | Protection of Audit Information | Append-only log design; separate sink Phase 2 | 🔜 Partial |
| CM-2 | Baseline Configuration | Docker Compose + ENV-driven config | ✅ Phase 1 |
| CM-6 | Configuration Settings | .env.example template; no hardcoded values | ✅ Phase 1 |
| SC-8 | Transmission Confidentiality | TLS via Nginx reverse proxy — Phase 2 | 🔜 Planned |
| SI-4 | System Monitoring | Isolation Forest continuous telemetry analysis | ✅ Phase 1 |
| SI-3 | Malware Protection | Process isolation + termination engine | ✅ Phase 1 |
| IR-4 | Incident Handling | Isolation workflow + audit trail | ✅ Phase 1 |
| SA-11 | Developer Security Testing | Trivy scan in GitHub Actions CI/CD | ✅ Phase 1 |

## SOC 2 Type II Alignment

| Trust Service Criteria | Implementation | Status |
|---|---|---|
| CC6.1 — Logical access | RBAC placeholder (enforcement Phase 2) | 🔜 Partial |
| CC7.2 — System monitoring | Anomaly detection engine | ✅ Phase 1 |
| CC7.3 — Anomaly evaluation | Isolation Forest + scoring | ✅ Phase 1 |
| CC8.1 — Change management | PR workflow + branch protection | ✅ Phase 1 |
| A1.1 — Availability monitoring | Docker health checks | ✅ Phase 1 |

## ISO 27001:2022 (Future Target)

| Clause | Description | Target Phase |
|---|---|---|
| 8.16 | Monitoring activities | Phase 1 ✅ |
| 5.7 | Threat intelligence | Phase 2 |
| 8.8 | Management of technical vulnerabilities | Phase 1 ✅ |
