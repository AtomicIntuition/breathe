'use client'

import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { Phase } from '@/lib/techniques'
import { BreathingGuideRing } from './BreathingGuideRing'
import { BreathingParticles } from './BreathingParticles'

interface BreathingCircleProps {
  phase: Phase | null
  phaseProgress: number
  isActive: boolean
  isPaused: boolean
  timeRemaining: number
  instruction: string
  techniqueId?: string
}

interface PhaseColorConfig {
  primary: string
  secondary: string
  glow: string
  particle: string
  gradient: [string, string, string]
}

// Rich color palettes for each phase - designed for visual harmony
const phaseColors: Record<Phase, PhaseColorConfig> = {
  inhale: {
    primary: 'rgba(74, 144, 217, 0.8)',
    secondary: 'rgba(56, 189, 248, 0.6)',
    glow: 'rgba(74, 144, 217, 0.35)',
    particle: 'rgba(147, 197, 253, 0.9)',
    gradient: ['rgba(74, 144, 217, 0.4)', 'rgba(56, 189, 248, 0.2)', 'transparent'],
  },
  hold: {
    primary: 'rgba(201, 162, 39, 0.8)',
    secondary: 'rgba(251, 191, 36, 0.6)',
    glow: 'rgba(201, 162, 39, 0.35)',
    particle: 'rgba(253, 224, 71, 0.9)',
    gradient: ['rgba(201, 162, 39, 0.4)', 'rgba(251, 191, 36, 0.2)', 'transparent'],
  },
  holdAfterExhale: {
    primary: 'rgba(168, 139, 50, 0.6)',
    secondary: 'rgba(201, 162, 39, 0.4)',
    glow: 'rgba(168, 139, 50, 0.25)',
    particle: 'rgba(253, 224, 71, 0.7)',
    gradient: ['rgba(168, 139, 50, 0.3)', 'rgba(201, 162, 39, 0.15)', 'transparent'],
  },
  exhale: {
    primary: 'rgba(100, 116, 139, 0.7)',
    secondary: 'rgba(148, 163, 184, 0.5)',
    glow: 'rgba(100, 116, 139, 0.25)',
    particle: 'rgba(203, 213, 225, 0.8)',
    gradient: ['rgba(100, 116, 139, 0.3)', 'rgba(148, 163, 184, 0.15)', 'transparent'],
  },
}

