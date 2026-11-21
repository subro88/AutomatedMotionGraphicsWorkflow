import re
from pathlib import Path

with open("projects/incremental_backup_2008/assets/Component.svg", "r", encoding="utf-8") as f:
    svg_raw = f.read()

# Component.svg contains defs with styles and linear gradients
defs_match = re.search(r'(<defs>.*?</defs>)', svg_raw, re.DOTALL)
defs_str = defs_match.group(1) if defs_match else ""

# Remove background rect: <rect class="cls-1" width="450" height="450"/>
svg_body = svg_raw.replace('<rect class="cls-1" width="450" height="450"/>', '')

# We know the bounding coordinates of components:
# 1. Server Blade Rack: (250, 40, 75, 75)
# 2. Server Tower / Chassis: (340, 190, 70, 120)
# 3. Hard Drive Platter: (290, 120, 80, 80)
# 4. Network Switch / Router: (250, 130, 70, 50)
# 5. Cloud: (130, 110, 80, 60)
# 6. Workstation / Desktop: (160, 40, 80, 80)
# 7. Laptop: (170, 140, 110, 80)
# 8. Gears: (100, 140, 60, 60)
# 9. Shield: (110, 160, 60, 60)

# We can create a dedicated React component ComponentSvgSprite.tsx
# which can render any of these icons at any scale using <svg viewBox="x y w h"> with the defs!

print("Defs length:", len(defs_str))
print("Body length:", len(svg_body))
