const net = require("node:net");

const PORT = 3099;

const server = net.createServer((socket) => {
  // socket here is a Duplex Stream.
  socket.on("data", (chunk) => {
    console.log(chunk.toString("utf-8"));
  });
});


server.listen(PORT, "127.0.0.1", () => {
  console.log("opened server on", server.address());
});
