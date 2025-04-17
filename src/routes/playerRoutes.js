const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

/**
 * @swagger
 * /api/players:
 *   post:
 *     summary: Create a new player (Basic)
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "Player1"
 *     responses:
 *       201:
 *         description: Player created successfully
 *       400:
 *         description: Username is required
 *       500:
 *         description: Error creating player
 */
router.post("/", playerController.createPlayer);

/**
 * @swagger
 * /api/players:
 *   get:
 *     summary: Get all players
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: List of players
 *       500:
 *         description: Error retrieving players
 */
router.get("/", playerController.getPlayers);

/**
 * @swagger
 * /api/players/register:
 *   post:
 *     summary: Register a new player
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: "player1@example.com"
 *               name:
 *                 type: string
 *                 example: "Player1"
 *               password:
 *                 type: string
 *                 example: "securePassword"
 *               confirmPassword:
 *                 type: string
 *                 example: "securePassword"
 *     responses:
 *       201:
 *         description: Player registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/register', playerController.registerPlayer);

/**
 * @swagger
 * /api/players/login:
 *   post:
 *     summary: Login a player
 *     tags: [Players]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "player1@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials or missing fields
 *       500:
 *         description: Server error
 */
router.post('/login', playerController.loginPlayer);


/**
 * @swagger
 * /api/players/leaderboard:
 *   get:
 *     summary: Get the leaderboard of players
 *     tags: [Players]
 *     responses:
 *       200:
 *         description: List of players in the leaderboard
 *       500:
 *         description: Server error
 */
router.get("/leaderboard", playerController.getLeaderboard);


module.exports = router;
