const fs = require("fs"),
  path = require("path"),
  readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Creating interface for sorting...",
  removeHistoryDuplicates: true,
});
rl.question("Enter the path: ", (p) => {
  const pt = path.join(__dirname, p.trim()),
    ct = fs.readFileSync(pt, "utf-8"),
    ending = "###END",
    endIndex = ct.indexOf(ending),
    hd = endIndex !== -1 ? ct.slice(0, ct.indexOf(ending)) : content,
    tl = endIndex !== -1 ? ct.slice(ct.indexOf(ending) + ending.length) : "";
  fs.writeFileSync(
    pt,
    `${hd
      .split(/[\n\t/]/g)
      .map((l) => l.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .join("\n")}\n\n${ending}\n${tl}`,
    "utf-8"
  );
  rl.close();
});
