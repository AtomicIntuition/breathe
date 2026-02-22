'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { BreathingTechnique, BreathingPhase, Phase, getPhasesForRound } from '@/lib/techniques'
import { playChime, playSessionComplete, forceUnlock } from '@/lib/sounds'
import { triggerHaptic } from '@/lib/haptics'
import { useStore } from '@/store/useStore'

interface SessionState {
  isActive: boolean
  isPaused: boolean
  currentPhaseIndex: number
  currentCycle: number
  phaseTimeRemaining: number
  totalTimeElapsed: number
}

interface UseBreathingSessionReturn {
  state: SessionState
  currentPhase: Phase | null
  currentInstruction: string
  progress: number
  phaseProgress: number
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  isComplete: boolean
  activePhases: BreathingPhase[]
}

export function useBreathingSession(
  technique: BreathingTechnique,
  cycles: number
): UseBreathingSessionReturn {
  const { soundEnabled, hapticEnabled } = useStore()

  const getActivePhasesForCycle = useCallback((cycle: number) => {
    return getPhasesForRound(technique, cycle - 1)
  }, [technique])

  const initialPhases = getActivePhasesForCycle(1)

  const [state, setState] = useState<SessionState>({
    isActive: false,
    isPaused: false,
    currentPhaseIndex: 0,
    currentCycle: 1,
    phaseTimeRemaining: initialPhases[0]?.duration ?? 0,
    totalTimeElapsed: 0,
  })

  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastTickRef = useRef<number>(0)

  const activePhases = useMemo(() => getActivePhasesForCycle(state.currentCycle), [getActivePhasesForCycle, state.currentCycle])

  const totalDuration = useMemo(() => {
    if (technique.rounds) {
      let total = 0
      for (let i = 0; i < cycles; i++) {
        const phases = getPhasesForRound(technique, i)
        total += phases.reduce((sum, p) => sum + p.duration, 0)
      }
      return total
    }
    return technique.phases.reduce((sum, p) => sum + p.duration, 0) * cycles
  }, [technique, cycles])

  const currentPhaseDuration = activePhases[state.currentPhaseIndex]?.duration ?? 1

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    const now = Date.now()
    const delta = (now - lastTickRef.current) / 1000
    lastTickRef.current = now

    setState((prev) => {
      if (!prev.isActive || prev.isPaused) return prev

      let newPhaseTime = prev.phaseTimeRemaining - delta
      let newPhaseIndex = prev.currentPhaseIndex
      let newCycle = prev.currentCycle
      let phaseChanged = false
      let currentRoundPhases = getPhasesForRound(technique, newCycle - 1)

      // Check if phase is complete
      while (newPhaseTime <= 0) {
        newPhaseIndex++
        phaseChanged = true

        if (newPhaseIndex >= currentRoundPhases.length) {
          newPhaseIndex = 0
          newCycle++

          if (newCycle > cycles) {
            // Session complete
            clearTimer()
            setIsComplete(true)
            if (soundEnabled) playSessionComplete()
            if (hapticEnabled) triggerHaptic('sessionComplete')
            return {
              ...prev,
              isActive: false,
              isPaused: false,
              currentPhaseIndex: 0,
              currentCycle: cycles,
              phaseTimeRemaining: 0,
              totalTimeElapsed: totalDuration,
            }
          }

          // Re-fetch phases for the new round
          currentRoundPhases = getPhasesForRound(technique, newCycle - 1)
        }

        newPhaseTime += currentRoundPhases[newPhaseIndex].duration
      }

      // Play sound on phase change
      if (phaseChanged) {
        if (soundEnabled) playChime('phaseChange')
        if (hapticEnabled) triggerHaptic('phaseChange')
      }

      return {
        ...prev,
        currentPhaseIndex: newPhaseIndex,
        currentCycle: newCycle,
        phaseTimeRemaining: Math.max(0, newPhaseTime),
        totalTimeElapsed: prev.totalTimeElapsed + delta,
      }
    })
  }, [technique, cycles, clearTimer, totalDuration, soundEnabled, hapticEnabled])

  const start = useCallback(() => {
    clearTimer()
    setIsComplete(false)
    lastTickRef.current = Date.now()

    const firstRoundPhases = getPhasesForRound(technique, 0)
    setState({
      isActive: true,
      isPaused: false,
      currentPhaseIndex: 0,
      currentCycle: 1,
      phaseTimeRemaining: firstRoundPhases[0]?.duration ?? 0,
      totalTimeElapsed: 0,
    })

    // Unlock audio on mobile - this MUST happen during user gesture (synchronously!)
    if (soundEnabled) {
      forceUnlock() // Synchronous unlock during gesture (critical for iOS)
      // Small delay to let context resume before playing
      setTimeout(() => playChime('sessionStart'), 50)
    }
    if (hapticEnabled) triggerHaptic('phaseChange')

    intervalRef.current = setInterval(tick, 50) // 20fps for smooth animation
  }, [technique, clearTimer, tick, soundEnabled, hapticEnabled])

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: true }))
  }, [])

  const resume = useCallback(() => {
    lastTickRef.current = Date.now()
    setState((prev) => ({ ...prev, isPaused: false }))
  }, [])

  const stop = useCallback(() => {
    clearTimer()
    const firstRoundPhases = getPhasesForRound(technique, 0)
    setState({
      isActive: false,
      isPaused: false,
      currentPhaseIndex: 0,
      currentCycle: 1,
      phaseTimeRemaining: firstRoundPhases[0]?.duration ?? 0,
      totalTimeElapsed: 0,
    })
    setIsComplete(false)
  }, [technique, clearTimer])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  const currentPhase = activePhases[state.currentPhaseIndex]?.phase ?? null
  const currentInstruction = activePhases[state.currentPhaseIndex]?.instruction ?? ''
  const progress = totalDuration > 0 ? (state.totalTimeElapsed / totalDuration) * 100 : 0
  const phaseProgress = currentPhaseDuration > 0
    ? ((currentPhaseDuration - state.phaseTimeRemaining) / currentPhaseDuration) * 100
    : 0

  return {
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
  }
}
