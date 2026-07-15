<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
    <!-- Browser Compatibility Warning -->
    <Alert v-if="!serialSupported" variant="destructive" class="lg:col-span-12 flex flex-col gap-2 shadow-sm mb-4">
      <AlertTitle class="flex items-center gap-2 text-sm font-semibold">
        ⚠️ Web Serial API Not Supported
      </AlertTitle>
      <AlertDescription class="text-xs leading-relaxed text-destructive/80">
        USB Connection requires the Web Serial API to communicate directly with your printer.
        Please open this app in <strong>Google Chrome, Microsoft Edge, or Opera</strong>.
      </AlertDescription>
    </Alert>

    <!-- Left Column: Controls (4 cols) -->
    <div class="lg:col-span-4 flex flex-col gap-6">
      <!-- Guided Calibration Wizard Card -->
      <Card v-if="connected">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-semibold flex items-center justify-between">
            <span>🧙 Guided Calibration Wizard</span>
            <Badge v-if="wizardActive" variant="default" class="text-[9px] bg-indigo-600 text-white font-mono">
              Step {{ wizardStep }}/5
            </Badge>
          </CardTitle>
          <CardDescription class="text-[10px]">Complete guided flow: Bed Prep → Center & Home → Babystep → Bilinear Leveling → Save</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div v-if="!wizardActive" class="flex flex-col gap-4">
            <Button 
              @click="startWizard" 
              class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-lg text-xs cursor-pointer shadow-md"
            >
              🚀 Start Guided Calibration
            </Button>

            <div class="flex flex-col gap-1.5 pt-3 border-t border-border">
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">Leveling Status:</span>
                <span :class="['font-semibold', levelingEnabled ? 'text-emerald-500' : 'text-amber-500']">
                  {{ levelingEnabled ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">Tolerance threshold:</span>
                <span class="font-mono text-indigo-400 font-semibold">{{ tolerance }}mm</span>
              </div>
              <input 
                type="range" 
                v-model.number="tolerance" 
                min="0.01" 
                max="0.2" 
                step="0.01" 
                class="w-full accent-indigo-600 bg-zinc-950 rounded-lg cursor-pointer h-1.5 mt-1"
              />
            </div>

            <div class="flex gap-2 pt-2 border-t border-border">
              <Button 
                @click="retrieveStoredMesh" 
                :disabled="probingActive"
                variant="outline"
                class="flex-1 text-xs font-semibold py-3"
              >
                🔄 Fetch Mesh
              </Button>
              <Button 
                @click="saveToEeprom" 
                variant="secondary"
                class="flex-1 text-xs font-semibold py-3"
              >
                💾 Save EEPROM
              </Button>
            </div>
          </div>
          <div v-else class="flex flex-col gap-4">
            <!-- Step Indicators -->
            <div class="flex items-center justify-between text-[9px] font-mono border-b border-border pb-2 gap-0.5">
              <span :class="wizardStep === 1 ? 'text-indigo-400 font-bold' : 'text-muted-foreground'">1. Prep</span>
              <span class="text-[8px] text-muted-foreground">→</span>
              <span :class="wizardStep === 2 ? 'text-indigo-400 font-bold' : 'text-muted-foreground'">2. Home</span>
              <span class="text-[8px] text-muted-foreground">→</span>
              <span :class="wizardStep === 3 ? 'text-indigo-400 font-bold' : 'text-muted-foreground'">3. Babystep</span>
              <span class="text-[8px] text-muted-foreground">→</span>
              <span :class="wizardStep === 4 ? 'text-indigo-400 font-bold' : 'text-muted-foreground'">4. Bilinear</span>
              <span class="text-[8px] text-muted-foreground">→</span>
              <span :class="wizardStep === 5 ? 'text-indigo-400 font-bold' : 'text-muted-foreground'">5. Save</span>
            </div>

            <!-- Step 1 Content (Prep) -->
            <div v-if="wizardStep === 1" class="flex flex-col gap-3">
              <div class="text-[11px] text-muted-foreground leading-relaxed flex flex-col gap-1.5">
                <p>Ensure a neutral bed height before starting calibration:</p>
                <ol class="list-decimal pl-4 flex flex-col gap-1">
                  <li>Tighten all <strong>4 under-bed knobs fully</strong> to compress springs.</li>
                  <li>Loosen each knob <strong>~5-6 full turns</strong> (approx. 50-60% compression).</li>
                </ol>
                <p class="text-[10px] text-indigo-400/80 italic mt-1 font-semibold">💡 Bed now at optimal starting height (prevents gantry limit switch error).</p>
              </div>
              <Button 
                @click="wizardStep = 2"
                class="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-3 cursor-pointer shadow-md"
              >
                Next: Home & Center ➔
              </Button>
            </div>

            <!-- Step 2 Content (Home & Center) -->
            <div v-if="wizardStep === 2" class="flex flex-col gap-3">
              <p class="text-[11px] text-muted-foreground leading-relaxed">
                Printer will home X/Y, auto-center using safe homing, home Z, then move nozzle to bed center at Z=0. Make sure bed is clear.
              </p>
              <Button 
                @click="wizardHome"
                :disabled="probingActive" 
                class="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-3 cursor-pointer"
              >
                🏠 Home and Center
              </Button>
              <div class="flex gap-2">
                <Button @click="wizardStep = 1" variant="ghost" class="w-full text-xs py-2 text-muted-foreground" :disabled="probingActive">Back</Button>
              </div>
            </div>

            <!-- Step 3 Content (Z Babystepping) -->
            <div v-if="wizardStep === 3" class="flex flex-col gap-3">
              <p class="text-[11px] text-muted-foreground leading-relaxed">
                Place sheet of paper under nozzle. Adjust Z height with babysteps until nozzle grabs paper slightly.
              </p>
              
              <div class="grid grid-cols-2 gap-2">
                <Button @click="wizardBabystep(0.10)" size="sm" variant="outline" class="text-[10px] font-mono cursor-pointer">Up (+0.10)</Button>
                <Button @click="wizardBabystep(-0.10)" size="sm" variant="outline" class="text-[10px] font-mono cursor-pointer">Down (-0.10)</Button>
                <Button @click="wizardBabystep(0.05)" size="sm" variant="outline" class="text-[10px] font-mono cursor-pointer">Up (+0.05)</Button>
                <Button @click="wizardBabystep(-0.05)" size="sm" variant="outline" class="text-[10px] font-mono cursor-pointer">Down (-0.05)</Button>
                <Button @click="wizardBabystep(0.01)" size="sm" variant="outline" class="text-[10px] font-mono cursor-pointer">Up (+0.01)</Button>
                <Button @click="wizardBabystep(-0.01)" size="sm" variant="outline" class="text-[10px] font-mono cursor-pointer">Down (-0.01)</Button>
              </div>

              <div class="p-2.5 bg-muted rounded border border-border flex flex-col gap-1 text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-muted-foreground">Session Z adjustment:</span>
                  <span class="font-mono font-bold text-indigo-400">{{ totalBabysteps >= 0 ? '+' : '' }}{{ totalBabysteps.toFixed(2) }}mm</span>
                </div>
                <div v-if="printerProbeOffset !== null" class="flex justify-between items-center pt-1 border-t border-border/40">
                  <span class="text-muted-foreground">Printer Probe Z-Offset:</span>
                  <span class="font-mono font-bold text-emerald-400">{{ printerProbeOffset }}mm</span>
                </div>
              </div>

              <div class="flex gap-2 mt-1">
                <Button @click="wizardStep = 2" variant="ghost" class="flex-1 text-xs py-2 text-muted-foreground">Back</Button>
                <Button @click="wizardStep = 4" class="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 cursor-pointer">Next Step</Button>
              </div>
            </div>

            <!-- Step 4 Content (Bilinear Leveling) -->
            <div v-if="wizardStep === 4" class="flex flex-col gap-3">
              <p class="text-[11px] text-muted-foreground leading-relaxed">
                Running Bilinear grid probing. Printer will probe the grid points. This takes 2-3 minutes.
              </p>
              
              <Button 
                @click="wizardRunBilinear" 
                :disabled="probingActive"
                class="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-3 cursor-pointer"
              >
                🎯 {{ probingActive ? 'Probing...' : 'Start Bilinear Leveling (G29)' }}
              </Button>
              
              <span class="text-[9px] text-muted-foreground text-center italic mt-1 block">
                Will auto-advance when grid parsing completes.
              </span>
              
              <div class="flex gap-2">
                <Button @click="wizardStep = 3" variant="ghost" class="flex-1 text-xs py-2 text-muted-foreground" :disabled="probingActive">Back</Button>
                <Button @click="wizardStep = 5" variant="outline" class="flex-1 text-xs py-2 cursor-pointer" :disabled="probingActive">Skip/Next</Button>
              </div>
            </div>

            <!-- Step 5 Content (Save Settings) -->
            <div v-if="wizardStep === 5" class="flex flex-col gap-3">
              <p class="text-[11px] text-muted-foreground leading-relaxed">
                Calibration complete! Check bed variance and decide to adjust knobs or save settings.
              </p>

              <div v-if="meshVariance !== null" class="flex flex-col gap-1 text-[11px] p-2.5 bg-muted rounded border border-border">
                <div class="flex justify-between items-center">
                  <span class="text-muted-foreground">Current Bed Variance:</span>
                  <Badge variant="outline" :class="['text-[10px] font-mono font-bold py-0.5 px-2 rounded-full', varianceBadgeColor(meshVariance)]">
                    {{ meshVariance.toFixed(3) }}mm
                  </Badge>
                </div>
                <div v-if="varianceHistory.length > 1" class="flex flex-col gap-1 pt-1.5 mt-1 border-t border-border/40">
                  <span class="text-muted-foreground">Variance History:</span>
                  <div class="flex items-center gap-1 flex-wrap font-mono text-[9px] font-bold text-indigo-400">
                    <span v-for="(v, vIdx) in varianceHistory" :key="vIdx">
                      {{ v.toFixed(3) }}mm
                      <span v-if="vIdx < varianceHistory.length - 1" class="text-muted-foreground mx-0.5">➔</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <Button 
                @click="wizardSave" 
                class="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-3 cursor-pointer shadow-md"
              >
                💾 Save and Exit
              </Button>

              <Button 
                @click="wizardStep = 4" 
                variant="outline"
                class="w-full text-xs font-semibold py-3 cursor-pointer"
              >
                🔄 Adjust Knobs & Rerun Probing
              </Button>

              <Button @click="exitWizard" variant="ghost" class="w-full text-xs text-muted-foreground py-2 mt-0.5 cursor-pointer">
                Cancel / Exit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card v-else class="border border-dashed border-border/80 bg-background/50">
        <CardContent class="py-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <span class="text-3xl">🔌</span>
          <span class="font-bold text-foreground">Printer Disconnected</span>
          <p class="max-w-[200px] leading-relaxed mx-auto text-[10px]">
            Please click the <strong>Connect</strong> button in the top navigation bar to start calibration.
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Right Column: Visualizer & Knobs (8 cols) -->
    <div class="lg:col-span-8 flex flex-col gap-6">
      <Card class="flex-1">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-semibold flex items-center justify-between">
            <span>🗺️ Bed Mesh Visualizer</span>
            <div class="flex items-center gap-1.5">
              <Badge v-if="printerProbeOffset !== null" variant="outline" class="text-[9px] font-mono font-bold py-0.5 px-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-full">
                Z-Offset: {{ printerProbeOffset.toFixed(2) }}mm
              </Badge>
              <Badge v-if="meshVariance !== null" variant="outline" :class="['text-[9px] font-mono font-bold py-0.5 px-2 rounded-full', varianceBadgeColor(meshVariance)]">
                Variance: {{ meshVariance.toFixed(3) }}mm
              </Badge>
              <Badge v-if="displayMeshGrid" variant="outline" class="text-[9px] font-mono">
                {{ displayMeshGrid.length }}x{{ displayMeshGrid[0].length }} Grid
              </Badge>
            </div>
          </CardTitle>
          <CardDescription class="text-[10px]">Topographic height deviation from center plane (values in mm)</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-6 items-center">
          <!-- Mesh Grid View -->
          <div v-if="displayMeshGrid" class="w-full flex flex-col items-center gap-6">
            <!-- 2D Colored Grid Map -->
            <div class="flex flex-col border border-border rounded-xl p-4 bg-muted/20 w-full max-w-[400px]">
              <!-- Grid Header: Back -->
              <div class="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Back</div>
              
              <div class="flex items-stretch justify-between w-full">
                <!-- Grid Left -->
                <div class="flex items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider writing-mode-vertical rotate-180 mr-2">Left</div>
                
                <!-- Center Grid Map -->
                <div class="grid gap-2 flex-1 aspect-square" :style="`grid-template-rows: repeat(${displayMeshGrid.length}, minmax(0, 1fr));`">
                  <!-- Row rendering (Marlin prints top Y-max first, so we render in reverse row order) -->
                  <div 
                    v-for="(row, rIdx) in [...displayMeshGrid].reverse()" 
                    :key="rIdx" 
                    class="grid gap-2"
                    :style="`grid-template-columns: repeat(${row.length}, minmax(0, 1fr));`"
                  >
                    <div 
                      v-for="(val, cIdx) in row" 
                      :key="cIdx"
                      :class="[
                        'rounded-lg flex flex-col items-center justify-center font-mono text-[10px] font-bold border transition p-2',
                        getCellClass(val),
                        isActiveCell(rIdx, cIdx) ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-black scale-105 shadow-lg animate-pulse' : ''
                      ]"
                    >
                      <span class="text-[8px] opacity-75">
                        <span v-if="isActiveCell(rIdx, cIdx)">🤖 </span>
                        Y{{ displayMeshGrid.length - 1 - rIdx }},X{{ cIdx }}
                      </span>
                      <span v-if="val !== null">{{ val >= 0 ? '+' : '' }}{{ val.toFixed(3) }}</span>
                      <span v-else class="text-[8px] text-muted-foreground italic animate-pulse">pending</span>
                    </div>
                  </div>
                </div>

                <!-- Grid Right -->
                <div class="flex items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider writing-mode-vertical ml-2">Right</div>
              </div>

              <!-- Grid Footer: Front -->
              <div class="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-2">Front</div>
            </div>

            <!-- Knobs Alignment Guide -->
            <div class="w-full border-t border-border pt-4 flex flex-col gap-4">
              <div class="text-xs font-semibold text-foreground uppercase tracking-wider font-mono flex items-center justify-between">
                <span>🔧 Bed Leveling Knobs Assistant:</span>
                <span v-if="knobAdjustments.some(k => k.appliedShift)" class="text-[9px] text-emerald-500 font-bold normal-case animate-pulse">
                  ✨ Integer shift applied
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  v-for="knob in knobAdjustments" 
                  :key="knob.name"
                  class="border border-border/80 bg-background hover:border-indigo-500/50 transition"
                >
                  <CardContent class="p-3 flex items-center justify-between gap-4">
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-foreground">{{ knob.name }} Knob</span>
                      <span class="text-[10px] text-muted-foreground font-mono mt-0.5">
                        Adjust: <strong class="text-indigo-400">{{ knob.turns === 0 ? 'No change' : formatFraction(knob.turns) + ' turn' + (knob.turns !== 1 ? 's' : '') }}</strong>
                      </span>
                    </div>
                    
                    <!-- Turn action badges -->
                    <div class="flex flex-col items-end gap-1">
                      <Badge 
                        v-if="knob.turns === 0" 
                        variant="outline" 
                        class="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold py-1 px-2.5 rounded-full"
                      >
                        ✓ LEVEL
                      </Badge>
                      <template v-else>
                        <Badge 
                          :class="[
                            'text-[10px] font-bold py-1 px-2.5 rounded-full',
                            knob.direction === 'CW' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          ]"
                        >
                          {{ knob.direction === 'CW' ? 'Raise Bed ↻' : 'Lower Bed ↺' }}
                        </Badge>
                        <span class="text-[10px] font-mono font-bold text-indigo-400">
                          {{ formatFraction(knob.turns) }} turn{{ knob.turns !== 1 ? 's' : '' }}
                        </span>
                      </template>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <!-- Collapsible Raw Coordinates & Precise Values -->
              <details class="text-[10px] border border-border rounded-lg bg-zinc-950/40 p-2.5 cursor-pointer select-none">
                <summary class="font-mono font-bold text-muted-foreground hover:text-foreground transition">
                  📋 View Precise Values & Raw Coordinates
                </summary>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-border/40 mt-2 font-mono text-[9px] cursor-default">
                  <div v-for="knob in knobAdjustments" :key="'raw-' + knob.name" class="flex flex-col gap-0.5 p-2 bg-background border border-border/50 rounded">
                    <span class="font-bold text-foreground text-[10px]">{{ knob.name }}</span>
                    <span class="text-[9px] text-muted-foreground mt-0.5">Height: {{ knob.rawVal >= 0 ? '+' : '' }}{{ knob.rawVal.toFixed(3) }}mm</span>
                    <span class="text-[9px] text-indigo-400">Raw Turns: {{ knob.rawTurns.toFixed(2) }} ({{ knob.rawDirection }})</span>
                  </div>
                </div>
              </details>

              <!-- Helpful Info Tip -->
              <Alert class="bg-indigo-500/10 border-indigo-500/20 text-indigo-400 text-xs">
                <AlertDescription class="leading-relaxed">
                  <strong>💡 How to Adjust Knobs (Top-Down View):</strong><br />
                  - <strong>Clockwise ↻</strong> turn releases the spring, which **raises** the bed.<br />
                  - <strong>Counter-Clockwise ↺</strong> turn compresses the spring, which **lowers** the bed.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div v-else class="py-12 text-center text-xs text-muted-foreground">
            <span class="text-3xl block mb-2">📡</span>
            Connect your printer and retrieve/probe mesh to visualize bed heights
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Bottom: Interactive Serial Terminal (12 cols) -->
    <div class="lg:col-span-12">
      <Card>
        <CardHeader class="pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle class="text-sm font-semibold flex items-center gap-2">
              💻 Serial Terminal
            </CardTitle>
            <CardDescription class="text-[10px]">Real-time serial communication log</CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <Button 
              @click="autoScroll = !autoScroll"
              variant="ghost"
              size="xs"
              :class="[
                'text-[10px] h-7 font-mono font-bold cursor-pointer select-none',
                autoScroll ? 'text-indigo-400 hover:text-indigo-300' : 'text-muted-foreground hover:text-foreground'
              ]"
            >
              {{ autoScroll ? '🟢 Auto-Scroll On' : '⚪ Auto-Scroll Off' }}
            </Button>
            <Button 
              @click="clearConsole" 
              variant="ghost" 
              size="xs"
              class="text-[10px] h-7 font-mono font-bold text-muted-foreground hover:text-foreground cursor-pointer select-none"
            >
              Clear Log
            </Button>
          </div>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <!-- Terminal Area -->
          <div 
            ref="consoleEl"
            class="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-4 h-48 overflow-y-auto font-mono text-[10px] flex flex-col gap-1.5 shadow-inner"
          >
            <div 
              v-for="(log, idx) in consoleLogs" 
              :key="idx" 
              class="flex items-start gap-2"
            >
              <span class="text-muted-foreground select-none">[{{ log.time }}]</span>
              <span :class="getLogColor(log.type)">{{ log.text }}</span>
            </div>
          </div>

          <!-- Command send -->
          <div class="flex gap-2">
            <Input 
              type="text" 
              v-model="customCommand" 
              @keyup.enter="sendCustomCommand" 
              placeholder="Send custom G-code (e.g. G28, M420 S1)..." 
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
import { ref, computed, onBeforeUnmount, onMounted, watch, nextTick } from 'vue'
import { usePrinter } from '@/lib/usePrinter'

