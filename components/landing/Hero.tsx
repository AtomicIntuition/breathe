'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Ambient particle for the hero
interface AmbientParticle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export function Hero() {
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale')
  const [progress, setProgress] = useState(0)

  // Breathing cycle: 4s inhale, 4s exhale
  useEffect(() => {
    const cycleDuration = 8000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTime) % cycleDuration
      const halfCycle = cycleDuration / 2

      if (elapsed < halfCycle) {
        setBreathPhase('inhale')
        setProgress(elapsed / halfCycle)
      } else {
        setBreathPhase('exhale')
        setProgress((elapsed - halfCycle) / halfCycle)
      }
    }

    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [])

  // Scale: 0.75 (exhaled) to 1.0 (inhaled)
  const scale = breathPhase === 'inhale'
    ? 0.75 + progress * 0.25
    : 1.0 - progress * 0.25

  // Generate ambient particles
  const particles = useMemo<AmbientParticle[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.cos((i * 30) * Math.PI / 180) * 100,
      y: Math.sin((i * 30) * Math.PI / 180) * 100,
      size: 2 + Math.random() * 3,
      duration: 3 + Math.random() * 2,
      delay: i * 0.2,
    })),
  [])

  // Colors
  const primaryColor = 'rgba(74, 144, 217, 0.8)'
  const glowColor = 'rgba(74, 144, 217, 0.4)'
  const particleColor = 'rgba(147, 197, 253, 0.7)'

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-dark" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Animated breathing circle */}
      <motion.div
        className="relative z-10 mb-12 w-56 h-56 md:w-72 md:h-72 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute w-52 h-52 md:w-68 md:h-68 rounded-full"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(10px)',
          }}
          animate={{
            scale: scale * 1.2,
            opacity: breathPhase === 'inhale' ? [0.3, 0.5] : [0.5, 0.3],
          }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        />

        {/* Outer ring */}
        <motion.div
          className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full"
          style={{
            border: `1px solid ${primaryColor}`,
            opacity: 0.3,
          }}
          animate={{
            scale: scale * 1.1,
            opacity: breathPhase === 'inhale' ? [0.2, 0.4] : [0.4, 0.2],
          }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        />

        {/* Secondary ring */}
        <motion.div
          className="absolute w-44 h-44 md:w-60 md:h-60 rounded-full"
          style={{
            border: `1px solid ${primaryColor}`,
            opacity: 0.2,
          }}
          animate={{
            scale: scale * 1.05,
            rotate: [0, 180],
          }}
          transition={{
            scale: { duration: 4, ease: 'easeInOut' },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          }}
        />

        {/* Main circle */}
        <motion.div
          className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 30% 30%,
              rgba(74, 144, 217, 0.3) 0%,
              rgba(15, 23, 42, 0.9) 60%,
              rgba(10, 22, 40, 0.95) 100%)`,
            border: `2px solid ${primaryColor}`,
            boxShadow: `
              0 0 40px ${glowColor},
              0 0 80px ${glowColor},
              inset 0 0 30px rgba(74, 144, 217, 0.2)
            `,
          }}
          animate={{ scale }}
          transition={{ duration: 0.1, ease: 'linear' }}
        >
          {/* Inner highlight */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '80%',
              height: '80%',
              background: `radial-gradient(circle at 35% 35%, rgba(56, 189, 248, 0.3) 0%, transparent 50%)`,
            }}
            animate={{
              opacity: breathPhase === 'inhale' ? [0.1, 0.2] : [0.2, 0.1],
            }}
            transition={{ duration: 4, ease: 'easeInOut' }}
          />

          {/* Inner circle */}
          <motion.div
            className="w-28 h-28 md:w-40 md:h-40 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(74, 144, 217, 0.2) 0%, transparent 70%)`,
              border: `1px solid rgba(74, 144, 217, 0.3)`,
            }}
            animate={{ scale }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </motion.div>

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: particleColor,
              filter: 'blur(0.5px)',
            }}
            animate={{
              x: breathPhase === 'inhale'
                ? [particle.x, particle.x * 0.3]
                : [particle.x * 0.3, particle.x],
              y: breathPhase === 'inhale'
                ? [particle.y, particle.y * 0.3]
                : [particle.y * 0.3, particle.y],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Central core glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 24,
            height: 24,
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(2px)',
          }}
          animate={{
            scale: breathPhase === 'inhale' ? [1, 1.5] : [1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="text-white">Train Your Breath.</span>
          <br />
          <span className="gradient-text">Master Your Mind.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-light max-w-2xl mx-auto mb-10">
          Military-grade breathing techniques used by Navy SEALs, now available to everyone.
          Backed by science, designed for results.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/breathe">
            <Button size="lg" glow className="group">
              Start Breathing
              <motion.span
                className="ml-2 inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-slate" />
        </motion.div>
      </motion.div>
    </section>
  )
}
