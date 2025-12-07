FROM python:3.11-slim

WORKDIR /app

# Install OS deps (postgres, netcat, etc.)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]



