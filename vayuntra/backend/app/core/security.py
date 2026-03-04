# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

# Phase 1: Security module placeholder
# Phase 2: JWT token validation, RBAC enforcement

SECURE_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cache-Control": "no-store",
}


def get_secure_headers() -> dict:
    """
    Return security headers to be applied to all API responses.
    Phase 2: Add Content-Security-Policy, HSTS.
    """
    return SECURE_HEADERS
