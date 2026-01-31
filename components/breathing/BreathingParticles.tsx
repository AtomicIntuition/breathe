'use client'

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phase } from '@/lib/techniques'

interface PhaseColorConfig {
  primary: string
  secondary: string
  glow: string
  particle: string
  gradient: [string, string, string]
}

interface Particle {
  id: number
  angle: number
  delay: number
  duration: number
  size: number
  opacity: number
  spiralOffset: number
  speed: number
}

interface BreathingParticlesProps {
  phase: Phase | null
  isActive: boolean
  isPaused: boolean
  phaseProgress: number
  containerSize?: number
  colors?: PhaseColorConfig
}

// Default colors if not provided
const defaultColors: PhaseColorConfig = {
  primary: 'rgba(74, 144, 217, 0.8)',
  secondary: 'rgba(56, 189, 248, 0.6)',
  glow: 'rgba(74, 144, 217, 0.35)',
  particle: 'rgba(147, 197, 253, 0.9)',
  gradient: ['rgba(74, 144, 217, 0.4)', 'rgba(56, 189, 248, 0.2)', 'transparent'],
}

const PARTICLE_COUNT = 16
const PARTICLE_DISTANCE = 85

export function BreathingParticles({
  phase,
  isActive,
  isPaused,
  phaseProgress,
  containerSize = 260,
  colors = defaultColors,
}: BreathingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [particleKey, setParticleKey] = useState(0)
  const animationRef = useRef<number>(0)

  // Generate varied particles for organic feel
  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseAngle = (360 / PARTICLE_COUNT) * i
      newParticles.push({
        id: i,
        angle: baseAngle + (Math.random() - 0.5) * 25,
        delay: Math.random() * 0.8,
        duration: 2 + Math.random() * 1.5,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.5,
        spiralOffset: Math.random() * 30 - 15,
        speed: 0.7 + Math.random() * 0.6,
      })
    }
    setParticles(newParticles)
    setParticleKey(prev => prev + 1)
  }, [])

  useEffect(() => {
    if (isActive && !isPaused && (phase === 'inhale' || phase === 'exhale')) {
      generateParticles()
    }
  }, [phase, isActive, isPaused, generateParticles])

  const isInhale = phase === 'inhale'
  const isExhale = phase === 'exhale'
  const isHold = phase === 'hold' || phase === 'holdAfterExhale'

  const center = containerSize / 2

  // Ambient floating particles for hold phases
  const ambientParticles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (360 / 8) * i + Math.random() * 20,
      radius: 35 + Math.random() * 35,
      size: 2 + Math.random() * 2,
      duration: 4 + Math.random() * 2,
      delay: i * 0.3,
    }))
  }, [])

  // Energy wisps that float during breathing
  const [wisps, setWisps] = useState<{ id: number; startAngle: number }[]>([])

  useEffect(() => {
    if (isActive && !isPaused && (isInhale || isExhale)) {
      const wispInterval = setInterval(() => {
        const newWisp = {
          id: Date.now(),
          startAngle: Math.random() * 360,
        }
        setWisps(prev => [...prev.slice(-5), newWisp])
      }, 400)
      return () => clearInterval(wispInterval)
    }
  }, [isActive, isPaused, isInhale, isExhale])

  // Clean up old wisps
  useEffect(() => {
    const cleanup = setInterval(() => {
      setWisps(prev => prev.filter(w => Date.now() - w.id < 2500))
    }, 500)
    return () => clearInterval(cleanup)
  }, [])

  if (!isActive || isPaused) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ width: containerSize, height: containerSize }}
    >
      {/* Inhale particles - spiral inward with trails */}
      <AnimatePresence mode="sync">
        {isInhale && particles.map((particle) => {
          const distance = PARTICLE_DISTANCE * particle.speed
          const startAngle = particle.angle
          const spiralAngle = startAngle + particle.spiralOffset

          const startX = Math.cos((startAngle * Math.PI) / 180) * distance
          const startY = Math.sin((startAngle * Math.PI) / 180) * distance
          const midX = Math.cos((spiralAngle * Math.PI) / 180) * (distance * 0.5)
          const midY = Math.sin((spiralAngle * Math.PI) / 180) * (distance * 0.5)

          return (
            <motion.div
              key={`inhale-${particleKey}-${particle.id}`}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                background: `radial-gradient(circle, ${colors.particle} 0%, transparent 70%)`,
                left: center,
                top: center,
                filter: 'blur(0.5px)',
              }}
              initial={{
                x: startX,
                y: startY,
                opacity: 0,
                scale: 0.3,
              }}
              animate={{
                x: [startX, midX, 0],
                y: [startY, midY, 0],
                opacity: [0, particle.opacity, particle.opacity * 0.8, 0],
                scale: [0.3, 1, 0.8, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: [0.25, 0.1, 0.25, 1],
                times: [0, 0.3, 0.7, 1],
              }}
            />
          )
        })}
      </AnimatePresence>

      {/* Exhale particles - spiral outward with fade */}
      <AnimatePresence mode="sync">
        {isExhale && particles.map((particle) => {
          const distance = PARTICLE_DISTANCE * particle.speed
          const endAngle = particle.angle
          const spiralAngle = endAngle - particle.spiralOffset

          const midX = Math.cos((spiralAngle * Math.PI) / 180) * (distance * 0.5)
          const midY = Math.sin((spiralAngle * Math.PI) / 180) * (distance * 0.5)
          const endX = Math.cos((endAngle * Math.PI) / 180) * distance
          const endY = Math.sin((endAngle * Math.PI) / 180) * distance

          return (
            <motion.div
              key={`exhale-${particleKey}-${particle.id}`}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                background: `radial-gradient(circle, ${colors.particle} 0%, transparent 70%)`,
                left: center,
                top: center,
                filter: 'blur(0.5px)',
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: [0, midX, endX],
                y: [0, midY, endY],
                opacity: [0, particle.opacity, particle.opacity * 0.5, 0],
                scale: [0, 0.8, 1, 0.3],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: [0.4, 0, 0.2, 1],
                times: [0, 0.3, 0.7, 1],
              }}
            />
          )
        })}
      </AnimatePresence>

      {/* Energy wisps - flowing trails */}
      <AnimatePresence>
        {(isInhale || isExhale) && wisps.map((wisp) => {
          const distance = PARTICLE_DISTANCE * 0.9
          const startX = isExhale ? 0 : Math.cos((wisp.startAngle * Math.PI) / 180) * distance
          const startY = isExhale ? 0 : Math.sin((wisp.startAngle * Math.PI) / 180) * distance
          const endX = isInhale ? 0 : Math.cos((wisp.startAngle * Math.PI) / 180) * distance
          const endY = isInhale ? 0 : Math.sin((wisp.startAngle * Math.PI) / 180) * distance

          return (
            <motion.div
              key={wisp.id}
              className="absolute"
              style={{
                width: 20,
                height: 3,
                background: `linear-gradient(90deg, transparent 0%, ${colors.secondary} 50%, transparent 100%)`,
                left: center,
                top: center,
                borderRadius: 2,
                transformOrigin: 'left center',
                rotate: `${wisp.startAngle}deg`,
                filter: 'blur(1px)',
              }}
              initial={{
                x: startX,
                y: startY,
                opacity: 0,
                scaleX: 0.3,
              }}
              animate={{
                x: endX,
                y: endY,
                opacity: [0, 0.6, 0.4, 0],
                scaleX: [0.3, 1, 0.5],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                ease: 'easeOut',
              }}
            />
          )
        })}
      </AnimatePresence>

      {/* Ambient floating particles for hold phases */}
      {isHold && ambientParticles.map((particle) => {
        const x = Math.cos((particle.angle * Math.PI) / 180) * particle.radius
        const y = Math.sin((particle.angle * Math.PI) / 180) * particle.radius

        return (
          <motion.div
            key={`ambient-${particle.id}`}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: colors.particle,
              left: center,
              top: center,
              filter: 'blur(0.5px)',
            }}
            animate={{
              x: [x, x + 8, x - 5, x],
              y: [y, y - 6, y + 8, y],
              opacity: [0.2, 0.6, 0.4, 0.2],
              scale: [0.8, 1.2, 1, 0.8],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        )
      })}

      {/* Orbital ring during holds */}
      {isHold && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: containerSize * 0.55,
            height: containerSize * 0.55,
            border: `1px solid ${colors.secondary}`,
            left: center - (containerSize * 0.55) / 2,
            top: center - (containerSize * 0.55) / 2,
          }}
          animate={{
            rotate: [0, 360],
            opacity: [0.1, 0.25, 0.1],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      )}

      {/* Central energy core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 24,
          height: 24,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          left: center - 12,
          top: center - 12,
          filter: 'blur(2px)',
        }}
        animate={{
          scale: isInhale
            ? [1, 1.8]
            : isExhale
              ? [1.8, 1]
              : [1, 1.3, 1],
          opacity: isHold
            ? [0.4, 0.7, 0.4]
            : [0.5, 0.8],
        }}
        transition={{
          duration: isHold ? 2.5 : 1.5,
          repeat: isHold ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary core glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 40,
          height: 40,
          background: `radial-gradient(circle, ${colors.gradient[0]} 0%, transparent 60%)`,
          left: center - 20,
          top: center - 20,
        }}
        animate={{
          scale: isInhale
            ? [0.8, 1.4]
            : isExhale
              ? [1.4, 0.8]
              : [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: isHold ? 3 : 2,
          repeat: isHold ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />

      {/* Pulsing ring effect during breathing */}
      {(isInhale || isExhale) && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: containerSize * 0.4,
            height: containerSize * 0.4,
            border: `1px solid ${colors.primary}`,
            left: center - (containerSize * 0.4) / 2,
            top: center - (containerSize * 0.4) / 2,
          }}
          animate={{
            scale: isInhale ? [0.5, 1.2] : [1.2, 0.5],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            ease: 'easeOut',
            repeat: Infinity,
          }}
        />
      )}
    </div>
  )
}
