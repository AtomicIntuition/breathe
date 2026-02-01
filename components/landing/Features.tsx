'use client'

import { motion } from 'framer-motion'
import { Square, Target, Zap, Moon, Flame, Heart, Waves, Battery, Sparkles, Snowflake, CloudMoon, Eye, Shield } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { techniques } from '@/lib/techniques'
import Link from 'next/link'

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
  Eye,
  Shield,
}

const colorMap: Record<string, string> = {
  arctic: 'text-arctic',
  gold: 'text-gold',
  slate: 'text-slate-light',
  purple: 'text-purple-400',
  orange: 'text-orange-400',
  emerald: 'text-emerald-400',
  rose: 'text-rose-400',
}

const bgColorMap: Record<string, string> = {
  arctic: 'bg-arctic/10',
  gold: 'bg-gold/10',
  slate: 'bg-slate/10',
  purple: 'bg-purple-500/10',
  orange: 'bg-orange-500/10',
  emerald: 'bg-emerald-500/10',
  rose: 'bg-rose-500/10',
}

// Curated selection of featured techniques for the landing page
const featuredIds = [
  'box-breathing',
  'military-sleep',
  'physiological-sigh',
  'coherent-breathing',
  'power-breathing',
  'recovery-breathing',
]

export function Features() {
  const featuredTechniques = featuredIds
    .map(id => techniques.find(t => t.id === id))
    .filter(Boolean)

  return (
    <section className="py-24 px-4 relative" id="techniques">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {techniques.length} Techniques. Endless Mastery.
          </h2>
          <p className="text-slate-light text-lg max-w-2xl mx-auto">
            Military-grade and scientifically-proven breathing techniques for focus,
            sleep, stress relief, energy, and recovery.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTechniques.map((technique, index) => {
            if (!technique) return null
            const Icon = iconMap[technique.icon] || Square

            return (
              <motion.div
                key={technique.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/breathe/${technique.id}`}>
                  <Card
                    variant="bordered"
                    hover
                    className="p-6 h-full group"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${bgColorMap[technique.color]} group-hover:scale-110 transition-transform`}
                      >
                        <Icon
                          className={`w-6 h-6 ${colorMap[technique.color]}`}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {technique.name}
                        </h3>
                        <p className="text-sm text-slate mb-3">
                          {technique.tagline}
                        </p>

                        <div className="flex items-center gap-2 mb-3">
                          <span className={`font-mono text-sm ${colorMap[technique.color]}`}>
                            {technique.pattern}
                          </span>
                        </div>

                        <p className="text-sm text-slate-light">
                          {technique.purpose}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* View all techniques link */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/breathe"
            className="inline-flex items-center gap-2 text-arctic hover:text-arctic/80 transition-colors"
          >
            View all {techniques.length} techniques
            <span className="text-lg">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
