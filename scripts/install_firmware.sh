#!/bin/bash
set -e

echo "Searching for mounted volumes in /Volumes..."

# Find all directories in /Volumes, excluding hidden files
volumes=()
volume_tags=()
while IFS= read -r line; do
    if [ "$(basename "$line")" != "Macintosh HD" ]; then
        volumes+=("$line")
        # Check if printer backup/firmware files exist (.CUR / .cur / .bin / .txt)
        tag=""
        if [ -f "$line/ROBIN_NANO35.CUR" ] || [ -f "$line/robin_nano35_cfg.CUR" ] || \
           [ -f "$line/robin_nano35.cur" ] || [ -f "$line/robin_nano35_cfg.cur" ] || \
           [ -f "$line/Robin_nano35.bin" ] || [ -f "$line/robin_nano35_cfg.txt" ]; then
            tag=" [PRINTER SD - RECOMMENDED]"
        fi
        volume_tags+=("$tag")
    fi
done < <(find /Volumes -maxdepth 1 -mindepth 1 -type d ! -name ".*")

if [ ${#volumes[@]} -eq 0 ]; then
    echo "Error: No mounted volumes found in /Volumes!"
    exit 1
fi

echo "Available Volumes:"
for i in "${!volumes[@]}"; do
    echo "$((i+1))) $(basename "${volumes[i]}") (${volumes[i]})${volume_tags[i]}"
done
echo ""

while true; do
    read -p "Select number of target SD Card: " selection
    if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 1 ] && [ "$selection" -le "${#volumes[@]}" ]; then
        SD_PATH="${volumes[$((selection-1))]}"
        break
    else
        echo "Invalid choice. Please enter a number between 1 and ${#volumes[@]}."
    fi
done

echo ""
echo "Selected target: $SD_PATH"
read -p "Confirm copy to this path? (y/n): " confirm
if [[ ! "$confirm" =~ ^[yY](es)?$ ]]; then
    echo "Aborted."
    exit 0
fi

echo "Copying firmware files to $SD_PATH..."

# Ensure we are in script directory
cd "$(dirname "$0")"

# Source files check
if [ ! -f "../firmware/Robin_nano35.bin" ] || [ ! -f "../firmware/robin_nano35_cfg.txt" ]; then
    echo "Error: Firmware source files missing in firmware/ directory!"
    exit 1
fi

# Copy binary
cp -v "../firmware/Robin_nano35.bin" "$SD_PATH/"

# Configure Wi-Fi prompt
echo ""
read -p "Configure Wi-Fi settings for printer? (y/n): " config_wifi
if [[ "$config_wifi" =~ ^[yY](es)?$ ]]; then
    read -p "  Enter Wi-Fi SSID: " wifi_ssid
    read -s -p "  Enter Wi-Fi Password: " wifi_password
    echo ""
    echo "Writing configuration with Wi-Fi settings to $SD_PATH/robin_nano35_cfg.txt..."
    SSID="$wifi_ssid" PASSWORD="$wifi_password" python3 -c "
import os
with open('../firmware/robin_nano35_cfg.txt', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()
content = content.replace('YOUR_WIFI_SSID', os.environ.get('SSID', ''))
content = content.replace('YOUR_WIFI_PASSWORD', os.environ.get('PASSWORD', ''))
with open('$SD_PATH/robin_nano35_cfg.txt', 'w', encoding='utf-8') as f:
    f.write(content)
"
else
    echo "Copying configuration with placeholders..."
    cp -v "../firmware/robin_nano35_cfg.txt" "$SD_PATH/"
fi

# Copy asset directories
if [ -d "../firmware/mks_pic" ]; then
    echo "Copying screen icons..."
    cp -rv "../firmware/mks_pic" "$SD_PATH/"
fi

if [ -d "../firmware/mks_font" ]; then
    echo "Copying screen fonts..."
    cp -rv "../firmware/mks_font" "$SD_PATH/"
fi

echo "Flushing writes..."
sync

echo "Ejecting volume safely..."
diskutil eject "$SD_PATH" || echo "Ejected, please remove card."

echo "Success! Insert SD Card into printer and boot to flash firmware."
