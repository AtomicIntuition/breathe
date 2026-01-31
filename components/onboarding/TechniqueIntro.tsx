'use client'

import { motion } from 'framer-motion'
import { Square, Target, Zap, Moon, Flame } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { BreathingTechnique } from '@/lib/techniques'

interface TechniqueIntroProps {
  technique: BreathingTechnique
  onStart: () => void
  onBack: () => void
}

const iconMap = {
  Square,
  Target,
  Zap,
  Moon,
  Flame,
}

export function TechniqueIntro({ technique, onStart, onBack }: TechniqueIntroProps) {
  const Icon = iconMap[technique.icon as keyof typeof iconMap]

  return (
    <motion.div
      className="text-center max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-arctic/10 flex items-center justify-center"
      >
        <Icon className="w-10 h-10 text-arctic" />
      </motion.div>

      <p className="text-sm text-arctic uppercase tracking-wider mb-2">
        Recommended for you
      </p>

      <h2 className="text-3xl md:text-4xl font-bold mb-2">
        {technique.name}
      </h2>

      <p className="text-slate-light mb-6">{technique.description}</p>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white font-mono mb-8">
        {technique.pattern}
      </div>

      <div className="space-y-4">
        <Button
          variant="primary"
          size="lg"
          onClick={onStart}
          glow
          className="w-full sm:w-auto"
        >
          Start Your First Session
        </Button>

        <div>
          <Button variant="ghost" onClick={onBack}>
            Choose a different technique
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
