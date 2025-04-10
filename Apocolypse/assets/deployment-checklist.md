# WORLD 8 APOCALYPSE - Deployment Checklist

Version: v1.2.0  
Last Updated: 2023-11-14

## Pre-Deployment Testing Checklist

### Core Game Functionality
- [ ] Game starts successfully on desktop
- [ ] Game starts successfully on mobile
- [ ] Missiles can be fired and explode on impact
- [ ] Cities are destroyed when hit by enemy missiles
- [ ] Level progression works correctly
- [ ] Score increases appropriately
- [ ] Game over sequence triggers correctly
- [ ] Restart functionality works as expected

### Wallet Integration
- [ ] Wallet detection works on desktop and mobile
- [ ] Wallet connection succeeds on desktop
- [ ] Wallet connection succeeds on mobile via QR code
- [ ] Mock wallet fallback activates when real wallet is unavailable
- [ ] Payment request shows correct amount (0.01 ICP)
- [ ] Payment success triggers game start
- [ ] Payment error is handled gracefully

### High Score Functionality
- [ ] Player score and level transfer to high score page
- [ ] Name submission works correctly
- [ ] High scores display correctly
- [ ] Scores are sorted properly
- [ ] High score submission succeeds with wallet connection

### Browser Compatibility
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (mobile)
- [ ] Samsung Internet (mobile)

### Performance
- [ ] Game maintains stable framerate on desktop
- [ ] Game maintains stable framerate on mobile
- [ ] No memory leaks after extended play
- [ ] Sound assets load properly
- [ ] No console errors during normal gameplay

### Automated Tests (New)
- [ ] Run Game Mechanics Tests:
  - [ ] Missile firing logic test
  - [ ] Explosion collision detection test
  - [ ] Bonus target system test
  - [ ] Level progression test
  - [ ] Object pooling test
- [ ] Run Integration Tests:
  - [ ] Wallet to payment flow test
  - [ ] Game to high score submission test
  - [ ] Local storage persistence test
  - [ ] URL parameter passing test
  - [ ] End-to-end game flow test
- [ ] Run Performance Monitor:
  - [ ] Check FPS stability
  - [ ] Monitor memory usage
  - [ ] Verify object pool efficiency

## Deployment Process

1. **Backup Current Version**
   ```bash
   # Use the deploy.sh script's backup feature
   ./deploy.sh backup
   
   # Or manually backup
   cp Apocolypse/assets/index.html Apocolypse/assets/index.html.bak-$(date +%Y%m%d)
   cp Apocolypse/assets/high-score.html Apocolypse/assets/high-score.html.bak-$(date +%Y%m%d)
   ```

2. **Update Version Number**
   - Ensure GAME_VERSION constant is updated in index.html and high-score.html
   - The deploy.sh script can verify and update version numbers

3. **Run Test Suite**
   - Open tests/test-suite.html and run all tests
   - Fix any failing tests before proceeding

4. **Minimize Assets (Optional)**
   - Consider minifying JS and HTML for production

5. **Deploy to Internet Computer**
   ```bash
   # Use the deploy.sh script for a guided deployment
   ./deploy.sh test      # Deploy to test network
   ./deploy.sh production # Deploy to production network
   
   # Or manually deploy
   dfx deploy --network ic_test  # Test network
   dfx deploy --network ic       # Production
   ```

6. **Verify Deployment**
   - Visit production URL: https://k7syt-ayaaa-aaaaj-qnn6q-cai.icp0.io/
   - Test wallet connection and gameplay
   - Submit a test high score
   - Check mobile compatibility

7. **Update Documentation**
   - Mark this checklist as completed with current date
   - Document any known issues or limitations

## Post-Deployment Monitoring

- [ ] Check analytics for user engagement
- [ ] Monitor for error reports
- [ ] Verify high score submissions are working
- [ ] Test payment flow with real ICP periodically

## Rollback Procedure (If Needed)

```bash
# Use deploy.sh rollback feature
./deploy.sh rollback

# Or manually restore backup files
cp Apocolypse/assets/index.html.bak-[DATE] Apocolypse/assets/index.html
cp Apocolypse/assets/high-score.html.bak-[DATE] Apocolypse/assets/high-score.html

# Re-deploy previous version
dfx deploy --network ic
```

## Performance Benchmarks (New)

For optimal gameplay experience, the game should meet these performance targets:

- Desktop:
  - [ ] 60 FPS minimum during normal gameplay
  - [ ] 45 FPS minimum during intense gameplay (many missiles/explosions)
  - [ ] Memory usage below 100MB after 10 minutes of gameplay

- Mobile:
  - [ ] 30 FPS minimum during gameplay
  - [ ] Initial load time under 5 seconds on 4G connection
  - [ ] Memory usage below 75MB after 10 minutes of gameplay

## Notes for Future Releases

- Consider adding analytics tracking
- Implement leaderboard filtering options
- Add more sound effects for game events
- Optimize mobile performance further
- Consider adding social sharing for high scores 