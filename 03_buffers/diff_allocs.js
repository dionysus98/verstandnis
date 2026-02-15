const { Buffer } = require("buffer");

// const buff = Buffer.alloc(1000); // allocates 0 by default
const buffUnsafe = Buffer.allocUnsafe(10000); // won't alloc 0 by default. a bit faster. it could make use of he buffer pre-allocated by node, if size < Buffer.poolSize >>> 1
// console.log(buffUnsafe)

for (let i = 0; i < buffUnsafe.length; i++) {
    if (buffUnsafe[i] !== 0) {
        console.log(`el at position ${i} has value: ${buffUnsafe[i].toString(2)}`);
    }
}

