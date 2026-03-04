# Risk Register — Vayuntra Phase 1

| Risk ID | Risk Description | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|---|
| R-001 | Model poisoning via adversarial inputs | Medium | High | No live retraining; static artifact loaded at startup | ✅ Mitigated |
| R-002 | Unauthorized database access | High | Critical | Strong credentials + network isolation via Docker | ✅ Mitigated |
| R-003 | Container escape | Low | Critical | Non-root container execution; minimal base image | ✅ Mitigated |
| R-004 | Log tampering | Medium | High | Append-only logging design; separate log sink (Phase 2) | 🔜 Partial |
| R-005 | Secret exposure in repository | High | Critical | .gitignore enforced; .env never committed | ✅ Mitigated |
| R-006 | API endpoint abuse (no auth) | High | High | RBAC enforcement planned Phase 2 | 🔜 Planned |
| R-007 | False positive isolation (business impact) | Medium | High | Confidence threshold + manual override endpoint | ✅ Mitigated |
| R-008 | Dependency vulnerability | Medium | High | Trivy scan in CI/CD pipeline | ✅ Mitigated |
| R-009 | ML model bias / drift | Medium | Medium | Model versioning + periodic offline evaluation | 🔜 Planned |
| R-010 | Data exfiltration via API | Low | Critical | Network isolation + TLS (Phase 2) | 🔜 Planned |

## Residual Risk Acceptance

Phase 1 residual risks (R-004, R-006, R-010) are accepted with documented mitigations planned for Phase 2. Risk owner: CISO.
