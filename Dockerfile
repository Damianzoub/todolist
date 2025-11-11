# Build React Frontend
FROM node:18-alphine AS frontend-build

WORKDIR /app/frontend

COPY Todo_App/static/react/package*.json ./

RUN npm install 

COPY Todo_App/static/react .

RUN npm run build

#Build  the Python Backend
FROM python:3.10-slim AS backend 

LABEL maintainer="TodoList Maintainer "

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app 

COPY requirements.txt ./
RUN  pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt 

COPY Todo_App ./Todo_App
COPY run.py .

COPY --from=frontend-build /app/frontend/dist ./Todo_App/static/react

EXPOSE 5000 

CMD ["gunicorn","--workers","4","--bind","0.0.0.0:5000","run:app"]