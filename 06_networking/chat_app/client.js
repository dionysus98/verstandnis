const net = require("node:net");
const readline = require("node:readline/promises");
const process = require("node:process");
const { dir } = require("node:console");

const PORT = 3399;
const HOST = "127.0.0.1";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let clientId;

const client = net.createConnection({
  port: PORT,
  host: HOST,
});

const clearLine = (dir) => {
  // dir: -1 (left), 1 (right), 0 (whole line)
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  // dir: -1 (left/up), 1 (right/down), 0 (whole line)
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const resetLine = async () => {
  await moveCursor(0, -1); // move up once
  await clearLine(0); // clear whole line
};

const showChatInferface = async () => {
  try {
    const msg = await rl.question("> ");

    if (msg.trim() === "/exit") {
      rl.close();
      client.end();
      return;
    }

    await resetLine();
    client.write(`${clientId}-message-${msg}`);
  } catch (err) {
    if (err.name !== "AbortError") throw err;
  }
};

client.on("connect", async () => {
  console.log("Connected to server!");
  await showChatInferface();
});

client.on("data", async (chunk) => {
  const msg = chunk.toString("utf-8");

  console.log(); // empty log.
  await resetLine(); // move cursor up

  if (msg.startsWith("id-")) {
    clientId = msg.substring(3);
    console.log(`your id is ${clientId}`);
  } else {
    console.log(msg);
  }

  await showChatInferface();
});

client.on("end", () => {
  rl.close();
  console.log("Connection ended!");
});
