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

## 06. Networking

Basic networking Concepts:

- Ethernet cable
  - cable where data is transmitted.
- Switches
  - connect computer to switch via cables
  - login to the switch and manual configure it.
  - multiple computers are connected to this switch.
  - computer should have a networking card.
- Network card:
  - each computer these days has a networking card installed to it.
  - and each of them have a unique MAC address configured to them
  - A MAC address (aka physical address) is 48 bits (6 bytes) represented in Hex usaully
- Packet:
  - to send data from system A to system B, it will send something called a Packet to the switch.
  - Packet will have data including:
    - source : MAC address
    - destination : MAC address
    - data : binary
  - The switch will handle the redirection of Packet from system A to system B based on their MAC address.

- Routers (or how to communicate between different networks):
  - routers are installed on top of the switches.
  - Instead of MAC address, they work with IP address.
  - Each router and it's systems would have unique IP addresses.
  - And it's the router's job to assign IP address to different systems in it's network.
  - So router is public IP and system is private IP.
  - And this is how the internet works, in a nutshell.
  - Also there are ports, which enables a single system to do different process based on it's port number.

### 06.1 Networking Layers

- Note, this is just a concept.

1. Physical Layer (bits):

- the most basic layer of network, your cables, system.
- only concers itself with moving bits.
- it has no idea about MAC address, IP address, switches etc. just moves data in bits.
- summary: Signals, Binary transmission

2. Data Link Layer (frames + switches):

- Moves data in Frames using Switches.
- So, It works with MAC address.

3. Network Layer (Packets + routers):

- Moves data in Packets using IP address.
- Path Determination.

4. Transport Layer (Segments):

- Moves data in segments.
- make sure packets are sent properly to other system in network.
  - retries on failure, etc.
- Here the port is also specified
- So, TCP/UDP are some protocols used in this layer, end-to-end connections.

5. Application Layer (Data):

- Works with `Data`.
- This is the layer of abstraction in which we develop our application

### 06.2 Understanding Transport Layer

- It gets the data from point A->B, has no idea about IP address, or how the data is being transmitted. it just makes sure data is received. [TODO, rework this point]
- It adds port numbers to move data to application layers.
- The two main protocols used for this Layer:
  - TCP:
    - make sure every single info/bit is being sent over by doing some extra work.
    - eg: application data, password etc.
  - UDP:
    - it doesn't concerns whether the data is actually received by the target. it just sends.
    - much faster, cause less work.
    - eg: used in streaming services..

#### 06.2.1 TCP:

- Three way Handshake:
  - The sender first sends packet to target machine.
  - once received, target will acknowledge it, and send it back to sender.
  - info for this is shared in headers.
- TCP common headers (segments):
  - source port: 16 bits
  - destination port: 16 bits
  - sequence number: 32 bits
  - acknowledgement number: 32 bits
  - length: 16 bits
  - checksum: 16 bits
  - Data: (optional)

#### 06.2.2 UDP:

- UDP headers (8byte):
  - source port: 16 bits
  - destination port: 16 bits
  - Segment length: 16 bits
  - checksum: 16 bits
  - Data: (optional)

### 06.3 IPv4

- IP -> Internet Protocol.
- IP and IP address are different things technically.
- note: There are to IP versions.
  - IPv4
  - IPv6
- IPv4 is 32 bits
  - it is divided into 4 portions.
  - eg:
    - 00001111.10101011.11111110.00000001
    - 15.171.254.1 (in decimal format)

  - 8 bits for each portion.
  - supports 2^32 unique addresses
  - we are running out of addresses :c

- subnet mask:
  - to differentiate between portions.
  - either net or host portion.
  - explain with eg:
    - For this Ip addr.
      - 00001111.10101011.11111110.00000001
      - - 15.171.254.1 (same in decimal format)
    - The subnet mask could be:
      - 11111111.11111111.11111111.00000000
    - This means first 24 bits are net portions
    - The 8 bits are host portions
    - The subnet mask is represent in the address like this:
      - 15.171.254.1/24
    - So, in this example, this network can support 254 hosts (8bits).
  - note: routers by default only work with net portions.

- Private IP addresses:
- we 3 ranges of private address.
  | from | to | mask |
  | ---- | -- | ---- |
  | 10.0.0.0 | 10.255.255.255 | 10.0/8 |
  | 172.16.0.0 | 172.31.255.255 | 172.16/12 |
  | 192.168.0.0 | 192.168.255.255 | 192.168/16 |
- also there's loopback address.
  | from | to | mask |
  | ---- | -- | ---- |
  | 127.0.0.0 | 127.255.255.255 | 127.0.0.0/8 |
  - wasted potential, since the network portion is 8 bits.

### 06.4 DNS

- PC -> TCP req (send Packets) to google.com -> DNS server -> TCP resp (including domain's IP add) -> PC

### 06.5 IPv6

- Even though IPv4 is still popular, but it's out of addresses hence IPv6 was introduced.
- The change between IPv4 and IPv6 only affects the `network layer` (layer 3).
- IPv6 is 128 bits (32 hex)
- It is separated into 8 portions, where each portion is 16 bits.
- eg:
  2401:1900:8de5:607e:c061:27c:9d78:2ac2
- representation conventions:
  - in each portion you can exclude all leading 0s
  - removing 0 portions can only be done once in a addr.
- The loopback addr for IPv6 is:
  - 0000:0000:0000:0000:0000:0000:0000:0001
  - ::1 (different repr for the same addr above)
- So, comparison:
  - IPv4 -> 2^32 -> 4~ billion.
  - IPv6 -> 2^128 -> 340~ trillion.
