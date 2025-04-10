# WORLD 8 APOCALYPSE

A retro-inspired missile command game with Internet Computer integration for wallet payments and high scores.

Version: v1.2.0  
Last Updated: 2023-11-14

## Overview

WORLD 8 APOCALYPSE is a modern take on the classic arcade game Missile Command. Defend your cities from incoming missiles, score points, and submit your high scores to a global leaderboard powered by the Internet Computer blockchain.

## Features

- Retro-inspired gameplay with modern enhancements
- Multiple enemy missile types and bonus targets
- Progressive difficulty and level advancement
- Internet Computer integration for payments and high scores
- Mobile and desktop support
- Mock wallet support for development and testing

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm start
   ```

## Testing Tools

### Test Suite

Located at `tests/test-suite.html`, the test suite provides tools for verifying game functionality:

- **Game Mechanics Tests**: Tests core game mechanics like missile movement, explosions, bonus targets, level progression, and object pooling
- **Integration Tests**: Tests interactions between different components including wallet-payment flow, game-high score integration, and URL parameter passing
- **Performance Monitor**: Measures and reports on FPS, memory usage, and object pool efficiency
- **Wallet Integration Tests**: Verifies wallet connection and payment flow
- **Sound Tests**: Verifies audio loading and playback
- **Mobile Compatibility Tests**: Tests responsive design and mobile detection

To run the test suite:
1. Navigate to `http://localhost:8000/tests/test-suite.html`
2. Click on the test buttons to run individual tests or "Run All" buttons for test groups

### Performance Monitor

The performance monitor (`performance-monitor.js`) can be used in the test suite or integrated into the game for real-time performance measurement.

Features:
- FPS tracking
- Memory usage monitoring
- Asset loading time measurement
- Object pool efficiency tracking
- Event handler counting

Usage example:
```javascript
// Initialize the monitor
const monitor = new PerformanceMonitor({
    showVisualDisplay: true, // Shows an overlay with real-time stats
    trackMemory: true,
    trackFPS: true
});

// Start monitoring
monitor.start({
    missile: missilePool,
    counterMissile: counterMissilePool,
    explosion: explosionPool
});

// Later, get a performance report
const report = monitor.getReport();
console.log(report);

// Stop monitoring when done
monitor.stop();
```

## Deployment

### Using the Deployment Script

The `deploy.sh` script automates the deployment process:

```bash
# Deploy to test network
./deploy.sh test

# Deploy to production network
./deploy.sh production

# Create a backup
./deploy.sh backup

# Roll back to previous version
./deploy.sh rollback
```

### Manual Deployment

1. Backup current version:
   ```bash
   cp index.html index.html.bak-$(date +%Y%m%d)
   cp high-score.html high-score.html.bak-$(date +%Y%m%d)
   ```

2. Deploy to Internet Computer:
   ```bash
   # Test network
   dfx deploy --network ic_test
   
   # Production network
   dfx deploy --network ic
   ```

## Project Structure

- `index.html` - Main game file
- `high-score.html` - High score submission page
- `plug-wallet.js` - Enhanced Plug Wallet integration
- `payment-integration.js` - Payment flow integration
- `*.wav` - Game sound effects
- `tests/` - Testing tools and scripts
- `backups/` - Backup files for previous versions

## Wallet Integration

The game uses the Plug Wallet for Internet Computer integration:

- Real wallet functionality when the extension is available
- Mock wallet functionality for testing and development
- Mobile support via QR code for wallet connections

## High Score System

The high score system is powered by an Internet Computer canister:

- Submit scores with player name, score, and level
- View global high scores sorted by top scores
- Requires wallet connection to submit scores
- Falls back to mock data if the backend is unavailable

## Development Phases

1. Phase 1: Core Game Mechanics
2. Phase 2: Wallet Integration (Mock)
3. Phase 3: Backend Integration
4. Phase 4: Live Payment Flow
5. Phase 5: High Score Integration
6. Phase 6: Testing & Refinement
7. Phase 7: Deployment

## License

© 2023 World 8 Studios. All rights reserved. 