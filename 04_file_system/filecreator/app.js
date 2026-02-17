const fsp = require("node:fs/promises");
const { Buffer } = require("buffer");

// note: syscall open() -> fd (filedescriptor)

(async () => {

    const createFile = async (filepath) => {
        let fh;
        try {
            // "r" flag would throw an exception if file is not found.
            fh = await fsp.open(filepath, "r");
            console.log(`The file ${filepath} already exists.`);
        } catch (err) {
            // let's create the file
            fh = await fsp.open(filepath, "w");
            console.log(`file created!`);
        } finally {
            await fh?.close();
        }

    }

    const deleteFile = async (filepath) => {
        try {
            await fsp.unlink(filepath);
            console.log(`deleted!`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('File does not exist, skipping deletion.');
            } else {
                console.error('Error deleting file:', error.message);
            }
        }
    }

    const renameFile = async (srcPath, targetPath) => {
        try {
            await fsp.rename(srcPath, targetPath);
            console.log(`renamed!`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('File does not exist, skipping renaming');
            } else {
                console.error('Error renaming file:', error.message);
            }
        }
    }

    const addToFile = async (filepath, content) => {
        let fh;
        try {
            // "r" flag would throw an exception if file is not found.
            fh = await fsp.open(filepath, "a");
            await fh.writeFile(content, "utf-8");
            console.log("wrote successfully");
        } catch (error) {
            // let's create the file
            console.error('Error creating file:', error.message);

        } finally {
            await fh?.close();
        }
    }


    const CREATE_FILE = "create file";
    const DELETE_FILE = "delete file";
    const RENAME_FILE = "rename file";
    const ADD_TO_FILE = "insert file";

    const filepath = __dirname + "/command.txt";
    let fileHandler;

    try {
        fileHandler = await fsp.open(filepath, "r");

        fileHandler.on("change", async () => {
            const stat = await fileHandler.stat();

            const buff = Buffer.alloc(stat.size);

            await fileHandler.read(
                {
                    buffer: buff,
                    // read this many bytes
                    length: buff.byteLength,
                    // location at which we want to start fillin out buffer
                    offset: 0,
                    // read from position
                    position: 0
                }
            );

            const content = buff.toString("utf-8");

            if (content.includes(CREATE_FILE)) {
                const filePath = content.substring(CREATE_FILE.length + 1).trim();

                await createFile(filePath);
            }

            if (content.includes(DELETE_FILE)) {
                const filePath = content.substring(DELETE_FILE.length + 1).trim();

                await deleteFile(filePath);
            }

            if (content.includes(RENAME_FILE)) {
                const [srcPath, targetPath] =
                    content
                        .substring(RENAME_FILE.length + 1)
                        .split(" ")
                        .filter((x) => x.length);

                await renameFile(srcPath, targetPath);
            }

            if (content.includes(ADD_TO_FILE)) {
                const [filePath, data] =
                    content
                        .substring(ADD_TO_FILE.length + 1)
                        .split("\n")
                        .filter((x) => x.length)

                await addToFile(filePath, data);
            }


        })

        const watcher = fsp.watch(filepath);

        for await (const event of watcher) {
            switch (event.eventType) {
                case "change":
                    fileHandler.emit("change");
                    break;
                case "rename":
                    console.error("renamed file")
                    return;
                    break
                default:
                    break;
            }
        }


    } catch (err) {
        console.error(err);
    } finally {
        await fileHandler?.close()
    }
})();
