import sys
import os
import struct
from PIL import Image, ImageDraw, ImageFont

def render_emoji_to_bin(emoji, out_path, size=74, bg_color=(0, 0, 0)):
    # 1. Create a new RGB image with the background color
    img = Image.new('RGB', (size, size), bg_color)
    draw = ImageDraw.Draw(img)
    
    # 2. Find a suitable emoji font on macOS
    font_paths = [
        "/System/Library/Fonts/Apple Color Emoji.ttc",
        "/System/Library/Fonts/Apple Color Emoji.ttf",
        "/System/Library/Fonts/Cache/AppleColorEmoji.ttf",
        "/Library/Fonts/Arial Unicode.ttf"
    ]
    
    font = None
    for p in font_paths:
        if os.path.exists(p):
            try:
                # Emojis are usually drawn large in emoji fonts
                font = ImageFont.truetype(p, int(size * 0.75))
                break
            except:
                continue
                
    if font is None:
        font = ImageFont.load_default()
        print("Warning: Emoji font not found, falling back to default system font.")
        
    # 3. Calculate text bounding box to center the emoji
    try:
        bbox = draw.textbbox((0, 0), emoji, font=font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
    except AttributeError:
        # Fallback for older Pillow versions
        w, h = draw.textsize(emoji, font=font)
        
    x = (size - w) // 2
    # Adjust slightly for emoji vertical alignment quirks
    y = (size - h) // 2 - int(size * 0.05)
    
    # 4. Draw the emoji
    draw.text((x, y), emoji, font=font, fill=(255, 255, 255), embedded_color=True)
    
    # 5. Convert pixels directly to RGB565 Little-Endian bin bytes
    with open(out_path, 'wb') as out:
        for py in range(size):
            for px in range(size):
                r, g, b = img.getpixel((px, py))[:3]
                
                r5 = (r >> 3) & 0x1F
                g6 = (g >> 2) & 0x3F
                b5 = (b >> 3) & 0x1F
                rgb565 = (r5 << 11) | (g6 << 5) | b5
                
                out.write(struct.pack('<H', rgb565))
                
    print(f"Successfully rendered emoji '{emoji}' to {out_path} ({size}x{size} bin)")
    return True

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 emoji_to_bin.py <emoji> <output.bin> [size] [bg_hex_color_without_hash]")
        print("Example: python3 emoji_to_bin.py '🏠' bmp_custom1.bin 74 000000")
    else:
        emoji = sys.argv[1]
        out_path = sys.argv[2]
        size = int(sys.argv[3]) if len(sys.argv) > 3 else 74
        
        bg_color = (0, 0, 0)
        if len(sys.argv) > 4:
            hex_color = sys.argv[4]
            bg_color = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
            
        render_emoji_to_bin(emoji, out_path, size, bg_color)
