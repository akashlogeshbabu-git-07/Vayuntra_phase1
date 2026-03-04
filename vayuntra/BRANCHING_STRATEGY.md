# Branching Strategy — Vayuntra

## Branch Model

```
main (protected — production)
  └── develop (integration branch)
        ├── feature/anomaly-engine
        ├── feature/isolation-api
        ├── feature/frontend-dashboard
        └── hotfix/critical-patch
```

## Branch Rules

### main
- Protected. No direct push allowed.
- Merges only via approved PR from `develop`
- Requires: 1 PR approval + CI pass + Security scan pass
- Signed commits required

### develop
- Integration branch. Feature branches merge here.
- Requires: PR review + CI pass
- Auto-deploy to staging (Phase 2)

### feature/*
- Created from `develop`
- Named: `feature/<short-description>`
- Merge back to `develop` via PR

### hotfix/*
- Created from `main`
- Merged to both `main` and `develop`
- Emergency patches only

## Commit Convention

```
feat: add isolation engine endpoint
fix: correct anomaly score threshold
docs: update compliance mapping
chore: update dependencies
security: patch CVE-XXXX-XXXX
```

## Git Operations

### Fedora CLI
```bash
git pull origin develop
git checkout -b feature/your-feature
# work...
git add .
git commit -S -m "feat: description"
git push origin feature/your-feature
# Open PR via GitHub
```

### VS Code
- Use built-in SCM panel
- Enforce PR workflow — no force push
- Commit signing via GPG
