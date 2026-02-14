const http = require("node:http");
const fs = require("node:fs");

const server = http.createServer();

server.on("request", (req, resp) => {
    const result = fs.readFileSync("./text.txt")
    resp.setHeader("Content-Type", "text/plain");
    resp.end(result);
})

server.listen(4080, "127.0.0.1", () => {
    console.log("Server has started on:", server.address())
})