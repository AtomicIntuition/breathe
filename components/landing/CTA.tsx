'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Shield, Zap, Lock } from 'lucide-react'

const benefits = [
  { icon: Zap, text: 'Free forever' },
  { icon: Lock, text: 'No signup required' },
  { icon: Shield, text: 'Your data stays on device' },
]

export function CTA() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Enhanced background glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 50%, rgba(74, 144, 217, 0.15) 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 50% 30% at 50% 60%, rgba(201, 162, 39, 0.08) 0%, transparent 60%)`,
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 tracking-tight">
            Ready to Transform
            <br />
            <span className="gradient-text">Your Breath?</span>
          </h2>

          <p className="text-lg md:text-xl text-slate-light mb-12 max-w-xl mx-auto leading-relaxed">
            Join thousands who have discovered the power of controlled breathing.
            Your first session starts now.
          </p>

          <Link href="/breathe">
            <Button size="lg" glow className="mb-12 text-lg px-12 py-5">
              Start Your First Session
            </Button>
          </Link>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.text}
                  className="flex items-center gap-2.5 text-slate-light"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  <div className="w-8 h-8 rounded-lg bg-arctic/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-arctic" />
                  </div>
                  <span className="text-sm font-medium">{benefit.text}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="mt-32 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm font-semibold text-slate-light mb-2 tracking-wide">BREATHE SPEC</p>
        <p className="text-sm text-slate">Train Your Breath. Master Your Mind.</p>
      </motion.footer>
    </section>
  )
}
