// scripts/test_crucible_launch.mjs
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const JOBS_DIR = path.join(ROOT, "out", "crucible_jobs");

console.log("Testing Crucible MCP Server initialization...");
console.log("Chrome executable:", CHROME_PATH);
console.log("Jobs directory:", JOBS_DIR);

const child = spawn(
  process.execPath,
  [
    path.join(ROOT, "node_modules", "@codepawlhq", "crucible", "bin", "crucible-mcp.mjs"),
    "--backend", "gpu",
    "--browser", CHROME_PATH,
    "--jobs", JOBS_DIR
  ],
  {
    stdio: ['pipe', 'pipe', 'inherit'],
    cwd: ROOT
  }
);

child.stdout.on('data', (data) => {
  console.log('[Crucible MCP Output]:', data.toString());
});

// Send JSON-RPC initialize request
const initRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "test-client", version: "1.0.0" }
  }
};

child.stdin.write(JSON.stringify(initRequest) + "\n");

setTimeout(() => {
  console.log("Shutting down test process...");
  child.kill();
  process.exit(0);
}, 3000);
