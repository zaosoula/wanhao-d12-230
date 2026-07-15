M413 S1                            ; Enable Marlin power loss recovery
G21                                ; Set metric units
G90                                ; Absolute positioning
M82                                ; Absolute extruder mode

; 1. Heat nozzle to standby temp (150C) to prevent oozing while homing/heating bed
M140 S[bed_temperature_initial_layer_single]  ; Set bed temp
M104 S150                          ; Set nozzle to standby temp (150C)

G28                                ; Home all axes
M420 S1                            ; Load stored bed mesh from EEPROM

G1 X95 Y0 Z10 F6000                ; Park head directly above purge start during final heatup
M190 S[bed_temperature_initial_layer_single]  ; Wait bed temp
M109 S[nozzle_temperature_initial_layer]      ; Wait nozzle printing temp

G92 E0                             ; Reset extruder
G1 Z1.0 F3000                      ; Lift nozzle (pre-purge height)
M83                                ; Relative extruder mode

; Purge line front edge (centered X=95 to X=135)
G1 Z0.3 F3000                      ; Move down to bed surface at start position
G1 X135 Y0 Z0.3 F750 E1.5          ; Purge Line 1 (clamped relative extrusion)
G1 X95 Y1 Z0.3 F5000               ; Move back Y=1
G1 X135 Y1 Z0.3 F750 E1.5          ; Purge Line 2 (clamped relative extrusion)

G1 E-1.0 F1800                     ; Retract 1mm (anti-stringing relative retraction)
M82                                ; Absolute extruder mode
G92 E0                             ; Reset extruder
G1 Z1.0 F3000                      ; Lift nozzle
