const net = require("node:net");
const fs = require("node:fs/promises");

const PORT = 5050;
const HOST = "0.0.0.0";

const server = net.createServer(() => {});

server.on("connection", (socket) => {
  console.log("New connection");

  let fh, stream;

  socket.on("data", async (chunk) => {
    // console.log(chunk.toString("utf-8"));

    const filename = "test.txt";

    if (!fh) {
      fh = await fs.open(__dirname + "/storage/" + filename, "w");
      stream = fh.createWriteStream();
    }

    stream.write(chunk, (err) => {
      if (err) {
        throw err;
      }
    });
  });

  socket.on("end", () => {
    console.log("connection ended.");
    fh.close();
  });
});

server.listen(PORT, HOST, () => {
  console.log("Uploader Server opened on", server.address());
});
