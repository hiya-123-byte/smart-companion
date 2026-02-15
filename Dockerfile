# -------- FRONTEND BUILD --------
FROM node:18 AS frontend

WORKDIR /app/ui
COPY ui/package*.json ./
RUN npm install
COPY ui .
RUN npm run build

# -------- BACKEND --------
FROM python:3.10-slim

WORKDIR /app

# install node (to run next start)
RUN apt-get update && apt-get install -y nodejs npm

# backend deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy backend
COPY backend ./backend

# copy frontend build
COPY --from=frontend /app/ui ./

ENV PORT=8000

WORKDIR /app/backend

CMD sh -c "cd /app && npm run start & python app.py"