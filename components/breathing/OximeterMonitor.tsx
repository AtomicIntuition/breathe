'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Bluetooth, BluetoothOff, X, Loader2 } from 'lucide-react'

interface OximeterMonitorProps {
  spo2: number | null
  pulseRate: number | null
  isConnected: boolean
  isConnecting: boolean
  deviceName: string | null
  error: string | null
  isSupported: boolean
  onConnect: () => void
  onDisconnect: () => void
  compact?: boolean
}

function SpO2Badge({ spo2 }: { spo2: number }) {
  const color = spo2 >= 95 ? 'text-green-400' : spo2 >= 90 ? 'text-yellow-400' : 'text-red-400'
  return (
    <div className="flex items-center gap-1.5">
      <motion.span
        className={`font-mono text-lg font-semibold tabular-nums ${color}`}
        key={spo2}
        initial={{ opacity: 0.5, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {spo2}
      </motion.span>
      <span className="text-xs text-slate-light">%SpO2</span>
    </div>
  )
}

export function OximeterMonitor({
  spo2,
  pulseRate,
  isConnected,
  isConnecting,
  deviceName,
  error,
  isSupported,
  onConnect,
  onDisconnect,
  compact = false,
}: OximeterMonitorProps) {
  // Not supported — don't render
  if (!isSupported) return null

  // Inactive state — show connect button
  if (!isConnected && !isConnecting && !error) {
    return (
      <motion.button
        onClick={onConnect}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/[0.08] hover:bg-white/10 transition-all text-sm text-slate-light hover:text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bluetooth className="w-4 h-4 text-blue-400" />
        Connect Oximeter
      </motion.button>
    )
  }

  // Connecting state
  if (isConnecting) {
    return (
      <motion.div
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Connecting...
      </motion.div>
    )
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-sm text-red-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <BluetoothOff className="w-4 h-4" />
        {error}
        <button onClick={onDisconnect} className="ml-1 hover:text-white transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    )
  }

  // Connected — compact inline display (during session)
  if (compact) {
    return (
      <motion.div
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/[0.08]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Activity className="w-4 h-4 text-blue-400" />

        {spo2 !== null && pulseRate !== null ? (
          <div className="flex items-center gap-3">
            <SpO2Badge spo2={spo2} />
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <motion.span
                className="font-mono text-lg text-white font-semibold tabular-nums"
                key={pulseRate}
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {pulseRate}
              </motion.span>
              <span className="text-xs text-slate-light">BPM</span>
            </div>
          </div>
        ) : (
          <span className="text-sm text-slate-light">Waiting for data...</span>
        )}

        <button
          onClick={onDisconnect}
          className="ml-1 text-slate hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    )
  }

  // Connected — full display (pre-session)
  return (
    <motion.div
      className="w-full max-w-xs mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="rounded-2xl bg-white/5 border border-white/[0.08] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-white">
              {deviceName || 'Oximeter'}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>
          <button
            onClick={onDisconnect}
            className="text-slate hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {spo2 !== null && pulseRate !== null ? (
            <motion.div
              key="data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="text-center">
                <motion.div
                  className={`font-mono text-4xl font-bold mb-1 ${
                    spo2 >= 95 ? 'text-green-400' : spo2 >= 90 ? 'text-yellow-400' : 'text-red-400'
                  }`}
                  key={spo2}
                  initial={{ opacity: 0.7, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {spo2}
                </motion.div>
                <span className="text-xs text-slate-light uppercase tracking-wider">% SpO2</span>
              </div>
              <div className="text-center">
                <motion.div
                  className="font-mono text-4xl font-bold text-white mb-1"
                  key={pulseRate}
                  initial={{ opacity: 0.7, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {pulseRate}
                </motion.div>
                <span className="text-xs text-slate-light uppercase tracking-wider">BPM</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-2"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-sm text-slate-light">Waiting for readings...</span>
              </div>
              <p className="text-xs text-slate mt-1">
                Make sure the oximeter is on your finger
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
