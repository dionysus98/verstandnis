const Butter = require("./butter");
const http = require("node:http");
const fs = require("node:fs/promises");

const PORT = 9000;
const HOST = "0.0.0.0";

const server = new Butter();

server.route("get", "/", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/index.html", "text/html");
  // res.status(200).sendFile(__dirname + "/public/style.css", "text/css");
});

server.route("get", "/style.css", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/style.css", "text/css");
  // res.status(200).sendFile(__dirname + "/public/style.css", "text/css");
});

server.route("get", "/index.js", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/index.js", "text/javascript");
});

server.listen(PORT, HOST, () => {
  // console.log(server.address());
  console.log(`web server is live at http://${HOST}:${PORT}`);
});
