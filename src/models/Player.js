const db = require("../config/db");

const bcrypt = require("bcryptjs");

db.run(`CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  score INTEGER DEFAULT 0
)`);


class Player {
  static create({ username, email, password }, callback) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return callback(err);

      db.run(
        "INSERT INTO players (username, email, password,score) VALUES (?, ?, ?,0)",
        [username, email, hashedPassword],
        function (err) {
          callback(err, this?.lastID);
        }
      );
    });
  }
  static findByEmail(email, callback) {
    db.get("SELECT * FROM players WHERE email = ?", [email], callback);
  }

  static findByUsername(username, callback) {
    db.get("SELECT * FROM players WHERE username = ?", [username], callback);
  }

  static getAll(callback) {
    db.all("SELECT * FROM players", [], callback);
  }

  static comparePassword(inputPassword, storedHash, callback) {
    bcrypt.compare(inputPassword, storedHash, callback);
  }

  static getLeaderboard(callback) {
    db.all("SELECT username, score FROM players ORDER BY score DESC LIMIT 10", [], callback);
  }

  static incrementScore(playerId, callback) {
    db.run("UPDATE players SET score = score + 1 WHERE id = ?", [playerId], function (err) {
      callback(err);
    });
  }
}

module.exports = Player;
