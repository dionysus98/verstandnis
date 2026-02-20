// run node writeMany.js before running this.
const fs = require("node:fs/promises");

(async () => {
  //
  const fhr = await fs.open(__dirname + "/file.txt", "r");

  const fhw = await fs.open(__dirname + "/dest.txt", "w");

  // 65kb highwatermarkvalue
  const streamRead = fhr.createReadStream();
  const streamWrite = fhw.createWriteStream();

  console.log("highWaterMark", streamRead.readableHighWaterMark);

  let split = "";

  // event to listen to incoming data for readable streamRead.
  streamRead.on("data", (chunk) => {
    const nums = chunk.toString("utf-8").split(" ");

    if (nums[0] && Number(nums[0]) !== Number(nums[1]) - 1 && split.length) {
      nums[0] = split + nums[0];
    }

    if (Number(nums[nums.length - 2]) + 1 !== Number(nums[nums.length - 1])) {
      split = nums.pop();
    }

    // console.log({ s: nums[0] || nums[1], e: nums[nums.length - 1] });

    const evens = nums.filter((n) => Number(n) % 2 === 0).join(" ");

    if (!streamWrite.write(evens)) {
      // pause reading
      streamRead.pause();
    }
  });

  streamWrite.on("drain", () => {
    // resume the paused
    if (streamRead.isPaused()) {
      streamRead.resume();
    }
  });

  streamRead.on("end", (...args) => {
    console.log("end:");
  });

  //   console.log(fh);
})();
