# Fundamentals using NodeJS (cause I'm stupid)

## 01. Intro

- Machine Code
  <----- [Assembler] Assembly Language
  <----- [compiler] low-level languages (c,cpp,rust,zig,etc)
  <----- high-level languages (js,java,python,etc)

- NodeJs process
  - V8 engine & libuv & other low-level libs.
    - OS (underlaying)
      - CPU
      - RAM
      - Storage
      - Network Card
  - Also Node's EventLoop plays a crucial role in Node architecture at the same level as V8.
    - both v8 and eventloop runs in a single thread.
    - libuv internally has a threadpool which by default contains 4 thread. :o
      - though nodejs tries i'ts best not to use this threadpool

## 02. Events

- some important apis: `on`, `emit`, `once`, `error` event (registered event).
- ref [events implementation](https://github.com/nodejs/node/tree/main/lib/events.js)

## 03. Buffers

- Buffers are very important since they help connect to low level constructs such as binary data. (TODO: change this statement)

### 03.1 Binary Numbers

- Base 2 numbers
- everything is binary data (0s, 1s).
- The most basic unit in a computer is 1 bit.
  - note: 1 byte = 8 bits.
- so, `1101` -> `4 bits` (of data)
- for eg: `01011` (base 2) ->
  - base 2 means that you'll multiple the number with
    2 to the power of it's index, starting from right most
  - for this `01011`:
    - `1 * 2^0` -> `1 * 1` --> 1
    - `1 * 2^1` -> `1 * 2` --> 2
    - `0 * 2^2` -> `0 * 4` --> 0
    - `1 * 2^3` -> `1 * 8` --> 8
    - `1 * 2^4` -> `1 * 16` -> 0
    - ------------------------ 11
- for binary `01001`
  - the right most number `1` is called Least Significant Bit/Digit (LSB/LSD)
  - the left most number `0` is the Most signification bit/digit (MSB/MSD)

### 03.2 Hexadecimal numbers

- Base 16 numbers
- conversion between hex<->binary is super easy.
  - any 4 bits you pick there's exactly one hexadecimal char that you can use. and only one char.
  - so, if a file has 4000 bits -> 1000 hex
- Let's say we have `456` decimal -> usually 0x456 hexa representation.
- same a base 2, we will use 16 for multiplcation.
  - So, base 16 means that you'll multiple the number with 16 to the power of it's index, starting from right most
  - for 0x456,
    - `6 * 16^0` -> `6 * 001` --> 6
    - `5 * 16^1` -> `5 * 016` --> 80
    - `4 * 16^2` -> `4 * 256` --> 1024
    - -------------------------- 1110
- hexa digit can be: [0~9, A~F] 0 to 9 continued with A to F (representing 10 to 15).
- So something like for 0xfa3c,
  - `c * 16^0` -> `12 * 0001` --> 12
  - `3 * 16^1` -> `03 * 0016` --> 48
  - `a * 16^2` -> `10 * 0256` --> 2560
  - `f * 16^3` -> `15 * 4092` --> 6140
  - ----------------------------- 64060
- remember any 4 bits can be represented by a single hex.

### 03.3 Character Sets/Encodings.

#### 03.3.1 Character Sets

- letters & symbols(chars) that a writing system uses, and a representation of assigning different number of those characters
- most used char sets:
  - [unicode](https://home.unicode.org/) (vast)
    - it supports most characters used worldwide
  - [ascii](https://en.wikipedia.org/wiki/ASCII)
    - it's only for english and it only supports 128 chars
    - it's a 7 bit code.
    - man pages has ascii page on unix. try it out.
- It's a subset of Unicode. So, it's chars have same number as unicode. (eg: 's' is 115, for both character sets.)

#### 03.3.2 Character Encodings

##### 03.3.2.1 Encoders:

- take some data convert to binary
- "whater" -> 001010101
- in this case, a system of assigning a sequence of bytes (just binary, 1 byte = 8 bits) to a character.
- the most common encoding is `utf-8`, defined by Unicode standard.
  - `utf-8` (8 bit sequences) here each character is stored in either 8 bit, 16 bit, 32 bit...
  - the MSB is always 0 in the 8 bit sequence.

- for eg `"string"`:
  - s -> 115 -> 0111 0011
  - t -> 116 -> 0111 0100
  - r -> 114 -> 0111 0010
  - i -> 105 -> 0110 1001
  - n -> 110 -> 0110 1110
  - g -> 103 -> 0110 0111

##### 03.3.2.2 Decoders:

- take binary convert to some data
- 001010101 -> "whater"

### 03.4 Concept of buffer:

- It's a container in memory. We allocate a space in memory with some size.
- They act like an array.
  - it has elements. (in nodejs each element holds 8 bits (1 byte))
  - it's also indexed.
  - by default on allocation, all the bits in the elements is assinged as 0.
- The buffer size is fixed. They are a datastructure, specifically designed to work with binary data.
  - you can quickly insert, update and pull it out.

- TODO:
  - understand big and little endian
  - understand floating point numbers
  - understand binary arithemetic

## 04. File System

- In general (in simpler terms), file is just a sequence of bits.
- Each sequence of bits can be represented differenly, eg: text, image, video, may interept these bits differenty.
- In general, a file data may contain:
  - name
  - protection
  - location
  - type
  - timestamps
  - size
  - ...
- Everything is just files, even the whole OS is just a bunch of files orchestrated to work together. (in simpler terms)

- Nodejs runs a process on top of your OS.
  - So it starts to make syscalls to your OS. just like C.

## 05. Streams:

- Important to know. Buffers are core of steams.
- what are streams?
  - From node [docs](https://nodejs.org/api/stream.html#stream): It's an abstract interface for working with streaming data.
  - Stream in CS represents continuos data (data flowing)
  - transfering data in chunks rather than bulk transfer, if that helps. sendind data in chunks.
  - size of chunk: 16kb by default in NodeJS.
  - eg: file systems, network, stdout etc.

### 05.1 [types of streams](https://nodejs.org/api/stream.html#types-of-streams):

- Writable
  - stream would have an internal buffer(16kb by default)
  - `stream.write(data)`
    - pushes buffer data to this internal buffer, continuously until it's filled, becoming a single chunk
    - once it's filled, this chunk is the removed from the buffer (draining the buffer) and written to the target. (and we only write once).
    - remember buffer is some memory in a specific location
- Readable
  - stream would have an internal buffer(16kb by default)
  - `stream.push(data)`
    - pushes buffer data to this internal buffer, continuously until it's filled, becoming a single chunk
    - once it's filled, this chunk is the removed from the buffer (draining the buffer) and send as an event to `"data"` event. (note: `Stream` extends `EventEmitter` )
    - `stream.on("data", (chunk) => {})` this how you read.
- Duplex
  - it has 2 internal buffers. acting as both read and write streams :o
- Transform
  - it has 2 internal buffers. kinda like duplex, but it transforms it's data.

### 05.2 misc regarding encrytion [TODO, update notes later]

these are all separate from each other

- encryption/decryption
  - secure data in some way (lot of algorithms are available)
- compression
  - reduce size of data
- hashing,salting
  - hashing is a bit different from encrpytion,
  - after hashing it can be reversed
  - so ususally input is hased and checked against the hashed value.
- decoding/encoding
  - usually binary to some other format.
