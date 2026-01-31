'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      className="text-center max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated breathing circle */}
      <motion.div
        className="w-40 h-40 mx-auto mb-10 rounded-full border-2 border-arctic/30 flex items-center justify-center"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          boxShadow: '0 0 60px rgba(74, 144, 217, 0.2)',
        }}
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-arctic/10"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Welcome to
        <br />
        <span className="gradient-text">BREATHE SPEC</span>
      </h1>

      <p className="text-slate-light text-lg mb-8">
        Take a moment. Let the circle guide your first breath.
      </p>

      <Button variant="primary" size="lg" onClick={onNext} glow>
        Continue
      </Button>
    </motion.div>
  )
}
