import re
import xml.etree.ElementTree as ET

with open("projects/incremental_backup_2008/assets/Component.svg", "r", encoding="utf-8") as f:
    text = f.read()

print("SVG length:", len(text))
# Check text occurrences like 'NETWORK', etc.
texts = re.findall(r'>([^<]+)<', text)
clean_texts = [t.strip() for t in texts if t.strip()]
print("Texts in SVG:", clean_texts)

# Find all paths and rects coordinates to find bounding boxes of sub-components
rects = re.findall(r'<rect[^>]+>', text)
print(f"Total rects: {len(rects)}")
for r in rects[:10]:
    print(" ", r)

paths = re.findall(r'<path[^>]+>', text)
print(f"Total paths: {len(paths)}")
