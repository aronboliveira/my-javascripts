const readline = require("readline");
export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  removeHistoryDuplicates: true,
});
/*
	@param		str											qt
	@param		str											def
	@return		void
*/
export const prompt = (qt, def) => {
  return new Promise((res) =>
    rl.question(
      `${qt}? The default value is ${def}. If you want to keep the default, prompt 'd'`,
      (inp) => {
        const trimmed = inp?.trim().replace(/\s/g, "-");
        if (!trimmed) {
          console.warn(`The input value was rejected. Defaulting...`);
          res(def);
          return;
        }
        inp?.toLowerCase() === "d" ? res(def) : res(trimmed);
      }
    )
  );
};
