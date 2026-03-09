const dgram = require("node:dgram"); // UDP

const PORT = 5544;

const receiver = dgram.createSocket("udp4");

receiver.on("message", (msg, remoteInfo) => {
  console.log("Remote info:", remoteInfo);
  console.log("Message:", msg.toString("utf-8"));
});

receiver.bind(PORT, "127.0.0.1");

receiver.on("listening", () => {
  console.log("Receiver running on:", receiver.address());
});
