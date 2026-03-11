const http = require("node:http");
const fs = require("node:fs/promises");

const PORT = 9000;
const HOST = "0.0.0.0";

const server = http.createServer();

server.on("request", async (req, resp) => {
  console.log(req.url, req.method);
  if (req.url === "/" && req.method == "GET") {
    const fh = await fs.open(__dirname + "/public/index.html", "r");

    const stream = fh.createReadStream();

    resp.writeHead(200, "ok", {
      "content-type": "text/html",
    });

    stream.pipe(resp);
  }

  if (req.url === "/style.css" && req.method == "GET") {
    const fh = await fs.open(__dirname + "/public/style.css", "r");

    const stream = fh.createReadStream();

    resp.writeHead(200, "ok", {
      "content-type": "text/css",
    });

    stream.pipe(resp);
  }

  if (req.url === "/index.js" && req.method == "GET") {
    const fh = await fs.open(__dirname + "/public/index.js", "r");

    const stream = fh.createReadStream();

    resp.writeHead(200, "ok", {
      "content-type": "text/javascript",
    });

    stream.pipe(resp);
  }

  if (req.url === "/login" && req.method == "POST") {
    resp.writeHead(200, "ok", {
      "content-type": "application/json",
    });

    resp.end(
      JSON.stringify({
        message: "logged in",
      }) + "\n",
    );
  }

  if (req.url === "/user" && req.method == "PUT") {
    resp.writeHead(200, "ok", {
      "content-type": "application/json",
    });

    resp.end(
      JSON.stringify({
        message: "updated your info",
      }) + "\n",
    );
  }

  if (req.url === "/upload" && req.method == "PUT") {
    resp.writeHead(200, "ok", {
      "content-type": "application/json",
    });

    const fh = await fs.open(__dirname + "/storage/image.png", "w");

    const stream = fh.createWriteStream();

    req.pipe(stream);

    // req.on("data", (chunk) => {
    //   stream.write(chunk);
    // });

    req.on("end", () => {
      resp.end(
        JSON.stringify({
          message: "upload done",
        }) + "\n",
      );
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(server.address());
  console.log(`web server is live at http://${HOST}:${PORT}`);
});
