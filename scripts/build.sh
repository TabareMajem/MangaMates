#!/bin/bash

# Clean up
echo "Cleaning up..."
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps --no-audit

# Environment validation
echo "Validating environment..."
if [ ! -f .env.local ]; then
  echo "Error: .env.local file is missing"
  exit 1
fi

# Type checking
echo "Type checking..."
npx tsc --noEmit

# Linting with auto-fix
echo "Linting..."
npm run lint:fix

# Building
echo "Building..."
NODE_ENV=production npx next build
