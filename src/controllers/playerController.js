const Player = require("../models/Player");

exports.createPlayer = (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Username is required" });

  Player.create(username, (err, playerId) => {
    if (err) return res.status(500).json({ message: "Error creating player" });
    res.status(201).json({ playerId, message: "Player created successfully" });
  });
};

exports.getPlayers = (req, res) => {
  Player.getAll((err, players) => {
    if (err) return res.status(500).json({ message: "Error retrieving players" });
    res.json(players);
  });
};
