const { stdin, stdout, stderr } = require("node:process");

stdin.on("data", (chunk) => {
  console.log("stdin: ", chunk.toString("utf-8"));
});

// by default it's connect to tty.
stdout.write("stdout: some text\n");
stderr.write("stderr: some text I may not need\n");
