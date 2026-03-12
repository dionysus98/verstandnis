const http = require("node:http");
const fs = require("node:fs/promises");

class Butter {
  constructor() {
    this._server = http.createServer();

    // "[method] [path]": (req,res) => {};
    this._routes = {};

    this._server.on("request", (req, res) => {
      console.log("incoming request", req.headers);
    });

    this._server.on("request", (req, res) => {
      //   sends file back to client
      res.sendFile = async (path, mime) => {
        const fh = await fs.open(path, "r");
        const stream = fh.createReadStream();

        res.setHeader("Content-Type", mime);

        stream.pipe(res);
      };

      res.status = (statusCode) => {
        res.statusCode = statusCode;
        return res;
      };

      res.json = (data) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
        // return res;
      };

      const route = `${req.method.toLowerCase()} ${req.url}`;

      const handler = this._routes[route];

      if (typeof handler !== "function") {
        return res.status(404).json({
          error: "not found",
        });
      }
      
      handler(req, res);
    });
  }

  route = (method, path, cb) => {
    this._routes[`${method.toLowerCase()} ${path}`] = cb;
  };

  listen = (port, host, cb) => {
    if (typeof host == "function" && !cb) {
      this._server.listen(port, host);
    } else if (typeof host == "string" && typeof cb == "function") {
      this._server.listen(port, host, cb);
    }
  };
}

module.exports = Butter;
