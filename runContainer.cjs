export const dockerFiles = new Map();
let { imgName } = require("./buildImage.cjs");
require("dotenv").config({ path: "../env" });
const { rl, prompt } = require("./prompt.cjs"),
  crypto = require("crypto"),
  run = require("./run.cjs"),
  defaultName = process.env.CONTAINER_NAME || crypto.randomUUID();
(async () => {
  try {
    imgName ||= process.env.IMAGE_NAME;
    const containerName = await prompt(
      `Input the container name:\n`,
      defaultName
    );
    let v = defaultVers;
    console.log("\nRunning container...\n");
    if (!defaultVers) {
      const defaultingTo = "latest";
      v = await prompt(
        `No version for the container was found in the environmental variables. Input the version you want to call (default is ${defaultingTo}):\n`,
        defaultingTo
      );
    }
    const defBC = ".",
      buildContext = await prompt(
        `Input the build context (default is ${defBC}):\n`,
        defBC
      );
    if (!imgName) throw TypeError(`No valid image name found`);
    await run(
      "docker",
      [
        "run",
        "-d",
        src,
        "-t",
        "-p",
        "3000:3000",
        "-v",
        "frontend_cache:/app/cache",
        "-v",
        "frontend_cache:/app/data",
        `${imgName}:${v}`,
      ],
      buildContext
    );
    rl.close();
    console.log(`Finished Running ${containerName}!`);
  } catch (e) {
    rl.close();
    console.error(`Error: ${e.name} — ${e.message}`);
    process.exit(1);
  }
})();
