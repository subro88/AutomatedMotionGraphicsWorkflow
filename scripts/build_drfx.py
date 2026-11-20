#!/usr/bin/env python3
import argparse
import os
import shutil
import sys
import zipfile
from pathlib import Path

def get_resolve_templates_dir() -> Path:
    if sys.platform.startswith("win"):
        return Path(os.environ.get("APPDATA", "")) / "Blackmagic Design/DaVinci Resolve/Support/Fusion/Templates"
    elif sys.platform.startswith("darwin"):
        return Path.home() / "Library/Application Support/Blackmagic Design/DaVinci Resolve/Fusion/Templates"
    return Path.home() / ".local/share/DaVinciResolve/Fusion/Templates"

TEXTPLUS_SETTING = """{
	Tools = ordered() {
		TechBlogCyanTitle = TextPlus {
			Inputs = {
				Width = Input { Value = 1920, },
				Height = Input { Value = 1080, },
				Center = Input { Value = { 0.5, 0.5 }, },
				Red1 = Input { Value = 0, },
				Green1 = Input { Value = 0.949, },
				Blue1 = Input { Value = 0.996, },
				Alpha1 = Input { Value = 1, },
				StyledText = Input { Value = "KINETIC ARCHITECTURE", },
				Font = Input { Value = "Montserrat", },
				Style = Input { Value = "Bold", },
				Size = Input { Value = 0.085, },
				VerticalTopCenterBottom = Input { Value = 1, },
				HorizontalJustificationNew = Input { Value = 3, },
				Enabled2 = Input { Value = 1, },
				Thickness2 = Input { Value = 0.02, },
				ElementShape2 = Input { Value = 1, },
				Enabled3 = Input { Value = 1, },
				Red3 = Input { Value = 0, },
				Green3 = Input { Value = 0.949, },
				Blue3 = Input { Value = 0.996, },
				Softness3 = Input { Value = 0.045, },
				Alpha3 = Input { Value = 0.45, },
			},
		}
	}
}
"""

def generate_blank_thumbnail_png(output_path: Path):
    raw_png = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\xa0\x00\x00\x00\x64'
        b'\x08\x02\x00\x00\x00\x87\xca\xe5\xc7\x00\x00\x00\x1bIDATx\x9cc\xf8'
        b'\xcf\xc0\x00\x02\x13\x00\x00\xfe\xf2\x00\x00\x01\x00\x01\x00\x00'
        b'\x00\x00\xff\xff\x03\x00\x05\xfe\x01\xf1\x18`\xeb\x93\x00\x00\x00'
        b'\x00IEND\xaeB`\x82'
    )
    output_path.write_bytes(raw_png)

def package_and_install(pack_name: str, out_dir: Path):
    staging = Path("build/drfx_staging")
    titles_dir = staging / "Edit/Titles" / pack_name
    titles_dir.mkdir(parents=True, exist_ok=True)
    
    (titles_dir / f"{pack_name}Title.setting").write_text(TEXTPLUS_SETTING, encoding="utf-8")
    generate_blank_thumbnail_png(titles_dir / f"{pack_name}Title.png")

    drfx_dest = out_dir / f"{pack_name}.drfx"
    drfx_dest.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(drfx_dest, "w", compression=zipfile.ZIP_DEFLATED) as drfx:
        for root, _, files in os.walk(staging):
            for file in files:
                fpath = Path(root) / file
                drfx.write(fpath, arcname=fpath.relative_to(staging).as_posix())

    # Install directly into DaVinci Resolve
    res_dir = get_resolve_templates_dir()
    if res_dir.exists():
        shutil.copy2(drfx_dest, res_dir / drfx_dest.name)
    shutil.rmtree(staging, ignore_errors=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--title", default="TechBlog_Motion_Kit")
    parser.add_argument("--out-dir", default="out/drfx")
    args = parser.parse_args()
    package_and_install(args.title.replace(" ", "_"), Path(args.out_dir))

