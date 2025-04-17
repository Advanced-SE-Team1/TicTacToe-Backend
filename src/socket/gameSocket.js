const Game = require("../models/Game");

module.exports = (io) => {
  let waitingPlayers = [];

  io.on("connection", (socket) => {
    console.log("New player connected:", socket.id);

    socket.on("startGame", (username) => {
      const game = { id: socket.id, player1: username, status: "waiting" };
      waitingPlayers.push(game);
      io.emit("updateWaitingPlayers", waitingPlayers);
    });

    socket.on("joinGame", ({ gameId, username }) => {
      const gameIndex = waitingPlayers.findIndex((g) => g.id === gameId);
      if (gameIndex !== -1) {
        const game = waitingPlayers[gameIndex];
        game.player2 = username;
        game.status = "started";
        waitingPlayers.splice(gameIndex, 1);
        io.emit("updateWaitingPlayers", waitingPlayers);
        io.to(gameId).emit("gameStarted", { gameId: game.id });
      }
    });

    socket.on("disconnect", () => {
      waitingPlayers = waitingPlayers.filter((game) => game.id !== socket.id);
      io.emit("updateWaitingPlayers", waitingPlayers);
      console.log("Player disconnected:", socket.id);
    });
  });
};
