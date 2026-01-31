'use client'

import { motion } from 'framer-motion'
import { formatDuration } from '@/lib/techniques'

interface TimerProps {
  elapsed: number
  total: number
  cycle: number
  totalCycles: number
  quietMode?: boolean
}

export function Timer({ elapsed, total, cycle, totalCycles, quietMode = false }: TimerProps) {
  const remaining = Math.max(0, total - elapsed)
  const progress = total > 0 ? (elapsed / total) * 100 : 0

  return (
    <motion.div
      className={`flex flex-col items-center gap-4 ${quietMode ? 'quiet-mode' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Progress bar */}
      <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-arctic to-arctic-light rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6 md:gap-8 text-slate-light">
        <div className="text-center min-w-[4.5rem]">
          <p className="text-[10px] uppercase tracking-wider mb-0.5 opacity-70">Elapsed</p>
          <motion.p
            className="font-mono text-base md:text-lg text-white"
            key={Math.floor(elapsed)}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
          >
            {formatDuration(Math.floor(elapsed))}
          </motion.p>
        </div>

        {/* Cycle indicator - more prominent */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider mb-0.5 opacity-70">Cycle</p>
          <div className="flex items-center gap-1">
            <motion.span
              className="font-mono text-lg md:text-xl text-white font-semibold"
              key={cycle}
              initial={{ scale: 1.2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {cycle}
            </motion.span>
            <span className="text-slate text-sm">/</span>
            <span className="font-mono text-base text-slate-light">{totalCycles}</span>
          </div>
        </div>

        <div className="text-center min-w-[4.5rem]">
          <p className="text-[10px] uppercase tracking-wider mb-0.5 opacity-70">Remaining</p>
          <motion.p
            className="font-mono text-base md:text-lg text-white"
            key={Math.floor(remaining)}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
          >
            {formatDuration(Math.floor(remaining))}
          </motion.p>
        </div>
      </div>

      {/* Cycle progress dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalCycles }, (_, i) => (
          <motion.div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              i < cycle
                ? 'bg-arctic'
                : i === cycle - 1
                ? 'bg-arctic'
                : 'bg-white/20'
            }`}
            initial={i === cycle - 1 ? { scale: 0 } : undefined}
            animate={i === cycle - 1 ? { scale: 1 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
