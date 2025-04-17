const Player = require("../models/Player");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.createPlayer = (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Username is required" });

  Player.create({ username, email: `${username}@example.com`, password: "123456" }, (err, playerId) => {
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

exports.registerPlayer = (req, res) => {
  const { email, name, password, confirmPassword } = req.body;
  console.log(req.body);

  if (!email || !name || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  Player.findByEmail(email, (err, existingPlayer) => {
    if (err) return res.status(500).json({ message: "Error checking player" });
    if (existingPlayer) return res.status(400).json({ message: "Email already in use" });

    Player.create({ username: name, email, password }, (err, playerId) => {
      if (err) return res.status(500).json({ message: "Error creating player" });
      res.status(201).json({ playerId, message: "Player registered successfully" });
    });
  });
};

exports.loginPlayer = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  Player.findByEmail(email, (err, player) => {
    if (err) return res.status(500).json({ message: "Error finding player" });
    if (!player) return res.status(400).json({ message: "Player not found" });

    Player.comparePassword(password, player.password, (err, isMatch) => {
      if (err || !isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: player.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.status(200).json({
        message: "Login successful",
        token,
        player: { id: player.id, username: player.username, email: player.email }
      });
    });
  });
};

exports.getLeaderboard = (req, res) => {
  Player.getLeaderboard((err, players) => {
    console.log(err);
    console.log(players);
    if (err) return res.status(500).json({ message: "Error fetching leaderboard" });
    res.status(200).json(players);
  });
};