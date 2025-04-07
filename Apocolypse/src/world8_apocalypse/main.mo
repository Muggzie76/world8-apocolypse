import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor World8Apocalypse {
  // Type for storing high scores
  public type HighScore = {
    player: Text;
    score: Nat;
    level: Nat;
    timestamp: Int;
  };

  // Store high scores in a buffer
  private var highScores = Buffer.Buffer<HighScore>(10);

  // Add a new high score
  public shared(msg) func addHighScore(name: Text, score: Nat, level: Nat) : async Nat {
    let newScore : HighScore = {
      player = name;
      score = score;
      level = level;
      timestamp = Time.now();
    };

    highScores.add(newScore);
    
    // Sort high scores in descending order
    let sorted = Buffer.toArray(highScores);
    let sortedScores = Array.sort(sorted, func(a: HighScore, b: HighScore) : { #less; #equal; #greater } {
      if (a.score > b.score) { #less }
      else if (a.score < b.score) { #equal } 
      else { #greater }
    });
    
    // Keep only top 10 scores
    if (sortedScores.size() > 10) {
      let newBuffer = Buffer.Buffer<HighScore>(10);
      for (i in Iter.range(0, Nat.min(9, sortedScores.size() - 1))) {
        newBuffer.add(sortedScores[i]);
      };
      highScores := newBuffer;
    };
    
    return highScores.size();
  };

  // Get all high scores
  public query func getHighScores() : async [HighScore] {
    return Buffer.toArray(highScores);
  };

  // Clear all high scores - admin only
  public shared(msg) func clearHighScores() : async () {
    // In a real app, check for admin privileges
    highScores := Buffer.Buffer<HighScore>(10);
  };
} 