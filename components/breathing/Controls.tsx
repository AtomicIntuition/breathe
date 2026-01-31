'use client'

import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { triggerHaptic } from '@/lib/haptics'
import { useStore } from '@/store/useStore'

interface ControlsProps {
  isActive: boolean
  isPaused: boolean
  isComplete: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onRestart: () => void
}

export function Controls({
  isActive,
  isPaused,
  isComplete,
  onStart,
  onPause,
  onResume,
  onStop,
  onRestart,
}: ControlsProps) {
  const { hapticEnabled } = useStore()

  // Handle button press with haptic feedback
  const handlePress = useCallback((action: () => void) => {
    if (hapticEnabled) {
      triggerHaptic('phaseChange')
    }
    action()
  }, [hapticEnabled])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case ' ':
        case 'Space':
          e.preventDefault()
          if (isComplete) {
            handlePress(onRestart)
          } else if (!isActive) {
            handlePress(onStart)
          } else if (isPaused) {
            handlePress(onResume)
          } else {
            handlePress(onPause)
          }
          break
        case 'Escape':
          if (isActive) {
            handlePress(onStop)
          }
          break
        case 'r':
        case 'R':
          if (isComplete || !isActive) {
            handlePress(onRestart)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, isPaused, isComplete, onStart, onPause, onResume, onStop, onRestart, handlePress])

  if (isComplete) {
    return (
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={() => handlePress(onRestart)}
          glow
          className="gap-2 touch-target spring-transition"
        >
          <RotateCcw className="w-5 h-5" />
          Start Again
        </Button>
        <p className="text-xs text-slate-light hidden sm:block">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs">Space</kbd>
        </p>
      </motion.div>
    )
  }

  if (!isActive) {
    return (
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={() => handlePress(onStart)}
          glow
          className="gap-2 touch-target spring-transition"
        >
          <Play className="w-5 h-5" />
          Begin Session
        </Button>
        <p className="text-xs text-slate-light hidden sm:block">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs">Space</kbd> to start
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="flex items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Button
        variant="secondary"
        size="lg"
        onClick={() => handlePress(isPaused ? onResume : onPause)}
        className="gap-2 touch-target spring-transition"
      >
        <motion.div
          key={isPaused ? 'play' : 'pause'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {isPaused ? (
            <Play className="w-5 h-5" />
          ) : (
            <Pause className="w-5 h-5" />
          )}
        </motion.div>
        <span>{isPaused ? 'Resume' : 'Pause'}</span>
      </Button>

      <Button
        variant="ghost"
        size="lg"
        onClick={() => handlePress(onStop)}
        className="gap-2 touch-target"
      >
        <X className="w-5 h-5" />
        End
      </Button>

      {/* Keyboard hint */}
      <div className="hidden sm:flex items-center gap-2 text-xs text-slate ml-2">
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs">Space</kbd>
        <span>to {isPaused ? 'resume' : 'pause'}</span>
      </div>
    </motion.div>
  )
}
