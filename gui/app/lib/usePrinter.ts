import { ref } from 'vue'

const connectionType = ref<'usb' | 'wifi'>('usb')
const connected = ref(false)
const printerIp = ref('mkswifi')

const port = ref<any>(null)
const socket = ref<WebSocket | null>(null)
const isWaitingForOk = ref(false)
const commandQueue = ref<string[]>([])
const logs = ref<any[]>([])

let reader: any = null
let keepReading = true
let readableStreamClosed: any = null
let lineBuffer = ''
let activeOnLineReceived: ((line: string) => void) | null = null

if (typeof window !== 'undefined') {
  const savedIp = localStorage.getItem('mks_printer_ip')
  if (savedIp) printerIp.value = savedIp
  
  const savedType = localStorage.getItem('mks_connection_type')
  if (savedType === 'usb' || savedType === 'wifi') {
    connectionType.value = savedType as any
  }
}

export function usePrinter(onLineReceived: (line: string) => void) {
  activeOnLineReceived = onLineReceived

  const setConnectionType = (type: 'usb' | 'wifi') => {
    connectionType.value = type
    if (typeof window !== 'undefined') {
      localStorage.setItem('mks_connection_type', type)
    }
  }

  const setPrinterIp = (ip: string) => {
    printerIp.value = ip
    if (typeof window !== 'undefined') {
      localStorage.setItem('mks_printer_ip', ip)
    }
  }

  const addLog = (text: string, type = 'info') => {
    // Filter out temperature queries and reports from serial logs
    if (type === 'serial') {
      const cleanText = text.trim()
      if (
        cleanText.includes('echo:enqueueing "M105"') ||
        cleanText.startsWith('ok T:') ||
        /^T:\d+/.test(cleanText)
      ) {
        return
      }
    }
    
    // Also filter outgoing M105 commands from UI logs
    if (type === 'info' && text === '> M105') {
      return
    }

    const time = new Date().toLocaleTimeString()
    logs.value.push({ time, text, type })
    
    if (type === 'err') console.error(`[${time}] ${text}`)
    else if (type === 'warn') console.warn(`[${time}] ${text}`)
    else console.log(`[${time}] ${text}`)
  }

  const clearLogs = () => {
    logs.value = []
  }

  const handleIncomingData = (text: string) => {
    lineBuffer += text
    const lines = lineBuffer.split('\n')
    lineBuffer = lines.pop() || ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed) {
        addLog(trimmed, 'serial')
        
        const cleanLine = trimmed.toLowerCase()
        if (cleanLine === 'ok' || cleanLine.startsWith('ok ')) {
          isWaitingForOk.value = false
          processQueue()
        }
        
        if (activeOnLineReceived) {
          activeOnLineReceived(trimmed)
        }
      }
    }
  }

  const readLoop = async () => {
    try {
      const textDecoder = new TextDecoderStream()
      readableStreamClosed = port.value.readable.pipeTo(textDecoder.writable)
      reader = textDecoder.readable.getReader()

      while (keepReading) {
        const { value, done } = await reader.read()
        if (done) break
        if (value) {
          handleIncomingData(value)
        }
      }
    } catch (err: any) {
      if (connected.value) {
        addLog('Stream read error: ' + err.message, 'err')
      }
    } finally {
      if (reader) {
        reader.releaseLock()
      }
    }
  }

  const connectSerial = async () => {
    try {
      addLog('Requesting USB Serial port...', 'info')
      port.value = await (navigator as any).serial.requestPort({ filters: [{ usbVendorId: 0x1a86 }] })
      await port.value.open({ baudRate: 115200 })
      connected.value = true
      keepReading = true
      readLoop()
      addLog('Printer connected successfully over USB.', 'success')
      enqueueGcode('M503')
    } catch (err: any) {
      addLog('USB Connection failed: ' + err.message, 'err')
      throw err
    }
  }

  const connectWifi = async () => {
    return new Promise<void>((resolve, reject) => {
      try {
        const wsUrl = `ws://${printerIp.value}:81`
        addLog(`Connecting directly to WebSocket: ${wsUrl}...`, 'info')
        const ws = new WebSocket(wsUrl)
        
        ws.onopen = () => {
          socket.value = ws
          connected.value = true
          addLog(`Printer connected directly over WebSocket at ${printerIp.value}.`, 'success')
          enqueueGcode('M503')
          resolve()
        }

        ws.onmessage = (event) => {
          handleIncomingData(event.data)
        }

        ws.onerror = (err) => {
          addLog('WebSocket error encountered.', 'err')
          if (!connected.value) {
            reject(new Error('WebSocket connection error'))
          }
        }

        ws.onclose = () => {
          addLog('WebSocket connection closed.', 'warn')
          disconnect()
        }
      } catch (err: any) {
        addLog('WebSocket creation failed: ' + err.message, 'err')
        reject(err)
      }
    })
  }

  const connect = async () => {
    if (connectionType.value === 'usb') {
      await connectSerial()
    } else if (connectionType.value === 'wifi') {
      await connectWifi()
    }
  }

  const disconnect = async () => {
    keepReading = false
    if (reader) {
      try {
        await reader.cancel()
      } catch (err) {}
    }
    if (readableStreamClosed) {
      try {
        await readableStreamClosed
      } catch (err) {}
    }
    if (port.value) {
      try {
        await port.value.close()
      } catch (err) {}
      port.value = null
    }
    if (socket.value) {
      try {
        socket.value.close()
      } catch (err) {}
      socket.value = null
    }
    connected.value = false
    isWaitingForOk.value = false
    commandQueue.value = []
    addLog('Printer disconnected.', 'warn')
  }

  const enqueueGcode = (cmd: string) => {
    commandQueue.value.push(cmd)
    processQueue()
  }

  const processQueue = async () => {
    if (commandQueue.value.length === 0 || isWaitingForOk.value) return
    const cmd = commandQueue.value.shift() as string
    isWaitingForOk.value = true
    await sendGcode(cmd)
  }

  const sendGcode = async (cmd: string) => {
    if (!connected.value) {
      addLog('Write failed: No connection', 'err')
      return
    }

    if (connectionType.value === 'usb') {
      if (!port.value || !port.value.writable) {
        addLog('Write failed: Serial port closed', 'err')
        return
      }
      const encoder = new TextEncoder()
      const writer = port.value.writable.getWriter()
      try {
        await writer.write(encoder.encode(cmd + '\n'))
        addLog(`> ${cmd}`, 'info')
      } catch (err: any) {
        addLog('Write error: ' + err.message, 'err')
        isWaitingForOk.value = false
        processQueue()
      } finally {
        writer.releaseLock()
      }
    } else if (connectionType.value === 'wifi') {
      if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
        addLog('Write failed: WebSocket not open', 'err')
        isWaitingForOk.value = false
        processQueue()
        return
      }
      try {
        socket.value.send(cmd + '\n')
        addLog(`> ${cmd}`, 'info')
      } catch (err: any) {
        addLog('WebSocket send error: ' + err.message, 'err')
        isWaitingForOk.value = false
        processQueue()
      }
    }
  }

  return {
    connectionType,
    connected,
    printerIp,
    logs,
    isWaitingForOk,
    commandQueue,
    setConnectionType,
    setPrinterIp,
    connect,
    disconnect,
    enqueueGcode,
    addLog,
    clearLogs
  }
}
