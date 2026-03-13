const Butter = require("../butter");

const PORT = 8999;
const HOST = "0.0.0.0";

// === in memory DB ===
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

    res.status(200).json({
      message: "login success",
    });
  });
});

server.route("get", "/api/user", (req, res) => {});

// === start server ===
server.listen(PORT, HOST, () => {
  console.log("server started on PORT " + PORT);
});
