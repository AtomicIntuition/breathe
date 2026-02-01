'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
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

  // Generate ambient particles - larger and more visible
  const particles = useMemo<AmbientParticle[]>(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: Math.cos((i * 22.5) * Math.PI / 180) * 120,
      y: Math.sin((i * 22.5) * Math.PI / 180) * 120,
      size: 3 + Math.random() * 4,
      duration: 3 + Math.random() * 2,
      delay: i * 0.15,
    })),
  [])

  // Premium colors
  const primaryColor = 'rgba(74, 144, 217, 0.9)'
  const glowColor = 'rgba(74, 144, 217, 0.5)'
  const particleColor = 'rgba(147, 197, 253, 0.8)'

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-32">
      {/* Enhanced background with radial gradient */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(74, 144, 217, 0.12) 0%, transparent 60%)`,
        }}
      />

      {/* Subtle grid pattern - refined */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Animated breathing circle - larger */}
      <motion.div
        className="relative z-10 mb-16 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Ambient glow - enhanced */}
        <motion.div
          className="absolute w-60 h-60 md:w-76 md:h-76 lg:w-92 lg:h-92 rounded-full"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
          animate={{
            scale: scale * 1.3,
            opacity: breathPhase === 'inhale' ? [0.3, 0.6] : [0.6, 0.3],
          }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        />

        {/* Outer ring */}
        <motion.div
          className="absolute w-56 h-56 md:w-72 md:h-72 lg:w-88 lg:h-88 rounded-full"
          style={{
            border: `1px solid ${primaryColor}`,
            opacity: 0.25,
          }}
          animate={{
            scale: scale * 1.15,
            opacity: breathPhase === 'inhale' ? [0.15, 0.35] : [0.35, 0.15],
          }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        />

        {/* Secondary ring */}
        <motion.div
          className="absolute w-52 h-52 md:w-68 md:h-68 lg:w-80 lg:h-80 rounded-full"
          style={{
            border: `1px solid ${primaryColor}`,
            opacity: 0.15,
          }}
          animate={{
            scale: scale * 1.08,
            rotate: [0, 180],
          }}
          transition={{
            scale: { duration: 4, ease: 'easeInOut' },
            rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
          }}
        />

        {/* Main circle - refined */}
        <motion.div
          className="absolute w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 30% 30%,
              rgba(74, 144, 217, 0.35) 0%,
              rgba(15, 23, 42, 0.92) 55%,
              rgba(10, 22, 40, 0.98) 100%)`,
            border: `2px solid ${primaryColor}`,
            boxShadow: `
              0 0 60px ${glowColor},
              0 0 100px ${glowColor},
              inset 0 0 40px rgba(74, 144, 217, 0.25)
            `,
          }}
          animate={{ scale }}
          transition={{ duration: 0.1, ease: 'linear' }}
        >
          {/* Inner highlight */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '75%',
              height: '75%',
              background: `radial-gradient(circle at 35% 35%, rgba(56, 189, 248, 0.35) 0%, transparent 50%)`,
            }}
            animate={{
              opacity: breathPhase === 'inhale' ? [0.15, 0.25] : [0.25, 0.15],
            }}
            transition={{ duration: 4, ease: 'easeInOut' }}
          />

          {/* Inner circle */}
          <motion.div
            className="w-32 h-32 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(74, 144, 217, 0.25) 0%, transparent 70%)`,
              border: `1px solid rgba(74, 144, 217, 0.35)`,
            }}
            animate={{ scale }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </motion.div>

        {/* Floating particles - enhanced */}
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
                ? [particle.x, particle.x * 0.25]
                : [particle.x * 0.25, particle.x],
              y: breathPhase === 'inhale'
                ? [particle.y, particle.y * 0.25]
                : [particle.y * 0.25, particle.y],
              opacity: [0.15, 0.7, 0.15],
              scale: [0.4, 1, 0.4],
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
            width: 28,
            height: 28,
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(3px)',
          }}
          animate={{
            scale: breathPhase === 'inhale' ? [1, 1.6] : [1.6, 1],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Content - refined typography */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
          <span className="text-white">Train Your Breath.</span>
          <br />
          <span className="gradient-text">Master Your Mind.</span>
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl text-slate-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Military-grade breathing techniques used by Navy SEALs, now available to everyone.
          Backed by science, designed for results.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/breathe">
            <Button size="lg" glow className="group text-lg px-10 py-4">
              Start Breathing
              <motion.span
                className="ml-2 inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator - softer */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-slate-light" />
        </motion.div>
      </motion.div>
    </section>
  )
}
