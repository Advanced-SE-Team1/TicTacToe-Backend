const db = require("../config/db");

db.run(`CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1 TEXT,
    player2 TEXT,
    status TEXT DEFAULT 'waiting',
    rounds INTEGER DEFAULT 5,
    winner TEXT DEFAULT NULL
)`);
db.run(`CREATE TABLE IF NOT EXISTS rounds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER,
  round_number INTEGER,
  next_player INTEGER,
  board TEXT,             -- Store board as JSON string (3x3)
  winner TEXT,            -- 'X', 'O', or 'draw'
  FOREIGN KEY(game_id) REFERENCES games(id)
)`);



class Game {
  static create(player1, callback) {
    db.run("INSERT INTO games (player1, status) VALUES (?, ?)", [player1, "waiting"], function (err) {
      callback(err, this?.lastID);
    });
  }

  static findWaitingGames(callback) {
    const query = `
      SELECT 
        g.id AS gameId, 
        g.player1 AS player1Id, 
        p.username AS player1Name, 
        g.status 
      FROM games g
      LEFT JOIN players p ON g.player1 = p.id
      WHERE g.status = 'waiting';
    `;
  
    db.all(query, [], (err, games) => {
      if (err) {
        console.error("Error retrieving waiting games:", err);
        return callback(err, null);
      }
      callback(null, games);
    });
  }
  
  static getGameStatus(gameId, callback) {
    const query = `
      SELECT 
        games.id, 
        games.status, 
        games.player1, 
        p1.username AS player1_name,
        games.player2,
        p2.username AS player2_name
      FROM games 
      LEFT JOIN players p1 ON games.player1 = p1.id 
      LEFT JOIN players p2 ON games.player2 = p2.id 
      WHERE games.id = ?
    `;
  
    db.get(query, [gameId], (err, game) => {
      if (err) {
        console.error("Database Error:", err);
        return callback(err, null);
      }
  
      if (!game) {
        console.warn(`Game with ID ${gameId} not found.`);
        return callback(null, null);
      }
  
      callback(null, game);
    });
  }
  
  
  

  static joinGame(gameId, player2, callback) {
    db.run("UPDATE games SET player2 = ?, status = 'started' WHERE id = ?", [player2, gameId], callback);
  }

  static saveRound(gameId, roundNumber, board, next_player, winner, callback) {
    const boardStr = JSON.stringify(board);
    
    db.run(
      "INSERT INTO rounds (game_id, round_number, board, winner,next_player) VALUES (?, ?, ?, ?, ?)",
      [gameId, roundNumber, boardStr, winner,next_player],
      function (err) {
        if (err) return callback(err, null);
  
        // Fetch the newly inserted round to return in the response
        db.get(
          "SELECT * FROM rounds WHERE id = ?",
          [this.lastID], // Get the last inserted ID
          (fetchErr, round) => {
            if (fetchErr) return callback(fetchErr, null);
            callback(null, round);
          }
        );
      }
    );
  }
  
  static updateRound(roundId, board,next_player, winner,callback) {
    const boardStr = JSON.stringify(board);
    db.run(
      "UPDATE rounds SET board = ?, winner = ?, next_player = ? WHERE id = ?",
      [boardStr, winner,next_player, roundId],
      callback
    );
  }
  static getRoundById(roundId, callback) {
    db.all(
      "SELECT game_id, round_number, board,next_player, winner FROM rounds WHERE id = ? ORDER BY round_number ASC",
      [roundId],
      (err, rows) => {
        if (rows) {
          rows.forEach(r => r.board = JSON.parse(r.board)); // Convert board JSON string back to an array
        }
        callback(err, rows);
      }
    );
  }
  
  
  static getRounds(gameId, callback) {
    db.all(
      "SELECT id, round_number, board,next_player, winner FROM rounds WHERE game_id = ? ORDER BY round_number ASC",
      [gameId],
      (err, rows) => {
        if (rows) {
          rows.forEach(r => r.board = JSON.parse(r.board)); // Convert board JSON string back to an array
        }
        callback(err, rows);
      }
    );
  }
  
}

module.exports = Game;
