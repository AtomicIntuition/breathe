'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Phase } from '@/lib/techniques'

interface BreathingGuideRingProps {
  phase: Phase | null
  phaseProgress: number
  isActive: boolean
  isPaused: boolean
  size?: number
  strokeWidth?: number
}

const phaseColors: Record<Phase, { primary: string; glow: string }> = {
  inhale: {
    primary: '#4A90D9',
    glow: 'rgba(74, 144, 217, 0.6)',
  },
  hold: {
    primary: '#C9A227',
    glow: 'rgba(201, 162, 39, 0.6)',
  },
  exhale: {
    primary: '#64748B',
    glow: 'rgba(100, 116, 139, 0.5)',
  },
  holdAfterExhale: {
    primary: '#A88B32',
    glow: 'rgba(168, 139, 50, 0.5)',
  },
}

export function BreathingGuideRing({
  phase,
  phaseProgress,
  isActive,
  isPaused,
  size = 260,
  strokeWidth = 2.5,
}: BreathingGuideRingProps) {
  const radius = (size - strokeWidth * 4) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (phaseProgress / 100) * circumference

  const colors = phase ? phaseColors[phase] : phaseColors.inhale
  const trackOpacity = isActive && !isPaused ? 0.15 : 0.08
  const isHoldPhase = phase === 'hold' || phase === 'holdAfterExhale'

  // Unique gradient IDs
  const gradientId = useMemo(() => `ring-gradient-${Math.random().toString(36).slice(2)}`, [])
  const glowFilterId = useMemo(() => `ring-glow-${Math.random().toString(36).slice(2)}`, [])

  if (!isActive) return null

  return (
    <div
      className="absolute flex items-center justify-center pointer-events-none"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="absolute"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <defs>
          {/* Gradient for the progress arc */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
            <stop offset="50%" stopColor={colors.primary} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.primary} stopOpacity="0.4" />
          </linearGradient>

          {/* Glow filter */}
          <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer ambient ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 6}
          fill="none"
          stroke={colors.primary}
          strokeWidth={1}
          opacity={0.1}
        />

        {/* Track ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          opacity={trackOpacity}
        />

        {/* Progress arc - main */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={isPaused ? undefined : offset}
          strokeLinecap="round"
          filter={`url(#${glowFilterId})`}
          initial={false}
          animate={{
            strokeDashoffset: offset,
            opacity: isPaused ? 0.4 : 0.9,
          }}
          transition={{
            strokeDashoffset: { duration: 0.15, ease: 'linear' },
            opacity: { duration: 0.3 },
          }}
        />

        {/* Inner glow ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 4}
          fill="none"
          stroke={colors.glow}
          strokeWidth={1}
          initial={false}
          animate={{
            opacity: isPaused ? 0.1 : isHoldPhase ? [0.2, 0.4, 0.2] : 0.25,
          }}
          transition={{
            opacity: isHoldPhase
              ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 },
          }}
        />

        {/* Progress indicator dot */}
        {!isPaused && (
          <motion.circle
            cx={size / 2 + radius * Math.cos(((-90 + (phaseProgress / 100) * 360) * Math.PI) / 180)}
            cy={size / 2 + radius * Math.sin(((-90 + (phaseProgress / 100) * 360) * Math.PI) / 180)}
            r={isHoldPhase ? strokeWidth * 2 : strokeWidth * 1.5}
            fill={colors.primary}
            filter={`url(#${glowFilterId})`}
            animate={
              isHoldPhase
                ? {
                    r: [strokeWidth * 2, strokeWidth * 2.5, strokeWidth * 2],
                    opacity: [0.7, 1, 0.7],
                  }
                : {
                    opacity: [0.8, 1, 0.8],
                  }
            }
            transition={{
              duration: isHoldPhase ? 1.5 : 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Trail effect for moving phases */}
        {!isHoldPhase && !isPaused && phaseProgress > 5 && (
          <>
            {[0.2, 0.4, 0.6].map((offset, i) => {
              const trailProgress = Math.max(0, phaseProgress - offset * 10)
              const angle = (-90 + (trailProgress / 100) * 360) * Math.PI / 180
              return (
                <circle
                  key={i}
                  cx={size / 2 + radius * Math.cos(angle)}
                  cy={size / 2 + radius * Math.sin(angle)}
                  r={strokeWidth * (1 - offset * 0.5)}
                  fill={colors.primary}
                  opacity={0.3 - offset * 0.25}
                />
              )
            })}
          </>
        )}
      </svg>

      {/* Phase indicator glow underneath */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.92,
          height: size * 0.92,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
        }}
        animate={{
          opacity: isPaused ? 0.1 : isHoldPhase ? [0.15, 0.25, 0.15] : 0.2,
          scale: isHoldPhase ? [1, 1.02, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isHoldPhase ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
