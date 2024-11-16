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

Add this to your frontend env file if running backend locally. Else, change to deployed endpoint:  

```
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8001
NEXT_PUBLIC_PLAYER_SERVICE_URL=http://localhost:8002
NEXT_PUBLIC_TOURNAMENT_SERVICE_URL=http://localhost:8003
NEXT_PUBLIC_MATCHMAKING_SERVICE_URL=http://localhost:8004
NEXT_PUBLIC_RATING_SERVICE_URL=http://localhost:8005
NEXT_PUBLIC_ADMIN_SERVICE_URL=http://localhost:8006
NEXT_PUBLIC_ANALYTICS_SERVICE_URL=http://localhost:8007
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
PLAYER_SERVICE_URL=http://player-service:8000 // For local - replace with deployed url  
RATING_SERVICE_URL=http://rating-service:8000 // For local - replace with deployed url  
ANALYTICS_SERVICE_URL = http://analytics-service:8000 // For local - replace with deployed url  


#### Matchmaking service

PLAYER_SERVICE_URL=http://player-service:8000 // For local - replace with deployed url  

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

## Prerequisites

- Node.js (v18 or higher)
- Python 3.12
- Docker
- AWS Account (for production deployment)
- AWS CLI for development
- PostgreSQL

To enable CI/CD pipeline for AWS build, add AWS_ACCOUNT_ID, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY into github secrets, and uncomment the aws-build.yml file in .github/workflows for automatic building of Docker images and pushing into AWS ECR repository.  