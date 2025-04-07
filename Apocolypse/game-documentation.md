# WORLD 8 Apocalypse - Game Documentation

This document tracks the development progress and changes made to the WORLD 8 Apocalypse game.

## Game Overview

WORLD 8 Apocalypse is based on the classic Atari Missile Command game, with enhanced features and modern gameplay mechanics. The player defends cities from incoming missiles by launching counter-missiles from silos. The game has been optimized for performance and now includes blockchain integration via the Internet Computer Protocol (ICP).

## Core Game Features

### Game States
- **Title Screen**: Displays the game title "WORLD 8 APOCALYPSE" with an animated flashing effect, wallet connection and START GAME buttons
- **Playing State**: The main gameplay state with missiles, cities, silos, and scoring
- **Game Over State**: Displayed when all cities are destroyed or all silos are destroyed

### Game Mechanics
1. **Missile Defense System**:
   - Three missile silos positioned at the bottom of the screen
   - Each silo can hold up to 10 counter-missiles
   - Maximum of 3 active counter-missiles on screen at once
   - Counter-missiles fired by clicking on the screen; the closest silo with available missiles will fire
   - Visual indicators showing current missile count below each silo

2. **City Health System**:
   - Six cities positioned along the bottom of the screen
   - Each city has 3 health points
   - Cities are damaged when hit by enemy missiles
   - Cities are destroyed when health reaches zero
   - Visual health indicators show current city health (green for healthy, red for damaged)

3. **Enemy Missiles**:
   - Enemy missiles spawn from various points at the top of the screen
   - Missiles target cities and silos
   - Missile speed and frequency increase with difficulty progression
   - Missiles can be destroyed by counter-missile explosions

4. **Bonus Targets**:
   - Two types of bonus targets: UFOs (100 points) and Satellites (200 points)
   - Targets appear randomly and move in patterns across the screen
   - Shooting a bonus target rewards points and creates a special explosion

5. **Level System**:
   - 5 unique levels with increasing difficulty
   - Each level has a distinctive color scheme
   - Level parameters include missile speed, count, and spawn interval
   - Level completion rewards bonus points based on surviving cities and silos

6. **Scoring System**:
   - 25 points for each destroyed enemy missile
   - 100 points for bonus UFO targets
   - 200 points for bonus Satellite targets
   - Bonus points awarded for surviving cities and remaining missiles when completing a level

### Visual Elements
1. **Title Screen**:
   - Animated "WORLD 8 APOCALYPSE" title with flashing effect
   - START GAME button (enabled after wallet connection)
   - Connect Wallet button for ICP integration
   - Payment information showing required fee

2. **Background**:
   - Pixel art city skyline in grayscale at 25% opacity
   - Buildings with randomly placed windows for variety
   - Positioned to create depth with the gameplay elements

3. **Game Interface**:
   - Score display
   - Level indicator with level-specific color
   - Missile availability indicators
   - City health indicators
   - Ground terrain with missile silos
   - Missile count displays beneath each silo

4. **Special Effects**:
   - Explosions with expanding and contracting animation
   - Color changes based on current level
   - Message notifications for important events
   - Flashing "GAME OVER GEEZER" screen with neon yellow PLAY AGAIN button

## Special Features

1. **Missile Refill System**:
   - Every 500 points, all active silos are refilled to full capacity (10 missiles each)
   - "MISSILES REFILLED!" message displayed when this occurs

2. **Dynamic Difficulty Scaling**:
   - Difficulty increases by 10% every 300 points (upgraded from 3%)
   - Affects missile speed across all levels
   - "DIFFICULTY INCREASED!" message displayed when this occurs

3. **Apocalypse Warning**:
   - "WORLD 8 APOCALYPSE" message displayed every 1050 points
   - Dramatic red flashing effect

4. **Game Over Screen**:
   - "GAME OVER GEEZER!!" message with flashing effect
   - Neon yellow PLAY AGAIN button with glow effect and hover animation
   - Prominent popup modal with pulsing border effects

