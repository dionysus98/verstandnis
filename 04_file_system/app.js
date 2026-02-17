const fs = require("fs");

console.log(fs.readFileSync(__dirname + "/text.txt"));

console.log(fs.readFileSync(__dirname + "/text.txt", "utf-8"));
