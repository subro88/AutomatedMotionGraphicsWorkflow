import xml.etree.ElementTree as ET

ET.register_namespace('', 'http://www.w3.org/2000/svg')
tree = ET.parse('projects/incremental_backup_2008/assets/Component.svg')
root = tree.getroot()

with open('projects/incremental_backup_2008/assets/all_elements_debug.txt', 'w', encoding='utf-8') as f:
    for i in range(len(root)):
        el = root[i]
        tag = el.tag.split('}')[-1]
        cls = el.attrib.get('class', '')
        attribs = ' '.join([f"{k}='{v[:30]}'" for k, v in el.attrib.items() if k not in ['class', 'id', 'data-name']])
        f.write(f"[{i:03d}] <{tag} class='{cls}' {attribs}>\n")

print(f"Dumped {len(root)} elements.")
