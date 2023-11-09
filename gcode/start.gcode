G21 ;metric values
G28 ;home all
G90 ;absolute positioning
M107 ;start with the fan off
G1 F2400 Z15.0 ;raise the nozzle 15mm
M140 S{material_bed_temperature}     ; set bed temperature to e.g. 55 °C and continue
M104 S{material_print_temperature}   ; set hot end temperature to e.g. 210 °C and continue
M190 S{material_bed_temperature}     ; wait for bed temperature to reach e.g. 55 °C
M109 S{material_print_temperature}   ; wait for hot end temperature to reach e.g. 210 °C
G1 F3000 X5 Y10 Z0.2 ;move to prime start position
G92 E0 ;reset extrusion distance
G1 F600 X160 E100 ;prime nozzle in a line
G1 F5000 X180 ;quick wipe
G92 E0 ;reset extrusion distance
