import sys
import struct
from PIL import Image

SIZE_MAP = {
    307208: (480, 320), # Logo with header
    307200: (480, 320), # Logo raw
    32760: (117, 140),  # Standard button
    21528: (78, 138),   # Back / Page button
    20000: (100, 100),  # Menu button
    80000: (200, 200),  # Preview button
    5600: (70, 40),     # Next / Small button
    5000: (50, 50),     # Retro state button
    4050: (45, 45),     # Extruder/Bed state button
    1344: (28, 24),     # Backspace button
    1176: (28, 21),     # Toggle arrow
    504: (18, 14)       # Checkmark button
}

def decode_bin(bin_path, png_path):
    with open(bin_path, 'rb') as f:
        data = f.read()
        
    size = len(data)
    has_header = False
    if size not in SIZE_MAP and (size - 8) in SIZE_MAP:
        size = size - 8
        has_header = True
        
    if size not in SIZE_MAP:
        print(f"Error: Unknown dimensions for file size {len(data)}")
        return False
        
    width, height = SIZE_MAP[size]
    offset = 8 if has_header else 0
    
    img = Image.new('RGB', (width, height))
    
    idx = offset
    for y in range(height):
        for x in range(width):
            if idx + 2 > len(data):
                break
            val = struct.unpack('<H', data[idx:idx+2])[0]
            idx += 2
            
            r5 = (val >> 11) & 0x1F
            g6 = (val >> 5) & 0x3F
            b5 = val & 0x1F
            
            r = (r5 * 255) // 31
            g = (g6 * 255) // 63
            b = (b5 * 255) // 31
            
            img.putpixel((x, y), (r, g, b))
            
    img.save(png_path)
    print(f"Successfully decoded {bin_path} ({width}x{height}) to {png_path}")
    return True

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 decode_bin.py <input.bin> <output.png>")
    else:
        decode_bin(sys.argv[1], sys.argv[2])
