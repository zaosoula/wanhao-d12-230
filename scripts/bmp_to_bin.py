import struct
import sys
import os

def bmp_to_bin(bmp_path, bin_path):
    with open(bmp_path, 'rb') as f:
        # Read BMP header (54 bytes)
        header = f.read(54)
        if len(header) < 54 or header[0:2] != b'BM':
            print(f"Error: {bmp_path} is not a valid BMP file")
            return False
        
        # Extract width, height, and bits per pixel
        width = struct.unpack('<i', header[18:22])[0]
        height = struct.unpack('<i', header[22:26])[0]
        bpp = struct.unpack('<H', header[28:30])[0]
        
        # We only support 24-bit or 32-bit BMP
        if bpp not in (24, 32):
            print(f"Error: Unsupported BMP depth ({bpp} bpp). Must be 24-bit or 32-bit.")
            return False
            
        offset = struct.unpack('<I', header[10:14])[0]
        f.seek(offset)
        
        # Read pixel data
        # Standard BMP stores rows bottom-to-top, left-to-right.
        # If height is negative, it's top-to-bottom.
        top_to_bottom = (height < 0)
        height = abs(height)
        
        row_size = (width * (bpp // 8) + 3) & ~3  # Row size aligned to 4 bytes
        rows = []
        for _ in range(height):
            rows.append(f.read(row_size))
            
        if not top_to_bottom:
            rows.reverse()  # Convert bottom-to-top to top-to-bottom
            
        # Write to binary output file in Little-Endian RGB565
        with open(bin_path, 'wb') as out:
            for row in rows:
                for x in range(width):
                    # Extract R, G, B
                    if bpp == 24:
                        b = row[x * 3]
                        g = row[x * 3 + 1]
                        r = row[x * 3 + 2]
                    else:  # 32-bit
                        b = row[x * 4]
                        g = row[x * 4 + 1]
                        r = row[x * 4 + 2]
                        
                    # Convert to RGB565
                    r5 = (r >> 3) & 0x1F
                    g6 = (g >> 2) & 0x3F
                    b5 = (b >> 3) & 0x1F
                    rgb565 = (r5 << 11) | (g6 << 5) | b5
                    
                    # Write Little Endian bytes
                    out.write(struct.pack('<H', rgb565))
        print(f"Successfully converted {bmp_path} ({width}x{height}) to {bin_path}")
        return True

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 bmp_to_bin.py <input.bmp> <output.bin>")
    else:
        bmp_to_bin(sys.argv[1], sys.argv[2])
