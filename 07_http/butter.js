const http = require("node:http");
const fs = require("node:fs/promises");

class Butter {
  constructor() {
    this._server = http.createServer();

    // "[method] [path]": (req,res) => {};
    this._routes = {};
    this._middlewares = [];

    this._server.on("request", (req, res) => {
      console.log("incoming request", req.url, req.method);
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

      // TODO: maybe rewrite this, blyat
      const handler = this._routes[route] || function (req, res) {
        res.end()
      };



      // if (typeof handler !== "function") {
      //   return res.status(404).json({
      //     error: "not found",
      //   });
      // }

      this._runMiddleware(this._middlewares, req, res, () => handler(req, res));

      // if (this._middlewares.length) {
      //   // run the middleware before router handler.
      //   // maybe can be done better
      //   [...this._middlewares].reverse().reduce(
      //     (cb, middleware) => {
      //       return () => middleware(req, res, cb);
      //     },
      //     () => handler(req, res),
      //   )();
      // } else {
      //   handler(req, res);
      // }
    });
  }

  route = (method, path, cb) => {
    this._routes[`${method.toLowerCase()} ${path}`] = cb;
  };

  beforeEach = (cb) => {
    this._middlewares.push(cb);
  };

  _runMiddleware = ([...middlewares], req, res, cb) => {
    if (!middlewares.length) {
      return cb();
    }

    const middleware = middlewares.pop();

    this._runMiddleware(middlewares, req, res, () => middleware(req, res, cb));
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
