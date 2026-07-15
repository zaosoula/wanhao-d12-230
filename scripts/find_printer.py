import socket
import concurrent.futures

def check_ip(ip):
    # Check port 80 (HTTP) or port 81 (WS)
    for port in [80, 81, 8080]:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.3)
        try:
            s.connect((ip, port))
            s.close()
            return ip, port
        except:
            pass
    return None

ips = [f"192.168.1.{i}" for i in range(1, 255)]
print("Scanning subnet 192.168.1.x for open ports 80/81...")

found = []
with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
    results = executor.map(check_ip, ips)
    for res in results:
        if res:
            print(f"Found active device at {res[0]} on port {res[1]}!")
            found.append(res)

if not found:
    print("No printer found on ports 80/81.")
