const fs = require("fs"),
  path = require("path");
module.exports = {
  addExtensions: (dir = "dist/") => {
    dir = path.resolve(dir);
    console.log(`Processing ${dir}`);
    fs.readdir(dir, { encoding: "utf-8", withFileTypes: true }, (e, files) => {
      if (e) {
        console.log(`Failed to read ${dir} files: ${e.message}`);
        return;
      }
      for (let i = 0; i < files.length; i++) {
        const f = files[i],
          pd = path.resolve(dir, f.name);
        console.log(`Reading path ${pd}`);
        if (f.isDirectory()) module.exports.addExtensions(pd);
        else if (f.isFile() && (f.name.endsWith(".js") || f.name.endsWith(".jsx"))) {
          console.log(`Reading file ${f.name}`);
          fs.readFile(pd, "utf-8", (fE, c) => {
            if (fE) {
              console.log(`Failed to read ${f.name}: ${fE.message}`);
              return;
            }
            const newC = c
              .replace(
                /(import\s+[\w{}\s,*]*\s+from\s+['"`](\.|@(?=\/))[^'"`]+)(?<!\.(js|jsx|cjs|mjs|css|scss|sass|ts|tsx|cts|mts))['"`];/g,
                '$1.js";',
              )
              .replace(/(import\(['"`][^'"`]+)(?<!\.(js|jsx|cjs|mjs|css|scss|sass|ts|tsx|cts|mts))['"`]\)/g, '$1.js")')
              .replace(/import\s+['"`][^'"`]+['"`];/g, "//$&")
              .replace(/\.scss|\.sass/g, ".css");
            newC !== c &&
              fs.writeFile(pd, newC, "utf-8", cE => {
                if (cE) {
                  console.log(`Failed to write file ${f.name}: ${cE.message}`);
                  return;
                }
              });
          });
        }
      }
    });
  },
};
