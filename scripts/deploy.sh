#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Starting deployment process..."

# Build the project
echo "Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "${RED}Build failed!${NC}"
    exit 1
fi

# Run tests
echo "Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "${RED}Tests failed!${NC}"
    exit 1
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod
if [ $? -ne 0 ]; then
    echo "${RED}Deployment failed!${NC}"
    exit 1
fi

echo "${GREEN}Deployment successful!${NC}"

# Run health checks
echo "Running health checks..."
curl -f https://your-domain.com/api/health
if [ $? -ne 0 ]; then
    echo "${RED}Health check failed!${NC}"
    exit 1
fi

echo "${GREEN}All checks passed!${NC}" 