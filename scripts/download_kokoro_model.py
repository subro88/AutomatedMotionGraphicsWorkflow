#!/usr/bin/env python3
"""
Downloads Kokoro v1.0 ONNX model weights and voice vectors for local offline TTS.
"""
import os
import sys
import urllib.request
from pathlib import Path
from tqdm import tqdm

MODEL_DIR = Path("assets/models/kokoro")
MODEL_DIR.mkdir(parents=True, exist_ok=True)

FILES = {
    "kokoro-v1.0.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx",
    "voices-v1.0.bin": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}

class DownloadProgressBar(tqdm):
    def update_to(self, b=1, bsize=1, tsize=None):
        if tsize is not None:
            self.total = tsize
        self.update(b * bsize - self.n)

def download_file(url: str, output_path: Path):
    if output_path.exists() and output_path.stat().st_size > 1000:
        print(f"✓ Already downloaded: {output_path.name} ({round(output_path.stat().st_size / (1024*1024), 2)} MB)")
        return
    print(f"⬇️ Downloading {output_path.name}...")
    opener = urllib.request.build_opener()
    opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
    urllib.request.install_opener(opener)
    with DownloadProgressBar(unit='B', unit_scale=True, miniters=1, desc=output_path.name) as t:
        urllib.request.urlretrieve(url, filename=output_path, reporthook=t.update_to)
    print(f"✓ Completed: {output_path.name} ({round(output_path.stat().st_size / (1024*1024), 2)} MB)")

def main():
    print("=======================================================")
    print("  Kokoro-82M Local Voice Engine Model Setup")
    print("=======================================================")
    for filename, url in FILES.items():
        target = MODEL_DIR / filename
        download_file(url, target)
    print("\n✅ All Kokoro-82M neural model weights are ready in assets/models/kokoro/!")

if __name__ == "__main__":
    main()

