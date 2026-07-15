<template>
  <main class="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-6">
    <!-- Header -->
    <div class="flex flex-col gap-1.5">
      <h2 class="text-xl font-bold tracking-tight">📶 MKS WiFi Firmware Center</h2>
      <p class="text-xs text-muted-foreground">
        Download, flash, and configure custom wireless firmware for your ESP8266-equipped motherboard.
      </p>
    </div>

    <!-- Main Content Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
      <!-- Left Column: Download & Features (8 cols) -->
      <div class="lg:col-span-8 flex flex-col gap-6">
        <!-- Download Card -->
        <Card class="border border-border bg-card">
          <CardHeader>
            <CardTitle class="text-sm font-semibold flex items-center gap-2">
              <span>📥 Download Custom Firmware</span>
            </CardTitle>
            <CardDescription class="text-[10px]">
              Ready-to-flash compiled binary for the MKS Robin WiFi module (ESP8266 / ESP-12S).
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            <div class="p-3 bg-muted rounded border border-border/80 flex items-center justify-between">
              <div class="flex flex-col gap-1">
                <span class="text-xs font-mono font-bold text-foreground">MksWifi.bin</span>
                <div class="flex items-center gap-2 text-[9px] text-muted-foreground font-mono">
                  <span>Version: v1.0.4-CS</span>
                  <span>•</span>
                  <span>Size: 339 KB</span>
                  <span>•</span>
                  <span>Target: ESP8266</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <a 
                  href="https://github.com/zaosoula/MKS-WIFI/tree/master/firmware_source/MksWifi" 
                  target="_blank"
                  class="inline-flex items-center justify-center gap-1.5 border border-border bg-background hover:bg-muted text-foreground font-semibold text-xs py-2 px-3 rounded-md shadow-sm transition-all cursor-pointer select-none"
                >
                  <span>💻 View Source</span>
                </a>
                <a 
                  href="/firmware/wifi/MksWifi.bin" 
                  download="MksWifi.bin"
                  class="inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs py-2 px-3 rounded-md shadow-sm transition-all cursor-pointer select-none"
                >
                  <span>💾 Download Binary</span>
                </a>
              </div>
            </div>

            <!-- Features list -->
            <div class="flex flex-col gap-2">
              <h3 class="text-xs font-bold text-foreground">🛠️ Custom Improvements</h3>
              <ul class="text-[10px] text-muted-foreground leading-relaxed list-disc list-inside space-y-1.5">
                <li>
                  <strong class="text-foreground">English Configuration</strong>: Fully translated configuration file headers and comments from Chinese, resolving interface character corruption.
                </li>
                <li>
                  <strong class="text-foreground">Socket Stability</strong>: Optimized ESP8266 socket buffering for less connection dropping and timeout recovery.
                </li>
                <li>
                  <strong class="text-foreground">Fast Wireless Streaming</strong>: Calibrated baudrate compatibility to sustain raw TCP data speeds up to <code class="bg-muted px-1 py-0.5 rounded font-mono text-[9px]">100 KBytes/s</code>.
                </li>
                <li>
                  <strong class="text-foreground">TFT Screen Integration</strong>: Fully compatible with the Wanhao D12 3.5-inch color display to show connection status, signal strength, and local IP address.
                </li>
                <li>
                  <strong class="text-foreground">mDNS Support (Local Hostname)</strong>: Allows accessing the printer web portal or raw TCP port using the friendly hostname <code class="bg-muted px-1 py-0.5 rounded font-mono text-[9px]">mkswifi.local</code> instead of typing dynamic IP addresses.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <!-- Wireless Terminal Info Card -->
        <Card class="border border-border bg-card">
          <CardHeader class="pb-3">
            <CardTitle class="text-sm font-semibold flex items-center gap-2">
              <span>📡 Supported Communication Protocols</span>
            </CardTitle>
            <CardDescription class="text-[10px]">
              The custom MksWifi firmware exposes two separate communication channels.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            <!-- WebSocket Protocol -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-foreground">1. WebSocket (Port 81)</span>
                <Badge variant="outline" class="text-[8px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">NEW</Badge>
              </div>
              <p class="text-[10px] text-muted-foreground leading-relaxed">
                Used for modern browser-based web applications. This Web UI uses WebSockets to connect directly and stream commands wirelessly from your computer to the printer.
              </p>
            </div>

            <!-- TCP Socket Protocol -->
            <div class="flex flex-col gap-1.5 pt-2 border-t border-border/60">
              <span class="text-xs font-bold text-foreground">2. TCP Socket (Port 8080)</span>
              <p class="text-[10px] text-muted-foreground leading-relaxed">
                Raw serial-to-TCP bridge. Used by legacy slicing software (like Cura via the MKS Plugin) and command-line connections:
              </p>
              <div class="p-2.5 bg-zinc-950 border border-zinc-900 rounded font-mono text-[9px] text-zinc-300 select-all leading-normal">
                # Access serial console wirelessly via Netcat:<br />
                nc mkswifi.local 8080
              </div>
            </div>

            <Alert class="bg-amber-500/10 border-amber-500/20 text-amber-400 text-[10px] py-2 px-3 mt-1">
              <AlertDescription class="leading-normal">
                <strong>⚠️ Connection Limit:</strong> Only one active connection is supported on each port at a time. Close Netcat or Cura connections before connecting this Web UI over WiFi.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Tutorial (4 cols) -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        <!-- Network Connection Test -->
        <Card class="border border-border bg-card">
          <CardHeader class="pb-3">
            <CardTitle class="text-sm font-semibold flex items-center gap-2">
              <span>🔍 Network Discovery & Test</span>
            </CardTitle>
            <CardDescription class="text-[10px]">
              Test if the printer's WiFi card is active on your local network.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-3">
            <div class="flex flex-col gap-1.5">
              <label for="printer-host" class="text-[10px] text-muted-foreground font-semibold">Hostname or IP Address</label>
              <div class="flex gap-2">
                <input 
                  id="printer-host"
                  type="text" 
                  v-model="printerHost" 
                  @input="resetStatus"
                  placeholder="mkswifi.local"
                  class="flex-1 bg-background border border-border rounded px-2.5 py-1.5 text-xs text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button 
                  @click="testConnection" 
                  :disabled="testing"
                  size="xs"
                  class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1.5 px-3 rounded shadow-sm text-xs cursor-pointer"
                >
                  <span>{{ testing ? '⚡ Testing...' : '🔌 Test' }}</span>
                </Button>
              </div>
            </div>

            <!-- Auto-Discovery Button -->
            <Button 
              @click="autoDiscover" 
              :disabled="discovering || testing"
              size="xs"
              variant="outline"
              class="w-full text-xs font-semibold py-2 cursor-pointer mt-1 border-border/80 hover:bg-muted text-foreground"
            >
              <span>{{ discovering ? '🔍 Scanning hostnames...' : '🔍 Auto-Discover Printer' }}</span>
            </Button>

            <!-- Results area -->
            <div v-if="tested" class="mt-2 text-xs">
              <div v-if="isOnline" class="flex flex-col gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
                <div class="flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      ✓ Printer Online
                    </span>
                    <span class="font-mono text-[10px] text-muted-foreground mt-0.5">Hostname: {{ printerHost }}</span>
                  </div>
                  <a 
                    :href="'http://' + printerHost" 
                    target="_blank"
                    class="bg-emerald-500/25 text-emerald-400 hover:bg-emerald-500/35 font-semibold px-2 py-1 rounded text-[10px] transition-all cursor-pointer"
                  >
                    🌐 Web Portal
                  </a>
                </div>
              </div>
              <div v-else class="text-amber-500 text-[10px] flex items-center gap-1.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded font-normal leading-normal">
                <span>⚠️ Offline. Could not connect to {{ printerHost }}. Check connection settings or printer power.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Flashing Tutorial -->
        <Card class="border border-border bg-card">
          <CardHeader>
            <CardTitle class="text-sm font-semibold flex items-center gap-2">
              <span>📖 Flashing Tutorial</span>
            </CardTitle>
            <CardDescription class="text-[10px]">
              Follow these simple steps to update the WiFi module firmware on your printer.
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            <!-- Timeline steps -->
            <div class="flex flex-col gap-4 border-l-2 border-muted pl-4 ml-2">
              <!-- Step 1 -->
              <div class="relative">
                <div class="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center font-mono text-[9px] font-bold text-primary-foreground shadow-sm">
                  1
                </div>
                <h4 class="text-xs font-bold text-foreground">Download File</h4>
                <p class="text-[10px] text-muted-foreground leading-normal mt-0.5">
                  Download <code class="bg-muted px-1 py-0.5 rounded font-mono text-[9px]">MksWifi.bin</code> using the button on the left.
                </p>
              </div>

              <!-- Step 2 -->
              <div class="relative">
                <div class="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center font-mono text-[9px] font-bold text-primary-foreground shadow-sm">
                  2
                </div>
                <h4 class="text-xs font-bold text-foreground">Copy to SD Card</h4>
                <p class="text-[10px] text-muted-foreground leading-normal mt-0.5">
                  Copy the binary file to the root of your printer's micro SD card. The file name must remain precisely <strong class="text-foreground">MksWifi.bin</strong>.
                </p>
              </div>

              <!-- Step 3 -->
              <div class="relative">
                <div class="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center font-mono text-[9px] font-bold text-primary-foreground shadow-sm">
                  3
                </div>
                <h4 class="text-xs font-bold text-foreground">Flash the Printer</h4>
                <p class="text-[10px] text-muted-foreground leading-normal mt-0.5">
                  With the printer powered off, insert the SD card. Power on the printer. The screen will display a red update status bar as it updates the ESP8266 module.
                </p>
              </div>

              <!-- Step 4 -->
              <div class="relative">
                <div class="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center font-mono text-[9px] font-bold text-primary-foreground shadow-sm">
                  4
                </div>
                <h4 class="text-xs font-bold text-foreground">Join WiFi Network</h4>
                <p class="text-[10px] text-muted-foreground leading-normal mt-0.5">
                  Once booted, go to the screen settings: <strong class="text-foreground">Tools ➔ WiFi</strong>. Select your router and enter your password. The screen will display your new wireless IP address! You can now also access the printer dashboard using <strong class="text-foreground">http://mkswifi.local</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { usePrinter } from '@/lib/usePrinter'

