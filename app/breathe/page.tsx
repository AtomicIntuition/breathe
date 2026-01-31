'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Square,
  Target,
  Zap,
  Moon,
  Flame,
  Heart,
  Waves,
  Battery,
  Sparkles,
  Snowflake,
  CloudMoon,
  Clock,
  Star,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  techniques,
  calculateSessionDuration,
  formatDuration,
  BreathingTechnique,
} from '@/lib/techniques'
import { useStore } from '@/store/useStore'

const iconMap: Record<string, React.ElementType> = {
  Square,
  Target,
  Zap,
  Moon,
  Flame,
  Heart,
  Waves,
  Battery,
  Sparkles,
  Snowflake,
  CloudMoon,
}

const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  arctic: {
    text: 'text-arctic',
    bg: 'bg-arctic/10',
    border: 'hover:border-arctic/50',
    glow: 'shadow-arctic/20',
  },
  gold: {
    text: 'text-gold',
    bg: 'bg-gold/10',
    border: 'hover:border-gold/50',
    glow: 'shadow-gold/20',
  },
  slate: {
    text: 'text-slate-light',
    bg: 'bg-slate/10',
    border: 'hover:border-slate/50',
    glow: 'shadow-slate/20',
  },
  purple: {
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'hover:border-purple-400/50',
    glow: 'shadow-purple-500/20',
  },
  orange: {
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'hover:border-orange-400/50',
    glow: 'shadow-orange-500/20',
  },
  emerald: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'hover:border-emerald-400/50',
    glow: 'shadow-emerald-500/20',
  },
  rose: {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'hover:border-rose-400/50',
    glow: 'shadow-rose-500/20',
  },
}

const categoryInfo: Record<string, { label: string; description: string; icon: React.ElementType }> = {
  focus: {
    label: 'Focus & Performance',
    description: 'Techniques for mental clarity and peak performance',
    icon: Target,
  },
  calm: {
    label: 'Stress & Calm',
    description: 'Reduce anxiety and find your center',
    icon: Waves,
  },
  sleep: {
    label: 'Sleep & Relaxation',
    description: 'Wind down and prepare for restful sleep',
    icon: Moon,
  },
  energy: {
    label: 'Energy & Activation',
    description: 'Boost alertness and mental intensity',
    icon: Flame,
  },
  recovery: {
    label: 'Recovery & Healing',
    description: 'Restore and recharge your system',
    icon: Battery,
  },
}

const categoryOrder: BreathingTechnique['category'][] = ['focus', 'calm', 'sleep', 'energy', 'recovery']

export default function BreathePage() {
  const { userGoal } = useStore()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const getRecommendedId = () => {
    switch (userGoal) {
      case 'stress':
        return 'physiological-sigh'
      case 'sleep':
        return 'military-sleep'
      case 'focus':
        return 'box-breathing'
      case 'energy':
        return 'power-breathing'
      default:
        return 'box-breathing'
    }
  }

  const recommendedId = getRecommendedId()

  const filteredTechniques = selectedCategory
    ? techniques.filter((t) => t.category === selectedCategory)
    : techniques

  const groupedTechniques = categoryOrder.reduce((acc, category) => {
    acc[category] = techniques.filter((t) => t.category === category)
    return acc
  }, {} as Record<string, BreathingTechnique[]>)

  return (
    <main className="min-h-screen bg-gradient-dark py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Breathing Techniques
          </h1>
          <p className="text-slate-light text-lg max-w-2xl mx-auto">
            Military-grade and scientifically-proven breathing techniques for every situation.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'bg-white/10 text-white'
                : 'text-slate-light hover:text-white hover:bg-white/5'
            }`}
          >
            All ({techniques.length})
          </button>
          {categoryOrder.map((category) => {
            const info = categoryInfo[category]
            const count = groupedTechniques[category]?.length || 0
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-white/10 text-white'
                    : 'text-slate-light hover:text-white hover:bg-white/5'
                }`}
              >
                {info.label} ({count})
              </button>
            )
          })}
        </motion.div>

        {/* Techniques */}
        <AnimatePresence mode="wait">
          {selectedCategory ? (
            // Filtered view
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredTechniques.map((technique, index) => (
                <TechniqueCard
                  key={technique.id}
                  technique={technique}
                  isRecommended={technique.id === recommendedId}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            // Grouped view
            <motion.div
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {categoryOrder.map((category, catIndex) => {
                const info = categoryInfo[category]
                const categoryTechniques = groupedTechniques[category]
                const CategoryIcon = info.icon

                return (
                  <motion.section
                    key={category}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-white/5">
                        <CategoryIcon className="w-5 h-5 text-slate-light" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{info.label}</h2>
                        <p className="text-sm text-slate">{info.description}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryTechniques.map((technique, index) => (
                        <TechniqueCard
                          key={technique.id}
                          technique={technique}
                          isRecommended={technique.id === recommendedId}
                          index={index}
                        />
                      ))}
                    </div>
                  </motion.section>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function TechniqueCard({
  technique,
  isRecommended,
  index,
}: {
  technique: BreathingTechnique
  isRecommended: boolean
  index: number
}) {
  const Icon = iconMap[technique.icon] || Square
  const colors = colorMap[technique.color] || colorMap.arctic
  const duration = calculateSessionDuration(technique, technique.defaultCycles)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/breathe/${technique.id}`}>
        <Card
          variant="bordered"
          hover
          className={`p-5 h-full relative group ${colors.border} transition-all duration-300`}
        >
          {isRecommended && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-arctic/20 text-arctic">
                <Star className="w-3 h-3" />
                For You
              </span>
            </div>
          )}

          {technique.difficulty === 'advanced' && (
            <div className="absolute top-3 right-3">
              <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
                Advanced
              </span>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform`}>
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-0.5 pr-16">
                {technique.name}
              </h3>
              <p className="text-xs text-slate mb-2">
                {technique.tagline}
              </p>

              <div className="flex items-center gap-3 text-xs">
                <span className={`font-mono ${colors.text}`}>
                  {technique.pattern}
                </span>
                <span className="text-slate flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(duration)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-light mt-3 line-clamp-2">
            {technique.purpose}
          </p>
        </Card>
      </Link>
    </motion.div>
  )
}
