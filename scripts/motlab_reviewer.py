#!/usr/bin/env python3
"""
Motlab Universal Frame-Accurate Review Viewer & Spatial Feedback Bridge
========================================================================
Provides an interactive frame-accurate web viewer for scrubbing videos,
clicking or drawing bounding boxes on specific visual elements, and saving
timestamped spatial revision notes into selection.json for coding agents.

Features:
- Pure Python zero-dependency HTTP server with HTTP Range streaming for smooth scrubbing.
- Dynamic Project Selector: switch seamlessly between any workstation project or video.
- Frame-stepping controls (< / > keys, J-K-L playback, timestamp overlay).
- Click-and-drag bounding box overlay on any video frame.
- Real-time selection.json synchronization.
- CLI modes: --watch, --apply, --list, and full interactive server.

Usage:
  python scripts/motlab_reviewer.py
  python scripts/motlab_reviewer.py --project "CanvasShowcase"
  python scripts/motlab_reviewer.py --video out/master/video.mp4 --project "MyProject"
  python scripts/motlab_reviewer.py --project "CanvasShowcase" --watch
  python scripts/motlab_reviewer.py --project "CanvasShowcase" --apply
"""

import os
import sys
import json
import time
import shutil
import argparse
import webbrowser
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from datetime import datetime, timezone

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent

# Import discovery engine
try:
    from scripts.motlab_projects import discover_projects
except ImportError:
    try:
        from motlab_projects import discover_projects
    except ImportError:
        def discover_projects():
            return []


def get_selection_path(project_name: str) -> Path:
    proj_dir = WORKSPACE_ROOT / "projects" / project_name
    proj_dir.mkdir(parents=True, exist_ok=True)
    return proj_dir / "selection.json"


def load_selection(project_name: str) -> dict:
    sel_path = get_selection_path(project_name)
    if not sel_path.exists():
        return {
            "version": "1.0.0",
            "project": project_name,
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "annotations": []
        }
    try:
        with open(sel_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"version": "1.0.0", "project": project_name, "annotations": []}


