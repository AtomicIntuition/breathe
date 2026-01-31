'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const testimonials = [
  {
    quote:
      'Box breathing completely transformed how I handle high-pressure situations. I use it before every important meeting.',
    author: 'Michael R.',
    role: 'CEO, Tech Startup',
    rating: 5,
  },
  {
    quote:
      "The 4-7-8 technique finally solved my insomnia. I fall asleep in minutes now instead of lying awake for hours.",
    author: 'Sarah L.',
    role: 'Emergency Room Nurse',
    rating: 5,
  },
  {
    quote:
      'As a former Marine, I was skeptical. But this app makes the techniques I learned accessible and easy to practice daily.',
    author: 'James K.',
    role: 'Veteran, Business Owner',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-slate-light text-lg">
            From executives to athletes, people are transforming their lives.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="bordered" className="p-6 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-gold text-gold"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-slate-light flex-1 mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div>
                  <p className="font-semibold text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-slate">{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
