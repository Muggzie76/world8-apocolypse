#!/bin/bash
# WORLD 8 APOCALYPSE - Deployment Script
# Phase 7 - Deployment Automation
# Usage: ./deploy.sh [test|production]

# Configuration
BACKUP_DIR="./backups/$(date +%Y%m%d)"
NETWORK=${1:-"test"}  # Default to test network if no argument provided
VERSION="v1.2.0"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# Text styling
BOLD="\033[1m"
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
RESET="\033[0m"

# Function to show script usage
show_usage() {
  echo -e "${BOLD}WORLD 8 APOCALYPSE - Deployment Script${RESET}"
  echo "Usage: ./deploy.sh [test|production]"
  echo ""
  echo "Options:"
  echo "  test        Deploy to test network (default)"
  echo "  production  Deploy to production network"
  echo ""
  echo "Examples:"
  echo "  ./deploy.sh            # Deploys to test network"
  echo "  ./deploy.sh test       # Explicitly deploy to test network"
  echo "  ./deploy.sh production # Deploy to production network"
}

# Function to display steps with colored prefix
step() {
  echo -e "${BLUE}[STEP]${RESET} $1"
}

# Function to display success messages
success() {
  echo -e "${GREEN}[SUCCESS]${RESET} $1"
}

# Function to display warnings
warning() {
  echo -e "${YELLOW}[WARNING]${RESET} $1"
}

# Function to display errors
error() {
  echo -e "${RED}[ERROR]${RESET} $1"
}

# Function to backup files
backup_files() {
  step "Creating backup directory: $BACKUP_DIR"
  mkdir -p "$BACKUP_DIR"
  
  step "Backing up current version of files"
  cp index.html "$BACKUP_DIR/index.html"
  cp high-score.html "$BACKUP_DIR/high-score.html"
  
  success "Backup completed"
}

# Function to verify version number in files
verify_version() {
  step "Verifying version number in files"
  
  # Check index.html version
  INDEX_VERSION=$(grep -o 'GAME_VERSION = .v[0-9]\+\.[0-9]\+\.[0-9]\+.' index.html | cut -d"'" -f2)
  if [ "$INDEX_VERSION" != "$VERSION" ]; then
    warning "Version mismatch in index.html: Found $INDEX_VERSION, expected $VERSION"
    read -p "Update version to $VERSION? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      sed -i "" "s/GAME_VERSION = .\(v[0-9]\+\.[0-9]\+\.[0-9]\+\)./GAME_VERSION = '${VERSION}'/g" index.html
      success "Updated index.html version to $VERSION"
    fi
  else
    success "index.html version is correct: $VERSION"
  fi
  
  # Check high-score.html version
  HIGHSCORE_VERSION=$(grep -o 'GAME_VERSION = .v[0-9]\+\.[0-9]\+\.[0-9]\+.' high-score.html | cut -d"'" -f2)
  if [ "$HIGHSCORE_VERSION" != "$VERSION" ]; then
    warning "Version mismatch in high-score.html: Found $HIGHSCORE_VERSION, expected $VERSION"
    read -p "Update version to $VERSION? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      sed -i "" "s/GAME_VERSION = .\(v[0-9]\+\.[0-9]\+\.[0-9]\+\)./GAME_VERSION = '${VERSION}'/g" high-score.html
      success "Updated high-score.html version to $VERSION"
    fi
  else
    success "high-score.html version is correct: $VERSION"
  fi
}

# Function to run tests before deployment
run_tests() {
  step "Running pre-deployment tests"
  
  # Open test suite in default browser
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:8000/tests/test-suite.html"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:8000/tests/test-suite.html"
  elif [[ "$OSTYPE" == "msys" ]]; then
    start "http://localhost:8000/tests/test-suite.html"
  else
    echo "Please open tests/test-suite.html in your browser"
  fi
  
  read -p "Did all tests pass? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    error "Tests failed. Deployment aborted."
    exit 1
  fi
  
  success "Tests passed"
}

# Function to deploy to the specified network
deploy() {
  local network_flag="--network $NETWORK"
  if [ "$NETWORK" == "local" ]; then
    network_flag=""
  fi
  
  step "Deploying to $NETWORK network"
  
  # Move up to main project directory if needed
  if [ -d "../.dfx" ]; then
    cd ..
  fi
  
  # Deploy the application
  dfx deploy $network_flag
  
  if [ $? -eq 0 ]; then
    success "Deployment to $NETWORK network completed"
    
    # Get canister IDs
    if [ "$NETWORK" == "ic" ]; then
      FRONTEND_ID=$(dfx canister --network ic id world8_frontend)
      BACKEND_ID=$(dfx canister --network ic id world8_backend)
      success "Frontend canister deployed: https://$FRONTEND_ID.icp0.io/"
      success "Backend canister deployed: $BACKEND_ID"
    else
      FRONTEND_ID=$(dfx canister id world8_frontend)
      BACKEND_ID=$(dfx canister id world8_backend)
      success "Frontend canister deployed: http://localhost:8000/?canisterId=$FRONTEND_ID"
      success "Backend canister deployed: $BACKEND_ID"
    fi
    
    # Log deployment in deployment history
    echo "$TIMESTAMP - Deployed version $VERSION to $NETWORK network" >> deployment-history.log
  else
    error "Deployment failed!"
    exit 1
  fi
}

# Function to verify deployment
verify_deployment() {
  step "Verifying deployment"
  
  if [ "$NETWORK" == "ic" ]; then
    FRONTEND_ID=$(dfx canister --network ic id world8_frontend)
    # Ping the canister to verify it's responsive
    curl -s "https://$FRONTEND_ID.icp0.io/" > /dev/null
    
    if [ $? -eq 0 ]; then
      success "Deployment verified successfully"
    else
      warning "Could not verify deployment. Please check manually at https://$FRONTEND_ID.icp0.io/"
    fi
  else
    success "Skipping verification for local/test deployment"
  fi
}

# Main execution
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
  show_usage
  exit 0
fi

# Validate network parameter
if [ "$NETWORK" != "test" ] && [ "$NETWORK" != "production" ] && [ "$NETWORK" != "local" ] && [ "$NETWORK" != "ic" ]; then
  error "Invalid network specified: $NETWORK"
  show_usage
  exit 1
fi

# Convert "production" parameter to "ic" for dfx
if [ "$NETWORK" == "production" ]; then
  NETWORK="ic"
fi

echo -e "${BOLD}WORLD 8 APOCALYPSE - Deployment Script${RESET}"
echo "Starting deployment process for version $VERSION to $NETWORK network"
echo "Timestamp: $TIMESTAMP"
echo "----------------------------------------"

backup_files
verify_version
run_tests

echo "----------------------------------------"
echo -e "${YELLOW}Ready to deploy to $NETWORK network${RESET}"
read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  deploy
  verify_deployment
  
  success "Deployment process completed successfully"
else
  warning "Deployment aborted by user"
  exit 0
fi 