const serialSupported = ref(false)
if (typeof window !== 'undefined') {
  serialSupported.value = 'serial' in navigator
}

const consoleEl = ref(null)
const customCommand = ref('')
const autoScroll = ref(true)

const probingActive = ref(false)
const levelingEnabled = ref(false)
const tolerance = ref(0.05) // Tolerance threshold in mm
const meshGrid = ref(null) // 2D array of parsed height values

// Z Probe Offset and variance history tracking
const printerProbeOffset = ref(null)
const varianceHistory = ref([])
const gridXs = ref([20, 65, 110, 155, 200])
const gridYs = ref([15, 63, 111, 159, 207])

const meshVariance = computed(() => {
  const grid = displayMeshGrid.value
  if (!grid || grid.length === 0) return null
  const flatVals = grid.flat().filter(v => v !== null)
  if (flatVals.length === 0) return null
  const max = Math.max(...flatVals)
  const min = Math.min(...flatVals)
  return max - min
})

function varianceBadgeColor(v) {
  if (v <= 0.08) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  if (v <= 0.15) return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
}

// Watch meshGrid to record history and update grid size
watch(meshGrid, (newGrid) => {
  if (newGrid) {
    const flatVals = newGrid.flat().filter(v => v !== null)
    if (flatVals.length > 0) {
      const variance = Math.max(...flatVals) - Math.min(...flatVals)
      if (varianceHistory.value.length === 0 || Math.abs(varianceHistory.value[varianceHistory.value.length - 1] - variance) > 0.001) {
        varianceHistory.value.push(variance)
      }
    }

    // Adapt coordinates mapping to grid dimensions from printer
    const rows = newGrid.length
    const cols = newGrid[0].length
    if (rows !== gridYs.value.length || cols !== gridXs.value.length) {
      const minX = 20, maxX = 200
      const minY = 15, maxY = 207
      const xs = []
      for (let i = 0; i < cols; i++) {
        xs.push(minX + Math.round((maxX - minX) * (i / (cols - 1))))
      }
      const ys = []
      for (let i = 0; i < rows; i++) {
        ys.push(minY + Math.round((maxY - minY) * (i / (rows - 1))))
      }
      gridXs.value = xs
      gridYs.value = ys
    }
  }
}, { deep: true })

