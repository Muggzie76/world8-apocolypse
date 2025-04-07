# WORLD 8 APOCALYPSE

A modern remake of the classic Atari Missile Command game, integrated with the Internet Computer blockchain.

## Features

- Classic missile defense gameplay with modern features
- Multiple difficulty levels with increasing challenges
- City health indicators and damage limits
- Plug Wallet integration for ICP payments (0.01 ICP per game)
- Beautiful animations and visual effects
- Responsive design

## Deployment

### Local Testing

To deploy and test locally:

1. Make sure you have the DFINITY Canister SDK installed:
   ```
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

2. Run the local deployment script:
   ```
   chmod +x deploy-local.sh
   ./deploy-local.sh
   ```

3. Open the URL provided in the script output in your browser to play the game locally.

### Mainnet Deployment

To deploy to the Internet Computer mainnet:

1. Make sure you have the DFINITY Canister SDK installed and are logged in.

2. Ensure you have cycles in your wallet for deployment costs.

3. Run the mainnet deployment script:
   ```
   chmod +x deploy-mainnet.sh
   ./deploy-mainnet.sh
   ```

4. Follow the prompts and confirm the deployment.

5. Once deployed, access your game at the URL provided (typically `https://[canister-id].ic0.app/`).

## Development

- `missile-command.html` - Original game without wallet integration
- `missile-command-wallet.html` - Game with Plug Wallet integration
- `dfx.json` - Configuration for IC deployment
- `deploy-local.sh` - Script for local testing
- `deploy-mainnet.sh` - Script for mainnet deployment
- `game-documentation.md` - Detailed documentation

## Requirements for Players

- Internet Computer Plug Wallet browser extension
- Minimum of 0.01 ICP in wallet balance per game
- Modern web browser with JavaScript enabled

## License

All rights reserved. © 2023

# Basic Missile Command HTML and JavaScript Game

This is a basic implementation of the Atari Missile Command game, but it's missing a few things intentionally and they're left as further exploration for the reader.

<img width="300" height="205" alt="" src="https://user-images.githubusercontent.com/2433219/99129481-f2ad5780-25ca-11eb-9552-0cad07a1349e.png">

## Further Exploration

- Score
  - When a missile explodes (not a counter-missile), the score should increase by 25
  - At the end of the level the player should earn 5 bonus points for each missile still in a silo and 100 bonus points for each city still alive
  - See https://atariage.com/manual_html_page.php?SoftwareLabelID=306 Scoring section
- Bonus Targets
  - In each level there are bonus targets that move across the screen that award the player with additional points
- Limit Counter-missile fire rate
  - The player should only be able to fire 3 counter-missiles at a time
- Limit Missile city damage
  - The missiles should only be able to destroy 3 cities per level. See https://en.wikipedia.org/wiki/Missile_Command#Gameplay
  
**Important note:** I will answer questions about the code but will not add more features or answer questions about adding more features. This series is meant to give a basic outline of the game but nothing more.
  
## License

(CC0 1.0 Universal) You're free to use this game and code in any project, personal or commercial. There's no need to ask permission before using these. Giving attribution is not required, but appreciated.

## Other Basic Games

- [Snake](https://gist.github.com/straker/ff00b4b49669ad3dec890306d348adc4)
- [Pong](https://gist.github.com/straker/81b59eecf70da93af396f963596dfdc5)
- [Breakout](https://gist.github.com/straker/98a2aed6a7686d26c04810f08bfaf66b)
- [Tetris](https://gist.github.com/straker/3c98304f8a6a9174efd8292800891ea1)
- [Bomberman](https://gist.github.com/straker/769fb461e066147ea16ac2cb9463beae)
- [Frogger](https://gist.github.com/straker/82a4368849cbd441b05bd6a044f2b2d3)
- [Sokoban](https://gist.github.com/straker/2fddb507d4bb6bec54ea2fdb022d020c)
- [Doodle Jump](https://gist.github.com/straker/b96a4a68bd6d79cf75a833d98a2b654f)
- [Puzzle Bobble](https://gist.github.com/straker/afc5bedc7f4b4bc65ba8b05c435f6d32)
- [Helicopter](https://gist.github.com/straker/0d25ae9d235f6a62f8287fd36a097043)
- [Block Dude](https://gist.github.com/straker/df855f22e57576c80d6126aa5609654e)

## Support

Basic HTML Games are made possible by users like you. When you become a [Patron](https://www.patreon.com/straker), you get access to behind the scenes development logs, the ability to vote on which games I work on next, and early access to the next Basic HTML Game.

### Top Patrons

- Karar Al-Remahy
- UnbrandedTech
- Innkeeper Games
- Nezteb
