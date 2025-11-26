#!/bin/bash

# Test script to verify PartKasa application is working

echo "=== PartKasa System Status Check ==="
echo

echo "1. Checking API Gateway health..."
curl -s http://localhost:8000/health || echo "API Gateway not responding"
echo

echo "2. Checking Web Application..."
curl -s http://localhost:3000 | grep -q "PartKasa" && echo "Web app is running" || echo "Web app not responding"
echo

echo "3. Testing Registration Endpoint..."
response=$(curl -s -w "%{http_code}" -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}' \
  -m 10)

if [ $? -eq 0 ]; then
    echo "Registration endpoint responded with status: $response"
else
    echo "Registration endpoint timeout or error"
fi
echo

echo "=== Status Summary ==="
docker-compose ps