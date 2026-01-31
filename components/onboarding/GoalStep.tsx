'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Moon, Target, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { clsx } from 'clsx'

interface GoalStepProps {
  onNext: (goal: string) => void
  onBack: () => void
}

const goals = [
  {
    id: 'stress',
    icon: Heart,
    title: 'Stress Relief',
    description: 'Calm your mind and reduce anxiety',
    color: 'arctic',
  },
  {
    id: 'sleep',
    icon: Moon,
    title: 'Better Sleep',
    description: 'Wind down and rest deeply',
    color: 'slate',
  },
  {
    id: 'focus',
    icon: Target,
    title: 'Focus & Performance',
    description: 'Sharpen your mind for peak performance',
    color: 'gold',
  },
  {
    id: 'all',
    icon: Sparkles,
    title: 'All of the Above',
    description: 'Master all techniques for any situation',
    color: 'arctic',
  },
]

export function GoalStep({ onNext, onBack }: GoalStepProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <motion.div
      className="max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          What brings you here?
        </h2>
        <p className="text-slate-light">
          We&apos;ll recommend the best technique for you.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {goals.map((goal, index) => {
          const Icon = goal.icon
          const isSelected = selected === goal.id

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                variant="bordered"
                hover
                className={clsx(
                  'p-4 cursor-pointer transition-all',
                  isSelected && 'ring-2 ring-arctic bg-arctic/10'
                )}
                onClick={() => setSelected(goal.id)}
              >
                <Icon
                  className={clsx(
                    'w-8 h-8 mb-3',
                    goal.color === 'arctic' && 'text-arctic',
                    goal.color === 'gold' && 'text-gold',
                    goal.color === 'slate' && 'text-slate-light'
                  )}
                />
                <h3 className="font-semibold mb-1">{goal.title}</h3>
                <p className="text-sm text-slate-light">{goal.description}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          glow={!!selected}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  )
}
