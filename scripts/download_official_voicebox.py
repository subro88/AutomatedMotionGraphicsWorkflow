#!/usr/bin/env python3
"""
Downloads the official Voicebox Windows Installer from https://voicebox.sh (Jamie Pine)
Release: v0.5.0 - Voicebox_0.5.0_x64-setup.exe (~516 MB)
"""
import os
import sys
import urllib.request
from pathlib import Path
from tqdm import tqdm

URL = "https://github.com/jamiepine/voicebox/releases/download/v0.5.0/Voicebox_0.5.0_x64-setup.exe"
DEST = Path("Voicebox_Setup.exe").resolve()

class DownloadProgressBar(tqdm):
    def update_to(self, b=1, bsize=1, tsize=None):
        if tsize is not None:
            self.total = tsize
        self.update(b * bsize - self.n)

def download():
    print("==================================================================")
    print("  Downloading Official Voicebox Desktop App (https://voicebox.sh)")
    print("==================================================================")
    print(f"Source URL : {URL}")
    print(f"Target File: {DEST}")
    print("Starting download...\n")

    opener = urllib.request.build_opener()
    opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')]
    urllib.request.install_opener(opener)

    with DownloadProgressBar(unit='B', unit_scale=True, miniters=1, desc="Voicebox_Setup.exe") as t:
        urllib.request.urlretrieve(URL, filename=str(DEST), reporthook=t.update_to)

    print(f"\n✅ Voicebox official installer downloaded successfully: {DEST}")
    print(f"Size: {round(DEST.stat().st_size / (1024 * 1024), 2)} MB")

if __name__ == "__main__":
    download()

