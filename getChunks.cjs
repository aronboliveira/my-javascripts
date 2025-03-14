const { writeFileSync, readdirSync, statSync } = require("fs");
path = require("path");
const getFiles = (curr = path.join(__dirname, "/"), files = []) => {
  const exp = /\.chunk\.(c?[tj]sx?|m?[tj]s)$/i;
  readdirSync(curr, "utf-8").forEach((f) => {
    const fullPath = path.join(curr, f);
    statSync(fullPath).isDirectory()
      ? getFiles(fullPath, files)
      : f.match(exp) && files.push(fullPath);
  });
  return files;
};
writeFileSync(
  path.join(__dirname, "/chunks.json"),
  JSON.stringify({ scripts: [...new Set(getFiles())] }),
  "utf-8"
);
