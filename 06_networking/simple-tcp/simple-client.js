const net = require("node:net");

const handler = () => {
  socket.write("Simple message!");
};

const socket = net.createConnection(
  {
    port: 3099,
    host: "127.0.0.1",
  },
  handler,
);
