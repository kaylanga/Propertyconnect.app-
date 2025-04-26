#!/bin/bash
# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
# Check if NETLIFY_AUTH_TOKEN is set
if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
    echo "${RED}Error: NETLIFY_AUTH_TOKEN is not set${NC}"
    exit 1
fi
# Build the project
echo "Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "${RED}Build failed!${NC}"
    exit 1
fi
# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod --dir=dist
if [ $? -ne 0 ]; then
    echo "${RED}Deployment failed!${NC}"
    exit 1
fi
echo "${GREEN}Deployment successful!${NC}"
    exit 1
fi
echo "${GREEN}Deployment successful!${NC}"