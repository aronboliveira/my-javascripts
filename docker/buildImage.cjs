export const dockerFiles = new Map();
export let imgName = "";
require("dotenv").config({ path: "../env" });
const fs = require("fs"),
  { rl, prompt } = require("../utils/prompt.cjs"),
  crypto = require("crypto"),
  run = require("../utils/run.cjs"),
  walkDir = require("../utils/walkDir.cjs"),
  defaultName = process.env.IMAGE_NAME || crypto.randomUUID(),
  defaultSrc = process.env.IMAGE_SRC,
  defaultVers = process.env.IMAGE_VERSION;
(async () => {
  try {
    imgName = await prompt(`Input the image name:\n`, defaultName);
    let src = defaultSrc,
      v = defaultVers;
    if (!src) {
      let acc = 0;
      const defRoot = "../",
        rootDir = await prompt(
          `Input the relative root to walk on (default is ${defRoot}):\n`,
          defRoot
        );
      walkDir(rootDir, (p) => {
        p ||= "./";
        if (typeof p !== "string") return;
        const st = fs.statSync(p);
        if (st.isFile() && p.endsWith("Dockerfile")) {
          dockerFiles.set(acc.toString(), p);
          acc += 1;
        }
      });
      let jsonDfs = "";
      try {
        jsonDfs =
          [...dockerFiles.entries()]
            .map(([key, val]) => `${key}: ${val}`)
            .join("\n") || JSON.stringify(Object.fromEntries(dockerFiles));
      } catch (e) {}
      const i = await prompt(
          `No default Dockerfile was defined for the environment, but Dockerfile(s) were located:\n\n${
            jsonDfs || "NULL"
          }}.\n\nInput the index for the one you want to use, based on the shown map:\n`,
          defaultSrc
        ),
        chosenDf = dockerFiles.get(i);
      if (!chosenDf) throw new RangeError(`The given index was rejected`);
      if (!fs.statSync(chosenDf).isFile())
        throw new ReferenceError(
          `The value for the index does not represent a file`
        );
      src = chosenDf;
    }
    console.log("\nBuilding image...\n");
    if (!defaultVers) {
      const defaultingTo = "latest";
      v = await prompt(
        `No version for the image was found in the environmental variables. Input the version you want to call (default is ${defaultingTo}):\n`,
        defaultingTo
      );
    }
    const defBC = ".",
      buildContext = await prompt(
        `Input the build context (default is ${defBC}):\n`,
        defBC
      );
    await run(
      "docker",
      ["build", "-f", src, "-t", `${imgName}:${v}`],
      buildContext
    );
    rl.close();
    console.log(`Finished building ${imgName}!`);
  } catch (e) {
    rl.close();
    console.error(`Error: ${e.name} — ${e.message}`);
    process.exit(1);
  }
})();
