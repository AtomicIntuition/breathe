'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface OximeterState {
  spo2: number | null
  pulseRate: number | null
  isConnected: boolean
  isConnecting: boolean
  deviceName: string | null
  error: string | null
}

// Standard Bluetooth SIG Pulse Oximeter Service
const PLX_SERVICE = 0x1822
const PLX_CONTINUOUS = 0x2A5F
const PLX_SPOT_CHECK = 0x2A5E

// BerryMed BM1000C/E (common consumer oximeter)
const BERRYMED_SERVICE = '49535343-fe7d-4ae5-8fa9-9fafd205e455'
const BERRYMED_NOTIFY = '49535343-1e4d-4bd9-ba61-23c647249616'

// Viatom/Wellue (Nordic UART Service)
const NUS_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
const NUS_TX = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'

// Generic HM-10 module (cheap Chinese oximeters)
const HM10_SERVICE = '0000ffe0-0000-1000-8000-00805f9b34fb'
const HM10_CHAR = '0000ffe1-0000-1000-8000-00805f9b34fb'

// Valid ranges for safety — reject anything outside physiological limits
const SPO2_MIN = 50
const SPO2_MAX = 100
const PR_MIN = 30
const PR_MAX = 250

function isValidSpO2(value: number): boolean {
  return Number.isFinite(value) && value >= SPO2_MIN && value <= SPO2_MAX
}

function isValidPulseRate(value: number): boolean {
  return Number.isFinite(value) && value >= PR_MIN && value <= PR_MAX
}

// Parse IEEE 11073 SFLOAT (16-bit) used by standard BLE health profiles
function parseSFLOAT(raw: number): number {
  // Special values
  if (raw === 0x07FF || raw === 0x0800 || raw === 0x0801) return NaN
  if (raw === 0x07FE) return Infinity
  if (raw === 0x0802) return -Infinity

  let exponent = raw >> 12
  if (exponent >= 8) exponent -= 16

  let mantissa = raw & 0x0FFF
  if (mantissa >= 0x0800) mantissa -= 0x1000

  return mantissa * Math.pow(10, exponent)
}

