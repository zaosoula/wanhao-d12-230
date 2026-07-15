import subprocess
import time
import re
import sys

BASELINE = {
    '78:c2:13:cd:86:40', 'f8:4:2e:f2:1f:28', '5c:84:3c:b7:e7:4e', 'b8:e9:37:8c:20:f2',
    '5c:aa:fd:a7:d2:83', 'f0:f6:c1:a3:51:7c', 'b0:b8:67:c8:57:2c', 'da:de:13:f5:ea:28',
    '5c:aa:fd:48:7:a4', 'b8:e9:37:57:18:7a', '8:0:27:4:32:91', '8:92:72:9a:bb:fc',
    'bc:df:58:4d:89:2a', 'ac:8b:a9:68:3:a3', '14:98:77:3e:3f:40', 'ce:4f:12:66:c2:e1',
    '8a:2:6:18:da:2a', '0:e0:4c:11:81:29'
}

def get_active_devices():
    subprocess.run("for i in {2..254}; do ping -c 1 -t 1 192.168.1.$i >/dev/null 2>&1 & done; wait", shell=True)
    output = subprocess.check_output("arp -a", shell=True).decode('utf-8')
    
    devices = {}
    for line in output.split('\n'):
        if 'en0' in line and 'incomplete' not in line:
            ip_match = re.search(r'\((192\.168\.1\.\d+)\)', line)
            mac_match = re.search(r'at ([0-9a-fA-F:]+) on', line)
            if ip_match and mac_match:
                ip = ip_match.group(1)
                mac = mac_match.group(1).lower()
                normalized_parts = []
                for part in mac.split(':'):
                    normalized_parts.append(part.zfill(2))
                normalized_mac = ':'.join(normalized_parts)
                devices[normalized_mac] = ip
    return devices

normalized_baseline = set()
for mac in BASELINE:
    parts = mac.lower().split(':')
    normalized_baseline.add(':'.join(p.zfill(2) for p in parts))

print("Subnet monitor started. Waiting for printer to join Wi-Fi...")
sys.stdout.flush()

for iteration in range(20): # Check up to 100 seconds
    devices = get_active_devices()
    for mac, ip in devices.items():
        if mac not in normalized_baseline and mac != 'ff:ff:ff:ff:ff:ff' and not mac.startswith('01:00:5e'):
            print(f"printer_connected: {ip} ({mac})")
            sys.stdout.flush()
            sys.exit(0)
    time.sleep(5)

print("timeout: No new device found")
