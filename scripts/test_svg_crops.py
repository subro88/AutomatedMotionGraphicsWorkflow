import re
import subprocess
from pathlib import Path

with open("projects/incremental_backup_2008/assets/Component.svg", "r", encoding="utf-8") as f:
    svg_raw = f.read()

# Remove background rect
svg_no_bg = svg_raw.replace('<rect class="cls-1" width="450" height="450"/>', '')

# Define candidate regions
regions = {
    "server_blades": "255 45 65 70",
    "server_tower": "340 190 70 125",
    "hard_drive": "295 125 75 75",
    "cloud": "135 110 75 60",
    "router": "250 135 60 50",
    "workstation": "165 45 75 80",
    "gears": "105 145 55 55",
    "shield": "115 165 65 65",
}

test_dir = Path("projects/incremental_backup_2008/assets/svg_test")
test_dir.mkdir(parents=True, exist_ok=True)

for name, vb in regions.items():
    svg_item = re.sub(r'viewBox=\"[^\"]+\"', f'viewBox="{vb}"', svg_no_bg)
    item_path = test_dir / f"{name}.svg"
    with open(item_path, "w", encoding="utf-8") as f:
        f.write(svg_item)

print("Created 8 candidate SVGs in svg_test")