// Guided Calibration Wizard state
const wizardActive = ref(false)
const wizardStep = ref(1)
const totalBabysteps = ref(0)

// Live Probing State tracking
const rawProbedPoints = ref([])
const activeProbingPoint = ref(null)

const liveMeshGrid = computed(() => {
  const xs = gridXs.value
  const ys = gridYs.value
  if (xs.length === 0 || ys.length === 0) return null

  const grid = Array(ys.length).fill(null).map(() => Array(xs.length).fill(null))

  for (const p of rawProbedPoints.value) {
    const xIdx = xs.findIndex(ex => Math.abs(ex - p.x) < 5)
    const yIdx = ys.findIndex(ey => Math.abs(ey - p.y) < 5)
    if (xIdx !== -1 && yIdx !== -1) {
      grid[yIdx][xIdx] = p.z
    }
  }
  return grid
})

const displayMeshGrid = computed(() => {
  if (meshGrid.value) return meshGrid.value
  return liveMeshGrid.value
})

const activeProbingCell = computed(() => {
  if (!activeProbingPoint.value) return null
  const xs = gridXs.value
  const ys = gridYs.value
  const xIdx = xs.findIndex(ex => Math.abs(ex - activeProbingPoint.value.x) < 5)
  const yIdx = ys.findIndex(ey => Math.abs(ey - activeProbingPoint.value.y) < 5)
  if (xIdx !== -1 && yIdx !== -1) {
    return { r: yIdx, c: xIdx }
  }
  return null
})

