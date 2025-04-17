const Game = require("../models/Game");

exports.startGame = (req, res) => {
  const { playerId } = req.body;
  Game.create(playerId, (err, gameId) => {
    if (err) return res.status(500).json({ message: "Error starting game" });
    res.status(201).json({ gameId, message: "Game created, waiting for opponent" });
  });
};

exports.getWaitingGames = (req, res) => {
  Game.findWaitingGames((err, games) => {
    if (err) {
      return res.status(500).json({ message: "Error retrieving waiting games" });
    }
    res.json(games);
  });
};


exports.getGameStatus = (req, res) => {
  const { gameId } = req.params;

  if (!gameId) {
    return res.status(400).json({ message: "Missing gameId" });
  }

  Game.getGameStatus(gameId, (err, game) => {
    if (err) {
      console.error("Error retrieving game status:", err);
      return res.status(500).json({ message: "Error retrieving game status" });
    }

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
``
    res.json({ 
      gameId: game.id, 
      player1Id: game.player1,
      player1Name: game.player1_name || "Unknown Player", // Handle missing names
      player2Id: game.player2,
      player2Name: game.player2_name || "Unknown Player", // Handle missing names
      status: game.status 
    });
  });
};



exports.joinGame = (req, res) => {
  const { gameId, playerId } = req.body;
  Game.joinGame(gameId, playerId, (err) => {
    if (err) return res.status(500).json({ message: "Error joining game" });
    res.json({ message: "Game started!" });
  });
};


exports.submitRound = (req, res) => {
  const { gameId, roundNumber,next_player } = req.body;
  const board = Array(9).fill(null);
  // if (!Array.isArray(board) || board.length !== 9) {
  //   return res.status(400).json({ message: "Invalid board format" });
  // }

Game.saveRound(gameId, roundNumber, board,next_player, null, (err, savedRound) => {
  if (err) {
    console.error("Error saving round:", err.message);
    return res.status(500).json({ message: "Failed to save round" });
  }

  res.status(201).json({ message: "Round saved successfully", round: savedRound });
  });
};

exports.getRounds = (req, res) => {
  const { gameId } = req.params;

  if (!gameId) {
    return res.status(400).json({ message: "Game ID is required" });
  }

  Game.getRounds(gameId, (err, rounds) => {
    if (err) {
      console.error("Error retrieving rounds:", err);
      return res.status(500).json({ message: "Error retrieving rounds" });
    }
console.log(rounds);

    if (!rounds || rounds.length === 0) {
      return res.status(404).json({ message: "No rounds found for this game" });
    }

    res.status(200).json({ gameId, rounds });
  });
};



exports.updateRound = (req, res) => {
  const { roundId, board,next_player, winner } = req.body;

  if (!Array.isArray(board) || board.length !== 9) {
    return res.status(400).json({ message: "Invalid board format" });
  }
console.log(board);

  Game.updateRound(roundId, board,next_player, winner, (err) => {
    if (err) return res.status(500).json({ message: "Failed to update round" });
    res.json({ message: "Round updated successfully" });
  });
};

exports.getRound = (req, res) => {
  const { roundId } = req.params;
  if (!roundId) {
    return res.status(400).json({ message: "Round ID is required" });
  }
  Game.getRoundById(roundId, (err, round) => {
    if (err) {
      console.error("Error retrieving rounds:", err);
      return res.status(500).json({ message: "Error retrieving rounds" });
    }


    if (!round ) {
      return res.status(404).json({ message: "No rounds found for this game" });
    }

    res.status(200).json({ roundId, round });
  });
};
