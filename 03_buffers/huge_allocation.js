const { Buffer, constants } = require("buffer");

const buff = Buffer.alloc(1e9); // 1gb

console.log(constants)

setInterval(() => {
    // console.log(buff.byteLength)

    // for (let i = 0; i < buff.length; i++) {
    //     buff[i] = 0x22;
    // }

    // efficient way to fill buffer.
    buff.fill(0x22);
}, 5000)


