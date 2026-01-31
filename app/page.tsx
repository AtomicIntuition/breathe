import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Science } from '@/components/landing/Science'
import { Testimonials } from '@/components/landing/Testimonials'
import { CTA } from '@/components/landing/CTA'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Science />
      <Testimonials />
      <CTA />
    </main>
  )
}