def save_selection(project_name: str, data: dict):
    sel_path = get_selection_path(project_name)
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    with open(sel_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


VIEWER_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Motlab Frame-Accurate Review Viewer</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0a0b10;
      --surface: #12141f;
      --surface-border: #232738;
      --accent: #6366f1;
      --accent-cyan: #38bdf8;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --danger: #ef4444;
      --success: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    header {
      background: var(--surface);
      border-bottom: 1px solid var(--surface-border);
      padding: 10px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 10;
      gap: 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo-badge {
      background: linear-gradient(135deg, var(--accent), var(--accent-cyan));
      color: #fff;
      font-weight: 800;
      font-size: 0.85rem;
      padding: 5px 12px;
      border-radius: 6px;
      letter-spacing: 0.05em;
    }
    .project-dropdown {
      background: #171a29;
      color: #fff;
      border: 1px solid var(--accent);
      padding: 6px 12px;
      border-radius: 8px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 600;
      font-size: 0.88rem;
      cursor: pointer;
      outline: none;
      min-width: 280px;
      transition: all 0.2s;
    }
    .project-dropdown:hover, .project-dropdown:focus {
      border-color: var(--accent-cyan);
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
    }
    .meta-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--accent-cyan);
      background: rgba(56, 189, 248, 0.1);
      padding: 4px 10px;
      border-radius: 4px;
      border: 1px solid rgba(56, 189, 248, 0.2);
    }
    .main-layout {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    .stage-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
      background: radial-gradient(circle at center, #151828 0%, #0a0b10 100%);
    }
    .video-wrapper {
      position: relative;
      max-width: 90vw;
      max-height: 72vh;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--surface-border);
    }
    video {
      display: block;
      max-width: 100%;
      max-height: 72vh;
      background: #000;
    }
    #draw-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: crosshair;
      z-index: 5;
    }
    .controls-bar {
      margin-top: 16px;
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 12px;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      width: min(850px, 90vw);
    }
    .btn {
      background: #1e2235;
      color: var(--text);
      border: 1px solid var(--surface-border);
      padding: 8px 14px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn:hover {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
    .btn-primary {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
    .time-readout {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      background: #0d0f17;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid var(--surface-border);
      white-space: nowrap;
    }
    .scrubber-slider {
      flex: 1;
      accent-color: var(--accent);
      cursor: pointer;
    }
    .sidebar {
      width: 380px;
      background: var(--surface);
      border-left: 1px solid var(--surface-border);
      display: flex;
      flex-direction: column;
    }
    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid var(--surface-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sidebar-title {
      font-size: 0.95rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .notes-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .note-card {
      background: #171a29;
      border: 1px solid var(--surface-border);
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .note-card:hover {
      border-color: var(--accent-cyan);
      background: #1d2235;
    }
    .note-card.active {
      border-color: var(--accent);
      background: rgba(99, 102, 241, 0.12);
    }
    .note-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .note-time {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--accent-cyan);
      font-weight: 600;
    }
    .note-badge {
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-pending { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .badge-resolved { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .note-body {
      font-size: 0.88rem;
      line-height: 1.4;
      color: #e2e8f0;
    }
    .note-bbox {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      color: var(--text-muted);
      margin-top: 6px;
    }
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .modal-box {
      background: var(--surface);
      border: 1px solid var(--accent);
      border-radius: 12px;
      width: 460px;
      max-width: 90vw;
      padding: 24px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.8);
    }
    .modal-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: #fff;
    }
    .modal-meta {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--accent-cyan);
      margin-bottom: 16px;
    }
    textarea {
      width: 100%;
      height: 100px;
      background: #0d0f17;
      border: 1px solid var(--surface-border);
      border-radius: 8px;
      padding: 12px;
      color: #fff;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.9rem;
      resize: vertical;
      margin-bottom: 16px;
    }
    textarea:focus {
      outline: none;
      border-color: var(--accent);
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .kbd-hint {
      font-size: 0.72rem;
      color: var(--text-muted);
      margin-top: 8px;
      text-align: center;
    }
    kbd {
      background: #1e2235;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--surface-border);
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <span class="logo-badge">MOTLAB</span>
      <select id="project-selector" class="project-dropdown">
        <option value="">Loading Projects...</option>
      </select>
    </div>
    <div class="meta-tag" id="header-meta">FPS: 30 / 60 • Zero Slop Video as Code</div>
  </header>

  <div class="main-layout">
    <div class="stage-container">
      <div class="video-wrapper" id="v-wrapper">
        <video id="v" src="/video" preload="auto"></video>
        <canvas id="draw-canvas"></canvas>
      </div>

      <div class="controls-bar">
        <button class="btn" id="btn-play">▶ Play</button>
        <button class="btn" id="btn-prev">◀ Frame</button>
        <button class="btn" id="btn-next">Frame ▶</button>
        <input type="range" class="scrubber-slider" id="scrubber" min="0" max="100" step="0.01" value="0">
        <div class="time-readout" id="time-display">00:00:00.00</div>
      </div>
      <div class="kbd-hint">
        <kbd>Space</kbd> Play/Pause • <kbd>&lt;</kbd> <kbd>&gt;</kbd> Step Frame • <kbd>Shift + &lt; &gt;</kbd> Jump 1s • Drag on video to annotate
      </div>
    </div>

    <div class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-title">
          <span>📝 Visual Notes</span>
          <span class="meta-tag" id="notes-count">0</span>
        </div>
        <button class="btn" id="btn-refresh" style="padding: 4px 8px; font-size: 0.75rem;">↻ Sync</button>
      </div>
      <div class="notes-list" id="notes-list">
        <!-- Rendered annotations -->
      </div>
    </div>
  </div>

  <!-- Annotation Modal -->
  <div class="modal-overlay" id="modal">
    <div class="modal-box">
      <div class="modal-title">📍 Add Visual Feedback Note</div>
      <div class="modal-meta" id="modal-meta">Time: 00:00:00.00 | BBox: 0, 0, 0, 0</div>
      <textarea id="modal-comment" placeholder="Describe the change needed (e.g., make this title 20% larger, adjust glow color to cyan, move 50px left)..."></textarea>
      <div class="modal-actions">
        <button class="btn" id="modal-cancel">Cancel</button>
        <button class="btn btn-primary" id="modal-save">Save Annotation</button>
      </div>
    </div>
  </div>

  <script>
    const v = document.getElementById('v');
    const canvas = document.getElementById('draw-canvas');
    const ctx = canvas.getContext('2d');
    const btnPlay = document.getElementById('btn-play');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const scrubber = document.getElementById('scrubber');
    const timeDisplay = document.getElementById('time-display');
    const notesList = document.getElementById('notes-list');
    const notesCount = document.getElementById('notes-count');
    const modal = document.getElementById('modal');
    const modalMeta = document.getElementById('modal-meta');
    const modalComment = document.getElementById('modal-comment');
    const modalCancel = document.getElementById('modal-cancel');
    const modalSave = document.getElementById('modal-save');
    const projectSelector = document.getElementById('project-selector');
    const headerMeta = document.getElementById('header-meta');

    let isDrawing = false;
    let startX = 0, startY = 0;
    let currentBox = null;
    let pendingAnnotation = null;
    let annotations = [];
    const FPS = 30;

    let currentProject = new URLSearchParams(window.location.search).get('project') || '__DEFAULT_PROJECT__';

    function resizeCanvas() {
      canvas.width = v.clientWidth;
      canvas.height = v.clientHeight;
      drawActiveBoxes();
    }
    window.addEventListener('resize', resizeCanvas);
    v.addEventListener('loadedmetadata', resizeCanvas);

    function formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      const f = Math.floor((sec % 1) * FPS);
      return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(f).padStart(2,'0')}`;
    }

    function updateTimeDisplay() {
      timeDisplay.textContent = formatTime(v.currentTime);
      if (!isDrawing && v.duration) {
        scrubber.value = (v.currentTime / v.duration) * 100;
      }
      drawActiveBoxes();
    }

    v.addEventListener('timeupdate', updateTimeDisplay);

    btnPlay.addEventListener('click', () => {
      if (v.paused) { v.play(); btnPlay.textContent = '⏸ Pause'; }
      else { v.pause(); btnPlay.textContent = '▶ Play'; }
    });

    btnPrev.addEventListener('click', () => {
      v.pause();
      v.currentTime = Math.max(0, v.currentTime - 1 / FPS);
      updateTimeDisplay();
    });

    btnNext.addEventListener('click', () => {
      v.pause();
      v.currentTime = Math.min(v.duration || 100, v.currentTime + 1 / FPS);
      updateTimeDisplay();
    });

    scrubber.addEventListener('input', (e) => {
      if (v.duration) {
        v.currentTime = (e.target.value / 100) * v.duration;
        updateTimeDisplay();
      }
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (modal.style.display === 'flex') return;
      if (e.code === 'Space') {
        e.preventDefault();
        btnPlay.click();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        v.pause();
        v.currentTime = Math.max(0, v.currentTime - (e.shiftKey ? 1.0 : 1 / FPS));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        v.pause();
        v.currentTime = Math.min(v.duration || 100, v.currentTime + (e.shiftKey ? 1.0 : 1 / FPS));
      }
    });

    // Drawing Bounding Boxes
    canvas.addEventListener('mousedown', (e) => {
      v.pause();
      btnPlay.textContent = '▶ Play';
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      currentBox = { x: startX, y: startY, w: 0, h: 0 };
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;
      currentBox.w = curX - startX;
      currentBox.h = curY - startY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawActiveBoxes();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(currentBox.x, currentBox.y, currentBox.w, currentBox.h);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(currentBox.x, currentBox.y, currentBox.w, currentBox.h);
      ctx.setLineDash([]);
    });

    canvas.addEventListener('mouseup', () => {
      if (!isDrawing) return;
      isDrawing = false;
      if (Math.abs(currentBox.w) > 10 && Math.abs(currentBox.h) > 10) {
        const normBox = {
          x: Math.round(Math.min(startX, startX + currentBox.w)),
          y: Math.round(Math.min(startY, startY + currentBox.h)),
          width: Math.round(Math.abs(currentBox.w)),
          height: Math.round(Math.abs(currentBox.h))
        };
        openModal(normBox);
      }
    });

    function openModal(box) {
      const curSec = v.currentTime;
      pendingAnnotation = {
        id: 'rev_' + Date.now().toString().slice(-6),
        project: currentProject,
        timestamp: Math.round(curSec * 100) / 100,
        frame: Math.round(curSec * FPS),
        timecode: formatTime(curSec),
        bbox: box,
        canvas_resolution: { width: canvas.width, height: canvas.height },
        status: 'pending'
      };
      modalMeta.textContent = `Time: ${formatTime(curSec)} (Frame ${pendingAnnotation.frame}) | Box: ${box.x}, ${box.y}, ${box.width}x${box.height}`;
      modalComment.value = '';
      modal.style.display = 'flex';
      modalComment.focus();
    }

    modalCancel.addEventListener('click', () => {
      modal.style.display = 'none';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawActiveBoxes();
    });

    modalSave.addEventListener('click', async () => {
      const comment = modalComment.value.trim();
      if (!comment) return;
      pendingAnnotation.comment = comment;
      modal.style.display = 'none';

      await fetch('/api/selection?project=' + encodeURIComponent(currentProject), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingAnnotation)
      });

      await fetchAnnotations();
      await fetchProjects(); // refresh note badge in dropdown
    });

    function drawActiveBoxes() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const curSec = v.currentTime;
      annotations.forEach(a => {
        if (Math.abs(a.timestamp - curSec) < 0.6) {
          ctx.strokeStyle = a.status === 'resolved' ? '#10b981' : '#6366f1';
          ctx.lineWidth = 2;
          ctx.strokeRect(a.bbox.x, a.bbox.y, a.bbox.width, a.bbox.height);
          ctx.fillStyle = a.status === 'resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.2)';
          ctx.fillRect(a.bbox.x, a.bbox.y, a.bbox.width, a.bbox.height);

          ctx.fillStyle = '#fff';
          ctx.font = '600 12px "JetBrains Mono"';
          ctx.fillText(a.comment.slice(0, 24) + '...', a.bbox.x + 4, a.bbox.y - 6);
        }
      });
    }

    async function fetchAnnotations() {
      try {
        const res = await fetch('/api/selection?project=' + encodeURIComponent(currentProject));
        const data = await res.json();
        annotations = data.annotations || [];
        renderSidebarNotes();
        drawActiveBoxes();
      } catch (e) {
        console.error('Failed to load notes', e);
      }
    }

    function renderSidebarNotes() {
      notesList.innerHTML = '';
      notesCount.textContent = annotations.length;
      annotations.forEach(a => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
          <div class="note-header">
            <span class="note-time">⏱ ${a.timecode}</span>
            <span class="note-badge badge-${a.status}">${a.status}</span>
          </div>
          <div class="note-body">${a.comment}</div>
          <div class="note-bbox">📍 [${a.bbox.x}, ${a.bbox.y}, ${a.bbox.width}x${a.bbox.height}]</div>
        `;
        card.addEventListener('click', () => {
          v.pause();
          v.currentTime = a.timestamp;
          updateTimeDisplay();
        });
        notesList.appendChild(card);
      });
    }

    // Projects Discovery & Dropdown
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const list = await res.json();
        if (!list || list.length === 0) return;

        projectSelector.innerHTML = '';
        list.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id;
          const genreIcon = {
            'canvas': '⚡',
            'motion-graphics': '🎬',
            '3d-realistic': '🧊',
            'anime': '⛩️',
            'podcast': '🎙️',
            'documentary': '📜'
          }[p.genre] || '📁';

          const vidBadge = p.video_path ? `${p.video_size_mb}MB` : 'no mp4';
          const noteBadge = p.pending_notes > 0 ? ` • ${p.pending_notes} notes` : '';
          opt.textContent = `${genreIcon} ${p.name} (${vidBadge}${noteBadge})`;
          if (p.id.toLowerCase() === currentProject.toLowerCase()) {
            opt.selected = true;
          }
          projectSelector.appendChild(opt);
        });

        // If currentProject wasn't found, pick first option
        if (!projectSelector.value && list.length > 0) {
          projectSelector.value = list[0].id;
          switchProject(list[0].id);
        }
      } catch (e) {
        console.error('Failed to fetch projects', e);
      }
    }

    function switchProject(newProjectId) {
      currentProject = newProjectId;
      v.src = '/video?project=' + encodeURIComponent(currentProject);
      v.load();
      window.history.pushState(null, '', '/?project=' + encodeURIComponent(currentProject));
      headerMeta.textContent = `Project: ${currentProject} • Frame-Accurate Zero Slop`;
      fetchAnnotations();
    }

    projectSelector.addEventListener('change', (e) => {
      switchProject(e.target.value);
    });

    document.getElementById('btn-refresh').addEventListener('click', () => {
      fetchAnnotations();
      fetchProjects();
    });

    // Initialize
    fetchProjects().then(() => {
      fetchAnnotations();
    });
  </script>
