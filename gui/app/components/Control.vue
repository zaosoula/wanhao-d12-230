<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start animate-fade-in">
    <!-- Browser Compatibility Warning -->
    <Alert v-if="connectionType === 'usb' && !serialSupported" variant="destructive" class="lg:col-span-12 flex flex-col gap-2 shadow-sm">
      <AlertTitle class="flex items-center gap-2 text-sm font-semibold">
        ⚠️ Web Serial API Not Supported
      </AlertTitle>
      <AlertDescription class="text-xs leading-relaxed text-destructive/80">
        USB Connection requires the Web Serial API to communicate directly with your printer.
        Please open this app in <strong>Google Chrome, Microsoft Edge, or Opera</strong>, or switch to Wi-Fi mode.
      </AlertDescription>
    </Alert>

    <!-- Left side: Connection & Jog controls (6 cols) -->
    <div class="lg:col-span-6 flex flex-col gap-6">
      
      <!-- Connection Status Card -->
      <Card>
        <CardHeader class="pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle class="text-sm font-bold">Printer Connection</CardTitle>
            <CardDescription class="text-[10px]">Establish connection to your Wanhao D12 printer</CardDescription>
          </div>
          <Badge 
            :variant="connected ? 'default' : 'secondary'"
            class="text-[10px] font-mono gap-1.5 px-2.5 py-1"
          >
            <span :class="['w-1.5 h-1.5 rounded-full', connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500']"></span>
            {{ connected ? 'Connected' : 'Offline' }}
          </Badge>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <!-- Connection Type Switcher -->
          <div class="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg border border-border">
            <button 
              type="button"
              @click="setConnectionType('usb')"
              :class="['py-2 text-[9px] font-semibold rounded-md transition cursor-pointer', connectionType === 'usb' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground']"
            >
              🔌 USB
            </button>
            <button 
              type="button"
              @click="setConnectionType('wifi')"
              :class="['py-2 text-[9px] font-semibold rounded-md transition cursor-pointer', connectionType === 'wifi' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground']"
            >
              📶 Wi-Fi (WebSocket)
            </button>
          </div>

          <!-- Wi-Fi IP Input -->
          <div v-if="connectionType === 'wifi'" class="flex flex-col gap-1.5 animate-fade-in">
            <Label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Printer IP Address / Hostname</Label>
            <Input 
              type="text" 
              :model-value="printerIp"
              @update:model-value="setPrinterIp"
              placeholder="e.g. mkswifi.local or 192.168.1.52" 
              class="text-xs" 
              :disabled="connected"
            />
          </div>

          <Button 
            v-if="!connected" 
            @click="connect" 
            :disabled="connectionType === 'usb' && !serialSupported"
            class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-5 rounded-lg text-xs cursor-pointer shadow-md"
          >
            🔌 Connect Printer
          </Button>
          <Button 
            v-else 
            @click="disconnect" 
            variant="destructive"
            class="w-full font-semibold py-5 rounded-lg text-xs cursor-pointer shadow-md"
          >
            ❌ Disconnect
          </Button>
        </CardContent>
      </Card>

      <!-- XYZ Jog Control Card -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-semibold flex items-center gap-2">
            🕹️ Jog Control
          </CardTitle>
          <CardDescription class="text-[10px]">Manually jog the printhead/bed and home axes</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-5" :class="{ 'opacity-50 pointer-events-none': !connected }">
          
          <!-- Homing Bar -->
          <div class="grid grid-cols-4 gap-2">
            <Button @click="home('all')" variant="secondary" class="text-xs py-2">🏠 Home All</Button>
            <Button @click="home('x')" variant="outline" class="text-xs py-2">Home X</Button>
            <Button @click="home('y')" variant="outline" class="text-xs py-2">Home Y</Button>
            <Button @click="home('z')" variant="outline" class="text-xs py-2">Home Z</Button>
          </div>

          <!-- Jog Distance Select -->
          <div class="flex flex-col gap-1.5">
            <Label class="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Move Distance (Step)</Label>
            <div class="grid grid-cols-4 gap-2 p-1 bg-muted rounded-lg border border-border">
              <button 
                v-for="d in [0.1, 1, 10, 100]" 
                :key="d"
                @click="stepSize = d"
                :class="['py-1.5 text-[10px] font-semibold rounded-md transition cursor-pointer', stepSize === d ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground']"
              >
                {{ d }} mm
              </button>
            </div>
          </div>

          <!-- Movement Layout grid -->
          <div class="grid grid-cols-2 gap-6 items-center">
            <!-- XY Control (Left) -->
            <div class="flex flex-col items-center gap-2 border-r border-border/50 pr-4">
              <span class="text-[9px] font-bold text-muted-foreground uppercase tracking-wider font-mono">X / Y Motion</span>
              <div class="grid grid-cols-3 gap-2 w-36 h-36 mt-2 relative">
                <div></div>
                <Button @click="jogY(1)" variant="secondary" class="h-10 w-10 p-0 flex items-center justify-center text-sm font-bold shadow-sm" title="Move Y+ (Back)">▲</Button>
                <div></div>

                <Button @click="jogX(-1)" variant="secondary" class="h-10 w-10 p-0 flex items-center justify-center text-sm font-bold shadow-sm" title="Move X- (Left)">◀</Button>
                <div class="flex items-center justify-center text-[10px] text-muted-foreground font-mono">XY</div>
                <Button @click="jogX(1)" variant="secondary" class="h-10 w-10 p-0 flex items-center justify-center text-sm font-bold shadow-sm" title="Move X+ (Right)">▶</Button>

                <div></div>
                <Button @click="jogY(-1)" variant="secondary" class="h-10 w-10 p-0 flex items-center justify-center text-sm font-bold shadow-sm" title="Move Y- (Forward)">▼</Button>
                <div></div>
              </div>
            </div>

            <!-- Z Control (Right) -->
            <div class="flex flex-col items-center gap-2">
              <span class="text-[9px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Z Motion</span>
              <div class="flex flex-col gap-3 items-center mt-2 w-24">
                <Button @click="jogZ(1)" variant="secondary" class="h-10 w-full flex items-center justify-center text-xs font-bold shadow-sm" title="Move Z+ (Up)">▲ Z+ (Up)</Button>
                <div class="text-[10px] text-muted-foreground font-mono">Height</div>
                <Button @click="jogZ(-1)" variant="secondary" class="h-10 w-full flex items-center justify-center text-xs font-bold shadow-sm" title="Move Z- (Down)">▼ Z- (Down)</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- SD Card Files Card -->
      <Card>
        <CardHeader class="pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle class="text-sm font-semibold flex items-center gap-2">
              📁 SD Card Files
            </CardTitle>
            <CardDescription class="text-[10px]">Select and launch prints from the printer SD card</CardDescription>
          </div>
          <Button 
            @click="fetchFiles" 
            :disabled="!connected || loadingFiles"
            variant="ghost" 
            size="sm" 
            class="text-[10px] h-7 px-2 cursor-pointer text-muted-foreground hover:text-foreground"
          >
            {{ loadingFiles ? 'Loading...' : '🔄 Refresh' }}
          </Button>
        </CardHeader>
        <CardContent class="flex flex-col gap-3" :class="{ 'opacity-50 pointer-events-none': !connected }">
          <!-- Files list -->
          <div class="border border-border rounded-lg bg-muted/10 divide-y divide-border/50 max-h-[160px] overflow-y-auto">
            <div 
              v-for="f in files" 
              :key="f.name" 
              class="flex items-center justify-between px-3 py-2 text-xs"
            >
              <span class="font-mono truncate mr-2">{{ f.name }}</span>
              <Button 
                @click="printFile(f.name)" 
                size="sm" 
                class="bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-7 text-[10px] px-2.5 cursor-pointer shadow-sm flex items-center gap-1"
              >
                ▶ Print
              </Button>
            </div>
            <div 
              v-if="files.length === 0" 
              class="p-4 text-center text-xs text-muted-foreground italic"
            >
              {{ connectionType === 'wifi' ? 'No files loaded. Click Refresh to query SD card.' : 'USB mode: Click Refresh to list files in serial log.' }}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Right side: Temperature, Fan & Terminal (6 cols) -->
    <div class="lg:col-span-6 flex flex-col gap-6">
      
      <!-- Temperature & Fan Control Card -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-semibold flex items-center gap-2">
            🌡️ Temperature & Fan
          </CardTitle>
          <CardDescription class="text-[10px]">Monitor and set heater targets and parts cooling fan speed</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-5" :class="{ 'opacity-50 pointer-events-none': !connected }">
          <!-- Live Temp Readings Table -->
          <div class="border border-border rounded-lg overflow-hidden bg-muted/20">
            <table class="w-full text-xs">
              <thead class="bg-muted text-[10px] uppercase font-mono text-muted-foreground border-b border-border">
                <tr>
                  <th class="px-3 py-2 text-left">Heater</th>
                  <th class="px-3 py-2 text-center">Actual</th>
                  <th class="px-3 py-2 text-center">Target</th>
                  <th class="px-3 py-2 class text-right w-36">Change Target</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border/50">
                <!-- Extruder 0 -->
                <tr>
                  <td class="px-3 py-2.5 font-medium">🔥 Extruder 0</td>
                  <td class="px-3 py-2.5 text-center font-mono font-semibold">{{ extruderTemp.actual }}°C</td>
                  <td class="px-3 py-2.5 text-center font-mono text-muted-foreground">{{ extruderTemp.target }}°C</td>
                  <td class="px-3 py-2.5 text-right">
                    <div class="flex items-center gap-1.5 justify-end">
                      <Input type="number" v-model.number="extruderTempInput" class="h-8 w-16 text-center text-xs px-1 font-mono" />
                      <Button @click="setExtruderTarget" size="sm" class="h-8 text-[10px] px-2.5 cursor-pointer">Set</Button>
                    </div>
                  </td>
                </tr>
                <!-- Extruder 1 -->
                <tr>
                  <td class="px-3 py-2.5 font-medium">🔥 Extruder 1</td>
                  <td class="px-3 py-2.5 text-center font-mono font-semibold">{{ extruder1Temp.actual }}°C</td>
                  <td class="px-3 py-2.5 text-center font-mono text-muted-foreground">{{ extruder1Temp.target }}°C</td>
                  <td class="px-3 py-2.5 text-right">
                    <div class="flex items-center gap-1.5 justify-end">
                      <Input type="number" v-model.number="extruder1TempInput" class="h-8 w-16 text-center text-xs px-1 font-mono" />
                      <Button @click="setExtruder1Target" size="sm" class="h-8 text-[10px] px-2.5 cursor-pointer">Set</Button>
                    </div>
                  </td>
                </tr>
                <!-- Heated Bed -->
                <tr>
                  <td class="px-3 py-2.5 font-medium">🛏️ Heated Bed</td>
                  <td class="px-3 py-2.5 text-center font-mono font-semibold">{{ bedTemp.actual }}°C</td>
                  <td class="px-3 py-2.5 text-center font-mono text-muted-foreground">{{ bedTemp.target }}°C</td>
                  <td class="px-3 py-2.5 text-right">
                    <div class="flex items-center gap-1.5 justify-end">
                      <Input type="number" v-model.number="bedTempInput" class="h-8 w-16 text-center text-xs px-1 font-mono" />
                      <Button @click="setBedTarget" size="sm" class="h-8 text-[10px] px-2.5 cursor-pointer">Set</Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Quick Temperature Presets -->
          <div class="flex flex-col gap-1.5">
            <span class="text-[9px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Autotemp Presets</span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button @click="applyPreset(205, 0, 60)" variant="outline" class="text-xs py-2 bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400">🔥 PLA (205 / 60)</Button>
              <Button @click="applyPreset(235, 0, 80)" variant="outline" class="text-xs py-2 bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400">🔥 PETG (235 / 80)</Button>
              <Button @click="applyPreset(245, 0, 100)" variant="outline" class="text-xs py-2 bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400">🔥 ABS (245 / 100)</Button>
              <Button @click="applyPreset(0, 0, 0)" variant="secondary" class="text-xs py-2">❄️ Cooldown</Button>
            </div>
          </div>

          <!-- Print Fan Speed Controller -->
          <div class="flex flex-col gap-2 border-t border-border/50 pt-4">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-muted-foreground uppercase tracking-wider font-mono text-[9px]">💨 Parts Cooling Fan</span>
              <span class="font-mono text-primary font-bold">{{ fanPercent }}% ({{ fanSpeed }}/255)</span>
            </div>
            <div class="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="255" 
                v-model.number="fanSpeed" 
                @input="sendFanSpeed"
                class="flex-1 accent-indigo-600 cursor-pointer bg-muted rounded-lg h-2"
              />
              <div class="flex gap-1.5">
                <Button @click="quickFan(0)" size="sm" variant="outline" class="text-[9px] h-7 px-2">Off</Button>
                <Button @click="quickFan(128)" size="sm" variant="outline" class="text-[9px] h-7 px-2">50%</Button>
                <Button @click="quickFan(255)" size="sm" variant="outline" class="text-[9px] h-7 px-2">100%</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- G-code Console Terminal Card -->
      <Card class="flex-1 flex flex-col min-h-[350px]">
        <CardHeader class="pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle class="text-sm font-semibold flex items-center gap-2">
              💻 Serial Log Console
            </CardTitle>
            <CardDescription class="text-[10px]">Real-time output stream and G-code sender</CardDescription>
          </div>
          <Button @click="clearConsole" variant="ghost" size="sm" class="text-[10px] h-7 px-2 cursor-pointer text-muted-foreground hover:text-foreground">
            🗑️ Clear logs
          </Button>
        </CardHeader>
        <CardContent class="flex-1 flex flex-col gap-3 min-h-0">
          <!-- Scrollable Log panel -->
          <div 
            ref="consoleEl" 
            class="flex-1 bg-muted/40 border border-border rounded-lg p-3 overflow-y-auto font-mono text-[10px] text-slate-300 flex flex-col gap-1 max-h-[250px] min-h-[180px] shadow-inner select-text"
          >
            <div v-if="consoleLogs.length === 0" class="text-muted-foreground italic text-center py-6 select-none">
              Console idle. Establish connection to view serial events.
            </div>
            <div v-for="(log, idx) in consoleLogs" :key="idx" :class="getLogClass(log.type)">
              <span class="text-muted-foreground/60 mr-1.5 select-none">[{{ log.time }}]</span>
              <span>{{ log.text }}</span>
            </div>
          </div>

          <!-- Raw Sender Input -->
          <div class="flex gap-2">
            <Input 
              type="text" 
              v-model="customCommand" 
              @keyup.enter="sendCustomCommand"
              placeholder="Send raw G-code (e.g. M115, G28, M105)..." 
              :disabled="!connected"
              class="text-xs flex-1 font-mono"
            />
            <Button 
              @click="sendCustomCommand" 
              :disabled="!connected"
              class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 text-xs cursor-pointer shadow-sm"
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, onMounted, nextTick } from 'vue'
import { usePrinter } from '@/lib/usePrinter'

