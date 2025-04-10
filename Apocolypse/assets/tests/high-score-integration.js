/**
 * WORLD 8 APOCALYPSE - High Score Integration
 * Handles the integration between the game and high score system
 */

// Default mock data for testing
const DEFAULT_HIGH_SCORES = [
    { name: "Player 1", score: 5000, level: 5, date: new Date().toISOString() },
    { name: "Player 2", score: 4500, level: 4, date: new Date().toISOString() },
    { name: "Player 3", score: 4000, level: 4, date: new Date().toISOString() },
    { name: "Player 4", score: 3500, level: 3, date: new Date().toISOString() },
    { name: "Player 5", score: 3000, level: 3, date: new Date().toISOString() }
];

class HighScoreSystem {
    constructor() {
        this.scores = [];
        this.canisterId = "xggp5-zqaaa-aaaao-qj7ya-cai";
        this.isConnected = false;
    }
    
    /**
     * Initialize the high score system
     */
    async initialize() {
        console.log("Initializing high score system...");
        
        // Try to load scores from local storage first
        this.loadFromLocalStorage();
        
        return true;
    }
    
    /**
     * Load high scores from local storage
     */
    loadFromLocalStorage() {
        try {
            const savedScores = localStorage.getItem('highScores');
            if (savedScores) {
                this.scores = JSON.parse(savedScores);
                console.log("Loaded high scores from local storage:", this.scores.length);
            } else {
                // Use default scores if none found
                this.scores = DEFAULT_HIGH_SCORES;
                this.saveToLocalStorage();
                console.log("Using default high scores");
            }
        } catch (error) {
            console.error("Error loading high scores from local storage:", error);
            this.scores = DEFAULT_HIGH_SCORES;
        }
        
        return this.scores;
    }
    
    /**
     * Save high scores to local storage
     */
    saveToLocalStorage() {
        try {
            localStorage.setItem('highScores', JSON.stringify(this.scores));
            console.log("Saved high scores to local storage");
        } catch (error) {
            console.error("Error saving high scores to local storage:", error);
        }
    }
    
    /**
     * Get high scores
     */
    async getHighScores() {
        // Try to connect to backend if available
        if (window.ic && window.ic.plug) {
            try {
                console.log("Attempting to fetch scores from canister...");
                // Add backend connection here when available
                return this.scores;
            } catch (error) {
                console.error("Error fetching scores from canister:", error);
            }
        }
        
        // Return local scores
        return this.scores;
    }
    
    /**
     * Submit a high score
     */
    async submitScore(name, score, level) {
        const newScore = {
            name: name.substring(0, 20), // Limit name length
            score: parseInt(score),
            level: parseInt(level),
            date: new Date().toISOString()
        };
        
        console.log("Submitting score:", newScore);
        
        // Try to submit to backend if available
        if (window.ic && window.ic.plug) {
            try {
                console.log("Attempting to submit score to canister...");
                // Add backend connection here when available
            } catch (error) {
                console.error("Error submitting score to canister:", error);
            }
        }
        
        // Store locally regardless of backend status
        this.scores.push(newScore);
        this.scores.sort((a, b) => b.score - a.score); // Sort by score descending
        this.scores = this.scores.slice(0, 100); // Keep top 100 scores
        this.saveToLocalStorage();
        
        return true;
    }
    
    /**
     * Format scores for display
     */
    formatScores(scores) {
        let html = '<table class="high-score-table">';
        html += '<thead><tr><th>Rank</th><th>Name</th><th>Score</th><th>Level</th><th>Date</th></tr></thead>';
        html += '<tbody>';
        
        scores.slice(0, 10).forEach((score, index) => {
            const date = new Date(score.date);
            const formattedDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
            
            html += `<tr>
                <td>${index + 1}</td>
                <td>${score.name}</td>
                <td>${score.score.toLocaleString()}</td>
                <td>${score.level}</td>
                <td>${formattedDate}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        return html;
    }
}

// Create global instance
window.highScoreSystem = new HighScoreSystem();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log("High score integration loaded");
    await window.highScoreSystem.initialize();
    
    // Add event listeners for high score UI elements if they exist
    const submitButton = document.getElementById('submitScore');
    if (submitButton) {
        submitButton.addEventListener('click', async () => {
            const nameInput = document.getElementById('playerName');
            const scoreDisplay = document.getElementById('playerCurrentScore');
            const levelDisplay = document.getElementById('playerCurrentLevel');
            
            if (nameInput && scoreDisplay && levelDisplay) {
                const name = nameInput.value.trim();
                const score = scoreDisplay.textContent;
                const level = levelDisplay.textContent;
                
                if (name && score) {
                    const status = document.getElementById('status');
                    if (status) status.textContent = "Submitting score...";
                    
                    await window.highScoreSystem.submitScore(name, score, level);
                    
                    if (status) status.textContent = "Score submitted successfully!";
                    
                    // Save name for future use
                    localStorage.setItem('playerName', name);
                    
                    // Refresh scores display
                    const highScoresContainer = document.getElementById('highScores');
                    if (highScoresContainer) {
                        const scores = await window.highScoreSystem.getHighScores();
                        highScoresContainer.innerHTML = window.highScoreSystem.formatScores(scores);
                    }
                }
            }
        });
    }
    
    // Handle refresh scores button
    const refreshButton = document.getElementById('getHighScores');
    if (refreshButton) {
        refreshButton.addEventListener('click', async () => {
            const highScoresContainer = document.getElementById('highScores');
            if (highScoresContainer) {
                highScoresContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Loading...</div>';
                
                const scores = await window.highScoreSystem.getHighScores();
                highScoresContainer.innerHTML = window.highScoreSystem.formatScores(scores);
            }
        });
        
        // Trigger initial load
        refreshButton.click();
    }
}); 