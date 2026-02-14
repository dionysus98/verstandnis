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

### 03.4 Character Encodings.
