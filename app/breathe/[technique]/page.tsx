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
import { forceUnlock } from '@/lib/sounds'

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
    activePhases,
  } = useBreathingSession(technique!, cycles)

  const isTableTechnique = !!technique?.rounds

  useEffect(() => {
    if (technique) {
      setCycles(technique.defaultCycles)
    }
  }, [technique])

  // Unlock audio on first user interaction (mobile browsers require this)
  useEffect(() => {
    const handleInteraction = () => {
      forceUnlock() // Synchronous unlock during user gesture
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
      <main className={`h-screen flex flex-col overflow-hidden ${themeClass}`}>
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
                <div className="mb-10">
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

                <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <PhaseIndicator
                    phases={activePhases}
                    currentPhaseIndex={state.currentPhaseIndex}
                    isActive={state.isActive}
                    phaseProgress={phaseProgress}
                  />
                </motion.div>

                <motion.div className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Timer
                    elapsed={state.totalTimeElapsed}
                    total={totalDuration}
                    cycle={state.currentCycle}
                    totalCycles={cycles}
                    cycleLabel={isTableTechnique ? 'Round' : 'Cycle'}
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
                    className="text-sm text-slate mt-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
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
    <main className={`min-h-screen ${themeClass}`}>
      {/* Header - refined */}
      <header className="px-4 py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/breathe">
            <Button variant="ghost" size="sm" className="touch-target gap-2">
              <ArrowLeft className="w-4 h-4" />
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

      {/* Settings Panel - refined */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="px-4 pb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card variant="bordered" className="max-w-md mx-auto p-5">
              <h3 className="font-semibold mb-5 text-lg">Settings</h3>

              <div className="space-y-5">
                {isTableTechnique ? (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-light">Rounds</span>
                    <span className="font-mono text-xl text-white">{cycles} (fixed)</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-light">Cycles</span>
                    <div className="flex items-center gap-4">
                      <button
                        className="w-10 h-10 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center hover:bg-white/10 transition-colors touch-target"
                        onClick={() => setCycles(Math.max(1, cycles - 1))}
                      >
                        -
                      </button>
                      <span className="font-mono w-8 text-center text-xl">{cycles}</span>
                      <button
                        className="w-10 h-10 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center hover:bg-white/10 transition-colors touch-target"
                        onClick={() => setCycles(Math.min(20, cycles + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-light">Sound</span>
                  <button
                    className={`p-3 rounded-lg transition-all touch-target ${
                      soundEnabled ? 'bg-arctic/15 text-arctic border border-arctic/20' : 'bg-white/5 text-slate border border-white/[0.08]'
                    }`}
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-light">Vibration</span>
                  <button
                    className={`p-3 rounded-lg transition-all touch-target ${
                      hapticEnabled ? 'bg-arctic/15 text-arctic border border-arctic/20' : 'bg-white/5 text-slate border border-white/[0.08]'
                    }`}
                    onClick={() => setHapticEnabled(!hapticEnabled)}
                  >
                    <Vibrate className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="px-4 py-8 pb-20 overflow-x-hidden">
        <div className="flex flex-col items-center max-w-2xl mx-auto w-full">
          {/* Technique info - refined typography */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 tracking-tight">{technique.name}</h1>
            <p className="text-slate-light mb-6 max-w-md mx-auto leading-relaxed">{technique.purpose}</p>

            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/[0.08] text-sm text-slate-light mb-6">
              <span>Pattern:</span>
              <span className="font-mono text-white text-base">{technique.pattern}</span>
            </div>

            <TechniqueGuide technique={technique} cycles={cycles} />
          </div>

          {/* Breathing Circle (preview state) */}
          <div className="mb-10">
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
