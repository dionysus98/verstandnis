const http = require("node:http");

const HOST = "127.0.0.1";
const PORT = 5500;

// agent here is responsible for managing TCP connections.
const agent = new http.Agent({
  keepAlive: true,
});

const req = http.request({
  agent,
  host: HOST,
  port: PORT,
  path: "/posts/create",
  method: "POST",
  headers: {
    "content-type": "application/json",
    username: "avy",
    // "content-length": 16 // in bytes
  },
});

// Emitted only once?
req.on("response", (res) => {
  console.log(res.statusCode, res.statusMessage);
  console.log(res.headers);

  res.on("data", (chunk) => {
    console.log(chunk.toString("utf-8"));
  });

  res.on("end", () => {
    console.log("No more data in response.");
  });
});

req.write(JSON.stringify({ title: "Hello!" }));
req.write(JSON.stringify({ message: "kak dela?" }));
req.end(JSON.stringify({ footer: "bye!" }));
