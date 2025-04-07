// High Score Integration with Internet Computer backend
// This file provides functions to interact with the world8_backend canister

// Import the necessary dependencies for Internet Computer
const ic = window.ic || {};

// Candid interface for the high score canister
const idlFactory = ({ IDL }) => {
  const HighScore = IDL.Record({
    'player' : IDL.Text,
    'score' : IDL.Nat,
    'level' : IDL.Nat,
    'timestamp' : IDL.Int,
  });
  return IDL.Service({
    'addHighScore' : IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [IDL.Nat], []),
    'getHighScores' : IDL.Func([], [IDL.Vec(HighScore)], ['query']),
    'clearHighScores' : IDL.Func([], [], []),
  });
};

// Configuration
const LOCAL_BACKEND_URL = "http://localhost:8000/?canisterId="; // Will be populated at runtime
const PRODUCTION_BACKEND_URL = "https://ic0.app/"; // Will be populated with actual canister ID
let BACKEND_CANISTER_ID = ""; // Will be set at runtime

// Initialize the high score system
async function initHighScoreSystem(isLocal = true, canisterId = null) {
  try {
    if (canisterId) {
      BACKEND_CANISTER_ID = canisterId;
    } else {
      // Try to get canister ID from the URL or a deployed environment variable
      const urlParams = new URLSearchParams(window.location.search);
      const backendParam = urlParams.get('backend');
      if (backendParam) {
        BACKEND_CANISTER_ID = backendParam;
      } else if (isLocal) {
        console.warn("No backend canister ID provided for local development");
        // In local development, you might want to prompt for this or have a default
      } else {
        console.error("Backend canister ID not found");
        return false;
      }
    }
    
    console.log(`High score system initialized with canister ID: ${BACKEND_CANISTER_ID}`);
    return true;
  } catch (error) {
    console.error("Failed to initialize high score system:", error);
    return false;
  }
}

// Submit a high score to the backend
async function submitHighScore(playerName, score, level) {
  if (!BACKEND_CANISTER_ID) {
    console.error("Backend canister ID not set. Call initHighScoreSystem first.");
    return false;
  }

  try {
    // If the Internet Computer agent is available (e.g., Plug wallet is connected)
    if (ic.agent) {
      const actor = await ic.agent.Actor.createActor(idlFactory, {
        canisterId: BACKEND_CANISTER_ID,
      });
      
      const result = await actor.addHighScore(playerName, BigInt(score), BigInt(level));
      console.log("High score submitted successfully:", result);
      return true;
    } else {
      // Fallback to HTTP request if agent is not available
      console.warn("IC agent not available, using HTTP fallback");
      
      // This is a simplified example - in a real implementation you'd need
      // to properly encode the request for the IC HTTP interface
      const response = await fetch(`${LOCAL_BACKEND_URL}${BACKEND_CANISTER_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'addHighScore',
          args: [playerName, score.toString(), level.toString()],
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("High score submitted successfully:", data);
      return true;
    }
  } catch (error) {
    console.error("Failed to submit high score:", error);
    return false;
  }
}

// Get high scores from the backend
async function getHighScores() {
  if (!BACKEND_CANISTER_ID) {
    console.error("Backend canister ID not set. Call initHighScoreSystem first.");
    return [];
  }

  try {
    // If the Internet Computer agent is available
    if (ic.agent) {
      const actor = await ic.agent.Actor.createActor(idlFactory, {
        canisterId: BACKEND_CANISTER_ID,
      });
      
      const highScores = await actor.getHighScores();
      // Convert BigInt values to numbers for easier handling in JavaScript
      return highScores.map(score => ({
        player: score.player,
        score: Number(score.score),
        level: Number(score.level),
        timestamp: Number(score.timestamp)
      }));
    } else {
      // Fallback to HTTP request
      console.warn("IC agent not available, using HTTP fallback");
      
      const response = await fetch(`${LOCAL_BACKEND_URL}${BACKEND_CANISTER_ID}?method=getHighScores`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.highScores || [];
    }
  } catch (error) {
    console.error("Failed to get high scores:", error);
    return [];
  }
}

// Render high scores to a container element
function renderHighScores(highScores, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container element with ID '${containerId}' not found`);
    return;
  }
  
  // Clear the container
  container.innerHTML = '';
  
  // Create a table for the high scores
  const table = document.createElement('table');
  table.className = 'high-score-table';
  
  // Add header row
  const headerRow = document.createElement('tr');
  ['Rank', 'Player', 'Score', 'Level', 'Date'].forEach(headerText => {
    const headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });
  table.appendChild(headerRow);
  
  // Add high score rows
  highScores.forEach((score, index) => {
    const row = document.createElement('tr');
    
    // Rank cell
    const rankCell = document.createElement('td');
    rankCell.textContent = (index + 1).toString();
    row.appendChild(rankCell);
    
    // Player name cell
    const playerCell = document.createElement('td');
    playerCell.textContent = score.player;
    row.appendChild(playerCell);
    
    // Score cell
    const scoreCell = document.createElement('td');
    scoreCell.textContent = score.score.toString();
    row.appendChild(scoreCell);
    
    // Level cell
    const levelCell = document.createElement('td');
    levelCell.textContent = score.level.toString();
    row.appendChild(levelCell);
    
    // Date cell
    const dateCell = document.createElement('td');
    const date = new Date(Number(score.timestamp) / 1000000); // Convert nanoseconds to milliseconds
    dateCell.textContent = date.toLocaleDateString();
    row.appendChild(dateCell);
    
    table.appendChild(row);
  });
  
  container.appendChild(table);
}

// Export the functions for use in the game
window.highScoreSystem = {
  init: initHighScoreSystem,
  submit: submitHighScore,
  get: getHighScores,
  render: renderHighScores
}; 