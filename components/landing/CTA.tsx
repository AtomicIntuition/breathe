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
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(74, 144, 217, 0.15) 0%, transparent 70%)',
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
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform
            <br />
            <span className="gradient-text">Your Breath?</span>
          </h2>

          <p className="text-lg text-slate-light mb-10 max-w-xl mx-auto">
            Join thousands who have discovered the power of controlled breathing.
            Your first session starts now.
          </p>

          <Link href="/breathe">
            <Button size="lg" glow className="mb-10">
              Start Your First Session
            </Button>
          </Link>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.text}
                  className="flex items-center gap-2 text-slate-light"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  <Icon className="w-4 h-4 text-arctic" />
                  <span className="text-sm">{benefit.text}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="mt-24 text-center text-sm text-slate"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <p className="mb-2">BREATHE SPEC</p>
        <p>Train Your Breath. Master Your Mind.</p>
      </motion.footer>
    </section>
  )
}
