# ---------- FRONTEND BUILD ----------
FROM node:18 AS frontend

WORKDIR /app/ui
COPY ui/package*.json ./
RUN npm install
COPY ui .
RUN npm run build

# ---------- BACKEND RUNTIME ----------
FROM python:3.10-slim

# install node for serving frontend
RUN apt-get update && apt-get install -y nodejs npm

WORKDIR /app

# install python deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy backend
COPY backend ./backend

# copy frontend
COPY --from=frontend /app/ui ./ui

ENV PORT=8000

WORKDIR /app/backend

CMD sh -c "cd /app/ui && npm run start & uvicorn app:app --host 0.0.0.0 --port 8000"