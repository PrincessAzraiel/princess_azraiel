from PIL import Image
import os

# Process all PNG files in the current folder
for filename in os.listdir('.'):
    if filename.lower().endswith('.png'):
        base_name = os.path.splitext(filename)[0]
        new_filename = f"{base_name}.webp"

        try:
            # Open and convert image
            with Image.open(filename) as img:
                img.save(new_filename, format='WEBP')
                print(f"Converted: {filename} → {new_filename}")

            # Delete original only after successful save
            os.remove(filename)
        except Exception as e:
            print(f"Error converting {filename}: {e}")

print("Done converting all PNG to WEBP.")
