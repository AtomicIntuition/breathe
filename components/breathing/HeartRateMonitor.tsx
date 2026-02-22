'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X } from 'lucide-react'

interface HeartRateMonitorProps {
  bpm: number | null
  signal: number[]
  isReading: boolean
  isCalibrating: boolean
  fingerDetected: boolean
  error: string | null
  onStart: () => void
  onStop: () => void
  compact?: boolean
}

function SignalGraph({ signal }: { signal: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || signal.length < 10) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)

    // Normalize signal to canvas height
    const min = Math.min(...signal)
    const max = Math.max(...signal)
    const range = max - min || 1

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)'
    ctx.lineWidth = 1.5
    ctx.beginPath()

    for (let i = 0; i < signal.length; i++) {
      const x = (i / (signal.length - 1)) * w
      const y = h - ((signal[i] - min) / range) * h * 0.8 - h * 0.1
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }, [signal])

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={32}
      className="opacity-60"
    />
  )
}

export function HeartRateMonitor({
  bpm,
  signal,
  isReading,
  isCalibrating,
  fingerDetected,
  error,
  onStart,
  onStop,
  compact = false,
}: HeartRateMonitorProps) {
  // Inactive state — show toggle button
  if (!isReading && !error) {
    return (
      <motion.button
        onClick={onStart}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/[0.08] hover:bg-white/10 transition-all text-sm text-slate-light hover:text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart className="w-4 h-4 text-red-400" />
        Monitor Heart Rate
      </motion.button>
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
        <Heart className="w-4 h-4" />
        {error}
        <button onClick={onStop} className="ml-1 hover:text-white transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    )
  }

  // Active reading — compact inline display
  if (compact) {
    return (
      <motion.div
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/[0.08]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          animate={bpm ? {
            scale: [1, 1.3, 1],
          } : {}}
          transition={{
            duration: bpm ? 60 / bpm : 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Heart className="w-4 h-4 text-red-400 fill-red-400" />
        </motion.div>

        {isCalibrating ? (
          <span className="text-sm text-slate-light">Calibrating...</span>
        ) : !fingerDetected ? (
          <span className="text-sm text-slate-light">Place finger on camera</span>
        ) : bpm ? (
          <div className="flex items-center gap-2">
            <motion.span
              className="font-mono text-lg text-white font-semibold tabular-nums"
              key={bpm}
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {bpm}
            </motion.span>
            <span className="text-xs text-slate-light">BPM</span>
            <SignalGraph signal={signal} />
          </div>
        ) : (
          <span className="text-sm text-slate-light">Reading...</span>
        )}

        <button
          onClick={onStop}
          className="ml-1 text-slate hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    )
  }

  // Active reading — full display (pre-session)
  return (
    <motion.div
      className="w-full max-w-xs mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="rounded-2xl bg-white/5 border border-white/[0.08] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={bpm ? {
                scale: [1, 1.3, 1],
              } : {}}
              transition={{
                duration: bpm ? 60 / bpm : 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            </motion.div>
            <span className="text-sm font-medium text-white">Heart Rate</span>
          </div>
          <button
            onClick={onStop}
            className="text-slate hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isCalibrating ? (
            <motion.div
              key="calibrating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-2"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-sm text-yellow-400">Calibrating</span>
              </div>
              <p className="text-xs text-slate-light">
                Place your fingertip over the rear camera
              </p>
            </motion.div>
          ) : !fingerDetected ? (
            <motion.div
              key="no-finger"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-2"
            >
              <p className="text-sm text-slate-light mb-1">
                Cover the rear camera with your fingertip
              </p>
              <p className="text-xs text-slate">
                Press gently — light should shine through your finger
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {bpm ? (
                <div>
                  <motion.div
                    className="font-mono text-4xl font-bold text-white mb-1"
                    key={bpm}
                    initial={{ opacity: 0.7, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {bpm}
                  </motion.div>
                  <span className="text-xs text-slate-light uppercase tracking-wider">BPM</span>
                  <div className="mt-3 flex justify-center">
                    <SignalGraph signal={signal} />
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-sm text-slate-light">Detecting heartbeat...</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