// Technique-specific color themes for personality
const techniqueThemes: Record<string, Partial<Record<Phase, PhaseColorConfig>>> = {
  // Purple theme - sleep techniques
  '4-7-8-breathing': {
    inhale: {
      primary: 'rgba(139, 92, 246, 0.8)',
      secondary: 'rgba(167, 139, 250, 0.6)',
      glow: 'rgba(139, 92, 246, 0.35)',
      particle: 'rgba(196, 181, 253, 0.9)',
      gradient: ['rgba(139, 92, 246, 0.4)', 'rgba(167, 139, 250, 0.2)', 'transparent'],
    },
    hold: {
      primary: 'rgba(124, 58, 237, 0.8)',
      secondary: 'rgba(139, 92, 246, 0.6)',
      glow: 'rgba(124, 58, 237, 0.35)',
      particle: 'rgba(196, 181, 253, 0.9)',
      gradient: ['rgba(124, 58, 237, 0.4)', 'rgba(139, 92, 246, 0.2)', 'transparent'],
    },
    exhale: {
      primary: 'rgba(109, 40, 217, 0.7)',
      secondary: 'rgba(124, 58, 237, 0.5)',
      glow: 'rgba(109, 40, 217, 0.3)',
      particle: 'rgba(167, 139, 250, 0.8)',
      gradient: ['rgba(109, 40, 217, 0.35)', 'rgba(124, 58, 237, 0.18)', 'transparent'],
    },
  },
  'military-sleep': {
    inhale: {
      primary: 'rgba(139, 92, 246, 0.8)',
      secondary: 'rgba(167, 139, 250, 0.6)',
      glow: 'rgba(139, 92, 246, 0.35)',
      particle: 'rgba(196, 181, 253, 0.9)',
      gradient: ['rgba(139, 92, 246, 0.4)', 'rgba(167, 139, 250, 0.2)', 'transparent'],
    },
    hold: {
      primary: 'rgba(124, 58, 237, 0.8)',
      secondary: 'rgba(139, 92, 246, 0.6)',
      glow: 'rgba(124, 58, 237, 0.35)',
      particle: 'rgba(196, 181, 253, 0.9)',
      gradient: ['rgba(124, 58, 237, 0.4)', 'rgba(139, 92, 246, 0.2)', 'transparent'],
    },
    exhale: {
      primary: 'rgba(109, 40, 217, 0.7)',
      secondary: 'rgba(124, 58, 237, 0.5)',
      glow: 'rgba(109, 40, 217, 0.3)',
      particle: 'rgba(167, 139, 250, 0.8)',
      gradient: ['rgba(109, 40, 217, 0.35)', 'rgba(124, 58, 237, 0.18)', 'transparent'],
    },
  },
  'sleep-exhale': {
    inhale: {
      primary: 'rgba(139, 92, 246, 0.8)',
      secondary: 'rgba(167, 139, 250, 0.6)',
      glow: 'rgba(139, 92, 246, 0.35)',
      particle: 'rgba(196, 181, 253, 0.9)',
      gradient: ['rgba(139, 92, 246, 0.4)', 'rgba(167, 139, 250, 0.2)', 'transparent'],
    },
    hold: {
      primary: 'rgba(124, 58, 237, 0.7)',
      secondary: 'rgba(139, 92, 246, 0.5)',
      glow: 'rgba(124, 58, 237, 0.3)',
      particle: 'rgba(196, 181, 253, 0.8)',
      gradient: ['rgba(124, 58, 237, 0.35)', 'rgba(139, 92, 246, 0.18)', 'transparent'],
    },
    exhale: {
      primary: 'rgba(109, 40, 217, 0.7)',
      secondary: 'rgba(124, 58, 237, 0.5)',
      glow: 'rgba(109, 40, 217, 0.3)',
      particle: 'rgba(167, 139, 250, 0.8)',
      gradient: ['rgba(109, 40, 217, 0.35)', 'rgba(124, 58, 237, 0.18)', 'transparent'],
    },
  },
  'nsdr': {
    inhale: {
      primary: 'rgba(139, 92, 246, 0.8)',
      secondary: 'rgba(167, 139, 250, 0.6)',
      glow: 'rgba(139, 92, 246, 0.35)',
      particle: 'rgba(196, 181, 253, 0.9)',
      gradient: ['rgba(139, 92, 246, 0.4)', 'rgba(167, 139, 250, 0.2)', 'transparent'],
    },
    hold: {
      primary: 'rgba(124, 58, 237, 0.7)',
      secondary: 'rgba(139, 92, 246, 0.5)',
      glow: 'rgba(124, 58, 237, 0.3)',
      particle: 'rgba(196, 181, 253, 0.8)',
      gradient: ['rgba(124, 58, 237, 0.35)', 'rgba(139, 92, 246, 0.18)', 'transparent'],
    },
    exhale: {
      primary: 'rgba(109, 40, 217, 0.7)',
      secondary: 'rgba(124, 58, 237, 0.5)',
      glow: 'rgba(109, 40, 217, 0.3)',
      particle: 'rgba(167, 139, 250, 0.8)',
      gradient: ['rgba(109, 40, 217, 0.35)', 'rgba(124, 58, 237, 0.18)', 'transparent'],
    },
  },
  // Orange theme - energy techniques
  'energizing-breath': {
    inhale: {
      primary: 'rgba(249, 115, 22, 0.8)',
      secondary: 'rgba(251, 146, 60, 0.6)',
      glow: 'rgba(249, 115, 22, 0.35)',
      particle: 'rgba(254, 215, 170, 0.9)',
      gradient: ['rgba(249, 115, 22, 0.4)', 'rgba(251, 146, 60, 0.2)', 'transparent'],
    },
    exhale: {
      primary: 'rgba(251, 146, 60, 0.7)',
      secondary: 'rgba(253, 186, 116, 0.5)',
      glow: 'rgba(251, 146, 60, 0.3)',
      particle: 'rgba(254, 215, 170, 0.8)',
      gradient: ['rgba(251, 146, 60, 0.35)', 'rgba(253, 186, 116, 0.18)', 'transparent'],
    },
  },
  'power-breathing': {
    inhale: {
      primary: 'rgba(249, 115, 22, 0.8)',
      secondary: 'rgba(251, 146, 60, 0.6)',
      glow: 'rgba(249, 115, 22, 0.35)',
      particle: 'rgba(254, 215, 170, 0.9)',
      gradient: ['rgba(249, 115, 22, 0.4)', 'rgba(251, 146, 60, 0.2)', 'transparent'],
    },
    hold: {
      primary: 'rgba(234, 88, 12, 0.8)',
      secondary: 'rgba(249, 115, 22, 0.6)',
      glow: 'rgba(234, 88, 12, 0.35)',
      particle: 'rgba(254, 215, 170, 0.9)',
      gradient: ['rgba(234, 88, 12, 0.4)', 'rgba(249, 115, 22, 0.2)', 'transparent'],
    },
    exhale: {
      primary: 'rgba(251, 146, 60, 0.7)',
      secondary: 'rgba(253, 186, 116, 0.5)',
      glow: 'rgba(251, 146, 60, 0.3)',
      particle: 'rgba(254, 215, 170, 0.8)',
      gradient: ['rgba(251, 146, 60, 0.35)', 'rgba(253, 186, 116, 0.18)', 'transparent'],
    },
  },
  'wim-hof': {
    inhale: {
      primary: 'rgba(56, 189, 248, 0.8)',
      secondary: 'rgba(125, 211, 252, 0.6)',
      glow: 'rgba(56, 189, 248, 0.35)',
      particle: 'rgba(186, 230, 253, 0.9)',
      gradient: ['rgba(56, 189, 248, 0.4)', 'rgba(125, 211, 252, 0.2)', 'transparent'],
    },
    exhale: {
      primary: 'rgba(14, 165, 233, 0.7)',
      secondary: 'rgba(56, 189, 248, 0.5)',
      glow: 'rgba(14, 165, 233, 0.3)',
      particle: 'rgba(186, 230, 253, 0.8)',
      gradient: ['rgba(14, 165, 233, 0.35)', 'rgba(56, 189, 248, 0.18)', 'transparent'],
    },
  },
  // Emerald theme - recovery techniques
  'recovery-breathing': {
    inhale: {
      primary: 'rgba(52, 211, 153, 0.8)',
      secondary: 'rgba(110, 231, 183, 0.6)',
      glow: 'rgba(52, 211, 153, 0.35)',
      particle: 'rgba(167, 243, 208, 0.9)',
      gradient: ['rgba(52, 211, 153, 0.4)', 'rgba(110, 231, 183, 0.2)', 'transparent'],
    },
    hold: {
      primary: 'rgba(16, 185, 129, 0.7)',
      secondary: 'rgba(52, 211, 153, 0.5)',
      glow: 'rgba(16, 185, 129, 0.3)',
      particle: 'rgba(167, 243, 208, 0.8)',
      gradient: ['rgba(16, 185, 129, 0.35)', 'rgba(52, 211, 153, 0.18)', 'transparent'],
    },
    exhale: {
      primary: 'rgba(5, 150, 105, 0.7)',
      secondary: 'rgba(16, 185, 129, 0.5)',
      glow: 'rgba(5, 150, 105, 0.3)',
      particle: 'rgba(110, 231, 183, 0.8)',
      gradient: ['rgba(5, 150, 105, 0.35)', 'rgba(16, 185, 129, 0.18)', 'transparent'],
    },
  },
  'resonant-breathing': {
    inhale: {
      primary: 'rgba(52, 211, 153, 0.8)',
      secondary: 'rgba(110, 231, 183, 0.6)',
      glow: 'rgba(52, 211, 153, 0.35)',
      particle: 'rgba(167, 243, 208, 0.9)',
      gradient: ['rgba(52, 211, 153, 0.4)', 'rgba(110, 231, 183, 0.2)', 'transparent'],
    },
    exhale: {
      primary: 'rgba(16, 185, 129, 0.7)',
      secondary: 'rgba(52, 211, 153, 0.5)',
      glow: 'rgba(16, 185, 129, 0.3)',
      particle: 'rgba(167, 243, 208, 0.8)',
      gradient: ['rgba(16, 185, 129, 0.35)', 'rgba(52, 211, 153, 0.18)', 'transparent'],
    },
  },
  // Rose theme - heart coherence
  'coherent-breathing': {
    inhale: {
      primary: 'rgba(251, 113, 133, 0.8)',
      secondary: 'rgba(253, 164, 175, 0.6)',
      glow: 'rgba(251, 113, 133, 0.35)',
      particle: 'rgba(254, 205, 211, 0.9)',
      gradient: ['rgba(251, 113, 133, 0.4)', 'rgba(253, 164, 175, 0.2)', 'transparent'],
    },
    exhale: {
      primary: 'rgba(244, 63, 94, 0.7)',
      secondary: 'rgba(251, 113, 133, 0.5)',
      glow: 'rgba(244, 63, 94, 0.3)',
      particle: 'rgba(254, 205, 211, 0.8)',
      gradient: ['rgba(244, 63, 94, 0.35)', 'rgba(251, 113, 133, 0.18)', 'transparent'],
    },
  },
}

