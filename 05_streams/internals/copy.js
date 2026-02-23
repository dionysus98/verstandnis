// run node writeMany.js before running this.
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream");

// * higher memory usage, but faster
// (async () => {
//   console.time("Copy");
//   const destFile = await fs.open(__dirname + "/text_copy.txt", "w");
//   const res = await fs.readFile(__dirname + "/file.txt", "utf-8");
//   await destFile.write(res);
//   console.timeEnd("Copy");
// })();

// * lower memory usage, faster but not as fast as direct write.
// without using streams.
// (async () => {
//   console.time("Copy");
//   const src = await fs.open(__dirname + "/file.txt", "r");
//   const target = await fs.open(__dirname + "/copy.txt", "w");
//   let res = await src.read();
//   while (res.bytesRead) {
//     // note: size of chunk: 16kb by default in NodeJS.
//     if (res.bytesRead < 16384) {
//       const zeroIdx = res.buffer.indexOf(0);
//       const buff = Buffer.alloc(zeroIdx);
//       // update the new buffer with res buffer content
//       res.buffer.copy(buff, 0, 0, zeroIdx);
//       target.write(buff);
//     } else {
//       target.write(res.buffer);
//     }

//     res = await src.read();
//   }

//   console.timeEnd("Copy");
// })();

// * using streams (& piping)
// (async () => {
//   console.time("Copy");
//   const src = await fs.open(__dirname + "/file.txt", "r");
//   const target = await fs.open(__dirname + "/stream_copy.txt", "w");

//   const rs = src.createReadStream();
//   const ws = target.createWriteStream();

//   rs.pipe(ws); // understand the sematics of pipe in docs. (read-stream -> .pipe -> write-stream)

//   rs.once("end", () => console.timeEnd("Copy"));
// })();

// * using streams (& pipelines)
(async () => {
  console.time("Copy");
  const src = await fs.open(__dirname + "/file.txt", "r");
  const target = await fs.open(__dirname + "/stream_copy.txt", "w");

  const rs = src.createReadStream();
  const ws = target.createWriteStream();

  pipeline(rs, ws, (err) => {
    err && console.error(err);
  });

  console.timeEnd("Copy");
})();