const { printerIp, setPrinterIp } = usePrinter(() => {})

const printerHost = ref(printerIp.value)
const testing = ref(false)
const discovering = ref(false)
const tested = ref(false)
const isOnline = ref(false)

const resetStatus = () => {
  tested.value = false
  isOnline.value = false
}

const pingHost = async (host, timeout = 1200) => {
  let cleanHost = host.trim()
  if (!cleanHost) return null
  if (cleanHost.startsWith('http://')) cleanHost = cleanHost.substring(7)
  if (cleanHost.startsWith('https://')) cleanHost = cleanHost.substring(8)
  if (cleanHost.endsWith('/')) cleanHost = cleanHost.substring(0, cleanHost.length - 1)
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    await fetch(`http://${cleanHost}/`, { 
      mode: 'no-cors', 
      signal: controller.signal,
      cache: 'no-cache'
    })
    
    clearTimeout(timeoutId)
    return cleanHost
  } catch (e) {
    return null
  }
}

// Test specific Host/IP entered in the box
const testConnection = async () => {
  if (testing.value || discovering.value) return
  testing.value = true
  tested.value = false
  isOnline.value = false
  
  try {
    const result = await pingHost(printerHost.value)
    if (result) {
      isOnline.value = true
      // Persist the verified host IP globally & in localStorage
      setPrinterIp(printerHost.value)
    } else {
      isOnline.value = false
    }
  } catch (err) {
    isOnline.value = false
  } finally {
    testing.value = false
    tested.value = true
  }
}

// Auto-discover by checking multiple hostnames in parallel
const autoDiscover = async () => {
  if (testing.value || discovering.value) return
  discovering.value = true
  tested.value = false
  isOnline.value = false
  
  const hostsToTest = ['mkswifi', 'mkswifi.local', 'mkswifi.lan', 'mkswifi.home', 'mkswifi.localdomain']
  
  try {
    const results = await Promise.all(hostsToTest.map(h => pingHost(h, 1500)))
    const successfulHost = results.find(r => r !== null)
    
    if (successfulHost) {
      printerHost.value = successfulHost
      isOnline.value = true
      // Persist the discovered host IP globally & in localStorage
      setPrinterIp(successfulHost)
    } else {
      isOnline.value = false
    }
  } catch (err) {
    isOnline.value = false
  } finally {
    discovering.value = false
    tested.value = true
  }
}
</script>

<style scoped>
/* Page specific styling adjustments */
</style>
