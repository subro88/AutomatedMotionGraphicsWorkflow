#!/usr/bin/env python3
import http.server
import json
import os
import socketserver
import sys
import threading
import time
import urllib.parse
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STORYBOARD_FILE = ROOT / "src/data/storyboard.json"
PORT = 8080

approved_event = threading.Event()

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Interactive Storyboard Builder — Motion Graphics Deck</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <!-- Motion (formerly Framer Motion) Standalone Browser Core -->
  <script src="https://cdn.jsdelivr.net/npm/motion@latest/dist/motion.js"></script>
  <style>
    :root {
      --bg: #060911;
      --card-bg: #0c1322;
      --card-border: #1e2c4a;
      --accent: #00f2fe;
      --accent-slide: #38bdf8;
      --accent-info: #10b981;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 32px 24px;
      line-height: 1.5;
    }
    .header {
      max-width: 1200px;
      margin: 0 auto 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 24px;
    }
    h1 {
      font-size: 1.8rem;
      background: linear-gradient(135deg, #fff, var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .btn {
      background: linear-gradient(135deg, var(--accent), #4facfe);
      color: #060911;
      font-weight: 800;
      border: none;
      padding: 12px 28px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.95rem;
      box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
      transform: translate3d(0, 0, 0);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
    }
    .btn:hover {
      transform: translate3d(0, -2px, 0);
      box-shadow: 0 6px 20px rgba(0, 242, 254, 0.5);
    }
    .btn:active {
      transform: translate3d(0, 1px, 0) scale(0.97);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
      border: 1px solid var(--card-border);
      box-shadow: none;
      margin-right: 12px;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      box-shadow: none;
    }
    .deck-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 24px;
    }
    .scene-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 24px;
      position: relative;
      transform: translate3d(0, 0, 0);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease;
    }
    .scene-card:hover {
      transform: translate3d(0, -4px, 0);
      border-color: rgba(0, 242, 254, 0.4);
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .badge {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 10px;
      border-radius: 999px;
    }
    .badge-kinetic { background: rgba(0, 242, 254, 0.15); color: var(--accent); border: 1px solid rgba(0, 242, 254, 0.3); }
    .badge-corporate_slide { background: rgba(56, 189, 248, 0.15); color: var(--accent-slide); border: 1px solid rgba(56, 189, 248, 0.3); }
    .badge-infographic { background: rgba(16, 185, 129, 0.15); color: var(--accent-info); border: 1px solid rgba(16, 185, 129, 0.3); }
    
    label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-muted);
      display: block;
      margin: 12px 0 4px;
    }
    input, select, textarea {
      width: 100%;
      background: #090e1a;
      border: 1px solid var(--card-border);
      color: #fff;
      padding: 10px 12px;
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.88rem;
    }
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--accent);
    }
    .del-btn {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 0.8rem;
    }
    .del-btn:hover { text-decoration: underline; }
    .timing-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <h1>Interactive Storyboard Builder</h1>
      <div id="recipe-badge" style="display: inline-block; font-size: 0.76rem; background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 3px 12px; border-radius: 999px; margin-top: 6px;"></div>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 6px;">
        Review &amp; fine-tune scene types (Motion Graphics, Corporate Slides, Infographics) before rendering • Motion GPU Accelerated.
      </p>
    </div>
    <div>
      <button class="btn btn-secondary" onclick="addScene()">+ Add Scene</button>
      <button class="btn" onclick="saveAndApprove()">Approve &amp; Render Deck ➔</button>
    </div>
  </div>

  <div id="deck" class="deck-container"></div>

  <script>
    let storyboard = STORYBOARD_DATA;

    // Initialize recipe badge
    const badgeEl = document.getElementById("recipe-badge");
    if (badgeEl && storyboard) {
      const rec = storyboard.recipeName || storyboard.recipe || "Production Storyboard";
      const intens = storyboard.intensity || "Standard";
      const aspect = storyboard.aspectRatio || "16:9";
      badgeEl.innerHTML = `🎬 <b>Recipe:</b> ${rec} &nbsp;|&nbsp; <b>Intensity:</b> ${intens} &nbsp;|&nbsp; <b>Target:</b> ${aspect}`;
    }

    function renderDeck() {
      const container = document.getElementById("deck");
      container.innerHTML = "";

      storyboard.scenes.forEach((s, idx) => {
        const card = document.createElement("div");
        card.className = "scene-card";

        let typeBadgeClass = "badge-kinetic";
        if (s.type === "corporate_slide") typeBadgeClass = "badge-corporate_slide";
        if (s.type === "infographic") typeBadgeClass = "badge-infographic";

        let customFields = "";
        if (s.type === "corporate_slide") {
          const bullets = s.bullets || ["Point 1", "Point 2", "Point 3"];
          customFields = `
            <label>Bullets (Comma-separated)</label>
            <input type="text" value="${bullets.join(", ")}" onchange="updateBullets(${idx}, this.value)" />
          `;
        } else if (s.type === "infographic") {
          customFields = `
            <div class="timing-row">
              <div>
                <label>Metric Value</label>
                <input type="text" value="${s.metricValue || "+142%"}" onchange="updateField(${idx}, 'metricValue', this.value)" />
              </div>
              <div>
                <label>Metric Label</label>
                <input type="text" value="${s.metricLabel || "Acceleration"}" onchange="updateField(${idx}, 'metricLabel', this.value)" />
              </div>
            </div>
          `;
        }

        card.innerHTML = `
          <div class="card-top">
            <span class="badge ${typeBadgeClass}">Scene ${idx + 1}</span>
            <button class="del-btn" onclick="deleteScene(${idx})">✕ Remove</button>
          </div>

          <label>Scene Visual Archetype</label>
          <select onchange="changeType(${idx}, this.value)">
            <option value="kinetic" ${s.type === "kinetic" ? "selected" : ""}>Kinetic Motion Graphics</option>
            <option value="corporate_slide" ${s.type === "corporate_slide" ? "selected" : ""}>Corporate Executive Slide</option>
            <option value="infographic" ${s.type === "infographic" ? "selected" : ""}>Infographics & Data Chart</option>
          </select>

          <label>Scene Title / Headline</label>
          <input type="text" value="${s.title || ""}" onchange="updateField(${idx}, 'title', this.value)" />

          <label>Subtitle / Category</label>
          <input type="text" value="${s.subtitle || s.category || ""}" onchange="updateField(${idx}, 'subtitle', this.value)" />

          ${customFields}

          <div class="timing-row">
            <div>
              <label>Start Frame</label>
              <input type="number" value="${s.startFrame}" onchange="updateField(${idx}, 'startFrame', parseInt(this.value))" />
            </div>
            <div>
              <label>Duration (Frames)</label>
              <input type="number" value="${s.durationInFrames}" onchange="updateField(${idx}, 'durationInFrames', parseInt(this.value))" />
            </div>
          </div>
        `;
        container.appendChild(card);
      });

      // Staggered spring entrance using Motion
      if (window.Motion && window.Motion.animate) {
        window.Motion.animate(
          ".scene-card",
          { opacity: [0, 1], transform: ["scale(0.95) translateY(16px)", "scale(1) translateY(0)"] },
          { delay: window.Motion.stagger(0.045), duration: 0.45, easing: [0.16, 1, 0.3, 1] }
        );
      }
    }

    function updateField(idx, field, val) {
      storyboard.scenes[idx][field] = val;
    }

    function updateBullets(idx, val) {
      storyboard.scenes[idx].bullets = val.split(",").map(b => b.trim());
    }

    function changeType(idx, newType) {
      storyboard.scenes[idx].type = newType;
      renderDeck();
    }

    function deleteScene(idx) {
      storyboard.scenes.splice(idx, 1);
      renderDeck();
    }

    function addScene() {
      const last = storyboard.scenes[storyboard.scenes.length - 1];
      const nextStart = last ? (last.startFrame + last.durationInFrames) : 0;
      storyboard.scenes.push({
        id: "scene_" + (storyboard.scenes.length + 1),
        type: "corporate_slide",
        startFrame: nextStart,
        durationInFrames: 300,
        title: "New Strategic Overview",
        subtitle: "Executive Presentation",
        bullets: ["Key milestone one", "Autonomous velocity", "Final delivery"]
      });
      renderDeck();
    }

    function saveAndApprove() {
      fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyboard)
      }).then(() => {
        document.body.innerHTML = `
          <div style="text-align: center; margin-top: 15vh;">
            <h1 style="font-size: 2.5rem; color: #00f2fe; margin-bottom: 16px;">✔ Storyboard Approved!</h1>
            <p style="color: #94a3b8; font-size: 1.1rem;">Rendering Multi-Scene Master Deck in Remotion &amp; DaVinci Resolve...</p>
            <p style="color: #64748b; font-size: 0.85rem; margin-top: 24px;">You can now close this tab.</p>
          </div>
        `;
      });
    }

    renderDeck();
  </script>
