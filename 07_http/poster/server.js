const Butter = require("../butter");

const PORT = 8999;
const HOST = "0.0.0.0";

// === in memory DB ===
// { userId: number, token: number }
const SESSIONS = [];

const USERS = [
  { id: 1, name: "Liam Brown", username: "liam1", password: "string" },
  { id: 2, name: "Julia Brown", username: "lia1", password: "string" },
  { id: 3, name: "Angela Brown", username: "angela1", password: "string" },
];

const POSTS = [
  {
    id: 1,
    title: "POST title",
    userId: 1,
    body: "eoiwcoiwncowe c owuenwoienwioe nwoenfiowenfw  noiewnowenf eoiwcoiwncowe c",
  },
];

const server = new Butter();

// for auth.
server.beforeEach((req, res, next) => {
  console.log("mw1");
  next(); // points to next middleware
});

server.beforeEach((req, res, next) => {
  setTimeout(() => {
    console.log("mw2");
    next(); // points to next middleware
  }, 2000);

  // console.log("mw2");
  // next(); // points to next middleware
});

server.beforeEach((req, res, next) => {
  console.log("mw3");
  next(); // points to the actual route
});

// === files routes ===

server.route("get", "/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html", "text/html");
});

server.route("get", "/login", (req, res) => {
  res.sendFile(__dirname + "/public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile(__dirname + "/public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile(__dirname + "/public/scripts.js", "text/javascript");
});

// === JSON routes ===
server.route("get", "/api/posts", (req, res) => {
  res.status(200).json(
    POSTS.map((post) => ({
      ...post,
      author: USERS.find((user) => user.id === post.userId).name,
    })),
  );
});

server.route("post", "/api/posts", (req, res) => {});

server.route("post", "/api/login", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString("utf-8");
  });

  req.on("end", () => {
    body = JSON.parse(body);

    const user = USERS.find(
      (user) =>
        user.username === body.username && user.password === body.password,
    );

    if (!user) {
      return res.status(401).json({
        error: "invalid username or password",
      });
    }

    const token = Math.floor(Math.random() * 10000000000).toString();

    SESSIONS.push({
      userId: user.id,
      token: token,
    });

    res.setHeader("Set-Cookie", [
      `token=${token}; Path=/;`,
      `username=${user.username}; Path=/;`,
    ]);

    res.status(200).json({
      message: "login success",
    });
  });
});

server.route("delete", "/api/logout", (req, res) => {});

server.route("get", "/api/user", (req, res) => {
  const cookies = req.headers.cookie.split("; ").reduce((acc, v) => {
    const [key, val] = v.split("=");
    return { ...acc, [key]: val };
  }, {});

  const session = SESSIONS.find(({ token }) => token === cookies.token);

  if (!session) {
    return res.status(401).json({
      error: "unauthorized",
    });
  }

  const user = USERS.find((user) => user.id === session.userId);

  if (!user) {
    return res.status(404).json({
      error: "not found",
    });
  }

  res.json({
    username: user.username,
    name: user.name,
  });
});

server.route("put", "/api/user", (req, res) => {});

// === start server ===
server.listen(PORT, HOST, () => {
  console.log("server started on PORT " + PORT);
});
