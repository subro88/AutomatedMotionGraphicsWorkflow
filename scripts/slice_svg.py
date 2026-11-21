import subprocess
from pathlib import Path

with open("projects/incremental_backup_2008/assets/Component.svg", "r", encoding="utf-8") as f:
    svg_raw = f.read()

# Remove the background rect so it has transparent background
svg_no_bg = svg_raw.replace('<rect class="cls-1" width="450" height="450"/>', '')

out_dir = Path("projects/incremental_backup_2008/assets/svg_crops")
out_dir.mkdir(parents=True, exist_ok=True)

# Also copy Component.svg to public/incremental_backup/ so Remotion can render it directly
public_dir = Path("public/incremental_backup")
with open(public_dir / "Component_transparent.svg", "w", encoding="utf-8") as f:
    f.write(svg_no_bg)

print("Saved Component_transparent.svg to public/incremental_backup!")
