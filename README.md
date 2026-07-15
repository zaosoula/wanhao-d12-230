# Wanhao Duplicator 12/230 Custom Firmware & Tools

Custom firmware configurations, asset generation tools, and automatic installation scripts for the **Wanhao Duplicator 12/230 (MKS Robin Nano 3.5 TFT)** 3D printer.

---

## 🖥️ Web GUI Interface (Nuxt App)
The repository contains a Web Flasher & Controller under the `gui/` directory:
- **Web Flasher**: Generates custom `robin_nano35_cfg.txt` configurations with presets like Bed PID, BLTouch homing, and WiFi details.
- **Bed Mesh Visualizer**: Renders 3D leveling topology in real-time.
- **MKS WiFi Center**: Provides a customcompiled ESP8266 WiFi binary with tutorial guides.

To start the local GUI server:
```bash
cd gui
npm install
npm run dev # Access at http://localhost:3000
```

---

## 📶 Custom MKS WiFi Firmware
Our custom ESP8266 WiFi firmware provides:
- **mDNS Hostname Support**: Connect directly via **`http://mkswifi.local`** instead of raw IP.
- **Socket Buffering Optimizations**: Prevents connection drops on port `8080` raw TCP bridge (useful for streaming serial data).
- **English Translated Config**: Full English comments and UI labels on the ESP8266 admin portal.

### Compiling WiFi Firmware:
Run the compiler script:
```bash
./scripts/compile_wifi.sh
```
This automatically compiles the ESP8266 firmware and copies the output `MksWifi.bin` directly into the Web GUI static resources folder (`gui/public/firmware/wifi/`).

---

## ⚙️ Custom Firmware Improvements

1.  **Stable Bed Temperature (Z-Banding Mitigation)**:
    *   Activated Bed PID control (`PIDTEMPBED 1`). Holds target bed temp steady instead of oscillating (Bang-Bang method), eliminating micro-movements from thermal expansion that cause layer lines.
2.  **Bowden Tube Optimization**:
    *   Increased filament load/unload feed length to `450` mm (from standard `100` mm) to automate filament changes through the entire length of the Bowden tube.
3.  **UI Macros & Safety Enhancements**:
    *   **Standby Menu**: Replaced redundant buttons with custom PLA Preheat, PETG Preheat, Cooldown, Disable Motors, Home, Hotend PID Autotune, and Bed PID Autotune macros.
    *   **Print Menu**: Replaced dangerous `G28` (Homing) buttons (which cause head crashes mid-print) with safe functions like Pause/Filament change (`M600`) and cooling fan speed toggles.

---

## 🚀 Flashing Instructions

1.  Plug your SD Card into your Mac.
2.  Open the Web GUI, configure your settings, and click **Flash** to automatically write `Robin_nano35.bin` and the customized configuration file to the SD card.
3.  **Flash Printer**: Insert the SD card into your Wanhao D12/230 while it is powered off, then turn it on. The firmware and assets will flash automatically.

