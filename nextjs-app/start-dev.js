// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawn } = require("child_process");
const p = spawn("node", [
  "node_modules/next/dist/bin/next",
  "dev", "--webpack", "--port", "3008"
], { stdio: "inherit", cwd: __dirname, shell: true });
process.on("exit", () => p.kill());
p.on("exit", (c) => { if (c) process.exit(c); });
