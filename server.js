const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const gameRoutes = require("./src/routes/gameRoutes"); 
const playerRoutes = require("./src/routes/playerRoutes"); 
const gameSocket = require("./src/socket/gameSocket");

const { swaggerUi, swaggerDocs } = require("./src/swagger");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use("/api/games", gameRoutes);
app.use("/api/players", playerRoutes);

// Socket Events
gameSocket(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
