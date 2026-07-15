<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full animate-fade-in">
    <!-- Browser Compatibility Warning -->
    <Alert v-if="!serialSupported" variant="destructive" class="lg:col-span-12 flex flex-col gap-2 shadow-sm">
      <AlertTitle class="flex items-center gap-2 text-sm font-semibold">
        ⚠️ Web Serial API Not Supported
      </AlertTitle>
      <AlertDescription class="text-xs leading-relaxed text-destructive/80">
        USB Connection requires the Web Serial API to communicate directly with your printer.
        Please open this app in <strong>Google Chrome, Microsoft Edge, or Opera</strong>.
      </AlertDescription>
    </Alert>

    <!-- Calibration Control Panel (Left Column) -->
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
          <!-- USB Connection Info -->
          <div class="p-3 bg-muted rounded-lg border border-border text-[10px] text-muted-foreground flex flex-col gap-1">
            <span class="font-semibold text-foreground">🔌 USB Connection Only</span>
            <span>Autotuning and leveling features require direct console streaming which is filtered by MKS over Wi-Fi.</span>
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

          <div class="flex items-center space-x-2 pt-1 border-t border-border/50">
            <input 
              type="checkbox" 
              id="auto-apply" 
              v-model="autoApply" 
              :disabled="autotuneActive" 
              class="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-zinc-900 cursor-pointer"
            />
            <Label for="auto-apply" class="text-[10px] text-muted-foreground select-none cursor-pointer font-medium">
              Automatically apply tuned values directly to firmware memory (U1)
            </Label>
          </div>
        </CardContent>
      </Card>

      <!-- Extruder PID Card -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-semibold flex items-center gap-2">
            🔥 Extruder PID Auto-Tune
          </CardTitle>
          <CardDescription class="text-[10px]">Tuning parameters for Hotend heating element</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <Label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target Temp (°C)</Label>
              <Input type="number" v-model="hotendTargetTemp" :disabled="autotuneActive || !connected" class="text-xs" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cycles</Label>
              <Input type="number" v-model="cycles" :disabled="autotuneActive || !connected" class="text-xs" />
            </div>
          </div>

          <Button 
            @click="startHotendAutotune" 
            :disabled="autotuneActive || !connected"
            class="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-5 rounded-lg text-xs cursor-pointer"
          >
            🎯 Start Extruder Autotune
          </Button>

          <!-- Extracted PID Results -->
          <div v-if="hotendPID" class="border border-border rounded-lg p-3 bg-muted/40 flex flex-col gap-3">
            <div class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Extracted Values:</div>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="bg-card border border-border p-2 rounded">
                <span class="text-[10px] block text-muted-foreground">Kp (P)</span>
                <span class="text-xs font-mono font-bold text-indigo-400">{{ hotendPID.p }}</span>
              </div>
              <div class="bg-card border border-border p-2 rounded">
                <span class="text-[10px] block text-muted-foreground">Ki (I)</span>
                <span class="text-xs font-mono font-bold text-indigo-400">{{ hotendPID.i }}</span>
              </div>
              <div class="bg-card border border-border p-2 rounded">
                <span class="text-[10px] block text-muted-foreground">Kd (D)</span>
                <span class="text-xs font-mono font-bold text-indigo-400">{{ hotendPID.d }}</span>
              </div>
            </div>
            <Button 
              @click="saveHotendPID" 
              class="bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded text-xs w-full mt-1"
            >
              📥 Apply Values (M301)
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Heated Bed PID Card -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-semibold flex items-center gap-2">
            🛏️ Bed PID Auto-Tune
          </CardTitle>
          <CardDescription class="text-[10px]">Tuning parameters for Heatbed heating element</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <Label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target Temp (°C)</Label>
              <Input type="number" v-model="bedTargetTemp" :disabled="autotuneActive || !connected" class="text-xs" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cycles</Label>
              <Input type="number" v-model="cycles" :disabled="autotuneActive || !connected" class="text-xs" />
            </div>
          </div>

          <Button 
            @click="startBedAutotune" 
            :disabled="autotuneActive || !connected"
            class="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-5 rounded-lg text-xs cursor-pointer"
          >
            🎯 Start Bed Autotune
          </Button>

          <!-- Extracted PID Results -->
          <div v-if="bedPID" class="border border-border rounded-lg p-3 bg-muted/40 flex flex-col gap-3">
            <div class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Extracted Values:</div>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="bg-card border border-border p-2 rounded">
                <span class="text-[10px] block text-muted-foreground">Kp (P)</span>
                <span class="text-xs font-mono font-bold text-indigo-400">{{ bedPID.p }}</span>
              </div>
              <div class="bg-card border border-border p-2 rounded">
                <span class="text-[10px] block text-muted-foreground">Ki (I)</span>
                <span class="text-xs font-mono font-bold text-indigo-400">{{ bedPID.i }}</span>
              </div>
              <div class="bg-card border border-border p-2 rounded">
                <span class="text-[10px] block text-muted-foreground">Kd (D)</span>
                <span class="text-xs font-mono font-bold text-indigo-400">{{ bedPID.d }}</span>
              </div>
            </div>
            <Button 
              @click="saveBedPID" 
              class="bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded text-xs w-full mt-1"
            >
              📥 Apply Values (M304)
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Persist & Save Card -->
      <Card>
        <CardContent class="py-4">
          <Button 
            @click="saveToEeprom" 
            :disabled="!connected"
            class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-5 rounded-lg text-xs cursor-pointer shadow-md shadow-emerald-500/10"
          >
            💾 Save Configuration to EEPROM (M500)
          </Button>
        </CardContent>
      </Card>
      
    </div>

    <!-- Live Serial Output Terminal (Right Column) -->
    <div class="lg:col-span-6 flex flex-col h-[760px]">
      <Card class="flex flex-col h-full overflow-hidden">
        <CardHeader class="pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle class="text-base font-bold">Interactive Serial Terminal</CardTitle>
            <CardDescription class="text-[10px]">Real-time output and manual G-code console</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="xs" 
            @click="clearConsole" 
            class="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Clear Console
          </Button>
        </CardHeader>
        <CardContent class="flex-1 flex flex-col gap-4 overflow-hidden">
          <!-- Live log area -->
          <div 
            ref="consoleEl"
            class="flex-1 border border-border rounded-lg bg-black/90 p-4 font-mono text-[10px] overflow-y-auto flex flex-col gap-1.5 leading-relaxed"
          >
            <div v-if="consoleLogs.length === 0" class="text-slate-500 italic">
              Awaiting printer connection...
            </div>
            <div 
              v-for="(log, idx) in consoleLogs" 
              :key="idx" 
              :class="getLogColor(log.type)"
              class="break-all whitespace-pre-wrap"
            >
              <span class="text-[9px] text-slate-600 select-none mr-2">[{{ log.time }}]</span>
              <span>{{ log.text }}</span>
            </div>
          </div>

          <!-- Command Sender Input -->
          <div class="flex gap-2">
            <Input 
              type="text" 
              v-model="customCommand" 
              @keyup.enter="sendCustomCommand"
              placeholder="Send custom G-code (e.g. M105, G28)..." 
              :disabled="!connected"
              class="text-xs flex-1 font-mono"
            />
            <Button 
              @click="sendCustomCommand" 
              :disabled="!connected"
              class="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 text-xs cursor-pointer"
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
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { usePrinter } from '@/lib/usePrinter'

