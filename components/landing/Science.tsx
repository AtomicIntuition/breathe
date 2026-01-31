'use client'

import { motion } from 'framer-motion'
import { FlaskConical, Brain, Heart, Activity } from 'lucide-react'

const stats = [
  {
    icon: Heart,
    value: '50%',
    label: 'Reduction in cortisol',
    source: 'Controlled breathing studies',
  },
  {
    icon: Brain,
    value: '3 min',
    label: 'To shift nervous system state',
    source: 'Huberman Lab research',
  },
  {
    icon: Activity,
    value: '20%',
    label: 'Improvement in HRV',
    source: 'Heart rate variability studies',
  },
]

const sources = [
  {
    name: 'Stanford Medicine',
    description: 'Physiological sigh research by Dr. Andrew Huberman',
  },
  {
    name: 'Navy Medicine',
    description: 'Official tactical breathing protocols',
  },
  {
    name: 'SEALFIT',
    description: 'Box breathing methodology by Mark Divine',
  },
]

export function Science() {
  return (
    <section className="py-24 px-4 relative bg-navy-light/50" id="science">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-arctic/10 text-arctic text-sm mb-6">
            <FlaskConical className="w-4 h-4" />
            Backed by Science
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Not Just Ancient Wisdom.
            <br />
            <span className="text-slate-light">Modern Science.</span>
          </h2>

          <p className="text-slate-light text-lg max-w-2xl mx-auto">
            These techniques are validated by cutting-edge neuroscience and used by
            elite performers worldwide.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Icon className="w-8 h-8 text-arctic mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-bold text-gold mb-2">
                  {stat.value}
                </div>
                <p className="text-white font-medium mb-1">{stat.label}</p>
                <p className="text-sm text-slate">{stat.source}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Sources */}
        <motion.div
          className="border-t border-white/10 pt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-center text-sm font-semibold text-slate uppercase tracking-wider mb-8">
            Research Sources
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {sources.map((source, index) => (
              <motion.div
                key={source.name}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <p className="font-semibold text-white mb-1">{source.name}</p>
                <p className="text-sm text-slate">{source.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
