import os
import zipfile
import xml.etree.ElementTree as ET
import json
import shutil

dvlsi_dir = r"c:\Users\Abhishek\Downloads\texreacter\raw_assets\dvlsi"
public_img_dir = r"c:\Users\Abhishek\Downloads\texreacter\public\assets\dvlsi"
os.makedirs(public_img_dir, exist_ok=True)

results = {}

for filename in os.listdir(dvlsi_dir):
    if not filename.endswith('.docx'):
        continue
    filepath = os.path.join(dvlsi_dir, filename)
    slug = filename.replace('.docx', '').replace(' ', '_').replace(',', '').replace('&', 'and').lower()
    file_info = {
        'filename': filename,
        'slug': slug,
        'paragraphs': [],
        'tables': [],
        'images': []
    }
    
    with zipfile.ZipFile(filepath, 'r') as z:
        # Extract all images from word/media/
        for item in z.infolist():
            if item.filename.startswith('word/media/'):
                img_name = os.path.basename(item.filename)
                target_img_name = f"{slug}_{img_name}"
                target_path = os.path.join(public_img_dir, target_img_name)
                with z.open(item.filename) as source, open(target_path, 'wb') as target:
                    shutil.copyfileobj(source, target)
                file_info['images'].append({
                    'original': item.filename,
                    'extracted': f"/assets/dvlsi/{target_img_name}",
                    'size': item.file_size
                })
        
        # Read document.xml
        if 'word/document.xml' in z.namelist():
            doc_xml = z.read('word/document.xml')
            root = ET.fromstring(doc_xml)
            
            # XML Namespaces
            ns = {
                'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
                'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
                'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
            }
            
            # Paragraphs
            for p in root.iter(f"{{{ns['w']}}}p"):
                texts = [node.text for node in p.iter(f"{{{ns['w']}}}t") if node.text]
                p_text = ''.join(texts).strip()
                if p_text:
                    file_info['paragraphs'].append(p_text)
            
            # Tables
            for tbl in root.iter(f"{{{ns['w']}}}tbl"):
                table_rows = []
                for tr in tbl.iter(f"{{{ns['w']}}}tr"):
                    row_cells = []
                    for tc in tr.iter(f"{{{ns['w']}}}tc"):
                        cell_texts = [node.text for node in tc.iter(f"{{{ns['w']}}}t") if node.text]
                        row_cells.append(' '.join(cell_texts).strip())
                    if row_cells:
                        table_rows.append(row_cells)
                if table_rows:
                    file_info['tables'].append(table_rows)

    results[filename] = file_info

output_json = os.path.join(dvlsi_dir, "dvlsi_extracted_data.json")
with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"Extracted {len(results)} files successfully. Output saved to {output_json}")
for fn, data in results.items():
    print(f"\n--- {fn} ---")
    print(f"Images extracted: {len(data['images'])}")
    for img in data['images']:
        print(f"  Image: {img['extracted']} ({img['size']} bytes)")
    print(f"Paragraphs count: {len(data['paragraphs'])}")
    print(f"Sample text (first 5 paragraphs):")
    for p in data['paragraphs'][:5]:
        print(f"  > {p}")
    print(f"Tables found: {len(data['tables'])}")
