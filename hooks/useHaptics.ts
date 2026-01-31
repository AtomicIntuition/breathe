'use client'

import { useCallback } from 'react'
import { supportsHaptics, triggerHaptic, stopHaptic } from '@/lib/haptics'
import { useStore } from '@/store/useStore'

type HapticPattern = 'inhale' | 'exhale' | 'hold' | 'phaseChange' | 'sessionComplete'

export function useHaptics() {
  const { hapticEnabled } = useStore()

  const vibrate = useCallback(
    (pattern: HapticPattern) => {
      if (hapticEnabled && supportsHaptics()) {
        triggerHaptic(pattern)
      }
    },
    [hapticEnabled]
  )

  const stop = useCallback(() => {
    stopHaptic()
  }, [])

  return {
    vibrate,
    stop,
    isSupported: supportsHaptics(),
    isEnabled: hapticEnabled,
  }
}
