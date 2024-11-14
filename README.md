# TetriTracker - Tournament Management System

## Overview  

TetriTracker is a tournament management system designed for organizing and managing competitive gaming tournaments.

## Getting Started  

### Frontend Setup

Navigate into frontend directory, install dependencies and run application

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

Navigate into backend directory

```bash
cd backend
docker-compose up --build
```

Create .env files for each service

#### Database configuration

Add the database url into the env file for each service.

Example structure using AWS RDS:
```
DATABASE_URL="postgresql+asyncpg://[username]:[password]@[database-instance-identifier].[unique-id].[region].rds.amazonaws.com:[port]/[database-name]"
```

Currently the docker compose file is set for local development. To use AWS or another non local database, remove the local database dependency in the docker compose file.

For local development:
```
DATABASE_URL="postgresql+asyncpg://postgres:postgres@local-postgres:5432/database-cs203"
```

Additionally, add these into the env for the following services on top of the database configuration above:

#### Auth Service

FROM EMAIL={Email for verification}  
FROM_PASSWORD={Password for verification}  
SECRET_KEY={Secret Key}  
ALGORITHM={Algorithm}  
ACCESS_TOKEN_EXPIRE_MINUTES=30  
PLAYER_SERVICE_URL=http://player-service:8000 // For local now - replace with deployed url  
RATING_SERVICE_URL=http://rating-service:8000 // For local now - replace with deployed url  
ANALYTICS_SERVICE_URL = http://analytics-service:8000 // For local now - replace with deployed url  


#### Matchmaking service

PLAYER_SERVICE_URL=http://player-service:8000 // For local now - replace with deployed url  

#### Player service

Set up a AWS S3 bucket

AWS_ACCESS_KEY_ID={Access key}
AWS_SECRET_ACCESS_KEY={AWS secret access key}
AWS_REGION={AWS region}
S3_BUCKET_NAME={Bucket name}

#### Telegram service

TELEGRAM_TOKEN={Telegram token}

## Features

- User Authentication (Admin/Player roles)
- Tournament Management
- Player Rating System
- Real-time Matchmaking
- Tournament Analytics
- Reddit Integration for Tetris community updates
- Telegram Bot Integration
- AWS Integration for deployment
- Profile Picture Management with S3

## Architecture

### Frontend

- Next.js 14
- TailwindCSS
- Shadcn/UI Components
- Zustand for State Management

### Backend Microservices

Local ports are listed. Use necessary endpoints for deployed routes.

- Auth Service (Port: 8001)
- Player Service (Port: 8002)
- Tournament Service (Port: 8003)
- Matchmaking Service (Port: 8004)
- Rating Service (Port: 8005)
- Admin Service (Port: 8006)
- Analytics Service (Port: 8007)
- Telegram Bot Service

## Prerequisites

- Node.js (v18 or higher)
- Python 3.12
- Docker
- AWS Account (for production deployment)
- AWS CLI for development
- PostgreSQL