const autotuneActive = ref(false)
const autotuneType = ref(null) 
const progressText = ref('Idle')
const autoApply = ref(true)

onMounted(() => {
  setConnectionType('usb')
})

const hotendTargetTemp = ref(205)
const bedTargetTemp = ref(60)
const cycles = ref(8)

const hotendPID = ref(null) 
const bedPID = ref(null) 

const consoleEl = ref(null)
const customCommand = ref('')

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
  const m301Match = line.match(/M301\s+P([\d.]+)\s+I([\d.]+)\s+D([\d.]+)/i)
  if (m301Match) {
    hotendPID.value = { p: parseFloat(m301Match[1]), i: parseFloat(m301Match[2]), d: parseFloat(m301Match[3]) }
    return
  }

  const m304Match = line.match(/M304\s+P([\d.]+)\s+I([\d.]+)\s+D([\d.]+)/i)
  if (m304Match) {
    bedPID.value = { p: parseFloat(m304Match[1]), i: parseFloat(m304Match[2]), d: parseFloat(m304Match[3]) }
    return
  }

  const defKpMatch = line.match(/#define\s+DEFAULT_(?:bed)?Kp\s+([\d.]+)/i)
  if (defKpMatch) {
    const val = parseFloat(defKpMatch[1])
    if (autotuneType.value === 'bed' || line.toLowerCase().includes('bed')) {
      if (!bedPID.value) bedPID.value = { p: val, i: 0, d: 0 }
      else bedPID.value.p = val
    } else {
      if (!hotendPID.value) hotendPID.value = { p: val, i: 0, d: 0 }
      else hotendPID.value.p = val
    }
    return
  }

  const defKiMatch = line.match(/#define\s+DEFAULT_(?:bed)?Ki\s+([\d.]+)/i)
  if (defKiMatch) {
    const val = parseFloat(defKiMatch[1])
    if (autotuneType.value === 'bed' || line.toLowerCase().includes('bed')) {
      if (!bedPID.value) bedPID.value = { p: 0, i: val, d: 0 }
      else bedPID.value.i = val
    } else {
      if (!hotendPID.value) hotendPID.value = { p: 0, i: val, d: 0 }
      else hotendPID.value.i = val
    }
    return
  }

  const defKdMatch = line.match(/#define\s+DEFAULT_(?:bed)?Kd\s+([\d.]+)/i)
  if (defKdMatch) {
    const val = parseFloat(defKdMatch[1])
    if (autotuneType.value === 'bed' || line.toLowerCase().includes('bed')) {
      if (!bedPID.value) bedPID.value = { p: 0, i: 0, d: val }
      else bedPID.value.d = val
      addLog(`✨ Bed PID Tuned: P=${bedPID.value.p} I=${bedPID.value.i} D=${bedPID.value.d}`, 'success')
    } else {
      if (!hotendPID.value) hotendPID.value = { p: 0, i: 0, d: val }
      else hotendPID.value.d = val
      addLog(`✨ Extruder PID Tuned: P=${hotendPID.value.p} I=${hotendPID.value.i} D=${hotendPID.value.d}`, 'success')
    }
    autotuneActive.value = false
    autotuneType.value = null
    progressText.value = 'Tuning complete!'
    return
  }
}

function sendCustomCommand() {
  if (customCommand.value.trim()) {
    enqueueGcode(customCommand.value.trim().toUpperCase())
    customCommand.value = ''
  }
}

function startHotendAutotune() {
  hotendPID.value = null
  autotuneActive.value = true
  autotuneType.value = 'hotend'
  const uParam = autoApply.value ? ' U1' : ''
  enqueueGcode(`M303 E0 C${cycles.value} S${hotendTargetTemp.value}${uParam}`)
}

function startBedAutotune() {
  bedPID.value = null
  autotuneActive.value = true
  autotuneType.value = 'bed'
  const uParam = autoApply.value ? ' U1' : ''
  enqueueGcode(`M303 E-1 C${cycles.value} S${bedTargetTemp.value}${uParam}`)
}

function saveHotendPID() {
  if (hotendPID.value) {
    enqueueGcode(`M301 P${hotendPID.value.p} I${hotendPID.value.i} D${hotendPID.value.d}`)
  }
}

function saveBedPID() {
  if (bedPID.value) {
    enqueueGcode(`M304 P${bedPID.value.p} I${bedPID.value.i} D${bedPID.value.d}`)
  }
}

function saveToEeprom() {
  enqueueGcode('M500')
}

function getLogColor(type) {
  switch (type) {
    case 'err': return 'text-rose-400 font-bold'
    case 'success': return 'text-emerald-400 font-semibold'
    case 'warn': return 'text-amber-400'
    case 'serial': return 'text-slate-300'
    default: return 'text-sky-400'
  }
}

onBeforeUnmount(() => {
  disconnect()
})
</script>