function isActiveCell(rIdx, cIdx) {
  if (!activeProbingCell.value) return false
  if (!displayMeshGrid.value) return false
  const actualYIdx = displayMeshGrid.value.length - 1 - rIdx
  return activeProbingCell.value.r === actualYIdx && activeProbingCell.value.c === cIdx
}

onMounted(() => {
  setConnectionType('usb')
})

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

watch(connected, (newVal) => {
  if (newVal) {
    addLog('Printer connected. Waiting 1.5 seconds to auto-retrieve stored bed mesh...', 'info')
    setTimeout(() => {
      retrieveStoredMesh()
    }, 1500)
  }
})

watch(consoleLogs, () => {
  if (autoScroll.value && consoleEl.value) {
    nextTick(() => {
      consoleEl.value.scrollTop = consoleEl.value.scrollHeight
    })
  }
}, { deep: true })

let isCollectingGrid = false
let collectedGridLines = []

function parseSerialLine(line) {
  // Check for bed leveling enabled/disabled status reporting (e.g. Bed Leveling On or M420 S1 reports)
  if (line.match(/Bed Leveling\s+On/i) || line.match(/M420\s+S1/i)) {
    levelingEnabled.value = true
  } else if (line.match(/Bed Leveling\s+Off/i) || line.match(/M420\s+S0/i)) {
    levelingEnabled.value = false
  }

  // Parse real-time bed probe points (e.g. Bed X: 20.000 Y: 15.000 Z: -0.337)
  const bedMatch = line.match(/Bed\s+X:\s*([-+]?\d+\.\d+)\s+Y:\s*([-+]?\d+\.\d+)\s+Z:\s*([-+]?\d+\.\d+)/i)
  if (bedMatch) {
    const x = parseFloat(bedMatch[1])
    const y = parseFloat(bedMatch[2])
    const z = parseFloat(bedMatch[3])
    
    // Update gridXs/gridYs dynamically if not present
    if (!gridXs.value.some(ex => Math.abs(ex - x) < 5)) {
      gridXs.value.push(x)
      gridXs.value.sort((a, b) => a - b)
    }
    if (!gridYs.value.some(ey => Math.abs(ey - y) < 5)) {
      gridYs.value.push(y)
      gridYs.value.sort((a, b) => a - b)
    }
    
    const existingIdx = rawProbedPoints.value.findIndex(p => Math.abs(p.x - x) < 5 && Math.abs(p.y - y) < 5)
    if (existingIdx !== -1) {
      rawProbedPoints.value[existingIdx].z = z
    } else {
      rawProbedPoints.value.push({ x, y, z })
    }
    activeProbingPoint.value = { x, y }
    addLog(`📍 Live Probed Point: X=${x} Y=${y} Z=${z.toFixed(3)}mm`, 'success')
  }

  // Parse Probe Z Offset response (e.g. echo:Probe Z Offset: -0.05 or Probe Z Offset: -0.10)
  const offsetMatch = line.match(/(?:echo:)?Probe\s+Z\s+Offset:\s*([-+]?\d+\.\d+)/i)
  if (offsetMatch) {
    const currentProbeOffset = parseFloat(offsetMatch[1])
    printerProbeOffset.value = currentProbeOffset
    addLog(`ℹ️ Active Probe Z-Offset reported by printer: ${currentProbeOffset}mm`, 'info')
  }

  // Parse M851 Z-Probe Offset response (e.g. echo: M851 Z-0.06 or M851 Z-0.06)
  const m851Match = line.match(/(?:echo:\s*)?M851\s+Z\s*([-+]?\d+\.\d+)/i)
  if (m851Match) {
    const currentProbeOffset = parseFloat(m851Match[1])
    printerProbeOffset.value = currentProbeOffset
    addLog(`ℹ️ Active Z-Probe Offset parsed from printer config: ${currentProbeOffset}mm`, 'info')
  }

  // Look for bilinear grid start
  if (line.toLowerCase().includes('bilinear leveling grid') || line.toLowerCase().includes('sub-ply leveling grid')) {
    isCollectingGrid = true
    collectedGridLines = []
    return
  }

  if (isCollectingGrid) {
    const rowMatch = line.match(/^\s*(\d+)\s+((?:[-+]?\d+\.\d+\s*)+)$/)
    if (rowMatch) {
      collectedGridLines.push(rowMatch[2].trim().split(/\s+/).map(Number))
    } else {
      if (collectedGridLines.length > 0) {
        meshGrid.value = [...collectedGridLines]
        isCollectingGrid = false
        addLog(`✨ Bed Mesh successfully parsed! (${meshGrid.value.length}x${meshGrid.value[0].length} grid)`, 'success')
        probingActive.value = false
        if (wizardActive.value && wizardStep.value === 4) {
          wizardStep.value = 5
        }
      }
    }
  }
}

