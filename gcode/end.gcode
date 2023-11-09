M104 S0  ;hotend off
M140 S0  ;bed off
G92 E0
G1 F2000 E-50 Z+10  ; retract filament 50mm and raize Z by 10mm
G92 E0
G1 F3000 X0 Y270  ;move bed for easy part removal
M84  ;disable steppers
