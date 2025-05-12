from PIL import Image
import os

# Process all files in the current folder
for filename in os.listdir('.'):
    if filename.lower().endswith(('.jpg', '.jpeg')):
        base_name = os.path.splitext(filename)[0]
        new_filename = f"{base_name}.png"

        try:
            # Open and convert image
            with Image.open(filename) as img:
                rgb_image = img.convert('RGBA')
                rgb_image.save(new_filename, format='PNG')
                print(f"Converted: {filename} → {new_filename}")

            # Delete original only after successful save
            os.remove(filename)
        except Exception as e:
            print(f"Error converting {filename}: {e}")

print("Done converting all JPG/JPEG to PNG.")
