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
COPY BACKEND/python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY BACKEND/python/ .


# --------- FINAL IMAGE (Node backend + frontend + python) ---------
FROM node:22-slim
WORKDIR /app

# Copy root Node backend (with package.json)
COPY package*.json ./
RUN npm install

COPY . .

# Copy built frontend → serve from backend/public
COPY --from=frontend /frontend/dist ./BACKEND/public

# Copy Python ML service
COPY --from=python-backend /python ./BACKEND/python

# Expose backend port
EXPOSE 10000

# Start Node backend
CMD ["node", "BACKEND/index.js"]