const serialSupported = ref(false)
if (typeof window !== 'undefined') {
  serialSupported.value = 'serial' in navigator
}

const consoleEl = ref(null)
const customCommand = ref('')
const stepSize = ref(10) // default 10mm step

// Heater stats
const extruderTemp = ref({ actual: 0, target: 0 })
const extruder1Temp = ref({ actual: 0, target: 0 })
const bedTemp = ref({ actual: 0, target: 0 })

// Change input values
const extruderTempInput = ref(200)
const extruder1TempInput = ref(200)
const bedTempInput = ref(60)

// Parts fan
const fanSpeed = ref(0) // 0-255
const fanPercent = computed(() => Math.round((fanSpeed.value / 255) * 100))

// SD Card Files
const files = ref([])
const loadingFiles = ref(false)

async function fetchFiles() {
  if (connectionType.value === 'wifi') {
    loadingFiles.value = true
    try {
      const ip = printerIp.value.trim()
      const host = ip.startsWith('http') ? ip : `http://${ip}`
      const res = await fetch(`${host}/api/files/sdcard`)
      const data = await res.json()
      files.value = data.files || []
      addLog(`Loaded ${files.value.length} files from SD card over Wi-Fi.`, 'success')
    } catch (err) {
      addLog('Failed to fetch SD card files over Wi-Fi: ' + err.message, 'err')
    } finally {
      loadingFiles.value = false
    }
  } else {
    enqueueGcode('M20')
    addLog('Sent M20 to list files on console. View output in serial log.', 'info')
  }
}