// Guided Calibration Wizard functions
function startWizard() {
  wizardActive.value = true
  wizardStep.value = 1
  totalBabysteps.value = printerProbeOffset.value !== null ? printerProbeOffset.value : 0
  varianceHistory.value = []
}

async function wizardHome() {
  if (!connected.value) return
  probingActive.value = true
  addLog('Wizard: Homing printer axes (G28)...', 'info')
  enqueueGcode('G28')
  await new Promise(resolve => setTimeout(resolve, 30000))
  addLog('Wizard: Disabling software endstops (M211 S0) to allow Z calibration...', 'warn')
  enqueueGcode('M211 S0')
  addLog('Wizard: Moving nozzle to bed center at Z=0...', 'info')
  enqueueGcode('G1 X115 Y115 Z0 F3000')
  probingActive.value = false
  wizardStep.value = 3
}

function wizardBabystep(val) {
  totalBabysteps.value += val
  // M290 update Z offset in firmware memory
  enqueueGcode(`M290 Z${val}`)
  // Physically move nozzle via relative G1 move so user can feel paper drag
  enqueueGcode('G91')
  enqueueGcode(`G1 Z${val} F150`)
  enqueueGcode('G90')
  addLog(`Wizard: Adjusted Z height by ${val}mm (Total: ${totalBabysteps.value.toFixed(2)}mm)`, 'info')
}

