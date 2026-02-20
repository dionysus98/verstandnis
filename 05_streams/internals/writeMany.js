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

// const fsp = require("node:fs/promises");

// (async () => {
//   console.time("writeMany");
//   let fh;
//   let stream;
//   try {
//     fh = await fsp.open(__dirname + "/file.txt", "w");
//     stream = fh.createWriteStream();

//     for (let i = 0; i < 1_000_000; i++) {
//       const buff = Buffer.from(`${i}\n`, "utf-8");
//       stream.write(buff);
//     }
//   } catch (error) {
//     console.error(error);
//   } finally {
//     await fh?.close();
//     stream?.close();
//   }
//   console.timeEnd("writeMany");
// })();

// === Streams way (fixing memory issue) ===

const fsp = require("node:fs/promises");

(async () => {
  console.time("writeMany");
  let fh;
  let stream;
  let drained = 0;
  try {
    fh = await fsp.open(__dirname + "/file.txt", "w");
    stream = fh.createWriteStream();

    // - capacity
    // console.log(stream.writableHighWaterMark);
    // - length
    // console.log(stream.writableLength);

    // const buff = Buffer.from("wrote!", "utf-8");

    // again: 8 bits ->  1byte.
    //        each bit -> 0 || 1.
    //        1000 bytes = 1 kilobye
    //        1000 kilobytes = 1 megabyte

    // hex: 1a -> 1(4bits) + a(4bits) -> 8bits

    // const buff = Buffer.alloc(1e8, 10);
    // console.log(buff);
    // const buff = Buffer.alloc(stream.writableHighWaterMark - 1, 10);
    // `stream.write` would return false if stream's internal buffer has reached the HighWaterMark.
    // console.log(stream.write(buff));
    // console.log(stream.write(Buffer.alloc(1, "a")));
    // console.log(stream.write(Buffer.alloc(1, "a")));
    // console.log(stream.write(Buffer.alloc(1, "a")));

    // stream.on("drain", () => {
    //   console.log("drained: ");
    //   console.log(stream.write(Buffer.alloc(1, "a")));
    // });

    // setInterval(() => {}, 1000);

    // stream.write(buff);

    // console.log(stream.writableLength);
    const writeMany = (iter = 1_000_000, n = 0) => {
      for (let i = n; i < iter; i++) {
        const buff = Buffer.from(`${i} `, "utf-8");

        // last possible write
        if (i === iter - 1) {
          return stream.end(buff);
          // .write after .end will return an exception.
        }

        if (!stream.write(buff)) {
          stream.once("drain", () => {
            drained++;
            writeMany(iter, i + 1);
          });
          break;
        }
      }
    };

    writeMany(1_000_000);

  } catch (error) {
    console.error(error);
  } finally {
    stream.on("finish", () => {
      console.timeEnd("writeMany");
      console.log("Drained:", drained);
      fh?.close();
      stream?.close();
    });
  }
})();
