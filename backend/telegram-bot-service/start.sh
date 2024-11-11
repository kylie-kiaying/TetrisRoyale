#!/bin/bash

# Wait for database to be ready
echo "Waiting for database..."
sleep 5

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Start the bot
echo "Starting Telegram bot..."
python -m app.main