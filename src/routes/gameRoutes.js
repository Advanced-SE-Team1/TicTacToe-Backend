const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");


// Check if gameController has all required functions
if (!gameController.startGame || typeof gameController.startGame !== "function") {
    console.error("Error: gameController.startGame is not defined or not a function.");
  }
/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management APIs
 */

/**
 * @swagger
 * /api/games/start:
 *   post:
 *     summary: Start a new game
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playerId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Game started successfully
 *       400:
 *         description: Missing playerId
 *       500:
 *         description: Error starting game
 */
router.post("/start", gameController.startGame);

/**
 * @swagger
 * /api/games/join:
 *   post:
 *     summary: Join an existing game
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameId:
 *                 type: integer
 *                 example: 1
 *               playerId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Successfully joined game
 *       400:
 *         description: Missing gameId or playerId
 *       500:
 *         description: Error joining game
 */
router.post("/join", gameController.joinGame);

/**
 * @swagger
 * /api/games/{gameId}/status:
 *   get:
 *     summary: Check if opponent has joined the game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The game ID to check the status for
 *     responses:
 *       200:
 *         description: Game status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gameId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   example: "started"
 *       404:
 *         description: Game not found
 *       500:
 *         description: Server error
 */
router.get("/:gameId/status", gameController.getGameStatus);




/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Get all available games
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: List of available games
 *       500:
 *         description: Error retrieving games
 */
router.get("/", gameController.getWaitingGames);



/**
 * @swagger
 * /round:
 *   post:
 *     summary: Create a new round for a game
 *     description: Initializes a new round with an empty board and assigns the next player.
 *     tags: 
 *       - Rounds
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *               - roundNumber
 *               - next_player
 *             properties:
 *               gameId:
 *                 type: integer
 *                 example: 1
 *                 description: The ID of the game to which the round belongs
 *               roundNumber:
 *                 type: integer
 *                 example: 2
 *                 description: The round number in the game
 *               next_player:
 *                 type: string
 *                 example: "player1"
 *                 description: The player who will start this round
 *     responses:
 *       201:
 *         description: Round created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Round saved successfully"
 *                 round:
 *                   type: object
 *                   description: The saved round details
 *       400:
 *         description: Invalid request format
 *       500:
 *         description: Failed to save round
 */

router.post("/round", gameController.submitRound);

/**
 * @swagger
 * /api/games/rounds/{gameId}:
 *   get:
 *     summary: Get rounds for a specific game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The game ID to retrieve rounds for
 *     responses:
 *       200:
 *         description: List of rounds for the game
 *       500:
 *         description: Error retrieving rounds
 */
router.get("/rounds/:gameId", gameController.getRounds);

/**
 * @swagger
 * /round:
 *   put:
 *     summary: Update a round with the latest board state
 *     description: Updates the round details including the board, next player, and winner.
 *     tags: 
 *       - Rounds
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roundId
 *               - board
 *               - next_player
 *               - winner
 *             properties:
 *               roundId:
 *                 type: integer
 *                 example: 1
 *                 description: The unique ID of the round
 *               board:
 *                 type: array
 *                 items:
 *                   type: string
 *                   nullable: true
 *                 example: ["X", null, "O", null, "X", null, "O", null, "X"]
 *                 description: The current board state in a 3x3 Tic-Tac-Toe format
 *               next_player:
 *                 type: string
 *                 example: "player2"
 *                 description: The player who will make the next move
 *               winner:
 *                 type: string
 *                 nullable: true
 *                 example: "player1"
 *                 description: The winner of the round (null if no winner)
 *     responses:
 *       200:
 *         description: Round updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Round updated successfully"
 *       400:
 *         description: Invalid board format
 *       500:
 *         description: Failed to update round
 */

router.put("/round", gameController.updateRound);



/**
 * @swagger
 * /api/games/round/{roundId}:
 *   get:
 *     summary: Get a specific round of the game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: roundId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The round ID to retrieve
 */
router.get("/round/:roundId", gameController.getRound);

module.exports = router;
