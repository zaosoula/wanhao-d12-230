import struct
import math

# Simple pixel-drawing library for generating 117x140 24-bit BMPs
class ImageDraw:
    def __init__(self, width=117, height=140):
        self.width = width
        self.height = height
        # Black background
        self.pixels = [[(0, 0, 0) for _ in range(width)] for _ in range(height)]
        
    def set_pixel(self, x, y, color):
        if 0 <= x < self.width and 0 <= y < self.height:
            self.pixels[y][x] = color
            
    def draw_line(self, x0, y0, x1, y1, color, thickness=1):
        dx = abs(x1 - x0)
        dy = abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx - dy
        
        while True:
            # Draw pixel with thickness
            for tx in range(-thickness//2, (thickness+1)//2):
                for ty in range(-thickness//2, (thickness+1)//2):
                    self.set_pixel(x0 + tx, y0 + ty, color)
                    
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 > -dy:
                err -= dy
                x0 += sx
            if e2 < dx:
                err += dx
                y0 += sy

    def draw_rect(self, x0, y0, x1, y1, color, fill=False, thickness=1):
        if fill:
            for y in range(min(y0, y1), max(y0, y1) + 1):
                for x in range(min(x0, x1), max(x0, x1) + 1):
                    self.set_pixel(x, y, color)
        else:
            self.draw_line(x0, y0, x1, y0, color, thickness)
            self.draw_line(x1, y0, x1, y1, color, thickness)
            self.draw_line(x1, y1, x0, y1, color, thickness)
            self.draw_line(x0, y1, x0, y0, color, thickness)

    def draw_circle(self, cx, cy, r, color, fill=False, thickness=1):
        for y in range(cy - r - 2, cy + r + 3):
            for x in range(cx - r - 2, cx + r + 3):
                dist = math.sqrt((x - cx)**2 + (y - cy)**2)
                if fill:
                    if dist <= r:
                        self.set_pixel(x, y, color)
                else:
                    if abs(dist - r) < (thickness / 2.0):
                        self.set_pixel(x, y, color)

    def draw_rounded_rect(self, x0, y0, x1, y1, r, color, thickness=1):
        # Draw straight edges
        self.draw_line(x0 + r, y0, x1 - r, y0, color, thickness)
        self.draw_line(x1, y0 + r, x1, y1 - r, color, thickness)
        self.draw_line(x1 - r, y1, x0 + r, y1, color, thickness)
        self.draw_line(x0, y1 - r, x0, y0 + r, color, thickness)
        # Draw corners
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                # Top-left corner
                if x < x0 + r and y < y0 + r:
                    dist = math.sqrt((x - (x0 + r))**2 + (y - (y0 + r))**2)
                    if abs(dist - r) < (thickness / 2.0):
                        self.set_pixel(x, y, color)
                # Top-right
                elif x > x1 - r and y < y0 + r:
                    dist = math.sqrt((x - (x1 - r))**2 + (y - (y0 + r))**2)
                    if abs(dist - r) < (thickness / 2.0):
                        self.set_pixel(x, y, color)
                # Bottom-left
                elif x < x0 + r and y > y1 - r:
                    dist = math.sqrt((x - (x0 + r))**2 + (y - (y1 - r))**2)
                    if abs(dist - r) < (thickness / 2.0):
                        self.set_pixel(x, y, color)
                # Bottom-right
                elif x > x1 - r and y > y1 - r:
                    dist = math.sqrt((x - (x1 - r))**2 + (y - (y1 - r))**2)
                    if abs(dist - r) < (thickness / 2.0):
                        self.set_pixel(x, y, color)

    # 5x7 font representation
    FONT = {
        'A': [" ### ", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
        'B': ["#### ", "#   #", "#   #", "#### ", "#   #", "#   #", "#### "],
        'C': [" ### ", "#   #", "#    ", "#    ", "#    ", "#   #", " ### "],
        'D': ["#### ", "#   #", "#   #", "#   #", "#   #", "#   #", "#### "],
        'E': ["#####", "#    ", "#    ", "#### ", "#    ", "#    ", "#####"],
        'F': ["#####", "#    ", "#    ", "#### ", "#    ", "#    ", "#    "],
        'G': [" ### ", "#   #", "#    ", "# ###", "#   #", "#   #", " ### "],
        'H': ["#   #", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
        'I': [" ### ", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", " ### "],
        'L': ["#    ", "#    ", "#    ", "#    ", "#    ", "#    ", "#####"],
        'M': ["#   #", "## ##", "# # #", "#   #", "#   #", "#   #", "#   #"],
        'O': [" ### ", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "],
        'P': ["#### ", "#   #", "#   #", "#### ", "#    ", "#    ", "#    "],
        'R': ["#### ", "#   #", "#   #", "#### ", "# #  ", "#  # ", "#   #"],
        'S': [" ####", "#    ", "#    ", " ### ", "    #", "    #", "#### "],
        'T': ["#####", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "  #  "],
        'U': ["#   #", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "],
        'X': ["#   #", "#   #", " # # ", "  #  ", " # # ", "#   #", "#   #"],
        'Z': ["#####", "    #", "   # ", "  #  ", " #   ", "#    ", "#####"],
        '0': [" ### ", "#  ##", "# # #", "##  #", "#   #", "#   #", " ### "],
        '1': ["  #  ", " ##  ", "  #  ", "  #  ", "  #  ", "  #  ", " ### "],
        '2': [" ### ", "#   #", "    #", "   # ", "  #  ", " #   ", "#####"],
        '3': ["#### ", "    #", "   # ", " ### ", "    #", "    #", "#### "],
        '-': ["     ", "     ", "     ", " ### ", "     ", "     ", "     "],
    }

    def draw_text(self, text, start_x, start_y, color, scale=1):
        for char in text.upper():
            if char == ' ':
                start_x += 6 * scale
                continue
            char_data = self.FONT.get(char, ["     "] * 7)
            for row_idx, row_str in enumerate(char_data):
                for col_idx, col_char in enumerate(row_str):
                    if col_char == '#':
                        if scale == 1:
                            self.set_pixel(start_x + col_idx, start_y + row_idx, color)
                        else:
                            self.draw_rect(start_x + col_idx*scale, start_y + row_idx*scale, 
                                           start_x + (col_idx+1)*scale - 1, start_y + (row_idx+1)*scale - 1, 
                                           color, fill=True)
            start_x += 6 * scale

    def save_bmp(self, filename):
        file_size = 54 + self.width * self.height * 3
        header = struct.pack('<2sIHHI', b'BM', file_size, 0, 0, 54)
        dib = struct.pack('<IiiHHIIiiII', 40, self.width, -self.height, 1, 24, 0, self.width * self.height * 3, 2835, 2835, 0, 0)
        
        row_size = self.width * 3
        padding_size = (4 - (row_size % 4)) % 4
        padding = b'\x00' * padding_size
        
        with open(filename, 'wb') as f:
            f.write(header)
            f.write(dib)
            for y in range(self.height):
                row_bytes = bytearray()
                for x in range(self.width):
                    r, g, b = self.pixels[y][x]
                    # BMP format is B, G, R
                    row_bytes.append(b)
                    row_bytes.append(g)
                    row_bytes.append(r)
                row_bytes.extend(padding)
                f.write(row_bytes)

# Theme color scheme:
BORDER_COLOR = (120, 130, 140)   # Sleek grey card outline
ICON_COLOR = (240, 245, 255)     # Warm white icons
ACCENT_RED = (255, 70, 70)       # Warning / Hotend red
ACCENT_BLUE = (70, 170, 255)     # Cooldown / Fan blue
TEXT_COLOR = (200, 210, 220)     # Light grey labels

def draw_card(drawer):
    # Rounded card outline
    drawer.draw_rounded_rect(6, 6, 110, 133, 16, BORDER_COLOR, thickness=3)

# 1. PLA Preheat Icon
def draw_pla():
    d = ImageDraw()
    draw_card(d)
    
    # Draw thermometer
    d.draw_circle(58, 70, 12, ICON_COLOR, fill=False, thickness=3)
    d.draw_circle(58, 70, 6, ACCENT_RED, fill=True)
    d.draw_rect(54, 30, 62, 60, ICON_COLOR, fill=False, thickness=3)
    d.draw_rect(57, 34, 59, 65, ACCENT_RED, fill=True)
    
    # Heat waves
    d.draw_line(42, 40, 46, 35, ACCENT_RED, thickness=2)
    d.draw_line(42, 50, 46, 45, ACCENT_RED, thickness=2)
    d.draw_line(74, 40, 70, 35, ACCENT_RED, thickness=2)
    d.draw_line(74, 50, 70, 45, ACCENT_RED, thickness=2)
    
    # PLA Label
    d.draw_text("PLA", 44, 98, TEXT_COLOR, scale=2)
    d.save_bmp("custom1.bmp")

# 2. PETG Preheat Icon
def draw_petg():
    d = ImageDraw()
    draw_card(d)
    
    # Draw thermometer
    d.draw_circle(58, 65, 12, ICON_COLOR, fill=False, thickness=3)
    d.draw_circle(58, 65, 6, ACCENT_RED, fill=True)
    d.draw_rect(54, 25, 62, 55, ICON_COLOR, fill=False, thickness=3)
    d.draw_rect(57, 29, 59, 60, ACCENT_RED, fill=True)
    
    # Heat waves
    d.draw_line(42, 35, 46, 30, ACCENT_RED, thickness=2)
    d.draw_line(42, 45, 46, 40, ACCENT_RED, thickness=2)
    d.draw_line(74, 35, 70, 30, ACCENT_RED, thickness=2)
    d.draw_line(74, 45, 70, 40, ACCENT_RED, thickness=2)
    
    # PETG Label
    d.draw_text("PETG", 35, 98, TEXT_COLOR, scale=2)
    d.save_bmp("custom2.bmp")

# 3. Cooldown Icon
def draw_cooldown():
    d = ImageDraw()
    draw_card(d)
    
    # Draw thermometer
    d.draw_circle(58, 62, 10, ICON_COLOR, fill=False, thickness=3)
    d.draw_rect(54, 25, 62, 53, ICON_COLOR, fill=False, thickness=3)
    
    # Snowflake-like elements (ice stars)
    d.draw_line(35, 40, 45, 40, ACCENT_BLUE, thickness=2)
    d.draw_line(40, 35, 40, 45, ACCENT_BLUE, thickness=2)
    d.draw_line(71, 40, 81, 40, ACCENT_BLUE, thickness=2)
    d.draw_line(76, 35, 76, 45, ACCENT_BLUE, thickness=2)
    
    # Diagonal Slash (OFF / Cooldown)
    d.draw_line(30, 20, 86, 76, ACCENT_BLUE, thickness=3)
    
    # COOL Label
    d.draw_text("COOL", 35, 98, TEXT_COLOR, scale=2)
    d.save_bmp("custom3.bmp")

# 4. Disable Motors Icon
def draw_motors_off():
    d = ImageDraw()
    draw_card(d)
    
    # Stepper Motor Body (Rounded box)
    d.draw_rect(38, 42, 78, 82, ICON_COLOR, fill=False, thickness=3)
    # Inside details (diagonal corners)
    d.draw_line(38, 52, 48, 42, ICON_COLOR, thickness=3)
    d.draw_line(78, 52, 68, 42, ICON_COLOR, thickness=3)
    d.draw_line(38, 72, 48, 82, ICON_COLOR, thickness=3)
    d.draw_line(78, 72, 68, 82, ICON_COLOR, thickness=3)
    
    # Motor Shaft
    d.draw_circle(58, 62, 8, ICON_COLOR, fill=False, thickness=3)
    d.draw_circle(58, 62, 3, ICON_COLOR, fill=True)
    
    # Warning slash
    d.draw_line(30, 30, 86, 86, ACCENT_RED, thickness=4)
    
    # OFF Label
    d.draw_text("M-OFF", 29, 98, TEXT_COLOR, scale=2)
    d.save_bmp("custom4.bmp")

# 5. Home All Icon
def draw_home_all():
    d = ImageDraw()
    draw_card(d)
    
    # House Roof
    d.draw_line(58, 25, 28, 55, ICON_COLOR, thickness=3)
    d.draw_line(58, 25, 88, 55, ICON_COLOR, thickness=3)
    d.draw_line(26, 55, 90, 55, ICON_COLOR, thickness=3)
    
    # House Body
    d.draw_rect(34, 55, 82, 92, ICON_COLOR, fill=False, thickness=3)
    
    # House Door
    d.draw_rect(50, 72, 66, 92, ICON_COLOR, fill=False, thickness=2)
    
    # G28 / HOME text
    d.draw_text("HOME", 35, 98, TEXT_COLOR, scale=2)
    d.save_bmp("custom5.bmp")

# 6. Hotend PID Tuning
def draw_pid_hotend():
    d = ImageDraw()
    draw_card(d)
    
    # Nozzle V shape
    d.draw_line(42, 35, 74, 35, ICON_COLOR, thickness=3) # top block
    d.draw_rect(42, 35, 74, 55, ICON_COLOR, fill=False, thickness=3)
    d.draw_line(46, 55, 54, 75, ICON_COLOR, thickness=3) # left nozzle slope
    d.draw_line(70, 55, 62, 75, ICON_COLOR, thickness=3) # right nozzle slope
    d.draw_line(54, 75, 62, 75, ICON_COLOR, thickness=3) # tip
    
    # Calibration Gears or Tuning Wave
    d.draw_line(30, 48, 38, 48, ACCENT_BLUE, thickness=2)
    d.draw_line(78, 48, 86, 48, ACCENT_BLUE, thickness=2)
    d.draw_circle(58, 45, 4, ACCENT_RED, fill=True) # center nozzle heat
    
    # PID E0 Label
    d.draw_text("PID E0", 25, 98, TEXT_COLOR, scale=2)
    d.save_bmp("custom6.bmp")

# 7. Bed PID Tuning
def draw_pid_bed():
    d = ImageDraw()
    draw_card(d)
    
    # Bed plate (angled parallelogram)
    d.draw_line(30, 60, 80, 60, ICON_COLOR, thickness=4) # top surface
    d.draw_line(20, 75, 70, 75, ICON_COLOR, thickness=4) # bottom surface
    d.draw_line(30, 60, 20, 75, ICON_COLOR, thickness=4)
    d.draw_line(80, 60, 70, 75, ICON_COLOR, thickness=4)
    
    # Heating waves under/over
    d.draw_line(32, 50, 36, 42, ACCENT_RED, thickness=2)
    d.draw_line(47, 50, 51, 42, ACCENT_RED, thickness=2)
    d.draw_line(62, 50, 66, 42, ACCENT_RED, thickness=2)
    
    # PID BED Label
    d.draw_text("PID BED", 18, 98, TEXT_COLOR, scale=2)
    d.save_bmp("custom7.bmp")

print("Drawing custom icons...")
draw_pla()
draw_petg()
draw_cooldown()
draw_motors_off()
draw_home_all()
draw_pid_hotend()
draw_pid_bed()
print("Done drawing!")
