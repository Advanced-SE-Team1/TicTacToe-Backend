const db = require("../config/db");

db.run(`CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL
)`);

class Player {
  static create(username, callback) {
    db.run("INSERT INTO players (username) VALUES (?)", [username], function (err) {
      callback(err, this?.lastID);
    });
  }

  static findByUsername(username, callback) {
    db.get("SELECT * FROM players WHERE username = ?", [username], callback);
  }

  static getAll(callback) {
    db.all("SELECT * FROM players", [], callback);
  }
}

module.exports = Player;