function wizardRunBilinear() {
  meshGrid.value = null
  rawProbedPoints.value = []
  activeProbingPoint.value = null
  probingActive.value = true
  addLog('Wizard: Re-enabling software endstops (M211 S1) for safety...', 'info')
  enqueueGcode('M211 S1')
  addLog('Wizard: Measuring bed grid (G29 V4)...', 'info')
  enqueueGcode('G29 V4')
}

function wizardSave() {
  addLog('Wizard: Re-enabling software endstops (M211 S1) for safety...', 'info')
  enqueueGcode('M211 S1')
  enqueueGcode('M500')
  addLog('Wizard: Calibration successfully saved to EEPROM.', 'success')
  wizardActive.value = false
  wizardStep.value = 1
}

function exitWizard() {
  addLog('Wizard: Re-enabling software endstops (M211 S1) for safety...', 'info')
  enqueueGcode('M211 S1')
  wizardActive.value = false
  wizardStep.value = 1
}

function sendCustomCommand() {
  if (customCommand.value.trim()) {
    enqueueGcode(customCommand.value.trim().toUpperCase())
    customCommand.value = ''
  }
}

async function startProbing() {
  if (!connected.value) return
  meshGrid.value = null
  rawProbedPoints.value = []
  activeProbingPoint.value = null
  probingActive.value = true
  addLog('Starting auto-probing sequence...', 'info')
  
  addLog('Homing printer axes (G28) - waiting 30 seconds...', 'info')
  enqueueGcode('G28')
  await new Promise(resolve => setTimeout(resolve, 30000))
  
  addLog('Measuring bed grid (G29 V4). Probing takes 2-3 minutes. Watch logs below...', 'info')
  enqueueGcode('G29 V4')
}

