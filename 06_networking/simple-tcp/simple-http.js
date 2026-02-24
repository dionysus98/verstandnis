const http = require("http");

const PORT = 4080;
const HOST = "127.0.0.1"; // change to host IP addr.

const server = http.createServer((req, res) => {
  console.log(req);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Connection", "close");
  res.statusCode = 200;
  res.end(JSON.stringify({ message: "hi there!" }));
});

server.listen(PORT, HOST, () => {
  console.log(`server running on: http://${HOST}:${PORT}`);
});
