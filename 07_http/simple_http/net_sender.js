const net = require("node:net");

const PORT = 5500;

const handler = () => {
  //todo:
  // use packet to send actual http request. from wireshark
  client.write("Simple message!");
};

const client = net.createConnection(
  {
    port: PORT,
    host: "127.0.0.1",
  },
  handler,
);

client.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
  // client.end();
});
