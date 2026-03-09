const dgram = require("node:dgram"); // UDP

const PORT = 5544;

const sender = dgram.createSocket("udp4");

// TODO
sender.send("Hello!", PORT, "127.0.0.1", (err, bytes) => {
  if (err) {
    throw err;
  }
  console.log(bytes);
});
