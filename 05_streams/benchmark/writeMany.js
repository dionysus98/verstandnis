// === ASYNC way ===

// const fsp = require("node:fs/promises");

// (async() => {
//     console.time("writeMany");

//     let fh;
//     try {

//         fh = await fsp.open(__dirname + "/file.txt", "w");

//         for (let i = 0; i < 1_000_000; i++) {
//             await fh.write(` ${i} `);
//         }

//     } catch (error) {
//         console.error(error);

//     } finally {
//         await fh?.close();
//     }
//     console.timeEnd("writeMany");
// })();

// === CALLBACK way ===

// const fs = require("node:fs");

// (() => {
//   console.time("writeMany");
//   fs.open(__dirname + "/file.txt", "w", (err, fd) => {
//     if (err) {
//       console.err(err);
//       return;
//     }

//     for (let i = 0; i < 1_000_000; i++) {
//       const buff = Buffer.from(`${i}\n`, "utf-8");
//       fs.writeSync(fd, buff);
//       //   fs.writeSync(fd, `${i}\n`);
//       //   `callback write` occupies a lot of memory
//       //   fs.write(fd, `${i}\n`, (err) => {});
//     }

//     fs.close(fd, (err) => console.error(err));
//   });
//   console.timeEnd("writeMany");
// })();

// === Streams way (naively) ===

const fsp = require("node:fs/promises");

(async () => {
  console.time("writeMany");
  let fh;
  let stream;
  try {
    fh = await fsp.open(__dirname + "/file.txt", "w");
    stream = fh.createWriteStream();

    for (let i = 0; i < 1_000_000; i++) {
      const buff = Buffer.from(`${i}\n`, "utf-8");
      stream.write(buff);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await fh?.close();
    stream?.close();
  }
  console.timeEnd("writeMany");
})();
