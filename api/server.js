const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./custom middleware/logger");

const projectRouter = require("./router/projectRouter");
const actionRouter = require("./router/actionRouter");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(logger);

server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);

server.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = server;
