// scripts/render_crucible_scenes.mjs
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const JOBS_DIR = path.join(ROOT, "out", "crucible_jobs");
const RENDERS_DIR = path.join(ROOT, "out", "crucible_renders");
const SCENES_DIR = path.join(ROOT, "src", "crucible_scenes");

fs.mkdirSync(JOBS_DIR, { recursive: true });
fs.mkdirSync(RENDERS_DIR, { recursive: true });

class CrucibleClient {
  constructor() {
    this.process = null;
    this.nextId = 1;
    this.pending = new Map();
    this.buffer = '';
  }

  async start() {
    console.log("🚀 Starting Crucible MCP Server...");
    this.process = spawn(
      process.execPath,
      [
        path.join(ROOT, "node_modules", "@codepawlhq", "crucible", "bin", "crucible-mcp.mjs"),
        "--backend", "gpu",
        "--browser", CHROME_PATH,
        "--jobs", JOBS_DIR,
        "--memory", "512"
      ],
      {
        stdio: ['pipe', 'pipe', 'inherit'],
        cwd: ROOT
      }
    );

    this.process.stdout.on('data', (chunk) => {
      this.buffer += chunk.toString();
      let lines = this.buffer.split('\n');
      this.buffer = lines.pop(); // keep last incomplete line

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line.trim());
          if (msg.id && this.pending.has(msg.id)) {
            const { resolve, reject } = this.pending.get(msg.id);
            this.pending.delete(msg.id);
            if (msg.error) {
              reject(new Error(msg.error.message || JSON.stringify(msg.error)));
            } else {
              resolve(msg.result);
            }
          }
        } catch (e) {
          // not json or intermediate text
        }
      }
    });

    // Initialize MCP handshake
    const res = await this.call("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "crucible-render-client", version: "1.0.0" }
    });
    console.log("✔ Connected to Crucible Server:", res.serverInfo.name, "v" + res.serverInfo.version);
  }

  call(method, params) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      const payload = JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n";
      this.process.stdin.write(payload);
    });
  }

  async callTool(name, args = {}) {
    return this.call("tools/call", { name, arguments: args });
  }

  stop() {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
}

async function run() {
  const client = new CrucibleClient();
  try {
    await client.start();

    const scenes = [
      { file: "mechanical_gears.json", name: "Mechanical Gears" },
      { file: "electrical_transformer.json", name: "Electrical Transformer" },
      { file: "holographic_diploma.json", name: "Holographic Diploma" }
    ];

    for (const sc of scenes) {
      console.log(`\n==================================================`);
      console.log(`🎬 Processing: ${sc.name} (${sc.file})`);
      console.log(`==================================================`);

      const recipePath = path.join(SCENES_DIR, sc.file);
      const recipe = JSON.parse(fs.readFileSync(recipePath, 'utf8'));

      // 1. Create Scene
      console.log("  1. Uploading JSON recipe to Crucible...");
      const createRes = await client.callTool("scene_create", { recipe });
      const sessionId = createRes?.content?.[0]?.text 
        ? JSON.parse(createRes.content[0].text).sessionId 
        : null;
      console.log("  ✔ Scene loaded. Session ID:", sessionId || "active");

      // 2. Render Look / Still Preview
      console.log("  2. Rendering high-resolution GPU preview still...");
      const lookRes = await client.callTool("scene_look", { width: 768, height: 512 });
      
      // Look response contains image content or file path
      const outPng = path.join(RENDERS_DIR, `${path.basename(sc.file, '.json')}.png`);
      if (lookRes?.content) {
        for (const item of lookRes.content) {
          if (item.type === 'image' && item.data) {
            fs.writeFileSync(outPng, Buffer.from(item.data, 'base64'));
            console.log(`  ✔ Saved Snapshot: ${outPng} (${Math.round(fs.statSync(outPng).size / 1024)} KB)`);
          } else if (item.type === 'text') {
            console.log("  ℹ Render Info:", item.text.slice(0, 100));
          }
        }
      }

      // 3. Clean up scene
      if (sessionId) {
        await client.callTool("scene_dispose", { sessionId });
      }
    }

    console.log("\n✨ All 3D Scene Snapshots generated successfully in out/crucible_renders/!");
  } catch (err) {
    console.error("❌ Crucible Render Error:", err);
  } finally {
    client.stop();
  }
}

run();
