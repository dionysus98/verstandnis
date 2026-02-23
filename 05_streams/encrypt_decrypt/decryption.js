const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Decrypt extends Transform {
  _transform(chunk, encoding, callback) {
    
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] !== 255) {
        chunk[i] -= 1;
      }
    }
    this.push(chunk);
    callback();
  }
}

(async () => {
  const rfh = await fs.open(__dirname + "/write.txt", "r");
  const wfh = await fs.open(__dirname + "/decrypt.txt", "w");

  const rs = rfh.createReadStream();
  const ws = wfh.createWriteStream();
  const descrypt = new Decrypt();

  rs.pipe(descrypt).pipe(ws);
})();
