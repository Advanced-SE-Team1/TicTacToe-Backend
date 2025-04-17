const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

/**
 * @swagger
 * /api/players:
 *   post:
 *     summary: Create a new player
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

module.exports = router;
