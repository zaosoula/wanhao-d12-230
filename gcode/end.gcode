; Wanhao D12-230 Default End Gcode (Marlin adapted)
G91                     ; Mode déplacement relatif
G1 E-2 F300             ; Retrait léger du filament
G1 Z10 F1200            ; Monte la tête de 10 mm
G90                     ; Retour en position absolue
G1 X0 Y200 F3000        ; Déplace la tête vers l'arrière
M104 S0                 ; Éteint la chauffe de la buse
M140 S0                 ; Éteint la chauffe du plateau
M107                    ; Arrête tous les ventilateurs
M106 S0 P3              ; Arrête ventilateur carte mère
M106 S0 P2              ; Arrête ventilateur auxiliaire
M84 X Y E               ; Désactive X, Y et extrudeur (Z reste actif)
M204 P2000 R2000        ; Reset acceleration limits (Marlin M204)
