#!/usr/bin/env python3
"""
Voicebox MCP Stdio Bridge for Antigravity & AI Agent Workflows.
Bridges local JSON-RPC stdio protocol to Voicebox's HTTP SSE Stream Server (http://127.0.0.1:17493/mcp/).
Exposes tools:
  - voicebox.speak (speaks in 'myVoice' or selected profile)
  - voicebox.transcribe (audio to text via local Whisper)
  - voicebox.list_profiles (lists cloned & preset voices)
  - voicebox.list_captures (lists history recordings)
"""
import json
import os
import sys
import urllib.request
import urllib.error

VOICEBOX_BASE = os.environ.get("VOICEBOX_URL", "http://127.0.0.1:17493").rstrip("/")
VOICEBOX_MCP_URL = f"{VOICEBOX_BASE}/mcp/"

def log(msg: str):
    sys.stderr.write(f"[VoiceboxBridge] {msg}\n")
    sys.stderr.flush()

def main():
    session_id = None
    log(f"Connecting to Voicebox MCP server at {VOICEBOX_MCP_URL}...")

    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            line = line.strip()
            if not line:
                continue

            try:
                rpc_req = json.loads(line)
            except json.JSONDecodeError as je:
                log(f"Invalid JSON: {je}")
                continue

            req_bytes = json.dumps(rpc_req).encode("utf-8")
            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json, text/event-stream"
            }
            if session_id:
                headers["mcp-session-id"] = session_id

            http_req = urllib.request.Request(VOICEBOX_MCP_URL, data=req_bytes, headers=headers)

            try:
                with urllib.request.urlopen(http_req, timeout=30) as resp:
                    new_session = resp.headers.get("mcp-session-id")
                    if new_session:
                        session_id = new_session

                    raw_body = resp.read().decode("utf-8", errors="replace")

                    # Handle SSE format: "event: message\ndata: {JSON}\n\n"
                    for chunk in raw_body.split("\n\n"):
                        chunk = chunk.strip()
                        if not chunk:
                            continue
                        for subline in chunk.split("\n"):
                            if subline.startswith("data:"):
                                json_str = subline[len("data:"):].strip()
                                sys.stdout.write(json_str + "\n")
                                sys.stdout.flush()
                            elif subline.startswith("{") and subline.endswith("}"):
                                sys.stdout.write(subline + "\n")
                                sys.stdout.flush()

            except urllib.error.HTTPError as he:
                err_body = he.read().decode("utf-8", errors="replace")
                log(f"HTTP Error {he.code}: {err_body}")
                err_resp = {
                    "jsonrpc": "2.0",
                    "id": rpc_req.get("id"),
                    "error": {
                        "code": -32000,
                        "message": f"Voicebox HTTP {he.code}: {err_body}"
                    }
                }
                sys.stdout.write(json.dumps(err_resp) + "\n")
                sys.stdout.flush()

        except Exception as e:
            log(f"Bridge loop error: {e}")
            break

if __name__ == "__main__":
    main()
