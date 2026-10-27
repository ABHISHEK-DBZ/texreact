import os
import zipfile
import xml.etree.ElementTree as ET

dvlsi_dir = r"c:\Users\Abhishek\Downloads\texreacter\raw_assets\dvlsi"

for filename in os.listdir(dvlsi_dir):
    if not filename.endswith('.docx'):
        continue
    filepath = os.path.join(dvlsi_dir, filename)
    print(f"\n==========================================")
    print(f"DOCUMENT: {filename}")
    print(f"==========================================")
    
    with zipfile.ZipFile(filepath, 'r') as z:
        # Load relationships to map rId to image target
        rel_map = {}
        if 'word/_rels/document.xml.rels' in z.namelist():
            rel_xml = z.read('word/_rels/document.xml.rels')
            rel_root = ET.fromstring(rel_xml)
            for r in rel_root:
                r_id = r.attrib.get('Id')
                target = r.attrib.get('Target')
                rel_map[r_id] = target
        
        # Parse document.xml sequentially
        doc_xml = z.read('word/document.xml')
        root = ET.fromstring(doc_xml)
        
        w_p = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'
        w_t = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'
        a_blip = '{http://schemas.openxmlformats.org/drawingml/2006/main}blip'
        r_embed = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed'
        
        for p in root.iter(w_p):
            texts = [node.text for node in p.iter(w_t) if node.text]
            text = ''.join(texts).strip()
            
            blips = [node.attrib.get(r_embed) for node in p.iter(a_blip) if node.attrib.get(r_embed)]
            
            if text or blips:
                images = [rel_map.get(b, b) for b in blips]
                print(f"-> P: '{text}' | IMAGES: {images}")