function retrieveStoredMesh() {
  if (!connected.value) return
  meshGrid.value = null
  rawProbedPoints.value = []
  activeProbingPoint.value = null
  addLog('Retrieving stored bed leveling mesh data...', 'info')
  enqueueGcode('M420 V')
}

function saveToEeprom() {
  enqueueGcode('M500')
  addLog('Configuration saved to EEPROM permanently.', 'success')
}

const knobAdjustments = computed(() => {
  if (!displayMeshGrid.value) return []
  const grid = displayMeshGrid.value
  const rows = grid.length
  const cols = grid[0].length

  const FLVal = grid[0][0]
  const FRVal = grid[0][cols - 1]
  const BLVal = grid[rows - 1][0]
  const BRVal = grid[rows - 1][cols - 1]

  if (FLVal === null || FRVal === null || BLVal === null || BRVal === null) return []

  const pitch = 0.7 
  const rawVals = [FLVal, FRVal, BLVal, BRVal]
  const rawTurns = rawVals.map(v => v / pitch)
  const clampedTurns = rawTurns.map(t => Math.round(t / 0.25) * 0.25)

  const getFrac = (n) => {
    const f = n % 1
    return f < 0 ? f + 1 : f
  }

  const firstFrac = getFrac(clampedTurns[0])
  const allSameFrac = clampedTurns.every(t => Math.abs(getFrac(t) - firstFrac) < 0.001)

  let finalTurns = [...clampedTurns]
  let appliedShift = false

  if (allSameFrac) {
    const shift1 = -firstFrac
    const shift2 = 1 - firstFrac
    const sum1 = clampedTurns.reduce((sum, t) => sum + Math.abs(t + shift1), 0)
    const sum2 = clampedTurns.reduce((sum, t) => sum + Math.abs(t + shift2), 0)
    const optimalShift = sum1 <= sum2 ? shift1 : shift2
    finalTurns = clampedTurns.map(t => t + optimalShift)
    appliedShift = true
  }

  const names = ['Front-Left', 'Front-Right', 'Back-Left', 'Back-Right']
  
  return names.map((name, idx) => {
    const val = rawVals[idx]
    const turns = finalTurns[idx]
    const direction = turns >= 0 ? 'CCW' : 'CW'
    const absTurns = Math.abs(turns)

    const rawTurnVal = rawTurns[idx]
    const rawDirection = rawTurnVal >= 0 ? 'CCW' : 'CW'
    const rawAbsTurns = Math.abs(rawTurnVal)

    return {
      name,
      val,
      turns: absTurns,
      direction,
      isClamped: true,
      appliedShift,
      rawVal: val,
      rawTurns: rawAbsTurns,
      rawDirection
    }
  })
})

