# Copyright 2026 Vayuntra
# Licensed under the Apache License, Version 2.0

import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:admin@db:5432/vayuntra")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
SECRET_KEY = os.getenv("SECRET_KEY", "change_this_in_production")
ML_MODEL_PATH = os.getenv("ML_MODEL_PATH", "./models/model.joblib")
