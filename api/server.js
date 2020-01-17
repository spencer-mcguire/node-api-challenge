const express = require("express");
const helmet = require("helmet");

const projectRouter = require("./projectRouter");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(logger);

server.use("/api/projects", projectRouter);

function logger(req, res, next) {
  const { method, originalUrl } = req;
  console.log(`${method} on ${originalUrl} at ${Date()}`);
  next();
}

server.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = server;
