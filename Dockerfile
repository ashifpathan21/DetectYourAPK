# --------- FRONTEND BUILD ---------
FROM node:22-slim AS frontend
WORKDIR /frontend
COPY FRONTEND/package*.json ./
RUN npm install
COPY FRONTEND/ .
RUN npm run build

# --------- PYTHON ML SERVICE ---------
FROM python:3.11-slim AS python-backend
WORKDIR /python

# Install system dependencies needed for Python packages
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

COPY BACKEND/python/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
COPY BACKEND/python/ .

# --------- FINAL IMAGE (Node backend + frontend + python) ---------
FROM node:22-slim
WORKDIR /app

# Install Python in the final image since you're using python-shell
RUN apt-get update && apt-get install -y python3 && rm -rf /var/lib/apt/lists/*

# Copy root Node backend (with package.json)
COPY package*.json ./
RUN npm install

COPY . .

# Copy built frontend → serve from backend/public
COPY --from=frontend /frontend/dist ./BACKEND/public

# Copy Python ML service
COPY --from=python-backend /python ./BACKEND/python
COPY --from=python-backend /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Expose backend port
EXPOSE 10000

# Start Node backend
CMD ["node", "BACKEND/index.js"]