function getPhaseColors(techniqueId: string | undefined, phase: Phase): PhaseColorConfig {
  if (techniqueId && techniqueThemes[techniqueId]?.[phase]) {
    return techniqueThemes[techniqueId][phase]!
  }
  return phaseColors[phase]
}

// Body guidance messages
const defaultBodyGuidance: Record<Phase, string> = {
  inhale: 'Fill your belly',
  hold: 'Stay relaxed',
  exhale: 'Slow release',
  holdAfterExhale: 'Empty stillness',
}

const techniqueGuidance: Record<string, Record<Phase, string>> = {
  'box-breathing': {
    inhale: 'Breathe deep',
    hold: 'Hold steady',
    exhale: 'Release slowly',
    holdAfterExhale: 'Stay empty',
  },
  'tactical-breathing': {
    inhale: 'Full breath in',
    hold: 'Brief pause',
    exhale: 'Long, slow out',
    holdAfterExhale: 'Empty stillness',
  },
  'physiological-sigh': {
    inhale: 'Fill your lungs',
    hold: 'Stay relaxed',
    exhale: 'Let it all go',
    holdAfterExhale: 'Empty stillness',
  },
  '4-7-8-breathing': {
    inhale: 'Quiet breath in',
    hold: 'Calm stillness',
    exhale: 'Gentle release',
    holdAfterExhale: 'Empty stillness',
  },
  'energizing-breath': {
    inhale: 'Power in',
    hold: 'Stay relaxed',
    exhale: 'Let go',
    holdAfterExhale: 'Empty stillness',
  },
}

