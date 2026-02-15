# ---------- FRONTEND BUILD ----------
FROM node:18 AS frontend

WORKDIR /app/ui
COPY ui/package*.json ./
RUN npm install
COPY ui .
RUN npm run build

# ---------- BACKEND + RUNTIME ----------
FROM node:18

# install python
RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /app

# backend deps
RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /app

COPY backend/requirements.txt .
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install --no-cache-dir -r requirements.txt

COPY backend ./backend

# copy backend
COPY backend ./backend

# copy frontend build
COPY --from=frontend /app/ui ./ui

ENV PORT=8000

WORKDIR /app/backend

CMD sh -c "cd /app/ui && npm run start & python3 app.py"