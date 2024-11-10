#!/bin/bash

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose down
docker-compose -f docker-compose.test.yml down

# Start the test environment
echo "Starting test environment..."
docker-compose -f docker-compose.test.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
until curl -s http://localhost:8001/auth > /dev/null; do
    echo "Waiting for auth service..."
    sleep 2
done
echo "Auth service is ready"

# Run the tests
echo "Running tests..."
pytest integration_tests/flows -v

# Capture the test result
TEST_RESULT=$?

# Clean up
echo "Cleaning up test environment..."
docker-compose -f docker-compose.test.yml down

# Exit with the test result
exit $TEST_RESULT