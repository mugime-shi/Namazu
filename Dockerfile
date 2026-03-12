# ─── base: shared setup ──────────────────────────────────────────────────────
FROM python:3.12-slim AS base

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/app ./app

# ─── dev: local docker-compose (no Lambda adapter needed) ────────────────────
FROM base AS dev
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ─── lambda: AWS Lambda via Lambda Web Adapter ───────────────────────────────
# Build with: docker build --target lambda -t unagi-api .
# Requires: docker login public.ecr.aws (or AWS credentials)
FROM base AS lambda
COPY --from=public.ecr.aws/awsguru/aws-lambda-web-adapter:0.8.4 \
     /lambda-adapter /opt/extensions/lambda-adapter
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
