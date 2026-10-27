import os

img_dir = r"c:\Users\Abhishek\Downloads\texreacter\public\assets\dvlsi"
files = sorted(os.listdir(img_dir))

print(f"Total extracted images: {len(files)}")
for f in files:
    full_path = os.path.join(img_dir, f)
    size = os.path.getsize(full_path)
    print(f"  {f} - {size} bytes")
