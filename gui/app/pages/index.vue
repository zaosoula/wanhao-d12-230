<template>
  <main class="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-6">
      <!-- Unsupported Browser Warning -->
      <Alert v-if="!isSupported" variant="destructive" class="flex flex-col gap-2 shadow-sm">
        <AlertTitle class="flex items-center gap-2 text-sm font-semibold">
          ⚠️ Browser Not Supported
        </AlertTitle>
        <AlertDescription class="text-xs leading-relaxed text-destructive/80">
          The File System Access API is required to flash firmware directly to your SD card. 
          Please open this app in <strong>Google Chrome, Microsoft Edge, or Opera</strong>. Safari and Firefox are not supported.
        </AlertDescription>
      </Alert>

      <!-- Flashing Instructions top bar -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-xs font-semibold uppercase tracking-wider font-mono text-muted-foreground">📖 Quick Start Instructions</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
          <div class="flex gap-2">
            <span class="text-primary font-bold font-mono">01.</span>
            <p>Choose printer motherboard and firmware version.</p>
          </div>
          <div class="flex gap-2">
            <span class="text-primary font-bold font-mono">02.</span>
            <p>Tune config parameters & shortcuts to your liking.</p>
          </div>
          <div class="flex gap-2">
            <span class="text-primary font-bold font-mono">03.</span>
            <p>Connect SD Card target folder and click Flash.</p>
          </div>
          <div class="flex gap-2">
            <span class="text-amber-600 font-bold font-mono">04.</span>
            <p class="text-foreground font-medium">Eject card, put in printer, and turn on to update.</p>
          </div>
        </CardContent>
      </Card>

      <div class="flex flex-col gap-6 w-full">
          <!-- Step 1: Select Motherboard Matrix Profile -->
          <Card>
            <CardHeader class="flex flex-row items-center gap-3 space-y-0 pb-4">
              <div class="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground border border-border">
                1
              </div>
              <div>
                <CardTitle class="text-base">Select Hardware Matrix</CardTitle>
                <CardDescription class="text-[10px]">Define your Wanhao D12 printer core board and driver type</CardDescription>
              </div>
            </CardHeader>
            <CardContent class="grid sm:grid-cols-2 gap-4">
              <!-- Board Name -->
              <div class="flex flex-col gap-1.5">
                <Label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Motherboard</Label>
                <Select :model-value="selectedBoardId" @update:model-value="val => { selectedBoardId = val; handleBoardChange() }">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent class="bg-popover border-border text-popover-foreground">
                    <SelectItem v-for="b in boards" :key="b.id" :value="b.id">
                      {{ b.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Firmware Version -->
              <div class="flex flex-col gap-1.5">
                <Label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Firmware Version</Label>
                <Select :model-value="selectedVersionId" :disabled="!selectedBoardId" @update:model-value="val => { selectedVersionId = val; handleVersionChange() }">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent class="bg-popover border-border text-popover-foreground">
                    <SelectItem v-for="v in versions" :key="v.id" :value="v.id">
                      {{ v.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <!-- Step 2: Select SD Card Folder -->
          <Card v-if="selectedVersionId">
            <CardHeader class="flex flex-row items-center gap-3 space-y-0 pb-4">
              <div class="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground border border-border">
                2
              </div>
              <div>
                <CardTitle class="text-base">Select SD Card Folder</CardTitle>
                <CardDescription class="text-[10px]">Select target microSD drive directory to write configurations</CardDescription>
              </div>
            </CardHeader>
            
            <CardContent class="flex flex-col gap-4">
              <div class="flex flex-col sm:flex-row items-center gap-4">
                <Button 
                  v-if="isSupported"
                  @click="selectDirectory"
                  variant="outline"
                  class="w-full sm:w-auto font-medium h-10 cursor-pointer"
                >
                  📁 Connect Target Folder
                </Button>
                <Badge 
                  v-if="dirHandle" 
                  variant="outline" 
                  class="text-xs text-emerald-600 font-mono bg-emerald-500/5 border-emerald-500/20 px-3 py-2 w-full sm:w-auto flex-1 truncate flex items-center justify-start gap-1.5"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Connected: {{ dirHandle.name }}
                </Badge>
                <div v-else class="text-xs text-slate-500 italic">
                  Select microSD root (e.g. SD card drive)
                </div>
              </div>

              <!-- Prefilled alert -->
              <Alert v-if="configPrefilled" class="bg-emerald-500/10 border-emerald-500/20 text-emerald-600">
                <AlertDescription class="flex items-center gap-2 text-xs">
                  <span>💡 Loaded printer settings automatically from existing <strong>{{ prefilledFileName }}</strong>!</span>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <!-- Step 3: Configure Parameters -->
          <Card v-if="selectedVersionId">
            <CardHeader class="flex flex-row items-center gap-3 space-y-0 pb-4">
              <div class="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground border border-border">
                3
              </div>
              <div>
                <CardTitle class="text-base">Configure Parameters</CardTitle>
                <CardDescription class="text-[10px]">Tweak advanced Marlin config settings, preset modes, and custom TFT screen shortcuts</CardDescription>
              </div>
            </CardHeader>
            <CardContent class="flex flex-col gap-6">
              <!-- Features Presets Grid (Allows Selecting Multiple) -->
              <Card class="bg-card border-border shadow-none">
                <CardHeader class="pb-3">
                  <CardTitle class="text-xs font-semibold text-foreground">Features Presets</CardTitle>
                  <CardDescription class="text-[10px]">Select multiple features to apply simultaneously</CardDescription>
                </CardHeader>
                <CardContent class="flex flex-col gap-4">
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <!-- BLTouch -->
                    <div class="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:bg-accent hover:text-accent-foreground transition">
                      <div class="flex flex-col gap-0.5">
                        <Label for="preset-bltouch" class="text-xs font-medium cursor-pointer">BLTouch Leveling</Label>
                        <span class="text-[9px] text-muted-foreground font-mono">Auto 3D Touch</span>
                      </div>
                      <Switch 
                        id="preset-bltouch" 
                        :model-value="presetBLTouch" 
                        @update:model-value="val => { presetBLTouch = val; handlePresetToggle('bltouch', val) }"
                      />
                    </div>

                    <!-- Bed PID -->
                    <div class="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:bg-accent hover:text-accent-foreground transition">
                      <div class="flex flex-col gap-0.5">
                        <Label for="preset-bedpid" class="text-xs font-medium cursor-pointer">Bed PID Tuning</Label>
                        <span class="text-[9px] text-muted-foreground font-mono">Stable bed heating</span>
                      </div>
                      <Switch 
                        id="preset-bedpid" 
                        :model-value="presetBedPID" 
                        @update:model-value="val => { presetBedPID = val; handlePresetToggle('bedpid', val) }"
                      />
                    </div>

                    <!-- WiFi Preset -->
                    <div class="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:bg-accent hover:text-accent-foreground transition">
                      <div class="flex flex-col gap-0.5">
                        <Label for="preset-wifi" class="text-xs font-medium cursor-pointer">Wi-Fi Connection</Label>
                        <span class="text-[9px] text-muted-foreground font-mono">Connect printer to WLAN</span>
                      </div>
                      <Switch 
                        id="preset-wifi" 
                        :model-value="presetWiFi" 
                        @update:model-value="val => { presetWiFi = val; handlePresetToggle('wifi', val) }"
                      />
                    </div>
                  </div>

                  <!-- WiFi Config SSID/Password sub-card -->
                  <div v-if="presetWiFi" class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-accent/20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div class="flex flex-col gap-1">
                      <Label for="wifi-ssid" class="text-[10px] font-mono font-bold text-muted-foreground">Wi-Fi SSID (Name)</Label>
                      <Input 
                        id="wifi-ssid"
                        v-model="getWiFiItem('CFG_WIFI_AP_NAME').value"
                        placeholder="Enter WiFi SSID"
                        class="bg-background border-input text-xs font-mono h-8 rounded"
                      />
                    </div>
                    <div class="flex flex-col gap-1">
                      <Label for="wifi-password" class="text-[10px] font-mono font-bold text-muted-foreground">Wi-Fi Password</Label>
                      <Input 
                        id="wifi-password"
                        v-model="getWiFiItem('CFG_WIFI_KEY_CODE').value"
                        type="password"
                        placeholder="Enter WiFi Password"
                        class="bg-background border-input text-xs font-mono h-8 rounded"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Touchscreen Shortcut Customizer -->
              <Card class="bg-card border-border shadow-none">
                <CardHeader class="pb-3">
                  <CardTitle class="text-xs font-semibold text-foreground">Touchscreen Shortcut Customizer</CardTitle>
                  <CardDescription class="text-[10px]">Drag and drop to reorder button slots on the printer's screen. Select pre-defined macros or enter custom G-code.</CardDescription>
                </CardHeader>
                <CardContent class="flex flex-col gap-5">
                  <!-- Tab Switcher -->
                  <Tabs :model-value="activeShortcutTab" @update:model-value="val => activeShortcutTab = val" class="w-full">
                    <TabsList class="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
                      <TabsTrigger value="idle" class="text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground py-2 rounded-md cursor-pointer">
                        💤 Idle Screen Shortcuts
                      </TabsTrigger>
                      <TabsTrigger value="printing" class="text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground py-2 rounded-md cursor-pointer">
                        ⚡ Printing Screen Shortcuts
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <!-- Drag & Drop Slots Grid -->
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Virtual TFT Touchscreen Mockup -->
                    <div class="bg-background border border-border rounded-lg p-4 flex flex-col gap-3 shadow-inner">
                      <div class="flex items-center justify-between border-b border-border pb-2">
                        <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">📺 Virtual TFT Screen</span>
                        <span class="text-[9px] text-primary font-mono font-bold">{{ activeShortcutTab === 'idle' ? 'D12 TFT35 Idle "More" Menu' : 'D12 TFT35 Printing "More" Menu' }}</span>
                      </div>
                      <div class="grid grid-cols-4 gap-2 py-4">
                        <div 
                          v-for="(sc, idx) in currentShortcuts" 
                          :key="sc.id"
                          class="aspect-square bg-card border border-border hover:border-primary rounded-lg p-1.5 flex flex-col items-center justify-center text-center gap-1 transition"
                        >
                          <span class="text-lg">{{ sc.icon }}</span>
                          <span class="text-[8px] font-medium text-foreground leading-tight truncate w-full">{{ sc.name }}</span>
                          <span class="text-[7px] text-muted-foreground font-mono leading-none">Slot {{ idx + 1 }}</span>
                        </div>
                        <!-- Fixed Return/Home Screen Button -->
                        <div class="aspect-square bg-muted/20 border border-border/40 rounded-lg p-1.5 flex flex-col items-center justify-center text-center gap-1 opacity-40">
                          <span class="text-lg">🔙</span>
                          <span class="text-[8px] font-medium text-muted-foreground leading-tight">Back</span>
                          <span class="text-[7px] font-mono leading-none">System</span>
                        </div>
                      </div>
                    </div>

                    <!-- Interactive Edit & Drag List -->
                    <div class="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                      <div 
                        v-for="(sc, idx) in currentShortcuts" 
                        :key="sc.id"
                        draggable="true"
                        @dragstart="onDragStart(idx)"
                        @dragover.prevent
                        @drop="onDrop(idx)"
                        class="flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:border-primary/40 transition drag-handle cursor-grab active:cursor-grabbing select-none"
                      >
                        <!-- Drag handle -->
                        <div class="text-muted-foreground font-mono text-sm select-none px-1">☰</div>
                        
                        <!-- Slot index & icon -->
                        <div class="w-7 h-7 rounded bg-secondary flex items-center justify-center text-sm border border-border">
                          {{ sc.icon }}
                        </div>

                        <!-- Details & Presets selection -->
                        <div class="flex-1 flex flex-col gap-1 min-w-0">
                          <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold text-muted-foreground font-mono">Button Slot {{ idx + 1 }}</span>
                            <!-- Preset selector dropdown -->
                            <Select 
                              :model-value="sc.isCustom ? 'custom' : sc.name"
                              @update:model-value="val => selectShortcutPreset(idx, val)"
                            >
                              <SelectTrigger class="bg-card border-input text-[10px] text-foreground px-2 py-1 h-7 max-w-[120px] rounded cursor-pointer">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent class="bg-popover border-border text-popover-foreground">
                                <SelectItem v-for="t in currentTemplates" :key="t.name" :value="t.name === 'Custom G-code' ? 'custom' : t.name">
                                  {{ t.name }}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <!-- Editable Custom Name & Command inputs -->
                          <div class="flex gap-2">
                            <Input 
                              v-model="sc.name" 
                              @input="updateConfigShortcuts"
                              placeholder="Button label"
                              class="w-20 bg-card border-input h-7 text-[10px] px-2 rounded"
                            />
                            <Input 
                              v-model="sc.cmd" 
                              @input="updateConfigShortcuts"
                              placeholder="G-code commands"
                              class="flex-1 bg-card border-input h-7 text-[10px] px-2 rounded font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Form Body (Expert parameters search and accordions) -->
              <div class="flex flex-col gap-5 mt-4">
                <!-- Search bar for expert keys -->
                <div class="flex flex-col gap-1.5">
                  <Label class="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Search Parameters</Label>
                  <Input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Type key name or description to filter..."
                    class="w-full"
                  />
                </div>

                <!-- Category Groups Accordion -->
                <Accordion type="single" collapsible class="w-full flex flex-col gap-3">
                  <AccordionItem 
                    v-for="(fields, categoryName) in filteredCategories" 
                    :key="categoryName"
                    :value="categoryName"
                    class="border border-border rounded-lg overflow-hidden bg-background"
                  >
                    <!-- Category Header / Trigger -->
                    <AccordionTrigger class="w-full hover:no-underline px-4 py-3 flex items-center justify-between text-left transition select-none cursor-pointer border-b border-border bg-secondary/20">
                      <span class="text-xs font-semibold text-primary uppercase tracking-wider font-mono">{{ categoryName }}</span>
                    </AccordionTrigger>

                    <!-- Category Content -->
                    <AccordionContent class="p-4 flex flex-col gap-4 bg-card/10">
                      <!-- Parameter Row -->
                      <div 
                        v-for="item in fields" 
                        :key="item.key"
                        class="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded border border-border bg-card hover:border-border/80 transition"
                      >
                        <!-- Left descriptive side -->
                        <div class="flex-1 flex flex-col gap-1">
                          <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-sm font-semibold text-foreground leading-none">{{ item.label }}</span>
                            <span class="text-[9px] font-mono font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded select-all">{{ item.key }}</span>
                            <span 
                              v-if="isDirty(item)" 
                              class="px-1.5 py-0.2 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded text-[8px] font-mono uppercase tracking-wider"
                            >
                              modified
                            </span>
                            <Button 
                              v-if="isDirty(item)"
                              @click="revertItem(item)"
                              variant="link"
                              class="text-[9px] text-muted-foreground hover:text-primary h-auto p-0 cursor-pointer select-none font-mono underline ml-1"
                              title="Revert to baseline value"
                            >
                              ↺ Reset
                            </Button>
                          </div>
                          <span class="text-[11px] text-muted-foreground leading-normal mt-0.5">{{ item.comment }}</span>
                        </div>

                        <!-- Right interactive input side -->
                        <div class="w-full md:w-64 flex flex-col items-start md:items-end gap-1 justify-center">
                          <div class="w-full flex justify-start md:justify-end items-center">
                            <!-- Boolean switch type -->
                            <div v-if="item.type === 'boolean'" class="flex items-center">
                              <Switch 
                                :model-value="item.value === item.trueValue"
                                @update:model-value="val => { item.value = val ? item.trueValue : item.falseValue }"
                                :disabled="isItemDisabled(item)"
                              />
                            </div>

                            <!-- Select type -->
                            <Select 
                              v-else-if="item.type === 'select'"
                              v-model="item.value"
                              :disabled="isItemDisabled(item)"
                            >
                              <SelectTrigger class="w-full bg-background border-input text-xs rounded h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent class="bg-popover border-border text-xs">
                                <SelectItem v-for="opt in item.options" :key="opt.value" :value="opt.value">
                                  {{ opt.label }}
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <!-- Number type -->
                            <Input 
                              v-else-if="item.type === 'number'"
                              v-model.number="item.value"
                              type="number"
                              :disabled="isItemDisabled(item)"
                              class="w-full bg-background border-input rounded text-xs font-mono h-9"
                            />

                            <!-- Default string type -->
                            <Input 
                              v-else
                              v-model="item.value"
                              :type="item.type === 'password' ? 'password' : 'text'"
                              :disabled="isItemDisabled(item)"
                              class="w-full bg-background border-input rounded text-xs font-mono h-9"
                            />
                          </div>
                          
                          <!-- Warning text under the input -->
                          <span 
                            v-if="item.isHardware" 
                            class="text-[9px] text-destructive font-mono text-left md:text-right leading-none mt-1"
                          >
                            ⚠️ Warning: Changing may damage hardware.
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>

            <!-- Install Action (Flash button) -->
            <CardFooter class="pt-6 border-t border-border flex flex-col gap-3">
              <Button 
                @click="startFlash"
                :disabled="flashing || !dirHandle"
                size="lg"
                class="w-full font-semibold h-12 cursor-pointer"
              >
                <svg v-if="flashing" class="animate-spin h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-xs font-semibold">{{ flashing ? 'Writing files to SD Card...' : '⚡ Clean & Flash SD Card' }}</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

    <!-- Flashing Modal Overlay -->
    <Dialog :open="showFlashModal" @update:open="val => { if (!flashing) showFlashModal = val }">
      <DialogContent class="max-w-md w-full p-6 shadow-2xl overflow-hidden">
        <DialogHeader class="hidden">
          <DialogTitle>Flashing Status</DialogTitle>
          <DialogDescription>Firmware copy pipeline</DialogDescription>
        </DialogHeader>

        <!-- Progress State -->
        <div v-if="flashStatus === 'progress'" class="flex flex-col items-center text-center gap-4 py-4">
          <!-- Pulse glowing ring with rotating sync wheel -->
          <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
            <svg class="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div class="flex flex-col gap-1">
            <h3 class="text-foreground font-semibold text-base">⚡ Flashing Firmware...</h3>
            <p class="text-xs text-muted-foreground font-mono">{{ statusText }}</p>
          </div>

          <!-- Progress Bar -->
          <div class="w-full flex flex-col gap-2 mt-2">
            <Progress :model-value="progress" class="w-full" />
            <span class="text-xs font-bold text-primary font-mono">{{ progress }}%</span>
          </div>

          <!-- Mini scrolling console for reassurance -->
          <div class="w-full bg-muted/40 border border-border rounded-lg p-3 h-24 overflow-y-auto text-left font-mono text-[9px] text-muted-foreground flex flex-col gap-1">
            <div v-for="(log, idx) in logs.slice(-20)" :key="idx" :class="getLogClass(log.type)">
              &gt; {{ log.text }}
            </div>
          </div>
        </div>

        <!-- Success State -->
        <div v-else-if="flashStatus === 'success'" class="flex flex-col items-center text-center gap-4 py-4">
          <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <span class="text-3xl">🎉</span>
          </div>

          <div class="flex flex-col gap-1">
            <h3 class="text-foreground font-semibold text-lg">Flashing Successful!</h3>
            <p class="text-xs text-muted-foreground">All firmware assets written to SD card successfully.</p>
          </div>

          <!-- Next Steps guide -->
          <div class="w-full bg-muted/30 border border-border rounded-xl p-4 text-left flex flex-col gap-2.5 text-xs text-foreground">
            <span class="font-bold text-muted-foreground uppercase tracking-wider font-mono text-[9px] block border-b border-border pb-1">👉 Next Steps:</span>
            <div class="flex gap-2">
              <span class="text-primary font-bold">1.</span>
              <p>Eject the SD card drive from your computer.</p>
            </div>
            <div class="flex gap-2">
              <span class="text-primary font-bold">2.</span>
              <p>Insert microSD card into the printer's card reader slot.</p>
            </div>
            <div class="flex gap-2">
              <span class="text-primary font-bold">3.</span>
              <p>Turn on the printer. Firmware will flash automatically (takes ~15-30s).</p>
            </div>
          </div>

          <Button 
            @click="showFlashModal = false"
            class="w-full h-11 font-semibold mt-2 cursor-pointer"
          >
            Done
          </Button>
        </div>

        <!-- Error State -->
        <div v-else-if="flashStatus === 'error'" class="flex flex-col items-center text-center gap-4 py-4">
          <div class="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <span class="text-3xl">❌</span>
          </div>

          <div class="flex flex-col gap-1">
            <h3 class="text-foreground font-semibold text-lg">Flashing Failed</h3>
            <p class="text-xs text-destructive font-mono">{{ flashErrorMessage }}</p>
          </div>

          <Button 
            @click="showFlashModal = false"
            variant="outline"
            class="w-full h-11 font-semibold mt-2 cursor-pointer"
          >
            Dismiss
          </Button>
        </div>
      </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { schemaList } from '../schema.js'
import { useState } from '#app'

const isSupported = ref(false)
const mode = 'expert'
const flashing = ref(false)
const progress = ref(0)
const statusText = ref('Idle')
const logs = ref([])
const consoleEl = ref(null)

const showFlashModal = ref(false)
const flashStatus = ref('progress')
const flashErrorMessage = ref('')

const dirHandle = useState('dirHandle', () => null)
const configPrefilled = ref(false)
const prefilledFileName = ref('')
const searchQuery = ref('')

// Cascading matrices variables
const catalog = ref({ boards: [] })
const selectedBoardId = ref('')
const selectedDriverId = ref('')
const selectedVersionId = ref('')

// Preset checklist values
const presetBLTouch = ref(false)
const presetBedPID = ref(false)
const presetWiFi = ref(false)

const activeProfile = ref(null)
const templateText = ref('')
const configKeys = ref([])

// Collapsible category state tracking
const collapsedCategories = ref({
  'Wi-Fi': false,
  'Temperature / PID': false,
  'Motion': false,
  'Extruder': false,
  'Other': true
})



// Cascading computed properties
const boards = computed(() => catalog.value.boards)
const drivers = computed(() => {
  const b = boards.value.find(x => x.id === selectedBoardId.value)
  return b ? b.drivers : []
})
const versions = computed(() => activeProfile.value ? activeProfile.value.versions : [])
const activeVersion = computed(() => versions.value.find(v => v.id === selectedVersionId.value) || null)

const basePath = computed(() => {
  if (!selectedBoardId.value || !selectedDriverId.value || !selectedVersionId.value) return ''
  return `/firmware/${selectedBoardId.value}/${selectedDriverId.value}/${selectedVersionId.value}/`
})

onMounted(async () => {
  isSupported.value = typeof window !== 'undefined' && 'showDirectoryPicker' in window
  addLog('Web Application initialized.', 'info')
  if (!isSupported.value) {
    addLog('WARNING: showDirectoryPicker API not detected. Browser incompatible.', 'err')
  }
  
  // Load main catalog
  await loadCatalog()
})

const addLog = (text, type = 'info') => {
  const time = new Date().toLocaleTimeString()
  logs.value.push({ time, text, type })
  
  if (type === 'err') {
    console.error(`[${time}] ${text}`)
  } else if (type === 'warn') {
    console.warn(`[${time}] ${text}`)
  } else {
    console.log(`[${time}] ${text}`)
  }

  nextTick(() => {
    if (consoleEl.value) {
      consoleEl.value.scrollTop = consoleEl.value.scrollHeight
    }
  })
}

const clearLogs = () => {
  logs.value = []
}

const getLogClass = (type) => {
  switch (type) {
    case 'err': return 'text-rose-400'
    case 'success': return 'text-emerald-400 font-semibold'
    case 'warn': return 'text-amber-400'
    default: return 'text-slate-300'
  }
}

// Parses >KEY VALUE or >KEY:VALUE lines
const parseConfigLine = (line) => {
  const match = line.match(/^>(\w+)(?:\s+|:)([^#\r\n]+)/)
  if (match) {
    return { key: match[1], val: match[2].trim() }
  }
  return null
}

const loadCatalog = async () => {
  try {
    const res = await fetch('/firmware/catalog.json')
    catalog.value = await res.json()
    addLog('Hardware catalog loaded.', 'info')
  } catch (err) {
    addLog(`Error loading catalog manifest: ${err.message}`, 'err')
  }
}

const handleBoardChange = async () => {
  selectedDriverId.value = ''
  selectedVersionId.value = ''
  presetBLTouch.value = false
  presetBedPID.value = false
  presetWiFi.value = false
  activeProfile.value = null
  templateText.value = ''
  configKeys.value = []
  dirHandle.value = null
  configPrefilled.value = false

  if (selectedBoardId.value) {
    const b = boards.value.find(x => x.id === selectedBoardId.value)
    if (b && b.drivers && b.drivers.length > 0) {
      selectedDriverId.value = b.drivers[0].id
      await loadProfile()
    }
  }
}

const handleDriverChange = async () => {
  selectedVersionId.value = ''
  presetBLTouch.value = false
  presetBedPID.value = false
  presetWiFi.value = false
  templateText.value = ''
  configKeys.value = []
  dirHandle.value = null
  configPrefilled.value = false
  await loadProfile()
}

const handleVersionChange = async () => {
  presetBLTouch.value = false
  presetBedPID.value = false
  presetWiFi.value = false
  dirHandle.value = null
  configPrefilled.value = false
  await loadTemplate()
}

const loadProfile = async () => {
  if (!selectedBoardId.value || !selectedDriverId.value) return
  try {
    const path = `/firmware/${selectedBoardId.value}/${selectedDriverId.value}/profile.json`
    const res = await fetch(path)
    activeProfile.value = await res.json()
    addLog(`Board profile loaded: ${selectedBoardId.value} - ${selectedDriverId.value}`, 'info')
    
    if (versions.value.length > 0) {
      selectedVersionId.value = versions.value[0].id
      await loadTemplate()
    }
  } catch (err) {
    addLog(`Error loading profile manifest: ${err.message}`, 'err')
    activeProfile.value = null
  }
}

const loadTemplate = async () => {
  if (!basePath.value || !activeVersion.value) return
  try {
    const path = `${basePath.value}${activeVersion.value.configFile}`
    const res = await fetch(path)
    templateText.value = await res.text()
    
    const lines = templateText.value.split('\n')
    const list = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const parsed = parseConfigLine(line)
      if (parsed) {
        // Extract comment description from rest of line
        const rest = line.substring(line.indexOf(parsed.key) + parsed.key.length).trim()
        let comment = ''
        const hashIndex = rest.indexOf('#')
        if (hashIndex !== -1) {
          comment = rest.substring(hashIndex + 1).trim()
        }
        
        // Find matching schema definition
        const schema = schemaList.find(s => s.key === parsed.key)
        
        list.push({
          key: parsed.key,
          value: parsed.val,
          originalValue: parsed.val, // Revert baseline value tracking
          comment: schema && schema.description ? schema.description : (comment || parsed.key),
          label: schema ? schema.label : parsed.key,
          type: schema ? schema.type : 'string',
          options: schema ? schema.options : null,
          category: schema ? schema.category : 'Other',
          trueValue: schema ? schema.trueValue : '1',
          falseValue: schema ? schema.falseValue : '0',
          isHardware: schema ? !!schema.isHardware : false,
          dependsOn: schema ? schema.dependsOn : null
        })
      }
    }
    
    configKeys.value = list
    syncShortcutsFromConfig()
  } catch (err) {
    addLog(`Error loading configuration template: ${err.message}`, 'err')
  }
}

// Easy mode inputs mapped reactively to fields inside configKeys
const getItem = (key) => {
  return configKeys.value.find(k => k.key === key) || null
}

// Track if a value has been modified relative to originalValue
const isDirty = (item) => {
  if (!item) return false
  return item.value !== item.originalValue
}

// Revert a single parameter back to its baseline
const revertItem = (item) => {
  if (item) {
    item.value = item.originalValue
  }
}

const isItemDisabled = (item) => {
  if (!item) return false
  if (item.dependsOn) {
    const depItem = getItem(item.dependsOn.key)
    return depItem ? depItem.value !== item.dependsOn.value : false
  }
  return false
}

const getWiFiItem = (key) => {
  const item = getItem(key)
  return item || { value: '' }
}

// Handle dynamic feature preset toggles (supports choosing multiple at once)
const handlePresetToggle = (presetName, checked) => {
  let valuesToApply = {}
  
  if (presetName === 'bltouch') {
    if (checked) {
      valuesToApply = {
        'BLTOUCH': '1',
        'BED_LEVELING_METHOD': '3',
        'Z_MIN_PROBE_PIN_MODE': '1',
        'Z_SAFE_HOMING': '1',
        'cfg_leveling_mode': '1',
        'GRID_MAX_POINTS_X': '5',
        'GRID_MAX_POINTS_Y': '5',
        'BACK_PROBE_BED_POSITION': '210',
        'FRONT_PROBE_BED_POSITION': '15',
        'RIGHT_PROBE_BED_POSITION': '200',
        'BED_MAXTEMP': '110'
      }
    } else {
      const keys = ['BLTOUCH', 'BED_LEVELING_METHOD', 'Z_MIN_PROBE_PIN_MODE', 'Z_SAFE_HOMING', 'cfg_leveling_mode', 'GRID_MAX_POINTS_X', 'GRID_MAX_POINTS_Y', 'BACK_PROBE_BED_POSITION', 'FRONT_PROBE_BED_POSITION', 'RIGHT_PROBE_BED_POSITION', 'BED_MAXTEMP']
      keys.forEach(k => {
        const item = getItem(k)
        if (item) item.value = item.originalValue
      })
      return
    }
  } else if (presetName === 'bedpid') {
    if (checked) {
      valuesToApply = {
        'PIDTEMPBED': '1'
      }
    } else {
      const item = getItem('PIDTEMPBED')
      if (item) item.value = item.originalValue
      return
    }
  } else if (presetName === 'wifi') {
    if (checked) {
      valuesToApply = {
        'CFG_WIFI_MODE': '0',
        'DISABLE_WIFI': '0'
      }
    } else {
      const keys = ['CFG_WIFI_MODE', 'DISABLE_WIFI', 'CFG_WIFI_AP_NAME', 'CFG_WIFI_KEY_CODE']
      keys.forEach(k => {
        const item = getItem(k)
        if (item) item.value = item.originalValue
      })
      return
    }
  }

  for (const [k, v] of Object.entries(valuesToApply)) {
    const item = getItem(k)
    if (item) {
      item.value = v
    }
  }
}

// Shortcuts Manager States & Handlers
const activeShortcutTab = ref('idle') // 'idle' | 'printing'

const shortcutTemplates = [
  { name: 'None', cmd: 'empty', icon: '❌' },
  { name: 'Preheat PLA', cmd: 'M140 S60;M104 S200;', icon: '🔥' },
  { name: 'Preheat PETG', cmd: 'M140 S85;M104 S240;', icon: '♨️' },
  { name: 'Cooldown All', cmd: 'M140 S0;M104 S0;', icon: '❄️' },
  { name: 'Disable Motors', cmd: 'M84;', icon: '🔓' },
  { name: 'Home All', cmd: 'G28;', icon: '🏠' },
  { name: 'PID Autotune Extruder', cmd: 'M303 E0 S210 U1;M500;', icon: '⚙️' },
  { name: 'PID Autotune Bed', cmd: 'M303 E-1 S60 U1;M500;', icon: '🌡️' },
  { name: 'Mesh Bed Leveling', cmd: 'G29;', icon: '📐' },
  { name: 'Filament Load', cmd: 'M701;', icon: '📥' },
  { name: 'Filament Unload', cmd: 'M702;', icon: '📤' },
  { name: 'Custom G-code', cmd: 'G1 X0 Y0 F3000;', icon: '⌨️' }
]

const printShortcutTemplates = [
  { name: 'None', cmd: 'empty', icon: '❌' },
  { name: 'Pause/Filament Chg', cmd: 'M600;', icon: '🔄' },
  { name: 'Fan 100%', cmd: 'M106 S255;', icon: '🌀' },
  { name: 'Fan Off', cmd: 'M106 S0;', icon: '🛑' },
  { name: 'Cooldown All', cmd: 'M140 S0;M104 S0;', icon: '❄️' },
  { name: 'Extrude 5mm', cmd: 'G91;G1 E5 F100;G90;', icon: '📥' },
  { name: 'Retract 5mm', cmd: 'G91;G1 E-5 F100;G90;', icon: '📤' },
  { name: 'Babystep Up 0.05', cmd: 'M290 Z0.05;', icon: '⬆️' },
  { name: 'Babystep Down 0.05', cmd: 'M290 Z-0.05;', icon: '⬇️' },
  { name: 'Custom G-code', cmd: 'M117 Printing...;', icon: '⌨️' }
]

const idleShortcuts = ref([
  { id: 1, name: 'Preheat PLA', cmd: 'M140 S60;M104 S200;', icon: '🔥', isCustom: false },
  { id: 2, name: 'Preheat PETG', cmd: 'M140 S85;M104 S240;', icon: '♨️', isCustom: false },
  { id: 3, name: 'Cooldown All', cmd: 'M140 S0;M104 S0;', icon: '❄️', isCustom: false },
  { id: 4, name: 'Disable Motors', cmd: 'M84;', icon: '🔓', isCustom: false },
  { id: 5, name: 'Home All', cmd: 'G28;', icon: '🏠', isCustom: false },
  { id: 6, name: 'PID Extruder', cmd: 'M303 E0 S210 U1;M500;', icon: '⚙️', isCustom: false },
  { id: 7, name: 'PID Bed', cmd: 'M303 E-1 S60 U1;M500;', icon: '🌡️', isCustom: false }
])

const printShortcuts = ref([
  { id: 1, name: 'Pause/Filament', cmd: 'M600;', icon: '🔄', isCustom: false },
  { id: 2, name: 'Fan 100%', cmd: 'M106 S255;', icon: '🌀', isCustom: false },
  { id: 3, name: 'Fan Off', cmd: 'M106 S0;', icon: '🛑', isCustom: false },
  { id: 4, name: 'Cooldown All', cmd: 'M140 S0;M104 S0;', icon: '❄️', isCustom: false },
  { id: 5, name: 'Extrude 5mm', cmd: 'G91;G1 E5 F100;G90;', icon: '📥', isCustom: false },
  { id: 6, name: 'Retract 5mm', cmd: 'G91;G1 E-5 F100;G90;', icon: '📤', isCustom: false },
  { id: 7, name: 'Babystep Up', cmd: 'M290 Z0.05;', icon: '⬆️', isCustom: false }
])

const currentShortcuts = computed(() => {
  return activeShortcutTab.value === 'idle' ? idleShortcuts.value : printShortcuts.value
})

const currentTemplates = computed(() => {
  return activeShortcutTab.value === 'idle' ? shortcutTemplates : printShortcutTemplates
})

const dragIdx = ref(null)
const onDragStart = (idx) => {
  dragIdx.value = idx
}
const onDrop = (targetIdx) => {
  if (dragIdx.value === null) return
  const list = activeShortcutTab.value === 'idle' ? idleShortcuts.value : printShortcuts.value
  const item = list.splice(dragIdx.value, 1)[0]
  list.splice(targetIdx, 0, item)
  dragIdx.value = null
  updateConfigShortcuts()
}

const selectShortcutPreset = (idx, name) => {
  const list = activeShortcutTab.value === 'idle' ? idleShortcuts.value : printShortcuts.value
  const templates = activeShortcutTab.value === 'idle' ? shortcutTemplates : printShortcutTemplates
  
  if (name === 'custom') {
    list[idx].name = 'Custom'
    list[idx].cmd = activeShortcutTab.value === 'idle' ? 'G1 X0 Y0 F3000;' : 'M117 Printing...;'
    list[idx].icon = '⌨️'
    list[idx].isCustom = true
  } else {
    const found = templates.find(t => t.name === name)
    if (found) {
      list[idx].name = found.name
      list[idx].cmd = found.cmd
      list[idx].icon = found.icon
      list[idx].isCustom = false
    }
  }
  updateConfigShortcuts()
}

const updateConfigShortcuts = () => {
  const idleCnt = getItem('moreitem_pic_cnt')
  if (idleCnt) idleCnt.value = '7'
  
  idleShortcuts.value.forEach((sc, idx) => {
    const keyName = `moreitem_button${idx + 1}_cmd`
    const item = getItem(keyName)
    if (item) {
      item.value = sc.cmd
    }
  })

  const printCnt = getItem('morefunc_cnt')
  if (printCnt) printCnt.value = '7'

  printShortcuts.value.forEach((sc, idx) => {
    const keyName = `morefunc${idx + 1}_cmd`
    const item = getItem(keyName)
    if (item) {
      item.value = sc.cmd
    }
  })
}

const syncShortcutsFromConfig = () => {
  // Sync Idle Shortcuts
  for (let i = 1; i <= 7; i++) {
    const item = getItem(`moreitem_button${i}_cmd`)
    if (item) {
      const found = shortcutTemplates.find(t => t.cmd === item.value)
      if (found) {
        idleShortcuts.value[i - 1] = {
          id: i,
          name: found.name,
          cmd: item.value,
          icon: found.icon,
          isCustom: false
        }
      } else {
        idleShortcuts.value[i - 1] = {
          id: i,
          name: 'Custom',
          cmd: item.value,
          icon: '⌨️',
          isCustom: true
        }
      }
    }
  }

  // Sync Printing Shortcuts
  for (let i = 1; i <= 7; i++) {
    const item = getItem(`morefunc${i}_cmd`)
    if (item) {
      const found = printShortcutTemplates.find(t => t.cmd === item.value)
      if (found) {
        printShortcuts.value[i - 1] = {
          id: i,
          name: found.name,
          cmd: item.value,
          icon: found.icon,
          isCustom: false
        }
      } else {
        printShortcuts.value[i - 1] = {
          id: i,
          name: 'Custom',
          cmd: item.value,
          icon: '⌨️',
          isCustom: true
        }
      }
    }
  }
}

// Toggle collapsible categories
const toggleCategory = (cat) => {
  collapsedCategories.value[cat] = !collapsedCategories.value[cat]
}

// Handle Custom Switch logic
const toggleBooleanItem = (item) => {
  if (isItemDisabled(item)) return
  item.value = (item.value === item.trueValue) ? item.falseValue : item.trueValue
}

// Search and categorize full config list for Expert Mode
const filteredCategories = computed(() => {
  const groups = {}
  
  // Enforce ordering of categories
  const categoriesOrdered = [
    'Base settings',
    'Stepper Motor Settings',
    'Thermal Settings',
    'Thermal Runaway Protection',
    'Endstop  Settings',
    'Home settings',
    'Z Probe Settings',
    'Advanced  Settings',
    'Bed Leveling',
    'Heatbed Leveling',
    'Delta Settings',
    'Wireless',
    'Display Effect(refer to MKS TFT datasheet)',
    'Display Customization',
    'Other'
  ]
  categoriesOrdered.forEach(c => { groups[c] = [] })

  const query = searchQuery.value.toLowerCase()

  for (const item of configKeys.value) {
    // If search active, check if matches key or comment description
    if (query && !item.key.toLowerCase().includes(query) && !item.comment.toLowerCase().includes(query)) {
      continue
    }

    const cat = item.category || 'Other'
    if (!groups[cat]) {
      groups[cat] = []
    }
    groups[cat].push(item)
  }

  // Remove empty categories from display
  for (const cat in groups) {
    if (groups[cat].length === 0) {
      delete groups[cat]
    }
  }

  return groups
})

const selectDirectory = async () => {
  try {
    addLog('Requesting SD Card folder picker...', 'info')
    const handle = await window.showDirectoryPicker()
    dirHandle.value = handle
    addLog(`Target directory selected: ${handle.name}`, 'success')

    // Read config file if present (.CUR or .txt)
    let fileHandle
    let found = false
    try {
      fileHandle = await handle.getFileHandle(activeVersion.value.configFile.replace('.txt', '.CUR'))
      found = true
      prefilledFileName.value = activeVersion.value.configFile.replace('.txt', '.CUR')
      addLog(`Found existing configuration: ${prefilledFileName.value}`, 'info')
    } catch (e) {
      try {
        fileHandle = await handle.getFileHandle(activeVersion.value.configFile)
        found = true
        prefilledFileName.value = activeVersion.value.configFile
        addLog(`Found existing configuration: ${prefilledFileName.value}`, 'info')
      } catch (err) {}
    }

    if (found) {
      const file = await fileHandle.getFile()
      const text = await file.text()
      const lines = text.split('\n')
      let loadedCount = 0

      for (const line of lines) {
        const parsed = parseConfigLine(line)
        if (parsed) {
          const item = configKeys.value.find(k => k.key === parsed.key)
          if (item) {
            item.value = parsed.val
            loadedCount++
          }
        }
      }
      addLog(`Prefilled ${loadedCount} values from old SD card config.`, 'success')
      configPrefilled.value = true

      // Sync preset toggles based on prefilled values
      const blItem = getItem('BLTOUCH')
      if (blItem) presetBLTouch.value = (blItem.value === '1')

      const pidItem = getItem('PIDTEMPBED')
      if (pidItem) presetBedPID.value = (pidItem.value === '1')

      const wifiItem = getItem('CFG_WIFI_MODE')
      const disableWifiItem = getItem('DISABLE_WIFI')
      if (wifiItem && disableWifiItem) {
        presetWiFi.value = (wifiItem.value === '0' && disableWifiItem.value === '0')
      }

      syncShortcutsFromConfig()
    }
  } catch (err) {
    addLog(`Directory picker error: ${err.message}`, 'err')
    console.error(err)
  }
}

const cleanFolder = async (dirHandle) => {
  try {
    await dirHandle.remove({ recursive: true })
  } catch (err) {
    // If blocked (e.g. NoModificationAllowedError due to locks or OS metadata), clean contents individually
    for await (const entry of dirHandle.values()) {
      try {
        if (entry.kind === 'file') {
          await dirHandle.removeEntry(entry.name)
        } else if (entry.kind === 'directory') {
          const subDir = await dirHandle.getDirectoryHandle(entry.name, { create: false })
          await cleanFolder(subDir)
          try {
            await dirHandle.removeEntry(entry.name)
          } catch (e) {}
        }
      } catch (entryErr) {
        console.warn(`Failed to remove entry ${entry.name}: ${entryErr.message}`)
      }
    }
  }
}

const startFlash = async () => {
  if (!dirHandle.value || !activeVersion.value) {
    addLog('ERROR: Choose SD Card directory first.', 'err')
    return
  }
  if (flashing.value) return
  flashing.value = true
  showFlashModal.value = true
  flashStatus.value = 'progress'
  flashErrorMessage.value = ''
  progress.value = 0
  statusText.value = 'Preparing...'
  clearLogs()

  try {
    const handle = dirHandle.value
    addLog(`Starting write pipeline to: ${handle.name}`, 'info')

    // 1. Clean target files and folders
    addLog('Cleaning previous firmware and screen files from SD card...', 'warn')
    statusText.value = 'Cleaning target...'
    
    // Clean all common firmware files to prevent mixups
    const filesToCleanup = [
      'Robin_nano35.bin', 'ROBIN_NANO35.CUR', 'robin_nano35.cur', 'mks_pft.sys',
      'Robin_nano_v3.bin', 'ROBIN_NANO_V3.CUR', 'robin_nano_v3.cur',
      'robin_nano35_cfg.txt', 'robin_nano35_cfg.CUR', 'robin_nano35_cfg.cur',
      'robin_nano_v3_cfg.txt', 'robin_nano_v3_cfg.CUR', 'robin_nano_v3_cfg.cur'
    ]
    for (const file of filesToCleanup) {
      try {
        await handle.removeEntry(file)
        addLog(`Cleaned file: ${file}`)
      } catch (err) {}
    }

    const foldersToCleanup = ['mks_pic', 'mks_font', 'bak_pic', 'bak_font', 'assets', 'bak_assets']
    for (const folder of foldersToCleanup) {
      try {
        const subDir = await handle.getDirectoryHandle(folder, { create: false })
        // Use recursive file-by-file cleaning fallback if direct remove is locked
        await cleanFolder(subDir)
        
        // Try deleting the empty parent directory
        try {
          await handle.removeEntry(folder, { recursive: true })
        } catch (e) {}
        
        addLog(`Cleaned folder: ${folder}/`)
      } catch (err) {
        if (err.name === 'NotFoundError') {
          addLog(`Folder ${folder}/ not found on disk, safe to ignore`)
          continue
        }
        addLog(`Failed to clean folder ${folder}/: ${err.message}`, 'err')
      }
    }

    // 2. Fetch manifest
    addLog('Downloading system file manifest...', 'info')
    statusText.value = 'Loading manifest...'
    const manifestResp = await fetch(`${basePath.value}manifest.json`)
    const manifest = await manifestResp.json()
    addLog(`Manifest parsed successfully.`, 'info')

    // 3. Determine binary path
    const binFileToCopy = activeVersion.value.binFile

    addLog(`Downloading firmware binary (${binFileToCopy})...`, 'info')
    statusText.value = 'Downloading firmware...'
    const binResp = await fetch(`${basePath.value}${binFileToCopy}`)
    const binBlob = await binResp.blob()
    
    // We write the binary using its clean name on the SD Card (so the bootloader detects it)
    addLog(`Writing ${activeVersion.value.binFile} to SD root...`, 'info')
    const binHandle = await handle.getFileHandle(activeVersion.value.binFile, { create: true })
    const binWritable = await binHandle.createWritable()
    await binWritable.write(binBlob)
    await binWritable.close()
    addLog('Firmware binary written successfully.', 'success')

    // 4. Generate patched config file content and write it
    addLog('Patching configuration parameters...', 'info')
    statusText.value = 'Generating config...'
    const templateLines = templateText.value.split('\n')

    const outputLines = templateLines.map(line => {
      const parsed = parseConfigLine(line)
      if (parsed) {
        const item = configKeys.value.find(k => k.key === parsed.key)
        if (item) {
          const keyWithBracket = `>${item.key}`
          const commentStr = item.comment ? `# ${item.comment}` : ''
          const useColon = line.includes(`${item.key}:`)
          if (useColon) {
            return `${keyWithBracket}:${item.value} ${commentStr}`.trimEnd()
          } else {
            const paddedKey = keyWithBracket.padEnd(40, ' ')
            const paddedValue = String(item.value).padEnd(8, ' ')
            return `${paddedKey}${paddedValue} ${commentStr}`.trimEnd()
          }
        }
      }
      return line
    })

    addLog(`Writing custom ${activeVersion.value.configFile} to SD root...`, 'info')
    const cfgHandle = await handle.getFileHandle(activeVersion.value.configFile, { create: true })
    const cfgWritable = await cfgHandle.createWritable()
    await cfgWritable.write(outputLines.join('\n'))
    await cfgWritable.close()
    addLog('Configuration file written successfully.', 'success')

    // 5. Copy mapped assets folders
    let totalAssetsCopied = 0
    let totalFilesCount = 0
    for (const asset of activeVersion.value.assets) {
      if (manifest[asset.source]) totalFilesCount += manifest[asset.source].length
    }

    for (const asset of activeVersion.value.assets) {
      addLog(`Creating ${asset.target}/ folder...`, 'info')
      const targetDirHandle = await handle.getDirectoryHandle(asset.target, { create: true })
      const files = manifest[asset.source] || []
      const totalFiles = files.length
      addLog(`Copying ${totalFiles} files from ${asset.source}/...`, 'info')
      
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i]
        totalAssetsCopied++
        statusText.value = `Copying: ${totalAssetsCopied}/${totalFilesCount}`
        progress.value = Math.round((totalAssetsCopied / totalFilesCount) * 100)

        const fileResp = await fetch(`${basePath.value}${asset.source}/${file}`)
        const fileBlob = await fileResp.blob()
        const fileHandle = await targetDirHandle.getFileHandle(file, { create: true })
        const writable = await fileHandle.createWritable()
        await writable.write(fileBlob)
        await writable.close()
      }
      addLog(`Asset directory ${asset.target}/ written successfully.`, 'success')
    }

    progress.value = 100
    statusText.value = 'Completed'
    addLog('SUCCESS! All files prepared and copied to SD card.', 'success')
    addLog('ACTION: Eject card manually, insert into printer, and boot.', 'success')
    flashStatus.value = 'success'
  } catch (err) {
    addLog(`ERROR: ${err.message}`, 'err')
    console.error(err)
    statusText.value = 'Failed'
    flashStatus.value = 'error'
    flashErrorMessage.value = err.message
  } finally {
    flashing.value = false
  }
}
</script>

<style>
/* Custom scrollbar styling for terminal console */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #020617;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