</body>
</html>
"""


class MotlabReviewHandler(BaseHTTPRequestHandler):
    video_path: Path = None
    project_name: str = "default_project"

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed.query)
        target_project = query.get("project", [self.project_name])[0]

        if parsed.path == "/" or parsed.path == "/index.html":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            rendered_html = VIEWER_HTML.replace("__DEFAULT_PROJECT__", self.project_name)
            self.wfile.write(rendered_html.encode("utf-8"))
            return

        if parsed.path == "/api/projects":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            projects = discover_projects()
            clean_list = [{k: v for k, v in p.items() if k != "mtime"} for p in projects]
            self.wfile.write(json.dumps(clean_list, indent=2).encode("utf-8"))
            return

        if parsed.path == "/api/selection":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            data = load_selection(target_project)
            self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))
            return

        if parsed.path == "/video":
            # Locate target video
            target_vid = None
            if target_project.lower() == self.project_name.lower() and self.video_path and self.video_path.exists():
                target_vid = self.video_path
            else:
                projects = discover_projects()
                matched = next((p for p in projects if p["id"].lower() == target_project.lower()), None)
                if matched and matched.get("video_path"):
                    target_vid = WORKSPACE_ROOT / matched["video_path"]

            # Fallback to self.video_path or newest video
            if not target_vid or not target_vid.exists():
                if self.video_path and self.video_path.exists():
                    target_vid = self.video_path
                else:
                    self.send_error(404, "No video found for selected project")
                    return

            file_size = target_vid.stat().st_size
            range_header = self.headers.get("Range")

            if range_header:
                byte_range = range_header.strip().split("=")[-1]
                start_str, end_str = byte_range.split("-")
                start = int(start_str) if start_str else 0
                end = int(end_str) if end_str else file_size - 1
                length = end - start + 1

                self.send_response(206)
                self.send_header("Content-Type", "video/mp4")
                self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
                self.send_header("Content-Length", str(length))
                self.send_header("Accept-Ranges", "bytes")
                self.end_headers()

                with open(target_vid, "rb") as f:
                    f.seek(start)
                    self.wfile.write(f.read(length))
            else:
                self.send_response(200)
                self.send_header("Content-Type", "video/mp4")
                self.send_header("Content-Length", str(file_size))
                self.send_header("Accept-Ranges", "bytes")
                self.end_headers()

                with open(target_vid, "rb") as f:
                    shutil.copyfileobj(f, self.wfile)
            return

        self.send_error(404, "Not Found")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed.query)

        if parsed.path == "/api/selection":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            new_note = json.loads(body)

            target_project = new_note.get("project") or query.get("project", [self.project_name])[0]

            data = load_selection(target_project)
            annotations = data.get("annotations", [])
            annotations.append(new_note)
            data["annotations"] = annotations
            save_selection(target_project, data)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok", "id": new_note.get("id")}).encode("utf-8"))
            print(f"\n[Motlab Review] 📥 New visual note for [{target_project}] at {new_note.get('timecode')}: {new_note.get('comment')}")
            return

        self.send_error(404, "Not Found")

    def log_message(self, format, *args):
        pass


def run_server(video_path: Path, project: str, port: int = 4173):
    handler = MotlabReviewHandler
    handler.video_path = video_path
    handler.project_name = project

    server = HTTPServer(("127.0.0.1", port), handler)
    url = f"http://127.0.0.1:{port}"
    if project:
        url += f"/?project={project}"

    print("\n" + "=" * 75)
    print(" 🎬 MOTLAB FRAME-ACCURATE REVIEW VIEWER (WITH PROJECT REGISTRY)")
    print("=" * 75)
    print(f" Default Project: {project}")
    print(f" Initial Video:   {video_path or '(Auto-Discovered from Project)'}")
    print(f" Local Web UI:    {url}")
    print("-" * 75)
    print(" Switch projects dynamically in the top-bar dropdown without reloading!")
    print(" Controls: Space = Play/Pause | < > = Step Frame | Drag Box = Add Note")
    print("=" * 75 + "\n")

    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nReview server stopped.")


def watch_selection(project: str):
    sel_path = get_selection_path(project)
    print(f"\n👀 Watching for visual feedback in {sel_path} (Press Ctrl+C to stop)...")
    seen_ids = set()

    data = load_selection(project)
    for a in data.get("annotations", []):
        seen_ids.add(a.get("id"))

    while True:
        try:
            time.sleep(1.0)
            data = load_selection(project)
            for a in data.get("annotations", []):
                aid = a.get("id")
                if aid not in seen_ids:
                    seen_ids.add(aid)
                    print("\n" + "!" * 60)
                    print(f" 🔔 NEW VISUAL FEEDBACK RECEIVED [{a.get('timecode')}]")
                    print("!" * 60)
                    print(f"  Project:   {project}")
                    print(f"  Note ID:   {aid}")
                    print(f"  Timestamp: {a.get('timestamp')}s (Frame {a.get('frame')})")
                    print(f"  Bounding:  x={a['bbox']['x']}, y={a['bbox']['y']}, w={a['bbox']['width']}, h={a['bbox']['height']}")
                    print(f"  Feedback:  \"{a.get('comment')}\"")
                    print("!" * 60 + "\n")
        except KeyboardInterrupt:
            break


def apply_feedback(project: str):
    data = load_selection(project)
    annotations = data.get("annotations", [])
    pending = [a for a in annotations if a.get("status") == "pending"]

    print("\n" + "=" * 80)
    print(f" 🛠️  APPLYING VISUAL REVISION TASKS FOR: {project}")
    print("=" * 80)
    print(f" Total Notes: {len(annotations)} | Pending: {len(pending)}")
    print("-" * 80)

    if not pending:
        print(" (No pending feedback notes. All visual tasks are resolved!)")
        print("=" * 80 + "\n")
        return

    for i, a in enumerate(pending, 1):
        print(f"\n Task #{i} [{a.get('timecode')} / Frame {a.get('frame')}]:")
        print(f"   Coordinates: Box [x:{a['bbox']['x']}, y:{a['bbox']['y']}, w:{a['bbox']['width']}, h:{a['bbox']['height']}]")
        print(f"   Directive:   \"{a.get('comment')}\"")

    print("\n" + "-" * 80)
    confirm = input(" Mark these tasks as resolved? (y/N): ").strip().lower()
    if confirm == "y":
        for a in annotations:
            if a.get("status") == "pending":
                a["status"] = "resolved"
        save_selection(project, data)
        print(" ✅ All pending annotations marked as resolved.\n")


def list_notes(project: str):
    data = load_selection(project)
    annotations = data.get("annotations", [])

    print("\n" + "=" * 80)
    print(f" 📋 VISUAL REVISION LOG: {project}")
    print("=" * 80)

    if not annotations:
        print(" (No notes found in selection.json)")
        print("=" * 80 + "\n")
        return

    header = f"{'ID':<10} | {'Timecode':<10} | {'Status':<10} | {'Comment'}"
    print(header)
    print("-" * 80)
    for a in annotations:
        status_sym = "🟡 Pending" if a.get("status") == "pending" else "🟢 Resolved"
        print(f"{a.get('id'):<10} | {a.get('timecode'):<10} | {status_sym:<10} | {a.get('comment')}")
    print("=" * 80 + "\n")


def main():
    parser = argparse.ArgumentParser(description="Motlab Frame-Accurate Review Viewer & Spatial Feedback")
    parser.add_argument("--video", type=str, help="Path to rendered MP4 video file to review")
    parser.add_argument("--project", type=str, default="CanvasShowcase", help="Default project to open")
    parser.add_argument("--port", type=int, default=4173, help="Port to serve viewer (default: 4173)")
    parser.add_argument("--watch", action="store_true", help="Watch selection.json and print live feedback notifications")
    parser.add_argument("--apply", action="store_true", help="Print pending revision tasks and mark them resolved")
    parser.add_argument("--list", action="store_true", help="List all visual annotations for the project")

    args = parser.parse_args()

    if args.watch:
        watch_selection(args.project)
        return

    if args.apply:
        apply_feedback(args.project)
        return

    if args.list:
        list_notes(args.project)
        return

    video_p = Path(args.video).resolve() if args.video else None
    run_server(video_p, args.project, args.port)


if __name__ == "__main__":
    main()