function formatFraction(turns) {
  if (turns === 0) return '0'
  const integerPart = Math.floor(turns)
  const decimalPart = turns % 1
  let fracStr = ''
  
  if (Math.abs(decimalPart - 0.25) < 0.01) fracStr = '1/4'
  else if (Math.abs(decimalPart - 0.50) < 0.01) fracStr = '1/2'
  else if (Math.abs(decimalPart - 0.75) < 0.01) fracStr = '3/4'
  
  if (integerPart > 0) {
    return fracStr ? `${integerPart} ${fracStr}` : `${integerPart}`
  }
  return fracStr || '0'
}

function calcTurns(val, pitch) {
  const turns = Math.abs(val) / pitch
  const direction = val >= 0 ? 'CW' : 'CCW'
  return { turns, direction }
}

function getCellClass(val) {
  if (val === null) {
    return 'bg-zinc-950 border-zinc-900 text-zinc-600'
  }
  const absVal = Math.abs(val)
  if (absVal <= tolerance.value) {
    return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
  }
  if (val > 0) {
    if (absVal <= tolerance.value * 2) {
      return 'bg-amber-500/20 border-amber-500/50 text-amber-400'
    }
    return 'bg-rose-500/20 border-rose-500/50 text-rose-400'
  }
  if (absVal <= tolerance.value * 2) {
    return 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
  }
  return 'bg-blue-500/20 border-blue-500/50 text-blue-400'
}

function valColor(val) {
  if (Math.abs(val) <= tolerance.value) return 'text-emerald-400'
  return val >= 0 ? 'text-rose-400' : 'text-sky-400'
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

// Connection survives component unmount for hot-reload support
</script>
