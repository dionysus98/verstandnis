const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

// these are all separate from each other
// - encryption/decryption
//      - secure data in some way (lot of algorithms are available)
// - compression
//      - reduce size of data
// - hashing,salting
//      - hashing is a bit different from encrpytion,
//      - after hashing it can be reversed
//      - so ususally input is hased and checked against the hashed value.
// - decoding/encoding
//      - usually binary to some other format.

class Encrypt extends Transform {
  _transform(chunk, encoding, callback) {
    // for this simple eg,
    // let's just add 1 to each byte in out chunk.
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] !== 255) {
        chunk[i] += 1;
      }
    }
    // this.push(chunk);
    callback(null, chunk);
  }
}

(async () => {
  const rfh = await fs.open(__dirname + "/read.txt", "r");
  const wfh = await fs.open(__dirname + "/write.txt", "w");

  const rs = rfh.createReadStream();
  const ws = wfh.createWriteStream();
  const encrypt = new Encrypt();

  rs.pipe(encrypt).pipe(ws);
})();
