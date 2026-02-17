const fs = require("fs");
const fsp = require("fs/promises");

// == Different way to work FS in node. ==

// 1. Promises API (async) (non-blocking)
(async () => {
    try {
        await fsp.copyFile(__dirname + "/file.txt", __dirname + "/copied_p.txt");
    } catch (err) {
        console.log(err);
    }
})();


// 2. Callback API (non-blocking) in FS module is faster and performant
fs.copyFile(__dirname + "/file.txt", __dirname + "/copied_c.txt", (err) => {
    if (err) console.error(err);
})

// 3. Sync API (blocking)
fs.copyFileSync(__dirname + "/file.txt", __dirname + "/copied_s.txt")