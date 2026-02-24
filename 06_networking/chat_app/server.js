const net = require("node:net");

const PORT = 3399;
const HOST = "127.0.0.1";

// create TPC server (note: IPC can also be created.)
const server = net.createServer();
let clients = [];

// Socket:
//   - when two networking endpoints are communicating together is called a socket.
server.on("connection", (socket) => {
  const clientId = `${clients.length + 1}`;

  console.log(`New connection ${clientId} to the server!`);

  socket.write(`id-${clientId}`);

  clients.forEach((client) => {
    client.socket.write(`User ${clientId} joined!`);
  });

  socket.on("data", (chunk) => {
    const data = chunk.toString("utf-8");
    const [id, msg] = data.split("-message-");

    clients.forEach((client) => {
      client.socket.write(`> User ${id}: ${msg}`);
    });
  });

  socket.on("end", () => {
    clients = clients.filter((c) => c.clientId !== clientId);

    clients.forEach((client) => {
      client.socket.write(`User ${clientId} left.`);
    });
  });

  clients.push({ clientId, socket });
});

server.listen(PORT, HOST, () => {
  console.log("started server on :", server.address());
});
