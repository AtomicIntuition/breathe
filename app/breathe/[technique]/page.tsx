'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Settings, Volume2, VolumeX, Vibrate } from 'lucide-react'
import { BreathingCircle } from '@/components/breathing/BreathingCircle'
import { Timer } from '@/components/breathing/Timer'
import { Controls } from '@/components/breathing/Controls'
import { PhaseIndicator } from '@/components/breathing/PhaseIndicator'
import { SessionComplete } from '@/components/breathing/SessionComplete'
import { TechniqueGuide } from '@/components/breathing/TechniqueGuide'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getTechniqueById, calculateSessionDuration } from '@/lib/techniques'
import { useBreathingSession } from '@/hooks/useBreathingSession'
import { useStore } from '@/store/useStore'
import { addSessionRecord, updateStreak, setLastTechnique } from '@/lib/storage'
import { unlockAudio } from '@/lib/sounds'

export default function TechniquePage() {
  const params = useParams()
  const router = useRouter()
  const techniqueId = params.technique as string
  const technique = getTechniqueById(techniqueId)

  const [cycles, setCycles] = useState(5)
  const [showSettings, setShowSettings] = useState(false)
  const { soundEnabled, setSoundEnabled, hapticEnabled, setHapticEnabled } = useStore()

  const {
    state,
    currentPhase,
    currentInstruction,
    progress,
    phaseProgress,
    start,
    pause,
    resume,
    stop,
    isComplete,
  } = useBreathingSession(technique!, cycles)

  useEffect(() => {
    if (technique) {
      setCycles(technique.defaultCycles)
    }
  }, [technique])

  // Unlock audio on first user interaction (mobile browsers require this)
  useEffect(() => {
    const handleInteraction = () => {
      unlockAudio()
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('click', handleInteraction)
    }

    document.addEventListener('touchstart', handleInteraction, { passive: true })
    document.addEventListener('click', handleInteraction, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleInteraction)
      document.removeEventListener('click', handleInteraction)
    }
  }, [])

  useEffect(() => {
    if (isComplete && technique) {
      const duration = calculateSessionDuration(technique, cycles)
      addSessionRecord({
        techniqueId: technique.id,
        cycles,
        duration,
        completedAt: new Date().toISOString(),
      })
      updateStreak()
      setLastTechnique(technique.id)
    }
  }, [isComplete, technique, cycles])

  if (!technique) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Technique not found</h1>
          <Link href="/breathe">
            <Button variant="primary">Choose a Technique</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalDuration = calculateSessionDuration(technique, cycles)
  const themeClass = `theme-${technique.id}`

  // During active session, use fixed centered layout
  if (state.isActive) {
    return (
      <main className={`h-screen bg-gradient-dark flex flex-col overflow-hidden ${themeClass}`}>
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <SessionComplete
                key="complete"
                technique={technique}
                cycles={cycles}
                duration={state.totalTimeElapsed}
                onRestart={start}
              />
            ) : (
              <motion.div
                key="session"
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-8">
                  <BreathingCircle
                    phase={currentPhase}
                    phaseProgress={phaseProgress}
                    isActive={state.isActive}
                    isPaused={state.isPaused}
                    timeRemaining={state.phaseTimeRemaining}
                    instruction={currentInstruction}
                    techniqueId={technique.id}
                  />
                </div>

                <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <PhaseIndicator
                    phases={technique.phases}
                    currentPhaseIndex={state.currentPhaseIndex}
                    isActive={state.isActive}
                    phaseProgress={phaseProgress}
                  />
                </motion.div>

                <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Timer
                    elapsed={state.totalTimeElapsed}
                    total={totalDuration}
                    cycle={state.currentCycle}
                    totalCycles={cycles}
                  />
                </motion.div>

                <Controls
                  isActive={state.isActive}
                  isPaused={state.isPaused}
                  isComplete={isComplete}
                  onStart={start}
                  onPause={pause}
                  onResume={resume}
                  onStop={stop}
                  onRestart={start}
                />

                {!state.isPaused && (
                  <motion.p
                    className="text-sm text-slate mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                  >
                    Tap anywhere or press Space to pause
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tap area to pause */}
        {!state.isPaused && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => pause()}
            style={{ cursor: 'pointer' }}
          />
        )}
      </main>
    )
  }

  // Before session starts - normal scrollable page
  return (
    <main className={`min-h-screen bg-gradient-dark ${themeClass}`}>
      {/* Header */}
      <header className="px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/breathe">
            <Button variant="ghost" size="sm" className="touch-target">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="touch-target"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-4 pb-4">
          <Card variant="bordered" className="max-w-md mx-auto p-4">
            <h3 className="font-semibold mb-4">Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-light">Cycles</span>
                <div className="flex items-center gap-3">
                  <button
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition touch-target"
                    onClick={() => setCycles(Math.max(1, cycles - 1))}
                  >
                    -
                  </button>
                  <span className="font-mono w-8 text-center text-lg">{cycles}</span>
                  <button
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition touch-target"
                    onClick={() => setCycles(Math.min(20, cycles + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-light">Sound</span>
                <button
                  className={`p-3 rounded-lg transition touch-target ${
                    soundEnabled ? 'bg-arctic/20 text-arctic' : 'bg-white/10 text-slate'
                  }`}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-light">Vibration</span>
                <button
                  className={`p-3 rounded-lg transition touch-target ${
                    hapticEnabled ? 'bg-arctic/20 text-arctic' : 'bg-white/10 text-slate'
                  }`}
                  onClick={() => setHapticEnabled(!hapticEnabled)}
                >
                  <Vibrate className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 py-8 pb-16 overflow-x-hidden">
        <div className="flex flex-col items-center max-w-2xl mx-auto w-full">
          {/* Technique info */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{technique.name}</h1>
            <p className="text-slate-light mb-4">{technique.purpose}</p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sm text-slate-light mb-4">
              <span>Pattern:</span>
              <span className="font-mono text-white">{technique.pattern}</span>
            </div>

            <TechniqueGuide technique={technique} cycles={cycles} />
          </div>

          {/* Breathing Circle (preview state) */}
          <div className="mb-8">
            <BreathingCircle
              phase={currentPhase}
              phaseProgress={phaseProgress}
              isActive={state.isActive}
              isPaused={state.isPaused}
              timeRemaining={state.phaseTimeRemaining}
              instruction={currentInstruction}
              techniqueId={technique.id}
            />
          </div>

          {/* Start button */}
          <Controls
            isActive={state.isActive}
            isPaused={state.isPaused}
            isComplete={isComplete}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onStop={stop}
            onRestart={start}
          />
        </div>
      </div>
    </main>
  )
}
