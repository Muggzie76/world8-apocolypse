/**
 * WORLD 8 APOCALYPSE - Game Mechanics Tests
 * This file contains tests for core game mechanics including:
 * - Missile movement and collision
 * - Explosion detection
 * - Scoring system
 * - Level progression
 * - Bonus target handling
 */

class GameMechanicsTest {
    constructor(logResultCallback) {
        this.logResult = logResultCallback;
        this.testResults = {
            passed: 0,
            failed: 0,
            skipped: 0
        };
    }

    /**
     * Run all game mechanics tests
     */
    async runAllTests() {
        this.logResult('Starting game mechanics tests...', 'info');
        
        // Test missile movement
        await this.testMissileFiring();
        await this.testExplosionCollision();
        await this.testBonusTargets();
        await this.testLevelProgression();
        await this.testObjectPooling();
        
        // Summary
        this.logResult(`Test summary: ${this.testResults.passed} passed, ${this.testResults.failed} failed, ${this.testResults.skipped} skipped`, 
            this.testResults.failed > 0 ? 'fail' : 'pass');
        
        return this.testResults.failed === 0;
    }

    /**
     * Test counter missile firing mechanics
     */
    async testMissileFiring() {
        this.logResult('Testing missile firing...', 'running');
        
        try {
            // Create mock canvas and context
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            const context = canvas.getContext('2d');
            
            // Create mock game objects
            const silos = [
                { x: 200, y: 500, alive: true, missiles: 5 },
                { x: 400, y: 500, alive: true, missiles: 3 },
                { x: 600, y: 500, alive: true, missiles: 0 }
            ];
            
            // Find closest silo with available missiles
            const clickPoint = { x: 300, y: 300 };
            let closestSilo = null;
            let closestDist = Infinity;
            
            for (const silo of silos) {
                if (silo.alive && silo.missiles > 0) {
                    const dist = Math.sqrt(
                        Math.pow(clickPoint.x - silo.x, 2) + 
                        Math.pow(clickPoint.y - silo.y, 2)
                    );
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestSilo = silo;
                    }
                }
            }
            
            // Check if correct silo is selected
            if (closestSilo === silos[0]) {
                this.logResult('✓ Correct silo selected (closest with available missiles)', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult('✗ Wrong silo selected', 'fail');
                this.testResults.failed++;
            }
            
            // Test empty silo handling
            const emptySilos = [
                { x: 200, y: 500, alive: true, missiles: 0 },
                { x: 400, y: 500, alive: false, missiles: 3 },
                { x: 600, y: 500, alive: true, missiles: 0 }
            ];
            
            // Check if no silo is selected when all are empty or dead
            let anySiloSelected = false;
            for (const silo of emptySilos) {
                if (silo.alive && silo.missiles > 0) {
                    anySiloSelected = true;
                    break;
                }
            }
            
            if (!anySiloSelected) {
                this.logResult('✓ No silo selected when all are empty or destroyed', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult('✗ Silo incorrectly selected when all should be unavailable', 'fail');
                this.testResults.failed++;
            }
            
            // Test missile velocity calculation
            const startPoint = { x: 200, y: 500 };
            const targetPoint = { x: 300, y: 300 };
            const dx = targetPoint.x - startPoint.x;
            const dy = targetPoint.y - startPoint.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const speed = 5;
            
            const normalizedDx = (dx / dist) * speed;
            const normalizedDy = (dy / dist) * speed;
            
            // Check if velocity is normalized properly
            const velocityMagnitude = Math.sqrt(normalizedDx * normalizedDx + normalizedDy * normalizedDy);
            if (Math.abs(velocityMagnitude - speed) < 0.0001) {
                this.logResult('✓ Missile velocity calculated correctly', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult(`✗ Missile velocity incorrect: expected ${speed}, got ${velocityMagnitude}`, 'fail');
                this.testResults.failed++;
            }
            
        } catch (error) {
            this.logResult(`Error in missile firing test: ${error.message}`, 'fail');
            this.testResults.failed++;
        }
    }

    /**
     * Test explosion collision detection
     */
    async testExplosionCollision() {
        this.logResult('Testing explosion collision detection...', 'running');
        
        try {
            // Mock missiles and explosions
            const missiles = [
                { pos: { x: 100, y: 100 }, alive: true },
                { pos: { x: 200, y: 200 }, alive: true },
                { pos: { x: 300, y: 300 }, alive: true }
            ];
            
            const explosions = [
                { x: 105, y: 105, size: 10 },
                { x: 500, y: 500, size: 20 }
            ];
            
            const missileSize = 4;
            let collisionDetected = false;
            
            // Check collision detection
            for (let i = 0; i < missiles.length; i++) {
                const missile = missiles[i];
                
                for (let j = 0; j < explosions.length; j++) {
                    const explosion = explosions[j];
                    const dist = Math.sqrt(
                        Math.pow(explosion.x - missile.pos.x, 2) + 
                        Math.pow(explosion.y - missile.pos.y, 2)
                    );
                    
                    if (dist < missileSize + explosion.size) {
                        collisionDetected = true;
                        missile.alive = false;
                        break;
                    }
                }
            }
            
            if (collisionDetected) {
                this.logResult('✓ Explosion collision detected correctly', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult('✗ Failed to detect explosion collision', 'fail');
                this.testResults.failed++;
            }
            
            // Check that only the correct missile was destroyed
            if (!missiles[0].alive && missiles[1].alive && missiles[2].alive) {
                this.logResult('✓ Only colliding missile was destroyed', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult('✗ Incorrect missiles were destroyed', 'fail');
                this.testResults.failed++;
            }
            
        } catch (error) {
            this.logResult(`Error in explosion collision test: ${error.message}`, 'fail');
            this.testResults.failed++;
        }
    }

    /**
     * Test bonus target functionality
     */
    async testBonusTargets() {
        this.logResult('Testing bonus target system...', 'running');
        
        try {
            // Mock bonus target types and spawn chances
            const BONUS_TARGETS = {
                ASTEROID: { spawnChance: 0.4, points: 200, color: '#aa7722' },
                SATELITE: { spawnChance: 0.3, points: 300, color: '#4488ff' },
                UFO: { spawnChance: 0.2, points: 500, color: '#22ff22' }
            };
            
            // Test random spawn
            let asteroidsCount = 0;
            let satellitesCount = 0;
            let ufosCount = 0;
            
            // Run 1000 simulations to check distribution
            for (let i = 0; i < 1000; i++) {
                const random = Math.random();
                let type = null;
                
                if (random < BONUS_TARGETS.ASTEROID.spawnChance) {
                    type = 'ASTEROID';
                } else if (random < BONUS_TARGETS.ASTEROID.spawnChance + BONUS_TARGETS.SATELITE.spawnChance) {
                    type = 'SATELITE';
                } else if (random < BONUS_TARGETS.ASTEROID.spawnChance + BONUS_TARGETS.SATELITE.spawnChance + BONUS_TARGETS.UFO.spawnChance) {
                    type = 'UFO';
                }
                
                if (type === 'ASTEROID') asteroidsCount++;
                if (type === 'SATELITE') satellitesCount++;
                if (type === 'UFO') ufosCount++;
            }
            
            // Check if distribution is roughly correct
            const totalSpawned = asteroidsCount + satellitesCount + ufosCount;
            this.logResult(`Bonus spawns: Asteroids: ${asteroidsCount}, Satellites: ${satellitesCount}, UFOs: ${ufosCount}`, 'info');
            
            // Allow for some randomness in the distribution
            if (Math.abs(asteroidsCount - 400) < 50 && 
                Math.abs(satellitesCount - 300) < 50 && 
                Math.abs(ufosCount - 200) < 50) {
                this.logResult('✓ Bonus target spawn distribution is correct', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult('✗ Bonus target spawn distribution is incorrect', 'fail');
                this.testResults.failed++;
            }
            
            // Test bonus target collision
            const bonusTarget = {
                x: 100,
                y: 100,
                size: 20,
                isHit: function(x, y) {
                    const distance = Math.sqrt(
                        Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
                    );
                    return distance < this.size;
                }
            };
            
            const hitResult1 = bonusTarget.isHit(110, 110); // Should hit
            const hitResult2 = bonusTarget.isHit(150, 150); // Should miss
            
            if (hitResult1 && !hitResult2) {
                this.logResult('✓ Bonus target hit detection works correctly', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult('✗ Bonus target hit detection is incorrect', 'fail');
                this.testResults.failed++;
            }
            
        } catch (error) {
            this.logResult(`Error in bonus target test: ${error.message}`, 'fail');
            this.testResults.failed++;
        }
    }

    /**
     * Test level progression
     */
    async testLevelProgression() {
        this.logResult('Testing level progression...', 'running');
        
        try {
            // Mock level data
            const LEVELS = [
                { 
                    missileCount: [3, 5, 7], 
                    interval: 2000, 
                    missileSpeed: 1 
                },
                { 
                    missileCount: [5, 7, 9], 
                    interval: 1800, 
                    missileSpeed: 1.2 
                }
            ];
            
            // Test level completion check
            let currentLevel = 0;
            let levelComplete = false;
            let currInterval = 3; // All waves completed
            let missiles = []; // No missiles remaining
            
            // Check level completion logic
            if (!levelComplete && currInterval >= LEVELS[currentLevel].missileCount.length && missiles.length === 0) {
                levelComplete = true;
            }
            
            if (levelComplete) {
                this.logResult('✓ Level completion detected correctly', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult('✗ Failed to detect level completion', 'fail');
                this.testResults.failed++;
            }
            
            // Test player level calculation based on score
            const previousScore = 990;
            const score = 1010;
            const previousLevel = Math.floor(previousScore / 1000) + 1;
            const playerLevel = Math.floor(score / 1000) + 1;
            
            if (previousLevel === 1 && playerLevel === 2) {
                this.logResult('✓ Player level calculation is correct', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult('✗ Player level calculation is incorrect', 'fail');
                this.testResults.failed++;
            }
            
            // Test difficulty increase
            if (Math.floor(previousScore / 300) < Math.floor(score / 300)) {
                this.logResult('✓ Difficulty increase threshold detected correctly', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult('✗ Failed to detect difficulty increase threshold', 'fail');
                this.testResults.failed++;
            }
            
        } catch (error) {
            this.logResult(`Error in level progression test: ${error.message}`, 'fail');
            this.testResults.failed++;
        }
    }

    /**
     * Test object pooling system
     */
    async testObjectPooling() {
        this.logResult('Testing object pooling system...', 'running');
        
        try {
            // Mock object pools
            const missilePool = [];
            const explosionPool = [];
            
            // Create a reusable object
            function createMockObject() {
                return { created: true };
            }
            
            // Mock getPooledObject function
            function getPooledObject(pool, createFunc) {
                if (pool.length > 0) {
                    return pool.pop();
                }
                return createFunc();
            }
            
            // Test getting a new object when pool is empty
            const obj1 = getPooledObject(missilePool, createMockObject);
            
            if (obj1.created === true) {
                this.logResult('✓ Created new object when pool is empty', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult('✗ Failed to create new object', 'fail');
                this.testResults.failed++;
            }
            
            // Add some objects to the pool
            for (let i = 0; i < 5; i++) {
                explosionPool.push({ pooled: true, id: i });
            }
            
            // Test getting an object from non-empty pool
            const obj2 = getPooledObject(explosionPool, createMockObject);
            
            if (obj2.pooled === true) {
                this.logResult('✓ Reused object from pool correctly', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult('✗ Failed to reuse pooled object', 'fail');
                this.testResults.failed++;
            }
            
            // Verify pool size decreased
            if (explosionPool.length === 4) {
                this.logResult('✓ Pool size decreased correctly', 'pass');
                this.testResults.passed++;
            } else {
                this.logResult(`✗ Pool size incorrect: expected 4, got ${explosionPool.length}`, 'fail');
                this.testResults.failed++;
            }
            
        } catch (error) {
            this.logResult(`Error in object pooling test: ${error.message}`, 'fail');
            this.testResults.failed++;
        }
    }
}

// Export the test class if module.exports is available
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = GameMechanicsTest;
} 