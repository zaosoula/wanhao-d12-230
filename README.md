# Wanhao Duplicator 12/230 Custom Firmware & Tools

Custom firmware configurations, asset generation tools, and automatic installation scripts for the **Wanhao Duplicator 12/230 (MKS Robin Nano 3.5 TFT)** 3D printer.

---

## 📂 Repository Structure

*   **[firmware/](file:///Users/zaosoula/Github/wanhao-d12-230/firmware/)**: Active custom firmware binary, config file, and touchscreen UI assets.
    *   [robin_nano35_cfg.txt](file:///Users/zaosoula/Github/wanhao-d12-230/firmware/robin_nano35_cfg.txt): Custom configuration (Marlin parameters, UI macros, Wi-Fi config placeholders).
    *   `mks_pic/`: touchscreen icon assets (`.bin` files).
    *   `mks_font/`: touchscreen font assets.
*   **[firmware/original_backup/](file:///Users/zaosoula/Github/wanhao-d12-230/firmware/original_backup/)**: Original factory firmware binary and configuration backups.
*   **[scripts/](file:///Users/zaosoula/Github/wanhao-d12-230/scripts/)**: Automated tools and installation helpers:
    *   [install_firmware.sh](file:///Users/zaosoula/Github/wanhao-d12-230/scripts/install_firmware.sh): Interactive macOS SD card flasher and Wi-Fi credential provisioner.
    *   [generate_custom_icons.py](file:///Users/zaosoula/Github/wanhao-d12-230/scripts/generate_custom_icons.py): Programmatic pixel-art button generator.
    *   [bmp_to_bin.py](file:///Users/zaosoula/Github/wanhao-d12-230/scripts/bmp_to_bin.py): 24-bit BMP to MKS Little-Endian RGB565 `.bin` converter.

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
2.  Run the interactive installer from the repository root:
    ```bash
    ./scripts/install_firmware.sh
    ```
3.  **Select Volume**: Select the menu number corresponding to your SD card. The script will auto-detect and highlight standard printer SD cards containing `.CUR` backup files.
4.  **Configure Wi-Fi**: When prompted, enter your SSID and Password. The script will temporarily patch these settings into the config file copied to the SD card, keeping placeholders (`YOUR_WIFI_SSID` / `YOUR_WIFI_PASSWORD`) in the repository file to prevent leaking credentials to Git.
5.  **Sync & Eject**: The script will flush all writes and safely unmount the card.
6.  **Flash Printer**: Insert the SD card into your Wanhao D12/230 while it is powered off, then turn it on. The firmware and assets will flash automatically.
