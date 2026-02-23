const { Writable } = require("node:stream");

const fs = require("node:fs");
const fsp = require("node:fs/promises");

class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({
      highWaterMark,
    });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunksLength = 0;
    this.writesCount = 0;
  }

  _construct(callback) {
    // runs after constructor is ran.
    // it will put off all calling the other methods (_write..) until the callback function is called.
    // acts like a internal bootstrap.

    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        // if arg is passed, it's an error. stop proceeding.
        callback(err);
      } else {
        this.fd = fd;
        // no args means success
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    // do opertation
    // console.log(this.fd);
    this.chunks.push(chunk);
    this.chunksLength += chunk.length;

    if (this.chunksLength > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) return callback(err);
        this.chunks = [];
        this.chunksLength = 0;
        ++this.writesCount;
        callback();
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    // runs after stream is done.
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);

      this.chunks = [];
      this.chunksLength = 0;
      ++this.writesCount;
      callback(); // important. nodejs internally emits events on these callbacks.
    });
  }

  _destroy(error, cb) {
    console.log("Number of writes: ", this.writesCount);

    if (this.fd) {
      fs.close(this.fd, (err) => {
        cb(err | error);
      });
    } else {
      cb(error);
    }
  }
}

// const ws = new FileWriteStream({
//   highWaterMark: 1800,
//   fileName: __dirname + "/text.txt",
// });

// ws.write(Buffer.from("some string.", "utf-8"));

// ws.end(Buffer.from(" end", "utf-8"));

// ws.on("finish", () => {
//   console.log("done");
// });

(async () => {
  console.time("writeMany");
  //   let fh;
  let stream;
  let drained = 0;
  try {
    // use custom stream
    stream = new FileWriteStream({
      fileName: __dirname + "/text.txt",
    });

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

    writeMany(10_00_000);
  } catch (error) {
    console.error(error);
  } finally {
    stream.on("finish", () => {
      console.timeEnd("writeMany");
      console.log("Drained:", drained);
      //   fh?.close();
      //   stream?.close();
    });
  }
})();
