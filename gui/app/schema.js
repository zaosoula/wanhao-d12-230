export const schemaList = [
  {
    "key": "MACHINETPYE",
    "description": "Machine type",
    "label": "Machine type",
    "type": "select",
    "category": "Base settings",
    "options": [
      {
        "label": "Cartesian",
        "value": "0"
      },
      {
        "label": "DELTA",
        "value": "1"
      },
      {
        "label": "COREXY",
        "value": "2"
      }
    ],
    "isHardware": false
  },
  {
    "key": "HAS_TEMP_BED",
    "description": "whether enable the heated bed",
    "label": "Heated bed",
    "type": "boolean",
    "category": "Base settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "EXTRUDERS",
    "description": "This defines the number of extruders",
    "label": "Number of extruder",
    "type": "number",
    "category": "Base settings",
    "isHardware": false
  },
  {
    "key": "cfg_language_adjust_type",
    "description": "multi-language",
    "label": "Multi-language",
    "type": "boolean",
    "category": "Base settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "cfg_language_type",
    "description": "languages setting,this configuration is valid when \"cfg_multiple_language\" is disabled",
    "label": "Language",
    "type": "select",
    "category": "Base settings",
    "options": [
      {
        "label": "Simplified Chinese",
        "value": "1"
      },
      {
        "label": "Traditional Chinese",
        "value": "2"
      },
      {
        "label": "English",
        "value": "3"
      },
      {
        "label": "Russian",
        "value": "4"
      },
      {
        "label": "Spanish",
        "value": "5"
      },
      {
        "label": "French",
        "value": "6"
      },
      {
        "label": "Italian",
        "value": "7"
      }
    ],
    "isHardware": false
  },
  {
    "key": "SINGLE_NOZZLE",
    "description": "SINGLE_NOZZLE",
    "label": "SINGLE_NOZZLE",
    "type": "boolean",
    "category": "Base settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "Z2_STEPPER_DRIVERS",
    "description": "Enable Z2 stepper drivers",
    "label": "Enable Z2",
    "type": "boolean",
    "category": "Base settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "Z2_ENDSTOPS",
    "description": "Enable Z-axis double limit",
    "label": "Enable Z-axis double limit",
    "type": "boolean",
    "category": "Base settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "Z2_USE_ENDSTOP",
    "description": "Z axis second limit interface",
    "label": "Enable Z2",
    "type": "select",
    "category": "Base settings",
    "options": [
      {
        "label": "Useless",
        "value": "0"
      },
      {
        "label": "Z_MAX",
        "value": "1"
      },
      {
        "label": "Z_MIN",
        "value": "2"
      }
    ],
    "isHardware": false
  },
  {
    "key": "X_MIN_POS",
    "description": "MIN X-axis distance(units are in mm)",
    "label": "MIN X-axis",
    "type": "number",
    "category": "Base settings",
    "isHardware": false
  },
  {
    "key": "Y_MIN_POS",
    "description": "MIN Y-axis distance(units are in mm)",
    "label": "MIN Y-axis",
    "type": "number",
    "category": "Base settings",
    "isHardware": false
  },
  {
    "key": "Z_MIN_POS",
    "description": "MIN Z-axis distance(units are in mm)",
    "label": "MIN Z-axis",
    "type": "number",
    "category": "Base settings",
    "isHardware": false
  },
  {
    "key": "X_MAX_POS",
    "description": "MAX X-axis distance(units are in mm)",
    "label": "MAX X-axis",
    "type": "number",
    "category": "Base settings",
    "isHardware": false
  },
  {
    "key": "Y_MAX_POS",
    "description": "MAX Y-axis distance(units are in mm)",
    "label": "MAX Y-axis",
    "type": "number",
    "category": "Base settings",
    "isHardware": false
  },
  {
    "key": "Z_MAX_POS",
    "description": "MAX Z-axis distance(units are in mm)",
    "label": "MAX Z-axis",
    "type": "number",
    "category": "Base settings",
    "isHardware": false
  },
  {
    "key": "FILAMENT_CHANGE_X_POS",
    "description": "X position of hotend  for filament change and pause print",
    "label": "X position",
    "type": "number",
    "category": "Base settings",
    "isHardware": false
  },
  {
    "key": "FILAMENT_CHANGE_Y_POS",
    "description": "Y position of hotend  for filament change and pause print",
    "label": "Y position",
    "type": "number",
    "category": "Base settings",
    "isHardware": false
  },
  {
    "key": "FILAMENT_CHANGE_Z_ADD",
    "description": "Z position of hotend (lift) for filament change and pause print",
    "label": "Z position",
    "type": "number",
    "category": "Base settings",
    "isHardware": false
  },
  {
    "key": "HOTEND_OFFSET_X",
    "description": "(in mm) offset of the second hotend on the X axis ,Offsets for the first hotend must be 0.0.",
    "label": "X axis offset",
    "type": "number",
    "category": "Base settings",
    "isHardware": false
  },
  {
    "key": "HOTEND_OFFSET_Y",
    "description": "(in mm) offset of the second hotend on the Y axis ,Offsets for the first hotend must be 0.0.",
    "label": "Y axis offset",
    "type": "number",
    "category": "Base settings",
    "isHardware": false
  },
  {
    "key": "INVERT_X_DIR",
    "description": "Invert the stepper direction.",
    "label": "Invert X dir",
    "type": "boolean",
    "category": "Stepper Motor Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": true
  },
  {
    "key": "INVERT_Y_DIR",
    "description": "Y motor direction, 1 goes opposite direction",
    "label": "Invert Y dir",
    "type": "boolean",
    "category": "Stepper Motor Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": true
  },
  {
    "key": "INVERT_Z_DIR",
    "description": "Z motor direction, 1 goes opposite direction",
    "label": "Invert Z dir",
    "type": "boolean",
    "category": "Stepper Motor Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": true
  },
  {
    "key": "INVERT_E0_DIR",
    "description": "E0 motor direction, 1 goes opposite direction",
    "label": "Invert E0 dir",
    "type": "boolean",
    "category": "Stepper Motor Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": true
  },
  {
    "key": "INVERT_E1_DIR",
    "description": "E1 motor direction, 1 goes opposite direction",
    "label": "Invert E1 dir",
    "type": "boolean",
    "category": "Stepper Motor Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": true
  },
  {
    "key": "DEFAULT_X_STEPS_PER_UNIT",
    "description": "X steps per mm",
    "label": "X steps",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": true
  },
  {
    "key": "DEFAULT_Y_STEPS_PER_UNIT",
    "description": "Y steps per mm",
    "label": "Y steps",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": true
  },
  {
    "key": "DEFAULT_Z_STEPS_PER_UNIT",
    "description": "Z steps per mm",
    "label": "Z steps",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": true
  },
  {
    "key": "DEFAULT_E0_STEPS_PER_UNIT",
    "description": "E0 steps per mm",
    "label": "E0 steps",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": true
  },
  {
    "key": "DEFAULT_E1_STEPS_PER_UNIT",
    "description": "E1 steps per mm",
    "label": "E1 steps",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": true
  },
  {
    "key": "DEFAULT_X_MAX_FEEDRATE",
    "description": "the Max feedrate of X moving mm/s",
    "label": "Max feedrate of X moving",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": true
  },
  {
    "key": "DEFAULT_Y_MAX_FEEDRATE",
    "description": "the Max feedrate of Y moving mm/s",
    "label": "Max feedrate of Y moving",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": true
  },
  {
    "key": "DEFAULT_Z_MAX_FEEDRATE",
    "description": "the Max feedrate of Z moving mm/s",
    "label": "Max feedrate of Z moving",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": true
  },
  {
    "key": "DEFAULT_E0_MAX_FEEDRATE",
    "description": "the Max feedrate of E0 moving mm/s",
    "label": "Max feedrate of E0 moving",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": true
  },
  {
    "key": "DEFAULT_E1_MAX_FEEDRATE",
    "description": "the Max feedrate of E1 moving mm/s",
    "label": "Max feedrate of E1 moving",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": true
  },
  {
    "key": "DEFAULT_X_MAX_ACCELERATION",
    "description": "the Max acculeration of X printing mm/s^2",
    "label": "Max acculeration of X printing",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "DEFAULT_Y_MAX_ACCELERATION",
    "description": "the Max acculeration of Y printing mm/s^2",
    "label": "Max acculeration of Y printing",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "DEFAULT_Z_MAX_ACCELERATION",
    "description": "the Max acculeration of Z printing mm/s^2",
    "label": "Max acculeration of Z printing",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "DEFAULT_E0_MAX_ACCELERATION",
    "description": "the Max acculeration of E0 printing mm/s^2",
    "label": "Max acculeration of E0 printing",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "DEFAULT_E1_MAX_ACCELERATION",
    "description": "the Max acculeration of E1 printing mm/s^2",
    "label": "Max acculeration of E1 printing",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "DEFAULT_ACCELERATION",
    "description": "X, Y, Z and E acceleration for printing moves mm/s^2",
    "label": "Default acceleration",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "DEFAULT_RETRACT_ACCELERATION",
    "description": "X, Y, Z and E acceleration for retracts mm/s^2",
    "label": "Retracts acceleration",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "DEFAULT_TRAVEL_ACCELERATION",
    "description": "X, Y, Z acceleration for travel (non printing) moves mm/s^2",
    "label": "Travel acceleration",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "DEFAULT_MINIMUMFEEDRATE",
    "description": "default minimum feedrate",
    "label": "Minimum feedrate",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": true
  },
  {
    "key": "DEFAULT_MINSEGMENTTIME",
    "description": "minimum time in microseconds that a movement needs to take if the buffer is emptied. ",
    "label": "Minimum time",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "DEFAULT_MINTRAVELFEEDRATE",
    "description": "default minimum travel feedrate",
    "label": "Minimum travel feedrate",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": true
  },
  {
    "key": "DEFAULT_XJERK",
    "description": "Default Axis-X Jerk (mm/s)",
    "label": "Axis-X Jerk",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "DEFAULT_YJERK",
    "description": "Default Axis-Y Jerk (mm/s)",
    "label": "Axis-Y Jerk",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "DEFAULT_ZJERK",
    "description": "Default Axis-Z Jerk (mm/s)",
    "label": "Axis-Z Jerk",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "DEFAULT_EJERK",
    "description": "Default Axis-E Jerk (mm/s)",
    "label": "Axis-E Jerk",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "X_ENABLE_ON",
    "description": "Level_EnablePin_X",
    "label": "Level_EnablePin_X",
    "type": "boolean",
    "category": "Stepper Motor Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "Y_ENABLE_ON",
    "description": "Level_EnablePin_Y",
    "label": "Level_EnablePin_Y",
    "type": "boolean",
    "category": "Stepper Motor Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "Z_ENABLE_ON",
    "description": "Level_EnablePin_Z",
    "label": "Level_EnablePin_Z",
    "type": "boolean",
    "category": "Stepper Motor Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "E_ENABLE_ON",
    "description": "Level_EnablePin_E",
    "label": "Level_EnablePin_E",
    "type": "boolean",
    "category": "Stepper Motor Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "PULSE_DELAY",
    "description": "Pulse hold time (unit: machine cycle)",
    "label": "Pulse hold time",
    "type": "number",
    "category": "Stepper Motor Settings",
    "isHardware": false
  },
  {
    "key": "TEMP_SENSOR_0",
    "description": "Temp sensor type",
    "label": "Temp sensor type",
    "type": "select",
    "category": "Thermal Settings",
    "options": [
      {
        "label": "100k thermistor",
        "value": "1"
      },
      {
        "label": "MAX31855 thermocouple",
        "value": "-3"
      }
    ],
    "isHardware": false
  },
  {
    "key": "EXTRUDE_MINTEMP",
    "description": "Extrusion head set minimum temperature",
    "label": "Extrusion Min temp",
    "type": "number",
    "category": "Thermal Settings",
    "isHardware": false
  },
  {
    "key": "HEATER_0_MINTEMP",
    "description": "Extrusion head0 set minimum temperature",
    "label": "E0 Min temp",
    "type": "number",
    "category": "Thermal Settings",
    "isHardware": false
  },
  {
    "key": "HEATER_0_MAXTEMP",
    "description": "Extrusion head0 set maximum temperature",
    "label": "E0 Max temp",
    "type": "number",
    "category": "Thermal Settings",
    "isHardware": true
  },
  {
    "key": "HEATER_1_MINTEMP",
    "description": "Extrusion head1 set minimum temperature",
    "label": "E1 Min temp",
    "type": "number",
    "category": "Thermal Settings",
    "isHardware": false
  },
  {
    "key": "HEATER_1_MAXTEMP",
    "description": "Extrusion head1 set maximum temperature",
    "label": "E1 Max temp",
    "type": "number",
    "category": "Thermal Settings",
    "isHardware": true
  },
  {
    "key": "BED_MAXTEMP",
    "description": "Set the maximum temperature of the Heated bed",
    "label": "Heated bed max temp",
    "type": "number",
    "category": "Thermal Settings",
    "isHardware": true
  },
  {
    "key": "THERMAL_PROTECTION_PERIOD",
    "description": "Extrusion thermal protection period,unit:Seconds;When the machine frequently appears Err7, the current value can be appropriately increased.",
    "label": "Extrusion thermal protection period",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "THERMAL_PROTECTION_HYSTERESIS",
    "description": "Extrusion thermal protection hysteresis Degrees Celsius",
    "label": "Extrusion thermal protection hysteresis",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "WATCH_TEMP_PERIOD",
    "description": "Extrusion watch temp period,unit:Seconds;When the machine frequently appears Err5, the current value can be appropriately increased.",
    "label": "Extrusion watch temp period",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "WATCH_TEMP_INCREASE",
    "description": "Extrusion watch temp incerease Degrees Celsius",
    "label": "Extrusion watch temp incerease",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "WATCH_BED_TEMP_PERIOD",
    "description": "Bed temp period,unit:Seconds;When the machine frequently appears Err6, the current value can be appropriately increased.",
    "label": "Bed temp period",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "WATCH_BED_TEMP_INCREASE",
    "description": "Bed temp incerease Degrees Celsius",
    "label": "Bed temp incerease",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "THERMAL_PROTECTION_BED_PERIOD",
    "description": "Bed thermal protection period,unit:Seconds;When the machine frequently appears Err7, the current value can be appropriately increased.",
    "label": "Bed thermal protection period",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "THERMAL_PROTECTION_BED_HYSTERESIS",
    "description": "Bed thermal protection hysteresis Degrees Celsius",
    "label": "Bed thermal protection hysteresis",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "PIDTEMPE",
    "description": "Type of heat manager for extruder",
    "label": "Type of heat manager",
    "type": "boolean",
    "category": "Thermal Runaway Protection",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "DEFAULT_Kp",
    "description": "the P setting of extruder",
    "label": "Extruder P setting",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "DEFAULT_Ki",
    "description": "the I setting of extruder",
    "label": "Extruder I setting",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "EXT_PID_D",
    "description": "the D setting of extruder",
    "label": "Extruder D setting",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "PIDTEMPBED",
    "description": "Type of heat manager for heated bed",
    "label": "Type of heated bed manager",
    "type": "boolean",
    "category": "Thermal Runaway Protection",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "DEFAULT_bedKp",
    "description": "the P setting of heated bed",
    "label": "Heated bed P setting",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "DEFAULT_bedKi",
    "description": "the I setting of heated bed",
    "label": "Heated bed I setting",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "DEFAULT_bedKd",
    "description": "the D setting of heated bed",
    "label": "Heated bed D setting",
    "type": "number",
    "category": "Thermal Runaway Protection",
    "isHardware": false
  },
  {
    "key": "MIN_SOFTWARE_ENDSTOPS",
    "description": "Min software endstops",
    "label": "Min software endstops",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "MAX_SOFTWARE_ENDSTOPS",
    "description": "MAX software endstops",
    "label": "MAX software endstops",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "X_MIN_ENDSTOP_INVERTING",
    "description": "ENDSTOP_X_MIN_INVERTING",
    "label": "ENDSTOP_X_MIN_INVERTING",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": true
  },
  {
    "key": "Y_MIN_ENDSTOP_INVERTING",
    "description": "ENDSTOP_Y_MIN_INVERTING",
    "label": "ENDSTOP_Y_MIN_INVERTING",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": true
  },
  {
    "key": "Z_MIN_ENDSTOP_INVERTING",
    "description": "ENDSTOP_Z_MIN_INVERTING",
    "label": "ENDSTOP_Z_MIN_INVERTING",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": true
  },
  {
    "key": "X_MAX_ENDSTOP_INVERTING",
    "description": "ENDSTOP_X_MAX_INVERTING",
    "label": "ENDSTOP_X_MAX_INVERTING",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": true
  },
  {
    "key": "ENDSTOP_Y_MAX_INVERTING",
    "description": "ENDSTOP_Y_MAX_INVERTING",
    "label": "ENDSTOP_Y_MAX_INVERTING",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": true
  },
  {
    "key": "Z_MAX_ENDSTOP_INVERTING",
    "description": "ENDSTOP_Z_MAX_INVERTING",
    "label": "ENDSTOP_Z_MAX_INVERTING",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": true
  },
  {
    "key": "Z_MIN_PROBE_ENDSTOP_INVERTING",
    "description": "set to true to invert the logic of the Z_PROBE endstop.",
    "label": "Z_PROBE endstop",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": true
  },
  {
    "key": "USE_XMIN_PLUG",
    "description": "XMIN_PLUG,Specify here all the endstop connectors that are connected to any endstop or probe.",
    "label": "XMIN_PLUG",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "USE_YMIN_PLUG",
    "description": "YMIN_PLUG,Specify here all the endstop connectors that are connected to any endstop or probe.",
    "label": "YMIN_PLUG",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "USE_ZMIN_PLUG",
    "description": "ZMIN_PLUG,Specify here all the endstop connectors that are connected to any endstop or probe.",
    "label": "ZMIN_PLUG",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "USE_XMAX_PLUG",
    "description": "XMAX_PLUG,Specify here all the endstop connectors that are connected to any endstop or probe.",
    "label": "XMAX_PLUG",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "USE_YMAX_PLUG",
    "description": "YMAX_PLUG,Specify here all the endstop connectors that are connected to any endstop or probe.",
    "label": "YMAX_PLUG",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "USE_ZMAX_PLUG",
    "description": "ZMAX_PLUG,Specify here all the endstop connectors that are connected to any endstop or probe.",
    "label": "ZMAX_PLUG",
    "type": "boolean",
    "category": "Endstop  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "X_HOME_DIR",
    "description": "X Homing direction",
    "label": "X Homing direction",
    "type": "select",
    "category": "Home settings",
    "options": [
      {
        "label": "MIN",
        "value": "-1"
      },
      {
        "label": "MAX",
        "value": "1"
      }
    ],
    "isHardware": false
  },
  {
    "key": "Y_HOME_DIR",
    "description": "Y Homing direction",
    "label": "Y Homing direction",
    "type": "select",
    "category": "Home settings",
    "options": [
      {
        "label": "MIN",
        "value": "-1"
      },
      {
        "label": "MAX",
        "value": "1"
      }
    ],
    "isHardware": false
  },
  {
    "key": "Z_HOME_DIR",
    "description": "Z Homing direction",
    "label": "Z Homing direction",
    "type": "select",
    "category": "Home settings",
    "options": [
      {
        "label": "MIN",
        "value": "-1"
      },
      {
        "label": "MAX",
        "value": "1"
      }
    ],
    "isHardware": false
  },
  {
    "key": "HOME_Y_BEFORE_X",
    "description": "Homing direction When G28 is called",
    "label": "Homing direction",
    "type": "boolean",
    "category": "Home settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "HOMING_FEEDRATE_XY",
    "description": "Homing X Y speeds (mm/m)",
    "label": "Homing X Y speeds",
    "type": "number",
    "category": "Home settings",
    "isHardware": true
  },
  {
    "key": "HOMING_FEEDRATE_Z",
    "description": "Homing Z speeds (mm/m)",
    "label": "Homing Z speeds",
    "type": "number",
    "category": "Home settings",
    "isHardware": true
  },
  {
    "key": "Z_MIN_PROBE_PIN_MODE",
    "description": "Select for a probe connected to Z-Min or Z-Max.",
    "label": "probe connected",
    "type": "select",
    "category": "Z Probe Settings",
    "options": [
      {
        "label": "NULL",
        "value": "0"
      },
      {
        "label": "ZMIN",
        "value": "1"
      },
      {
        "label": "ZMAX",
        "value": "2"
      }
    ],
    "isHardware": false
  },
  {
    "key": "BLTOUCH",
    "description": "BLTOUCH",
    "label": "BLTOUCH",
    "type": "boolean",
    "category": "Z Probe Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "Z_PROBE_OFFSET_FROM_EXTRUDER",
    "description": "Z offset: -below +above  [the nozzle]",
    "label": "Z offset",
    "type": "number",
    "category": "Z Probe Settings",
    "isHardware": false
  },
  {
    "key": "X_PROBE_OFFSET_FROM_EXTRUDER",
    "description": "X offset: -below +above  [the nozzle]",
    "label": "X offset",
    "type": "number",
    "category": "Z Probe Settings",
    "isHardware": false
  },
  {
    "key": "Y_PROBE_OFFSET_FROM_EXTRUDER",
    "description": "Y offset: -below +above  [the nozzle]",
    "label": "Y offset",
    "type": "number",
    "category": "Z Probe Settings",
    "isHardware": false
  },
  {
    "key": "XY_PROBE_SPEED",
    "description": "X and Y axis travel speed (mm/m) between probes",
    "label": "Probes move speed",
    "type": "number",
    "category": "Z Probe Settings",
    "isHardware": false
  },
  {
    "key": "Z_PROBE_SPEED_FAST",
    "description": " Speed for the first approach when double-probing (with PROBE_DOUBLE_TOUCH)",
    "label": "Probes fast speed",
    "type": "number",
    "category": "Z Probe Settings",
    "isHardware": false
  },
  {
    "key": "Z_PROBE_SPEED_SLOW",
    "description": "Speed for the \"accurate\" probe of each point",
    "label": "Probes slow speed",
    "type": "number",
    "category": "Z Probe Settings",
    "isHardware": false
  },
  {
    "key": "cfg_insert_det_module",
    "description": "Assemble power outage module",
    "label": "Assemble power outage module",
    "type": "boolean",
    "category": "Advanced  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "cfg_have_ups_device",
    "description": "whether have ups device",
    "label": "UPS",
    "type": "boolean",
    "category": "Advanced  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "cfg_print_over_auto_close",
    "description": "auto-off when print finishes",
    "label": "Auto-off",
    "type": "boolean",
    "category": "Advanced  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "PRINT_FINISHED_COUNT",
    "description": "After the shutdown delay time (unit: second)",
    "label": "Shutdown delay time",
    "type": "number",
    "category": "Advanced  Settings",
    "isHardware": false
  },
  {
    "key": "cfg_filament_det0_trigger_level",
    "description": "the level signal of outage detection E0 module",
    "label": "E0 Level signal",
    "type": "boolean",
    "category": "Advanced  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "cfg_filament_det1_trigger_level",
    "description": "the level signal of outage detection E1 module",
    "label": "E1 Level signal",
    "type": "boolean",
    "category": "Advanced  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "cfg_filament_load_length",
    "description": "the lenght to extrude filament (mm),Max:2000mm",
    "label": "Load lenght",
    "type": "number",
    "category": "Advanced  Settings",
    "isHardware": false
  },
  {
    "key": "cfg_filament_load_speed",
    "description": "the speed to extrude filament(mm/min)",
    "label": "Load speed",
    "type": "number",
    "category": "Advanced  Settings",
    "isHardware": false
  },
  {
    "key": "cfg_filament_load_limit_temperature",
    "description": "It is the minimum temperature to extrude filament .",
    "label": "Load min temperature",
    "type": "number",
    "category": "Advanced  Settings",
    "isHardware": false
  },
  {
    "key": "cfg_filament_unload_length",
    "description": "the lenght to retract filament (mm),Max:2000mm",
    "label": "Retract lenght",
    "type": "number",
    "category": "Advanced  Settings",
    "isHardware": false
  },
  {
    "key": "cfg_filament_unload_speed",
    "description": "the speed to retract filament(mm/min)",
    "label": "Retract speed",
    "type": "number",
    "category": "Advanced  Settings",
    "isHardware": false
  },
  {
    "key": "cfg_filament_unload_limit_temperature",
    "description": "It is the minimum temperature to retract filament .",
    "label": "Retract min temperature",
    "type": "number",
    "category": "Advanced  Settings",
    "isHardware": false
  },
  {
    "key": "cfg_Standby_mode",
    "description": "Whether to enable the wake-up function",
    "label": "Wake-up function",
    "type": "boolean",
    "category": "Advanced  Settings",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "cfg_Standby_gap_time",
    "description": "Set to enter sleep time (unit: second)",
    "label": "Sleep time",
    "type": "number",
    "category": "Advanced  Settings",
    "isHardware": false
  },
  {
    "key": "cfg_leveling_mode",
    "description": "Leveling mode",
    "label": "Leveling mode",
    "type": "boolean",
    "category": "Bed Leveling",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "cfg_point_number",
    "description": "the point number of manual leveling",
    "label": " Point number",
    "type": "select",
    "category": "Bed Leveling",
    "options": [
      {
        "label": "3",
        "value": "3"
      },
      {
        "label": "4",
        "value": "4"
      },
      {
        "label": "5",
        "value": "5"
      }
    ],
    "isHardware": false
  },
  {
    "key": "cfg_point1:",
    "description": "the point1 location of  manual leveling(x,y)",
    "label": "Point1",
    "type": "string",
    "category": "Bed Leveling",
    "isHardware": false
  },
  {
    "key": "cfg_point2:",
    "description": "the point2 location of  manual leveling(x,y)",
    "label": "Point2",
    "type": "string",
    "category": "Bed Leveling",
    "isHardware": false
  },
  {
    "key": "cfg_point3:",
    "description": "the point3 location of  manual leveling(x,y)",
    "label": "Point3",
    "type": "string",
    "category": "Bed Leveling",
    "isHardware": false
  },
  {
    "key": "cfg_point4:",
    "description": "the point4 location of  manual leveling(x,y)",
    "label": "Point4",
    "type": "string",
    "category": "Bed Leveling",
    "isHardware": false
  },
  {
    "key": "cfg_point5:",
    "description": "the point5 location of  manual leveling(x,y)",
    "label": "Point5",
    "type": "string",
    "category": "Bed Leveling",
    "isHardware": false
  },
  {
    "key": "cfg_auto_leveling_cmd:",
    "description": "the setting of auto-leveling command button",
    "label": "Auto-leveling command",
    "type": "string",
    "category": "Bed Leveling",
    "isHardware": false
  },
  {
    "key": "BED_LEVELING_METHOD",
    "description": "Leveling mode",
    "label": "Leveling mode",
    "type": "select",
    "category": "Heatbed Leveling",
    "options": [
      {
        "label": "NULL_BED_LEVELING",
        "value": "0"
      },
      {
        "label": "AUTO_BED_LEVELING_BILINEAR",
        "value": "3"
      },
      {
        "label": "MESH_BED_LEVELING",
        "value": "5"
      }
    ],
    "isHardware": false
  },
  {
    "key": "GRID_MAX_POINTS_X",
    "description": "the number of X grid points per dimension. <= 15",
    "label": "Xgrid points number",
    "type": "number",
    "category": "Heatbed Leveling",
    "isHardware": false
  },
  {
    "key": "GRID_MAX_POINTS_Y",
    "description": "the number of Y grid points per dimension. <= 15",
    "label": "Ygrid points number",
    "type": "number",
    "category": "Heatbed Leveling",
    "isHardware": false
  },
  {
    "key": "Z_CLEARANCE_DEPLOY_PROBE",
    "description": "Z Clearance for Deploy/Stow",
    "label": "Z Clearance for Deploy/Stow",
    "type": "number",
    "category": "Heatbed Leveling",
    "isHardware": false
  },
  {
    "key": "Z_CLEARANCE_BETWEEN_PROBES",
    "description": "Z Clearance between probe points",
    "label": "Z Clearance between probe points",
    "type": "number",
    "category": "Heatbed Leveling",
    "isHardware": false
  },
  {
    "key": "LEFT_PROBE_BED_POSITION",
    "description": "Left position. Set the boundaries for probing (where the probe can reach)",
    "label": "Left position",
    "type": "number",
    "category": "Heatbed Leveling",
    "isHardware": false
  },
  {
    "key": "RIGHT_PROBE_BED_POSITION",
    "description": "Right position. Set the boundaries for probing (where the probe can reach)",
    "label": "Right position",
    "type": "number",
    "category": "Heatbed Leveling",
    "isHardware": false
  },
  {
    "key": "FRONT_PROBE_BED_POSITION",
    "description": "Front position. Set the boundaries for probing (where the probe can reach)",
    "label": "Front position",
    "type": "number",
    "category": "Heatbed Leveling",
    "isHardware": false
  },
  {
    "key": "BACK_PROBE_BED_POSITION",
    "description": "Back position. Set the boundaries for probing (where the probe can reach)",
    "label": "Back position",
    "type": "number",
    "category": "Heatbed Leveling",
    "isHardware": false
  },
  {
    "key": "MESH_INSET",
    "description": " Mesh inset margin on print area for MESH_BED_LEVELING",
    "label": "Margin on print area",
    "type": "number",
    "category": "Heatbed Leveling",
    "isHardware": false
  },
  {
    "key": "DELTA_SEGMENTS_PER_SECOND",
    "description": "DELTA_SEGMENTS_PER_SECOND",
    "label": "DELTA_SEGMENTS_PER_SECOND",
    "type": "number",
    "category": "Delta Settings",
    "isHardware": false
  },
  {
    "key": "DELTA_DIAGONAL_ROD",
    "description": "Center-to-center distance of the holes in the diagonal push rods.",
    "label": "(2)DELTA_DIAGONAL_ROD",
    "type": "number",
    "category": "Delta Settings",
    "isHardware": false
  },
  {
    "key": "DELTA_SMOOTH_ROD_OFFSET",
    "description": "Horizontal offset from middle of printer to smooth rod center.",
    "label": "(6)DELTA_SMOOTH_ROD_OFFSET",
    "type": "number",
    "category": "Delta Settings",
    "isHardware": false
  },
  {
    "key": "DELTA_EFFECTOR_OFFSET",
    "description": "Horizontal offset of the universal joints on the end effector.",
    "label": "(3)DELTA_EFFECTOR_OFFSET",
    "type": "number",
    "category": "Delta Settings",
    "isHardware": false
  },
  {
    "key": "DELTA_CARRIAGE_OFFSET",
    "description": "Horizontal offset of the universal joints on the carriages.",
    "label": "(4)DELTA_CARRIAGE_OFFSET",
    "type": "number",
    "category": "Delta Settings",
    "isHardware": false
  },
  {
    "key": "DELTA_RADIUS",
    "description": "Horizontal distance bridged by diagonal push rods when effector is centered.\t",
    "label": "(5)DELTA_RADIUS",
    "type": "number",
    "category": "Delta Settings",
    "isHardware": false
  },
  {
    "key": "DELTA_HEIGHT",
    "description": "height from z=0.00 to home position",
    "label": "DELTA_HEIGHT",
    "type": "number",
    "category": "Delta Settings",
    "isHardware": false
  },
  {
    "key": "DELTA_PRINTABLE_RADIUS",
    "description": "Print surface diameter/2 minus unreachable space (avoid collisions with vertical towers).",
    "label": "DELTA_PRINTABLE_RADIUS",
    "type": "number",
    "category": "Delta Settings",
    "isHardware": false
  },
  {
    "key": "DELTA_CALIBRATION_RADIUS",
    "description": "set the radius for the calibration probe points - max 0.8 * DELTA_PRINTABLE_RADIUS ",
    "label": "DELTA_CALIBRATION_RADIUS",
    "type": "number",
    "category": "Delta Settings",
    "isHardware": false
  },
  {
    "key": "CFG_WIFI_MODE",
    "description": "WIFI mode",
    "label": "WIFI mode",
    "type": "boolean",
    "category": "Wireless",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "CFG_WIFI_AP_NAME",
    "description": "WIFI name",
    "label": "WIFI name",
    "type": "string",
    "category": "Wireless",
    "isHardware": false
  },
  {
    "key": "CFG_WIFI_KEY_CODE",
    "description": "WIFI password",
    "label": "WIFI password",
    "type": "string",
    "category": "Wireless",
    "isHardware": false
  },
  {
    "key": "CFG_CLOUD_ENABLE",
    "description": "cloud service",
    "label": "Cloud service",
    "type": "boolean",
    "category": "Wireless",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "CFG_WIFI_CLOUD_HOST",
    "description": "cloud service adress",
    "label": "Cloud service address",
    "type": "string",
    "category": "Wireless",
    "isHardware": false
  },
  {
    "key": "CFG_CLOUD_PORT",
    "description": "cloud service port",
    "label": "Port",
    "type": "number",
    "category": "Wireless",
    "isHardware": false
  },
  {
    "key": "WISI_LIST_SCAN",
    "description": "Whether to use wifi list scan",
    "label": "WIFI list scan",
    "type": "boolean",
    "category": "Wireless",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "DISABLE_WIFI",
    "description": "Whether to display wifi button",
    "label": "WIFI button",
    "type": "boolean",
    "category": "Wireless",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "about_type:",
    "description": "about_type",
    "label": "About_type",
    "type": "string",
    "category": "Wireless",
    "isHardware": false
  },
  {
    "key": "about_version:",
    "description": "about_version",
    "label": "About_version",
    "type": "string",
    "category": "Wireless",
    "isHardware": false
  },
  {
    "key": "about_company:",
    "description": "about_company",
    "label": "About_company",
    "type": "string",
    "category": "Wireless",
    "isHardware": false
  },
  {
    "key": "about_email:",
    "description": "about_email",
    "label": "About_email",
    "type": "string",
    "category": "Wireless",
    "isHardware": false
  },
  {
    "key": "PAUSE_UNLOAD_LEN",
    "description": "Suspend extrusion configuration",
    "label": "Suspend extrusion configuration",
    "type": "number",
    "category": "Wireless",
    "isHardware": false
  },
  {
    "key": "RESUME_LOAD_LEN",
    "description": "resume extrusion configuration",
    "label": "Resume extrusion configuration",
    "type": "number",
    "category": "Wireless",
    "isHardware": false
  },
  {
    "key": "RESUME_SPEED",
    "description": "Suspend/resume extrusion increase percentage, when 0, the item does not work (unit: %)",
    "label": "Percentage",
    "type": "number",
    "category": "Wireless",
    "isHardware": false
  },
  {
    "key": "setmenu_func1_display",
    "description": "user-defined function1",
    "label": "User-defined function1",
    "type": "boolean",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "setmenu_func1:",
    "description": "user-defined function1 command，each command must be separated by semicolon \";\"",
    "label": "Function1 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "moreitem_pic_cnt",
    "description": "the number of \"more\" button ",
    "label": "Button num",
    "type": "number",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "moreitem_button1_cmd:",
    "description": "Button1 command edit, each command must be separated by semicolon \";\"",
    "label": "Button1 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "moreitem_button2_cmd:",
    "description": "Button2 command edit, each command must be separated by semicolon \";\"",
    "label": "Button2 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "moreitem_button3_cmd:",
    "description": "Button3 command edit, each command must be separated by semicolon \";\"",
    "label": "Button3 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "moreitem_button4_cmd:",
    "description": "Button4 command edit, each command must be separated by semicolon \";\"",
    "label": "Button4 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "moreitem_button5_cmd:",
    "description": "Button5 command edit, each command must be separated by semicolon \";\"",
    "label": "Button5 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "moreitem_button6_cmd:",
    "description": "Button6 command edit, each command must be separated by semicolon \";\"",
    "label": "Button6 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "moreitem_button7_cmd:",
    "description": "Button7 command edit, each command must be separated by semicolon \";\"",
    "label": "Button7 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "morefunc_cnt:",
    "description": "the number of \"more\" button to dispaly on printing interface",
    "label": "Number of \"more\" button",
    "type": "number",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "morefunc1_cmd:",
    "description": "command edit of \"more\" button1 to dispaly on printing interface, each command must be separated by semicolon \";\"",
    "label": "Button1 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "morefunc2_cmd:",
    "description": "command edit of \"more\" button2 to dispaly on printing interface, each command must be separated by semicolon \";\"",
    "label": "Button2 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "morefunc3_cmd:",
    "description": "command edit of \"more\" button3 to dispaly on printing interface, each command must be separated by semicolon \";\"",
    "label": "Button3 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "morefunc4_cmd:",
    "description": "command edit of \"more\" button4 to dispaly on printing interface, each command must be separated by semicolon \";\"",
    "label": "Button4 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "morefunc5_cmd:",
    "description": "command edit of \"more\" button5 to dispaly on printing interface, each command must be separated by semicolon \";\"",
    "label": "Button5 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "morefunc6_cmd:",
    "description": "command edit of \"more\" button6 to dispaly on printing interface, each command must be separated by semicolon \";\"",
    "label": "Button6 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "morefunc7_cmd:",
    "description": "command edit of \"more\" button7 to dispaly on printing interface, each command must be separated by semicolon \";\"",
    "label": "Button7 command",
    "type": "string",
    "category": "Display Effect(refer to MKS TFT datasheet)",
    "isHardware": false
  },
  {
    "key": "cfg_background_color",
    "description": "the color of screen background",
    "label": "Background color",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_title_color",
    "description": "the color of title text",
    "label": "Title color",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_state_bkcolor",
    "description": "the color of temperature,fan,(etc)background",
    "label": "Status color",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_state_textcolor",
    "description": "the color of temprature,fan,(etc) text",
    "label": "Status text color",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_filename_bkcolor",
    "description": "the color of file button",
    "label": "File button color",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_filename_textcolor",
    "description": "the color of file text",
    "label": "File button text color",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_btn_bkcolor",
    "description": "Universal button background color",
    "label": "Universal backgroundcolor",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_btn_textcolor",
    "description": "Universal button text color",
    "label": "Universal textcolor",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_state_btn_bkcolor",
    "description": "Status button background color",
    "label": "Status backgroundcolor",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_state_btn_textcolor",
    "description": "Status button text color",
    "label": "Status textcolor",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_back_btn_bkcolor",
    "description": "Return button background color",
    "label": "Return backgroundcolor",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_back_btn_textcolor",
    "description": "Return button text color",
    "label": "Return textcolor",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_sel_btn_bkcolor",
    "description": "Selected button background color",
    "label": "Selected backgroundcolor",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_sel_btn_textcolor",
    "description": "Selected button text color",
    "label": "Selected textcolor",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_dialog_btn_bkcolor",
    "description": "Dialog button background color",
    "label": "Dialog backgroundcolor",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_dialog_btn_textcolor",
    "description": "Dialog button text color",
    "label": "Dialog textcolor",
    "type": "string",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_btn_text_offset",
    "description": "position of button font offset bottom(unit:pixel)",
    "label": "Offset position",
    "type": "number",
    "category": "Display Customization",
    "isHardware": false
  },
  {
    "key": "cfg_screen_display_mode",
    "description": "the style of display on the screen home",
    "label": "Style of display",
    "type": "boolean",
    "category": "Display Customization",
    "trueValue": "1",
    "falseValue": "0",
    "isHardware": false
  },
  {
    "key": "cfg_screen_overturn_180",
    "description": "The screen flips 180°",
    "label": "screen flips",
    "type": "select",
    "category": "Display Customization",
    "options": [
      {
        "label": "no flip",
        "value": "0x00"
      },
      {
        "label": "flip",
        "value": "0xEE"
      }
    ],
    "isHardware": false
  }
];
