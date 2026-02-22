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
    glow: 'shadow-glow-arctic',
  },
  hold: {
    bg: 'bg-gold',
    glow: 'shadow-glow-gold',
  },
  holdAfterExhale: {
    bg: 'bg-gold',
    glow: 'shadow-glow-gold',
  },
  exhale: {
    bg: 'bg-slate',
    glow: '',
  },
  rest: {
    bg: 'bg-cyan-500',
    glow: 'shadow-glow-cyan',
  },
}

const phaseLabels: Record<Phase, string> = {
  inhale: 'In',
  hold: 'Hold',
  exhale: 'Out',
  holdAfterExhale: 'Hold',
  rest: 'Rest',
}

export function PhaseIndicator({
  phases,
  currentPhaseIndex,
  isActive,
  phaseProgress = 0,
}: PhaseIndicatorProps) {
  const totalDuration = phases.reduce((a, b) => a + b.duration, 0)

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Phase bars */}
      <div className="flex items-center gap-2">
        {phases.map((phase, index) => {
          const isCurrent = index === currentPhaseIndex && isActive
          const isComplete = index < currentPhaseIndex && isActive
          const colors = phaseColors[phase.phase]
          const width = Math.max(36, (phase.duration / totalDuration) * 200)

          return (
            <div key={`${phase.phase}-${index}`} className="relative">
              <motion.div
                className={clsx(
                  'h-2.5 rounded-full transition-all duration-300 overflow-hidden',
                  isComplete ? colors.bg : 'bg-white/[0.12]',
                  isCurrent && colors.glow
                )}
                style={{ width }}
                animate={{
                  scale: isCurrent ? 1.08 : 1,
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
                  'absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-medium tracking-wide transition-opacity duration-200',
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
      <div className="h-5" /> {/* Spacer for labels */}
    </div>
  )
}
