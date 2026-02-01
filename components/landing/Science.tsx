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
    <section className="py-32 px-4 relative" id="science">
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.5) 50%, transparent 100%)`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-arctic/10 border border-arctic/20 text-arctic text-sm font-medium mb-8">
            <FlaskConical className="w-4 h-4" />
            Backed by Science
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            Not Just Ancient Wisdom.
            <br />
            <span className="text-slate-light">Modern Science.</span>
          </h2>

          <p className="text-slate-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            These techniques are validated by cutting-edge neuroscience and used by
            elite performers worldwide.
          </p>
        </motion.div>

        {/* Stats Grid - refined */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                className="text-center p-8 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-arctic/10 mb-6">
                  <Icon className="w-7 h-7 text-arctic" />
                </div>
                <div className="text-5xl md:text-6xl font-bold text-gold mb-3 tracking-tight">
                  {stat.value}
                </div>
                <p className="text-white font-medium text-lg mb-2">{stat.label}</p>
                <p className="text-sm text-slate">{stat.source}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Sources */}
        <motion.div
          className="border-t border-white/[0.08] pt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-center text-xs font-semibold text-slate uppercase tracking-widest mb-10">
            Research Sources
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {sources.map((source, index) => (
              <motion.div
                key={source.name}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <p className="font-semibold text-white text-lg mb-2">{source.name}</p>
                <p className="text-sm text-slate leading-relaxed">{source.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