async function printFile(filename) {
  if (connectionType.value === 'wifi') {
    try {
      const ip = printerIp.value.trim()
      const host = ip.startsWith('http') ? ip : `http://${ip}`
      const res = await fetch(`${host}/api/files/sdcard/${filename}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'select', print: true })
      })
      if (res.ok) {
        addLog(`Started printing file: ${filename}`, 'success')
      } else {
        addLog(`Failed to start print: HTTP ${res.status}`, 'err')
      }
    } catch (err) {
      addLog(`Failed to trigger print: ${err.message}`, 'err')
    }
  } else {
    enqueueGcode(`M23 ${filename}`)
    enqueueGcode('M24')
    addLog(`Sent print commands for ${filename} over serial.`, 'success')
  }
}

const {
  connectionType,
  connected,
  printerIp,
  logs: consoleLogs,
  setConnectionType,
  setPrinterIp,
  connect,
  disconnect,
  enqueueGcode,
  addLog,
  clearLogs: clearConsole
} = usePrinter(parseSerialLine)

function parseSerialLine(line) {
  // Parse standard temperature reports: T:29.5 /0.0 B:28.1 /0.0 T0:29.5 /0.0 T1:29.0 /0.0
  const tMatch = line.match(/T:([\d.]+)\s*\/([\d.]+)\s*B:([\d.]+)\s*\/([\d.]+)/i)
  if (tMatch) {
    extruderTemp.value.actual = Math.round(parseFloat(tMatch[1]))
    extruderTemp.value.target = Math.round(parseFloat(tMatch[2]))
    bedTemp.value.actual = Math.round(parseFloat(tMatch[3]))
    bedTemp.value.target = Math.round(parseFloat(tMatch[4]))
  }

  const t0Match = line.match(/T0:([\d.]+)\s*\/([\d.]+)/i)
  if (t0Match) {
    extruderTemp.value.actual = Math.round(parseFloat(t0Match[1]))
    extruderTemp.value.target = Math.round(parseFloat(t0Match[2]))
  }

  const t1Match = line.match(/T1:([\d.]+)\s*\/([\d.]+)/i)
  if (t1Match) {
    extruder1Temp.value.actual = Math.round(parseFloat(t1Match[1]))
    extruder1Temp.value.target = Math.round(parseFloat(t1Match[2]))
  }
}

// Keep terminal scrolled to bottom
watch(consoleLogs, () => {
  nextTick(() => {
    if (consoleEl.value) {
      consoleEl.value.scrollTop = consoleEl.value.scrollHeight
    }
  })
}, { deep: true })

// Jogging functions
function jogX(dir) {
  enqueueGcode('G91') // relative
  enqueueGcode(`G1 X${dir * stepSize.value} F3000`)
  enqueueGcode('G90') // absolute
}

function jogY(dir) {
  enqueueGcode('G91')
  enqueueGcode(`G1 Y${dir * stepSize.value} F3000`)
  enqueueGcode('G90')
}

function jogZ(dir) {
  enqueueGcode('G91')
  enqueueGcode(`G1 Z${dir * stepSize.value} F300`) // slow Z feedrate!
  enqueueGcode('G90')
}

function home(axis) {
  if (axis === 'all') {
    enqueueGcode('G28')
  } else {
    enqueueGcode(`G28 ${axis.toUpperCase()}`)
  }
}

// Thermal setters
function setExtruderTarget() {
  enqueueGcode(`M104 T0 S${extruderTempInput.value}`)
}

function setExtruder1Target() {
  enqueueGcode(`M104 T1 S${extruder1TempInput.value}`)
}

function setBedTarget() {
  enqueueGcode(`M140 S${bedTempInput.value}`)
}

function applyPreset(ex0, ex1, bed) {
  extruderTempInput.value = ex0
  extruder1TempInput.value = ex1
  bedTempInput.value = bed
  
  enqueueGcode(`M104 T0 S${ex0}`)
  enqueueGcode(`M104 T1 S${ex1}`)
  enqueueGcode(`M140 S${bed}`)
}

// Fan Control
function sendFanSpeed() {
  if (fanSpeed.value === 0) {
    enqueueGcode('M107')
  } else {
    enqueueGcode(`M106 S${fanSpeed.value}`)
  }
}

function quickFan(val) {
  fanSpeed.value = val
  sendFanSpeed()
}

function sendCustomCommand() {
  if (customCommand.value.trim()) {
    enqueueGcode(customCommand.value.trim().toUpperCase())
    customCommand.value = ''
  }
}

const getLogClass = (type) => {
  switch (type) {
    case 'err': return 'text-rose-400'
    case 'success': return 'text-emerald-400 font-semibold'
    case 'warn': return 'text-amber-400'
    case 'info': return 'text-sky-400'
    case 'serial': return 'text-slate-300 font-mono'
    default: return 'text-slate-300'
  }
}
</script>
