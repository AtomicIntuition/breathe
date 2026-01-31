'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseTimerOptions {
  onTick?: (time: number) => void
  onComplete?: () => void
}

interface UseTimerReturn {
  time: number
  isRunning: boolean
  start: (duration?: number) => void
  pause: () => void
  resume: () => void
  reset: () => void
  setTime: (time: number) => void
}

export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const targetTimeRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const elapsedRef = useRef<number>(0)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback((duration?: number) => {
    clearTimer()
    setTime(0)
    elapsedRef.current = 0
    targetTimeRef.current = duration ?? null
    startTimeRef.current = Date.now()
    setIsRunning(true)

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000) + elapsedRef.current
      setTime(elapsed)
      options.onTick?.(elapsed)

      if (targetTimeRef.current !== null && elapsed >= targetTimeRef.current) {
        clearTimer()
        setIsRunning(false)
        options.onComplete?.()
      }
    }, 100) // Update every 100ms for smooth display
  }, [clearTimer, options])

  const pause = useCallback(() => {
    if (isRunning) {
      clearTimer()
      elapsedRef.current = time
      setIsRunning(false)
    }
  }, [clearTimer, isRunning, time])

  const resume = useCallback(() => {
    if (!isRunning && time > 0) {
      startTimeRef.current = Date.now()
      setIsRunning(true)

      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000) + elapsedRef.current
        setTime(elapsed)
        options.onTick?.(elapsed)

        if (targetTimeRef.current !== null && elapsed >= targetTimeRef.current) {
          clearTimer()
          setIsRunning(false)
          options.onComplete?.()
        }
      }, 100)
    }
  }, [clearTimer, isRunning, time, options])

  const reset = useCallback(() => {
    clearTimer()
    setTime(0)
    elapsedRef.current = 0
    targetTimeRef.current = null
    setIsRunning(false)
  }, [clearTimer])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return {
    time,
    isRunning,
    start,
    pause,
    resume,
    reset,
    setTime,
  }
}
