import xml.etree.ElementTree as ET
from pathlib import Path

ET.register_namespace('', 'http://www.w3.org/2000/svg')
tree = ET.parse('projects/incremental_backup_2008/assets/Component.svg')
root = tree.getroot()

print(f"Total direct children in svg: {len(root)}")

elements_info = []
for i, el in enumerate(root):
    tag = el.tag.split('}')[-1]
    cls = el.attrib.get('class', '')
    x = el.attrib.get('x', '')
    y = el.attrib.get('y', '')
    w = el.attrib.get('width', '')
    h = el.attrib.get('height', '')
    cx = el.attrib.get('cx', '')
    cy = el.attrib.get('cy', '')
    r = el.attrib.get('r', '')
    d = el.attrib.get('d', '')
    pts = el.attrib.get('points', '')
    elements_info.append((i, tag, cls, x, y, w, h, cx, cy, r, d[:25], pts[:25]))

with open('projects/incremental_backup_2008/assets/svg_elements_list.txt', 'w', encoding='utf-8') as f:
    for item in elements_info:
        f.write(f"{item[0]}: tag={item[1]}, cls={item[2]}, x={item[3]}, y={item[4]}, w={item[5]}, h={item[6]}, cx={item[7]}, cy={item[8]}, r={item[9]}, d={item[10]}, pts={item[11]}\n")

print(f"Wrote {len(elements_info)} elements to projects/incremental_backup_2008/assets/svg_elements_list.txt")
