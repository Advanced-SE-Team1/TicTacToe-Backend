const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tic Tac Toe API",
      version: "1.0.0",
      description: "API documentation for the Tic Tac Toe game",
    },
    externalDocs: {                // <<< this will add the link to your swagger page
      description: "swagger.json", // <<< link title
      url: "/swagger.json"         // <<< and the file added below in app.get(...)
    }, 
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/routes/*.js"]
  // Scans route files for API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs, swaggerOptions };
