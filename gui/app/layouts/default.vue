<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
    <!-- Navbar -->
    <header class="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-lg text-primary-foreground shadow-sm">
          W
        </div>
        <div>
          <h1 class="font-semibold text-base tracking-tight leading-none">Wanhao D12-230</h1>
          <span class="text-[10px] text-muted-foreground font-mono">Firmware Web Flasher v1.6</span>
        </div>
      </div>

      <!-- Navigation Tabs / Links -->
      <div class="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
        <NuxtLink 
          to="/" 
          exact-active-class="bg-background text-foreground shadow-sm border border-border/20"
          class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer select-none text-muted-foreground hover:text-foreground"
        >
          Flasher
        </NuxtLink>
        <NuxtLink 
          to="/control" 
          exact-active-class="bg-background text-foreground shadow-sm border border-border/20"
          class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer select-none text-muted-foreground hover:text-foreground"
        >
          Control
        </NuxtLink>
        <NuxtLink 
          to="/pid" 
          exact-active-class="bg-background text-foreground shadow-sm border border-border/20"
          class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer select-none text-muted-foreground hover:text-foreground"
        >
          PID Tuning
        </NuxtLink>
        <NuxtLink 
          to="/leveling" 
          exact-active-class="bg-background text-foreground shadow-sm border border-border/20"
          class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer select-none text-muted-foreground hover:text-foreground"
        >
          Bed Leveling
        </NuxtLink>
        <NuxtLink 
          to="/wifi" 
          exact-active-class="bg-background text-foreground shadow-sm border border-border/20"
          class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer select-none text-muted-foreground hover:text-foreground"
        >
          MKS WiFi
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <!-- Directory Connection Badge -->
        <Badge 
          v-if="dirHandle" 
          variant="secondary"
          class="text-[10px] font-mono font-medium gap-1.5 px-2.5 py-1"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          SD: {{ dirHandle.name }}
        </Badge>

        <!-- Printer Connection Section -->
        <div class="flex items-center gap-2 border-l border-border pl-3">
          <!-- Connection Type Toggle (USB / WiFi) -->
          <div v-if="!connected" class="flex items-center gap-1 bg-muted p-0.5 rounded border border-border/80 text-[10px]">
            <button 
              @click="setConnectionType('usb')"
              :class="['px-2 py-1 rounded font-semibold transition-all cursor-pointer text-[9px]', connectionType === 'usb' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground']"
            >
              🔌 USB
            </button>
            <button 
              @click="setConnectionType('wifi')"
              :class="['px-2 py-1 rounded font-semibold transition-all cursor-pointer text-[9px]', connectionType === 'wifi' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground']"
            >
              📶 WiFi
            </button>
          </div>

          <!-- WiFi IP Input (only visible when WiFi selected and not connected) -->
          <input 
            v-if="connectionType === 'wifi' && !connected"
            type="text"
            v-model="inputIp"
            @change="updateIp"
            placeholder="mkswifi.local"
            class="w-24 bg-muted border border-border rounded px-1.5 py-0.5 text-[10px] font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
          />

          <!-- Connected Status -->
          <span :class="['w-2 h-2 rounded-full', connected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600']"></span>
          <span class="text-[10px] text-muted-foreground font-mono mr-1">
            <span v-if="connected">
              {{ connectionType === 'usb' ? 'USB Online' : `WiFi: ${printerIp}` }}
            </span>
            <span v-else>Offline</span>
          </span>

          <!-- Connect/Disconnect Buttons -->
          <Button 
            v-if="!connected" 
            @click="connect" 
            size="xs"
            :disabled="connectionType === 'usb' && !serialSupported"
            class="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold py-1 px-2.5 rounded cursor-pointer shadow-sm"
          >
            🔌 Connect
          </Button>
          <Button 
            v-else 
            @click="disconnect" 
            size="xs"
            variant="destructive"
            class="text-[10px] font-semibold py-1 px-2.5 rounded cursor-pointer shadow-sm"
          >
            ❌ Disconnect
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <slot />
  </div>
</template>

<script setup>
import { useState } from '#app'
import { ref, watch } from 'vue'
import { usePrinter } from '@/lib/usePrinter'

const dirHandle = useState('dirHandle')

const serialSupported = ref(false)
if (typeof window !== 'undefined') {
  serialSupported.value = 'serial' in navigator
}

const {
  connected,
  connectionType,
  printerIp,
  setConnectionType,
  setPrinterIp,
  connect,
  disconnect
} = usePrinter(() => {})

const inputIp = ref(printerIp.value)

const updateIp = () => {
  setPrinterIp(inputIp.value)
}

watch(printerIp, (newIp) => {
  inputIp.value = newIp
})
</script>
