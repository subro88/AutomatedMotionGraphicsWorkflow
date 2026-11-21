import re
from pathlib import Path

with open("projects/incremental_backup_2008/assets/Component.svg", "r", encoding="utf-8") as f:
    svg_raw = f.read()

# Remove the full background rect: <rect class="cls-1" width="450" height="450"/>
svg_no_bg = svg_raw.replace('<rect class="cls-1" width="450" height="450"/>', '')

# Exact padding boxes:
crops = {
    "workstation": "53 47 95 90",
    "hard_drive": "175 49 53 75",
    "server_rack": "258 47 59 79",
    "tablet": "348 55 53 70",
    "smartphone": "58 148 39 65",
    "router": "183 144 80 63",
    "ethernet_cable": "344 147 60 27",
    "laptop": "154 203 141 97",
    "server_tower": "343 195 60 115",
    "cloud": "47 249 76 46",
    "folder": "58 335 65 63",
    "gears": "128 343 53 45",
    "shield": "191 328 68 71",
    "sync_arrows": "264 348 47 44",
    "wrench_unit": "324 338 88 60"
}

out_dirs = [
    Path("projects/incremental_backup_2008/assets/svg_test"),
    Path("public/incremental_backup/svg")
]

for d in out_dirs:
    d.mkdir(parents=True, exist_ok=True)
    for name, vb in crops.items():
        svg_item = re.sub(r'viewBox=\"[^\"]+\"', f'viewBox="{vb}"', svg_no_bg)
        with open(d / f"{name}.svg", "w", encoding="utf-8") as f:
            f.write(svg_item)

print(f"Generated {len(crops)} perfectly cropped SVGs into svg_test and public/incremental_backup/svg!")