</body>
</html>
"""

class StoryboardHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            data = "{}"
            if STORYBOARD_FILE.exists():
                data = STORYBOARD_FILE.read_text(encoding="utf-8")
            html = HTML_TEMPLATE.replace("STORYBOARD_DATA", data)
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(html.encode("utf-8"))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/api/save":
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length).decode("utf-8")
            parsed = json.loads(body)
            STORYBOARD_FILE.parent.mkdir(parents=True, exist_ok=True)
            STORYBOARD_FILE.write_text(json.dumps(parsed, indent=2), encoding="utf-8")
            print(f"\n✓ [Storyboard GUI] User approved storyboard with {len(parsed.get('scenes', []))} scenes.")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
            approved_event.set()
        else:
            self.send_response(404)
            self.end_headers()

def launch_storyboard_builder(timeout_sec: int = 120, auto_open: bool = True):
    server = socketserver.TCPServer(("", PORT), StoryboardHandler)
    server.allow_reuse_address = True
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    
    url = f"http://localhost:{PORT}"
    print(f"\n🎨 [Storyboard Builder] GUI live at {url}")
    print(f"⏳ Waiting for user approval (or auto-approving in {timeout_sec}s)...")
    if auto_open:
        try:
            webbrowser.open(url)
        except Exception:
            pass

    approved = approved_event.wait(timeout=timeout_sec)
    if not approved:
        print("⏰ Timeout reached; auto-approving current storyboard.json configuration.")
    server.shutdown()
    print("✓ [Storyboard Builder] Proceeding to Remotion Multi-Scene Render.")

if __name__ == "__main__":
    launch_storyboard_builder(timeout_sec=180, auto_open=True)

