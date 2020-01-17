const express = require("express");
const helmet = require("helmet");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(logger);

function logger(req, res, next) {
  const { method, originalUrl } = req;
  console.log(`${method} on ${originalUrl} at ${Date()}`);
  next();
}

server.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = server;
