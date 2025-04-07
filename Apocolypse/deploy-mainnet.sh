#!/bin/bash

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "dfx is not installed. Installing DFINITY Canister SDK..."
    sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
fi

# Create necessary directories if they don't exist
mkdir -p src/world8_apocalypse

# Check if user is logged in
echo "Checking if you're logged in to the Internet Computer..."
dfx identity get-principal || {
    echo "Please create or import an identity with 'dfx identity new' or 'dfx identity import'"
    exit 1
}

# Check wallet balance
echo "Checking your ICP wallet balance..."
dfx wallet --network ic balance || {
    echo "Please create a cycles wallet with 'dfx wallet --network ic create-wallet'"
    exit 1
}

# Confirm deployment
echo "You are about to deploy World 8 Apocalypse to the IC mainnet."
echo "This will cost cycles from your wallet."
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

# Deploy to mainnet
echo "Deploying World 8 Apocalypse to mainnet..."
dfx deploy --network ic

# Get the canister URLs
FRONTEND_ID=$(dfx canister --network ic id world8_apocalypse)
BACKEND_ID=$(dfx canister --network ic id world8_backend)
FRONTEND_URL="https://${FRONTEND_ID}.ic0.app/"
BACKEND_URL="https://${BACKEND_ID}.ic0.app/"

echo "=============================================="
echo "Game deployed successfully!"
echo "Frontend URL: ${FRONTEND_URL}"
echo "Backend Canister ID: ${BACKEND_ID}"
echo "=============================================="
echo "To interact with the backend canister, run:"
echo "dfx canister --network ic call world8_backend getHighScores"
echo "==============================================" 