# WORLD 8 APOCALYPSE

A modern remake of the classic Atari Missile Command game with Internet Computer blockchain integration.

![Game Screenshot](https://user-images.githubusercontent.com/2433219/99129481-f2ad5780-25ca-11eb-9552-0cad07a1349e.png)

## Project Overview

WORLD 8 APOCALYPSE is a reimagining of the classic Atari Missile Command game with enhanced features:

- Multiple difficulty levels with increasing challenges
- City health system with damage indicators
- Level progression with unique color schemes for each level
- Plug Wallet integration for ICP payments (0.01 ICP per game)
- High score system backed by Internet Computer canister

## Repository Structure

- `/Apocolypse` - Main game directory
  - Game HTML/JS files
  - Deployment scripts
  - Documentation
  - Internet Computer configuration
  - High score integration
- `/.cursor` - Development notes and todo lists

## Internet Computer Integration

This game is designed to be deployed to the Internet Computer blockchain platform:

- Frontend assets canister (`world8_apocalypse`)
- Backend Motoko canister for high scores (`world8_backend`)
- Integration with Plug Wallet for ICP payments

## Deployment

See the detailed [README in the Apocolypse directory](Apocolypse/README.md) for deployment instructions.

## License

All rights reserved. © 2023 