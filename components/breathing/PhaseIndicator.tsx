'use client'

import { motion } from 'framer-motion'
import { Phase, BreathingPhase } from '@/lib/techniques'
import { clsx } from 'clsx'

interface PhaseIndicatorProps {
  phases: BreathingPhase[]
  currentPhaseIndex: number
  isActive: boolean
  phaseProgress?: number
}

const phaseColors: Record<Phase, { bg: string; glow: string }> = {
  inhale: {
    bg: 'bg-arctic',
    glow: 'shadow-arctic/50',
  },
  hold: {
    bg: 'bg-gold',
    glow: 'shadow-gold/50',
  },
  holdAfterExhale: {
    bg: 'bg-gold',
    glow: 'shadow-gold/50',
  },
  exhale: {
    bg: 'bg-slate',
    glow: 'shadow-slate/50',
  },
}

const phaseLabels: Record<Phase, string> = {
  inhale: 'In',
  hold: 'Hold',
  exhale: 'Out',
  holdAfterExhale: 'Hold',
}

export function PhaseIndicator({
  phases,
  currentPhaseIndex,
  isActive,
  phaseProgress = 0,
}: PhaseIndicatorProps) {
  const totalDuration = phases.reduce((a, b) => a + b.duration, 0)

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Phase bars */}
      <div className="flex items-center gap-1.5">
        {phases.map((phase, index) => {
          const isCurrent = index === currentPhaseIndex && isActive
          const isComplete = index < currentPhaseIndex && isActive
          const colors = phaseColors[phase.phase]
          const width = Math.max(32, (phase.duration / totalDuration) * 180)

          return (
            <div key={`${phase.phase}-${index}`} className="relative">
              <motion.div
                className={clsx(
                  'h-2 rounded-full transition-all duration-300 overflow-hidden',
                  isComplete ? colors.bg : 'bg-white/20',
                  isCurrent && `shadow-lg ${colors.glow}`
                )}
                style={{ width }}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* Progress fill for current phase */}
                {isCurrent && (
                  <motion.div
                    className={clsx('h-full', colors.bg)}
                    initial={{ width: 0 }}
                    animate={{ width: `${phaseProgress}%` }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                  />
                )}
              </motion.div>

              {/* Phase label */}
              <motion.span
                className={clsx(
                  'absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium transition-opacity duration-200',
                  isCurrent ? 'text-white opacity-100' : 'text-slate-light opacity-0'
                )}
                animate={{ opacity: isCurrent ? 1 : 0 }}
              >
                {phaseLabels[phase.phase]}
              </motion.span>
            </div>
          )
        })}
      </div>

      {/* Duration indicator */}
      <div className="h-4" /> {/* Spacer for labels */}
    </div>
  )
}
