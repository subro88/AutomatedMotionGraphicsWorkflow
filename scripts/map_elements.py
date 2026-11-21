import xml.etree.ElementTree as ET

ET.register_namespace('', 'http://www.w3.org/2000/svg')
tree = ET.parse('projects/incremental_backup_2008/assets/Component.svg')
root = tree.getroot()

# Let's inspect where different components are located.
# We know:
# Elements 3 to 58 are connector lines and dots.
# Let's see all elements from 59 onwards.

for i in range(59, len(root)):
    el = root[i]
    tag = el.tag.split('}')[-1]
    cls = el.attrib.get('class', '')
    x = el.attrib.get('x', '')
    y = el.attrib.get('y', '')
    w = el.attrib.get('width', '')
    h = el.attrib.get('height', '')
    d = el.attrib.get('d', '')
    pts = el.attrib.get('points', '')
    
    # print significant tags or rects
    if tag in ['rect', 'circle', 'ellipse'] or (tag == 'path' and any(kw in d for kw in ['M', 'C'])):
        print(f"El {i}: <{tag} class='{cls}' x='{x}' y='{y}' w='{w}' h='{h}' d='{d[:35]}'>")
