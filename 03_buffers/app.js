const { Buffer } = require("buffer");

// creates a container of memory with fixed size of 4 bytes (32 bits), initialized with zeros.
// remember in node each element in a buffer is 8 bits. 0 - 255
const memContainer = Buffer.alloc(4);

console.log(memContainer);
console.log(memContainer[0]);

memContainer[0] = 0xff;
memContainer[1] = 0x34;
memContainer[2] = 0x00;
memContainer[3] = 0xff;

// memContainer.writeInt8(-34, 2);

console.log(memContainer[0]);
console.log(memContainer.readInt8(2));
console.log(memContainer.toString("hex"));

// memContainer.forEach((x)=>console.log(x))


console.log(Buffer.from("486921", "hex").toString("utf-8"));
console.log(Buffer.from("Hi!", "utf-8")); 