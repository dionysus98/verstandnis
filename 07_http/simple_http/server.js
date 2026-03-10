const http = require("node:http"); // native module to node.

const PORT = 5500;
const HOST = "127.0.0.1";

const server = http.createServer();

// req is a readable stream
// res is a writeable stream
server.on("request", (req, res) => {
  let data = [];

  console.log("============");
  console.log("method", req.method);
  console.log("url", req.url);
  console.log("header", req.headers);

  const username = req.headers.username;

  console.log("BODY");

  req.on("data", (chunk) => {
    // console.log("data", chunk.toString("utf-8"));
    data.push(chunk.toString("utf-8"));
  });

  req.on("end", () => {
    data = data
      .map(JSON.parse)
      .reduce((post, item) => ({ ...post, ...item }), {});

    console.log(data);
    console.log(username);

    res.writeHead(200, "ok", {
      "content-type": "application/json",
    });

    res.end(
      JSON.stringify({
        from: username,
        status: "processed",
        payload: data,
      }),
    );
  });

  console.log("============");
});

server.listen(PORT, HOST, () => {
  const addr = server.address();
  console.log(
    "Server listening on:",
    typeof addr === "string" ? addr : `http://${addr.address}:${addr.port}`,
  );
});
