const net = require("node:net");
const fs = require("node:fs/promises");

const PORT = 5050;
// const HOST = "::1";

const client = net.createConnection(
  {
    port: PORT,
    // host: HOST,
  },
  async () => {
    const path = __dirname + "/file.txt";
    const fh = await fs.open(path, "r");

    const stream = fh.createReadStream();

    stream.on("data", (chunk) => {
      client.write(chunk, (err) => {
        if (err) {
          throw err;
        }
      });
    });


    stream.on("end", () => {
      console.log("Successfully uploaded.");
      client.end();
    });
  },
);