export function useOximeter() {
  const [state, setState] = useState<OximeterState>({
    spo2: null,
    pulseRate: null,
    isConnected: false,
    isConnecting: false,
    deviceName: null,
    error: null,
  })

  const deviceRef = useRef<BluetoothDevice | null>(null)
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const protocolRef = useRef<'plx' | 'berrymed' | 'nus' | 'hm10' | null>(null)
  const spo2HistoryRef = useRef<number[]>([])
  const prHistoryRef = useRef<number[]>([])

  const handleDisconnect = useCallback(() => {
    characteristicRef.current = null
    protocolRef.current = null
    spo2HistoryRef.current = []
    prHistoryRef.current = []
    setState({
      spo2: null,
      pulseRate: null,
      isConnected: false,
      isConnecting: false,
      deviceName: null,
      error: null,
    })
  }, [])

  const cleanup = useCallback(() => {
    if (characteristicRef.current) {
      try {
        characteristicRef.current.stopNotifications().catch(() => {})
      } catch {}
    }
    if (deviceRef.current) {
      deviceRef.current.removeEventListener('gattserverdisconnected', handleDisconnect)
      if (deviceRef.current.gatt?.connected) {
        deviceRef.current.gatt.disconnect()
      }
    }
    deviceRef.current = null
    characteristicRef.current = null
    protocolRef.current = null
    spo2HistoryRef.current = []
    prHistoryRef.current = []
  }, [handleDisconnect])

  // Smooth readings with a rolling median (more robust than mean for medical data)
  const smoothValue = useCallback((history: number[], newValue: number, maxLen: number = 5): number => {
    history.push(newValue)
    if (history.length > maxLen) history.shift()
    const sorted = [...history].sort((a, b) => a - b)
    return sorted[Math.floor(sorted.length / 2)]
  }, [])

  // Standard PLX data handler
  const handlePLXData = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic
    const value = target.value
    if (!value || value.byteLength < 5) return

    const spo2Raw = parseSFLOAT(value.getUint16(1, true))
    const prRaw = parseSFLOAT(value.getUint16(3, true))

    if (!isValidSpO2(spo2Raw) || !isValidPulseRate(prRaw)) return

    const spo2 = smoothValue(spo2HistoryRef.current, Math.round(spo2Raw))
    const pulseRate = smoothValue(prHistoryRef.current, Math.round(prRaw))

    setState(prev => ({
      ...prev,
      spo2,
      pulseRate,
    }))
  }, [smoothValue])

  // BerryMed data handler (5-byte proprietary packets)
  const handleBerryMedData = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic
    const value = target.value
    if (!value || value.byteLength < 5) return

    const byte2 = value.getUint8(2)
    const byte3 = value.getUint8(3)
    const byte4 = value.getUint8(4)

    const pulseRateRaw = byte3 | ((byte2 & 0x40) << 1)
    const spo2Raw = byte4

    if (!isValidSpO2(spo2Raw) || !isValidPulseRate(pulseRateRaw)) return

    const spo2 = smoothValue(spo2HistoryRef.current, spo2Raw)
    const pulseRate = smoothValue(prHistoryRef.current, pulseRateRaw)

    setState(prev => ({
      ...prev,
      spo2,
      pulseRate,
    }))
  }, [smoothValue])

  // Viatom/NUS data handler (serial-over-BLE with sync word)
  const handleNUSData = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic
    const value = target.value
    if (!value || value.byteLength < 8) return

    // Look for sync word 0xAA 0x55
    for (let i = 0; i < value.byteLength - 7; i++) {
      if (value.getUint8(i) === 0xAA && value.getUint8(i + 1) === 0x55) {
        const typeIndicator = value.getUint8(i + 2)
        if (typeIndicator === 0x0F || typeIndicator === 0xF0) {
          // Check if we have enough bytes for the data type field
          if (i + 6 < value.byteLength) {
            const dataType = value.getUint8(i + 5)
            if (dataType === 8 && i + 8 < value.byteLength) {
              const spo2Raw = value.getUint8(i + 7)
              const prRaw = value.getUint8(i + 8)

              if (!isValidSpO2(spo2Raw) || !isValidPulseRate(prRaw)) continue

              const spo2 = smoothValue(spo2HistoryRef.current, spo2Raw)
              const pulseRate = smoothValue(prHistoryRef.current, prRaw)

              setState(prev => ({
                ...prev,
                spo2,
                pulseRate,
              }))
              return
            }
          }
        }
      }
    }
  }, [smoothValue])

  // Generic HM-10 handler (best-effort: try common byte positions)
  const handleHM10Data = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic
    const value = target.value
    if (!value || value.byteLength < 4) return

    // Common layout: byte positions vary, try most common
    // Many devices put SpO2 at byte 4 and PR at byte 3
    for (let spo2Idx = 0; spo2Idx < value.byteLength; spo2Idx++) {
      const candidate = value.getUint8(spo2Idx)
      if (candidate >= 85 && candidate <= 100) {
        // Likely SpO2 — look for PR nearby
        for (let prIdx = 0; prIdx < value.byteLength; prIdx++) {
          if (prIdx === spo2Idx) continue
          const prCandidate = value.getUint8(prIdx)
          if (isValidPulseRate(prCandidate)) {
            const spo2 = smoothValue(spo2HistoryRef.current, candidate)
            const pulseRate = smoothValue(prHistoryRef.current, prCandidate)

            setState(prev => ({
              ...prev,
              spo2,
              pulseRate,
            }))
            return
          }
        }
      }
    }
  }, [smoothValue])

  // Try to subscribe to a service's characteristic
  const tryService = useCallback(async (
    server: BluetoothRemoteGATTServer,
    serviceUUID: BluetoothServiceUUID,
    charUUID: BluetoothCharacteristicUUID,
    handler: (event: Event) => void,
    protocol: 'plx' | 'berrymed' | 'nus' | 'hm10',
  ): Promise<boolean> => {
    try {
      const service = await server.getPrimaryService(serviceUUID)
      const char = await service.getCharacteristic(charUUID)
      char.addEventListener('characteristicvaluechanged', handler)
      await char.startNotifications()
      characteristicRef.current = char
      protocolRef.current = protocol
      return true
    } catch {
      return false
    }
  }, [])

  const connect = useCallback(async () => {
    // Check browser support
    if (!navigator.bluetooth) {
      setState(prev => ({
        ...prev,
        error: 'Bluetooth not supported in this browser',
      }))
      return
    }

    try {
      cleanup()

      setState(prev => ({
        ...prev,
        isConnecting: true,
        error: null,
      }))

      // Request device — cast filters to satisfy TypeScript's strict typing
      // The browser handles the actual service UUID validation
      const device = await navigator.bluetooth.requestDevice({
        // Accept devices advertising any of these services, OR by common name patterns
        filters: [
          { services: [PLX_SERVICE] },
          { namePrefix: 'BerryMed' },
          { namePrefix: 'PC-60' },
          { namePrefix: 'Viatom' },
          { namePrefix: 'Wellue' },
          { namePrefix: 'OxySmart' },
          { namePrefix: 'Contec' },
          { namePrefix: 'CMS50' },
          { namePrefix: 'Pulse' },
          { namePrefix: 'Oxi' },
          { namePrefix: 'SpO2' },
        ],
        optionalServices: [
          PLX_SERVICE,
          BERRYMED_SERVICE,
          NUS_SERVICE,
          HM10_SERVICE,
        ],
      })

      deviceRef.current = device
      device.addEventListener('gattserverdisconnected', handleDisconnect)

      const server = await device.gatt!.connect()
      const name = device.name || 'Pulse Oximeter'

      // Try each protocol in order (standard first, then proprietary)
      // Each attempt is serialized to avoid GATT operation conflicts
      const connected =
        await tryService(server, PLX_SERVICE, PLX_CONTINUOUS, handlePLXData, 'plx') ||
        await tryService(server, PLX_SERVICE, PLX_SPOT_CHECK, handlePLXData, 'plx') ||
        await tryService(server, BERRYMED_SERVICE, BERRYMED_NOTIFY, handleBerryMedData, 'berrymed') ||
        await tryService(server, NUS_SERVICE, NUS_TX, handleNUSData, 'nus') ||
        await tryService(server, HM10_SERVICE, HM10_CHAR, handleHM10Data, 'hm10')

      if (!connected) {
        device.gatt?.disconnect()
        setState(prev => ({
          ...prev,
          isConnecting: false,
          error: 'Unsupported oximeter model',
        }))
        return
      }

      setState({
        spo2: null,
        pulseRate: null,
        isConnected: true,
        isConnecting: false,
        deviceName: name,
        error: null,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed'
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: message.includes('cancelled') || message.includes('canceled')
          ? null // User cancelled the picker — not an error
          : message.includes('NotFound')
            ? 'No oximeter found nearby'
            : 'Could not connect to oximeter',
      }))
    }
  }, [cleanup, handleDisconnect, tryService, handlePLXData, handleBerryMedData, handleNUSData, handleHM10Data])

  const disconnect = useCallback(() => {
    cleanup()
    setState({
      spo2: null,
      pulseRate: null,
      isConnected: false,
      isConnecting: false,
      deviceName: null,
      error: null,
    })
  }, [cleanup])

  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  return {
    ...state,
    connect,
    disconnect,
    isSupported: typeof navigator !== 'undefined' && !!navigator.bluetooth,
  }
}
