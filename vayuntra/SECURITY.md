# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.x (Phase 1) | ✅ |

## Reporting a Vulnerability

**Do NOT open a public GitHub issue for security vulnerabilities.**

Report vulnerabilities privately to: security@vayuntra.internal

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested remediation (if known)

We commit to acknowledging reports within 48 hours and providing a resolution timeline within 7 business days.

## Security Controls

- No secrets committed to version control
- Environment variable injection for all credentials
- Non-root container execution
- Trivy vulnerability scanning in CI/CD pipeline
- Signed commits enforced on main branch
- Branch protection rules enforced

## Disclosure Policy

We follow coordinated disclosure. Public disclosure will occur after a patch is available and affected parties have been notified.
