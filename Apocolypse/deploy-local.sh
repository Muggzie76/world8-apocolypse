#!/bin/bash

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "dfx is not installed. Installing DFINITY Canister SDK..."
    sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
fi

# Create necessary directories if they don't exist
mkdir -p src/world8_apocalypse

# Start the local replica if not already running
dfx start --background --clean

# Wait for the replica to start
sleep 5

# Deploy all canisters
echo "Deploying World 8 Apocalypse to local replica..."
dfx deploy

# Get the canister URLs
FRONTEND_ID=$(dfx canister id world8_apocalypse)
BACKEND_ID=$(dfx canister id world8_backend)
REPLICA_PORT=$(grep "replica-port" .dfx/replica-configuration/replica-1.json | grep -o '[0-9]\+')
FRONTEND_URL="http://localhost:${REPLICA_PORT}/?canisterId=${FRONTEND_ID}"
BACKEND_URL="http://localhost:${REPLICA_PORT}/?canisterId=${BACKEND_ID}"

echo "=============================================="
echo "Game deployed successfully!"
echo "Frontend: ${FRONTEND_URL}"
echo "Backend: ${BACKEND_ID}"
echo "=============================================="
echo "To interact with the backend canister, run:"
echo "dfx canister call world8_backend getHighScores"
echo "=============================================="
echo "To stop the replica, run: dfx stop" 