function getBodyGuidance(techniqueId: string | undefined, phase: Phase): string {
  if (techniqueId && techniqueGuidance[techniqueId]) {
    return techniqueGuidance[techniqueId][phase]
  }
  return defaultBodyGuidance[phase]
}

// Animation constants
const SCALE_MIN = 0.72
const SCALE_MAX = 1.0
const SCALE_RANGE = SCALE_MAX - SCALE_MIN

// Custom spring configs for organic motion
const breathingSpring = {
  damping: 30,
  stiffness: 90,
  mass: 1,
}

const gentleSpring = {
  damping: 25,
  stiffness: 60,
  mass: 0.8,
}

export function BreathingCircle({
  phase,
  phaseProgress,
  isActive,
  isPaused,
  timeRemaining,
  instruction,
  techniqueId,
}: BreathingCircleProps) {
  const colors = phase ? getPhaseColors(techniqueId, phase) : phaseColors.inhale
  const isInhale = phase === 'inhale'
  const isExhale = phase === 'exhale'
  const isHold = phase === 'hold' || phase === 'holdAfterExhale'

  // Spring-animated scale for organic motion
  const targetScale = useMemo(() => {
    if (!isActive || isPaused) return SCALE_MIN + SCALE_RANGE * 0.5
    if (isInhale) return SCALE_MIN + (phaseProgress / 100) * SCALE_RANGE
    if (isExhale) return SCALE_MAX - (phaseProgress / 100) * SCALE_RANGE
    if (phase === 'hold') return SCALE_MAX
    if (phase === 'holdAfterExhale') return SCALE_MIN
    return SCALE_MIN + SCALE_RANGE * 0.5
  }, [isActive, isPaused, isInhale, isExhale, phase, phaseProgress])

  const springScale = useSpring(targetScale, breathingSpring)

  // Rotation for ambient motion
  const [rotation, setRotation] = useState(0)
  useEffect(() => {
    if (!isActive || isPaused) return
    const interval = setInterval(() => {
      setRotation(r => (r + 0.5) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [isActive, isPaused])

  // Number animation
  const prevTimeRef = useRef<number>(Math.ceil(timeRemaining))
  const [animateNumber, setAnimateNumber] = useState(false)

  useEffect(() => {
    const currentTime = Math.ceil(timeRemaining)
    if (currentTime !== prevTimeRef.current && isActive && !isPaused) {
      setAnimateNumber(true)
      prevTimeRef.current = currentTime
      const timeout = setTimeout(() => setAnimateNumber(false), 200)
      return () => clearTimeout(timeout)
    }
  }, [timeRemaining, isActive, isPaused])

  // Phase transition ripple
  const [ripples, setRipples] = useState<{ id: number; color: string }[]>([])
  const prevPhaseRef = useRef<Phase | null>(null)
  const rippleIdRef = useRef(0)

  useEffect(() => {
    if (phase !== prevPhaseRef.current && isActive && !isPaused && phase) {
      const newRipple = { id: rippleIdRef.current++, color: colors.primary }
      setRipples(prev => [...prev, newRipple])
      prevPhaseRef.current = phase
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 1000)
    }
  }, [phase, isActive, isPaused, colors.primary])

  // Pulsing glow intensity for holds
  const [pulseIntensity, setPulseIntensity] = useState(0.5)
  useEffect(() => {
    if (!isHold || !isActive || isPaused) return
    const interval = setInterval(() => {
      setPulseIntensity(p => 0.5 + Math.sin(Date.now() / 800) * 0.2)
    }, 50)
    return () => clearInterval(interval)
  }, [isHold, isActive, isPaused])

  const containerSize = 260

  // Memoize gradient ID to prevent recreation
  const gradientId = useMemo(() => `breath-gradient-${Math.random().toString(36).slice(2)}`, [])
  const glowGradientId = useMemo(() => `glow-gradient-${Math.random().toString(36).slice(2)}`, [])

  return (
    <div className="relative w-[260px] h-[260px] md:w-[300px] md:h-[300px] flex items-center justify-center">
      {/* SVG Definitions for gradients */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.gradient[0]} />
            <stop offset="60%" stopColor={colors.gradient[1]} />
            <stop offset="100%" stopColor={colors.gradient[2]} />
          </radialGradient>
          <radialGradient id={glowGradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.glow} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>

      {/* Breathing Guide Ring */}
      <BreathingGuideRing
        phase={phase}
        phaseProgress={phaseProgress}
        isActive={isActive}
        isPaused={isPaused}
        size={containerSize}
      />

      {/* Breathing Particles */}
      <BreathingParticles
        phase={phase}
        isActive={isActive}
        isPaused={isPaused}
        phaseProgress={phaseProgress}
        containerSize={containerSize}
        colors={colors}
      />

      {/* Phase transition ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: containerSize * 0.75,
              height: containerSize * 0.75,
              border: `2px solid ${ripple.color}`,
            }}
            initial={{ scale: 0.8, opacity: 0.9 }}
            animate={{ scale: 1.3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        ))}
      </AnimatePresence>

      {/* Ambient outer glow - follows breathing with delay */}
      <motion.div
        className="absolute rounded-full will-change-transform"
        style={{
          width: containerSize * 0.95,
          height: containerSize * 0.95,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
        animate={{
          scale: targetScale * 1.1,
          opacity: isActive && !isPaused ? (isHold ? pulseIntensity : 0.6) : 0.2,
        }}
        transition={{ type: 'spring', ...gentleSpring }}
      />

      {/* Outer breathing ring - subtle border */}
      <motion.div
        className="absolute rounded-full will-change-transform"
        style={{
          width: containerSize * 0.88,
          height: containerSize * 0.88,
          border: `1px solid ${colors.secondary}`,
          opacity: 0.4,
        }}
        animate={{
          scale: targetScale * 1.08,
          opacity: isActive && !isPaused ? 0.5 : 0.2,
          rotate: rotation,
        }}
        transition={{ type: 'spring', ...gentleSpring }}
      />

      {/* Secondary ring with offset timing */}
      <motion.div
        className="absolute rounded-full will-change-transform"
        style={{
          width: containerSize * 0.82,
          height: containerSize * 0.82,
          border: `1px solid ${colors.primary}`,
          opacity: 0.3,
        }}
        animate={{
          scale: targetScale * 1.04,
          opacity: isActive && !isPaused ? 0.4 : 0.15,
          rotate: -rotation * 0.5,
        }}
        transition={{ type: 'spring', ...breathingSpring }}
      />

      {/* Main breathing circle */}
      <motion.div
        className="absolute rounded-full flex items-center justify-center will-change-transform breathing-circle"
        style={{
          width: containerSize * 0.75,
          height: containerSize * 0.75,
          background: `radial-gradient(circle at 30% 30%,
            ${colors.gradient[0]} 0%,
            rgba(15, 23, 42, 0.9) 60%,
            rgba(10, 22, 40, 0.95) 100%)`,
          border: `2px solid ${colors.primary}`,
          boxShadow: `
            0 0 30px ${colors.glow},
            0 0 60px ${colors.glow},
            inset 0 0 30px ${colors.gradient[1]}
          `,
        }}
        animate={{
          scale: targetScale,
          boxShadow: isHold
            ? `0 0 ${30 + pulseIntensity * 20}px ${colors.glow}, 0 0 ${60 + pulseIntensity * 30}px ${colors.glow}, inset 0 0 30px ${colors.gradient[1]}`
            : `0 0 30px ${colors.glow}, 0 0 60px ${colors.glow}, inset 0 0 30px ${colors.gradient[1]}`
        }}
        transition={{ type: 'spring', ...breathingSpring }}
      >
        {/* Inner highlight - creates depth */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '85%',
            height: '85%',
            background: `radial-gradient(circle at 35% 35%, ${colors.secondary} 0%, transparent 50%)`,
            opacity: 0.15,
          }}
          animate={{
            opacity: isActive && !isPaused ? (isHold ? pulseIntensity * 0.3 : 0.2) : 0.1,
          }}
        />

        {/* Shimmer overlay for holds */}
        {isHold && isActive && !isPaused && (
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, transparent 0%, ${colors.secondary} 50%, transparent 100%)`,
                backgroundSize: '200% 200%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}

        {/* Inner content */}
        <div className="text-center z-10 px-4">
          {/* Phase instruction */}
          <AnimatePresence mode="wait">
            <motion.div
              key={instruction}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-1"
            >
              <p className="text-xl md:text-2xl font-semibold text-white tracking-wide">
                {isActive ? instruction : 'Ready'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Body guidance */}
          <AnimatePresence>
            {isActive && !isPaused && phase && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.6, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-xs md:text-sm text-slate-300 mb-2"
              >
                {getBodyGuidance(techniqueId, phase)}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Timer with smooth number transitions */}
          <motion.div
            className={`font-mono text-3xl md:text-4xl font-light tracking-wider ${
              animateNumber ? 'text-white' : 'text-white/90'
            }`}
            animate={{
              scale: animateNumber ? [1, 1.08, 1] : 1,
              opacity: animateNumber ? [0.9, 1, 0.9] : 0.9,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {isActive ? Math.ceil(timeRemaining) : '--'}
          </motion.div>
        </div>
      </motion.div>

      {/* Inner core - breathing essence */}
      <motion.div
        className="absolute rounded-full will-change-transform pointer-events-none"
        style={{
          width: containerSize * 0.35,
          height: containerSize * 0.35,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
        }}
        animate={{
          scale: targetScale * 0.9,
          opacity: isActive && !isPaused ? (isHold ? pulseIntensity * 0.8 : 0.5) : 0.25,
        }}
        transition={{ type: 'spring', ...gentleSpring }}
      />

      {/* Floating energy orbs during holds */}
      {isHold && isActive && !isPaused && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 6,
                height: 6,
                background: colors.particle,
                filter: 'blur(1px)',
              }}
              animate={{
                x: [
                  Math.cos((i * 120 + Date.now() / 20) * Math.PI / 180) * 50,
                  Math.cos((i * 120 + 180 + Date.now() / 20) * Math.PI / 180) * 55,
                  Math.cos((i * 120 + Date.now() / 20) * Math.PI / 180) * 50,
                ],
                y: [
                  Math.sin((i * 120 + Date.now() / 20) * Math.PI / 180) * 50,
                  Math.sin((i * 120 + 180 + Date.now() / 20) * Math.PI / 180) * 55,
                  Math.sin((i * 120 + Date.now() / 20) * Math.PI / 180) * 50,
                ],
                opacity: [0.4, 0.8, 0.4],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}
