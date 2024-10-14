FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    cmake \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

COPY app/whr /app/whr

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

WORKDIR /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]