5. **Internet Computer Integration**:
   - Plug Wallet integration allowing players to connect their ICP wallet
   - 0.01 ICP fee to play or restart the game
   - Payments sent to specified Principal ID (PID)
   - Balance verification before gameplay
   - Success/failure notifications for payment transactions

## Technical Implementation

1. **Game Loop**:
   - RequestAnimationFrame-based game loop
   - Delta time calculation for consistent animations
   - State-based rendering and updates

2. **Collision Detection**:
   - Distance-based collision detection for missiles and explosions
   - Hit detection for bonus targets
   - Vector-based movement for accurate missile targeting

3. **Object Management**:
   - Object pooling system for missiles, counter-missiles, and explosions
   - Arrays to track active game objects
   - Object cleanup and reuse for better memory management
   - Deep copying for game state reset

4. **Game State Management**:
   - Title, Playing, and Game Over states
   - State-specific UI display
   - Clean transitions between states

5. **Internet Computer Integration**:
   - Plug Wallet SDK integration
   - Asynchronous payment processing
   - Wallet connection state management
   - ICP transfer handling and verification

## Optimization Techniques

1. **Object Pooling**:
   - Reuse of missile, counter-missile, and explosion objects
   - Reduced memory allocation and garbage collection
   - Improved performance during intense gameplay

2. **Efficient Memory Management**:
   - In-place array modifications instead of creating new arrays
   - Object property reuse with Object.assign()
   - Smart cleanup of inactive game objects

3. **Render Optimization**:
   - Conditional rendering based on game state
   - Minimal DOM updates
   - Efficient canvas drawing techniques

4. **Event Handling**:
   - Optimized click handlers with target filtering
   - Debounced payment processing
   - Proper event cleanup to prevent memory leaks

## Blockchain Integration

1. **Plug Wallet SDK**:
   - Wallet connection management
   - Balance checking functionality
   - ICP transfer capabilities
   - Error handling for wallet operations

2. **Payment System**:
   - Fixed 0.01 ICP fee per game
   - Payments directed to specific Principal ID
   - Payment verification before gameplay
   - User feedback for payment status

3. **User Experience**:
   - Visual indicators for wallet connection status
   - Clear payment instructions and feedback
   - Graceful error handling for payment failures
   - Seamless integration with game flow

4. **Security Considerations**:
   - Secure wallet connection process
   - Verification of payment completion
   - Proper error handling for failed transactions
   - Fee validation before gameplay

## Deployment Instructions

### Local Testing

To test the game locally with Internet Computer integration:

1. Install the DFINITY Canister SDK:
   ```
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

2. Initialize a new project:
   ```
   dfx new world8_apocalypse
   cd world8_apocalypse
   ```

3. Replace the default files with the game files:
   - Replace `src/world8_apocalypse_frontend/src/index.html` with the game HTML
   - Add game assets to the assets directory

4. Start a local replica:
   ```
   dfx start --background
   ```

5. Deploy the project locally:
   ```
   dfx deploy
   ```

### Production Deployment

To deploy to the Internet Computer mainnet:

1. Make sure you have sufficient ICP for cycles:
   ```
   dfx wallet balance
   ```

2. Configure your project for mainnet:
   ```
   dfx deploy --network ic
   ```

3. Convert ICP to cycles if needed:
   ```
   dfx wallet --network ic convert-icp --amount <amount> --icp
   ```

## Future Enhancements

1. **Multiplayer Capabilities**:
   - Player vs. player mode
   - Cooperative defense gameplay
   - Leaderboards and rankings

2. **Blockchain-specific Features**:
   - NFT rewards for high scores
   - Token-based upgrades
   - On-chain leaderboard

3. **Enhanced Visuals**:
   - More detailed city graphics
   - Advanced particle effects
   - Weather and time-of-day variations

4. **Mobile Support**:
   - Touch controls optimization
   - Responsive layout for different screen sizes
   - Mobile wallet integration

## Game Functions Reference

### Core Game Functions
- `