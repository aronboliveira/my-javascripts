const fs = require("fs"),
  path = require("path"),
  dir = process.argv[2] || process.cwd(),
  rExp = /(\.(?:post|get|put|patch|delete|trace|connect))\((["`'])\/.*\2/g,
  getFiles = (readPath, filesList = []) => {
    console.log(`Reading ${readPath}...`);
    fs.readdirSync(readPath, "utf-8").forEach((c) => {
      const fullPath = path.join(readPath, c);
      if (fs.statSync(fullPath).isDirectory()) getFiles(fullPath, filesList);
      else if (fs.statSync(fullPath).isFile()) filesList.push(fullPath);
    });
    return filesList;
  };
console.log("Starting procedure...");
const list = getFiles(dir).filter((f) => /\.(?:[cm]?(?:jsx?|tsx?))$/g.test(f));
if (list == false) console.log("No file was found!");
else
  list.forEach((f) => {
    if (!fs.statSync(f).isFile()) return;
    let cont = fs.readFileSync(f, {
      encoding: "utf-8",
    });
    const matches = Array.from(cont.match(rExp) ?? []),
      repeating = [];
    for (let i = 0; i < matches.length; i++) {
      // Getting the array without the element of the main iteration
      const otherMatches = matches.toSpliced(i, 1);
      for (let j = 0; j < otherMatches.length; j++) {
        if (otherMatches[j] !== matches[i]) continue;
        else {
          // If there is repetition, push so it goes to the procedure for duplicated; there is no need to keep iterating
          repeating.push(otherMatches[j]);
          break;
        }
      }
    }
    const iterated = [],
      usedPatterns = [];
    for (let i = 0; i < repeating.length; i++) {
      const closingChar = repeating[i].slice(-1),
        seq = repeating[i].slice(0, -1),
        n = matches.indexOf(repeating[i]) + i + 1,
        replacementString = `${seq}-${n}${closingChar}`,
        replacementPattern = new RegExp(
          replacementString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        ),
        originalPattern = new RegExp(
          repeating[i].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        );
      if (replacementPattern.test(cont)) continue;
      console.log(
        "Replacing " + originalPattern + " with " + replacementString
      );
      cont = cont.replace(originalPattern, replacementString);
      iterated.push(n);
      usedPatterns.push(replacementPattern);
    }
    if (!repeating.length) return;
    fs.writeFileSync(f, cont, "utf-8");
    console.log(`Written to ${f}`);
  });
