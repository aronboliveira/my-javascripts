const fs = require("fs"),
  path = require("path");
/*
	@param		str											dir
	@param		function | undefined		cb
	@param		any[]										args
	@return		void
*/
export const walkDir = (dir, cb, ...args) => {
  dir ||= "./";
  if (typeof dir !== "string") return;
  for (const c of fs.readdirSync(dir)) {
    const pt = path.join(dir, c),
      stt = fs.statSync(pt);
    if (stt.isDirectory()) {
      cb && cb(pt, ...args);
      walkDir(pt, cb, ...args);
    } else if (stt.isFile()) cb && cb(pt, ...args);
  }
};
