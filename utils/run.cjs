const { spawn } = require("child_process");
/*
	@param		str											cmd
	@param		any[]										args
	@return		void
*/
export const run = (cmd, args = []) => {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: "inherit" });
    p.on("spawn", () => console.log(`Started command process...`));
    p.on("disconnect", () => console.log(`Disconnecting...`));
    p.on("close", (n) =>
      n === 0
        ? res()
        : rej(new Error(`${cmd} ${args.join(" ")} failed with code ${n}`))
    );
  });
};
