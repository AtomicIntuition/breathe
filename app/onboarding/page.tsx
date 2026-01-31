'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { WelcomeStep } from '@/components/onboarding/WelcomeStep'
import { GoalStep } from '@/components/onboarding/GoalStep'
import { TechniqueIntro } from '@/components/onboarding/TechniqueIntro'
import { getRecommendedTechnique } from '@/lib/techniques'
import { useStore } from '@/store/useStore'

type Step = 'welcome' | 'goal' | 'technique'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('welcome')
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const { setOnboardingComplete, setUserGoal, onboardingComplete } = useStore()

  // Redirect if already completed onboarding
  useEffect(() => {
    if (onboardingComplete) {
      router.replace('/breathe')
    }
  }, [onboardingComplete, router])

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal)
    setUserGoal(goal)
    setStep('technique')
  }

  const handleStart = () => {
    setOnboardingComplete(true)
    const technique = getRecommendedTechnique(selectedGoal || 'focus')
    router.push(`/breathe/${technique.id}`)
  }

  const recommendedTechnique = getRecommendedTechnique(selectedGoal || 'focus')

  return (
    <main className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 py-12">
      {/* Progress indicator */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {['welcome', 'goal', 'technique'].map((s, i) => (
          <motion.div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              step === s
                ? 'w-8 bg-arctic'
                : i < ['welcome', 'goal', 'technique'].indexOf(step)
                ? 'w-4 bg-arctic/50'
                : 'w-4 bg-white/20'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <WelcomeStep key="welcome" onNext={() => setStep('goal')} />
        )}

        {step === 'goal' && (
          <GoalStep
            key="goal"
            onNext={handleGoalSelect}
            onBack={() => setStep('welcome')}
          />
        )}

        {step === 'technique' && (
          <TechniqueIntro
            key="technique"
            technique={recommendedTechnique}
            onStart={handleStart}
            onBack={() => setStep('goal')}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
