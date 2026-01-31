type HapticPattern =
  | 'inhale'
  | 'exhale'
  | 'hold'
  | 'holdAfterExhale'
  | 'phaseChange'
  | 'sessionStart'
  | 'sessionComplete'
  | 'buttonPress'

// Vibration patterns: numbers represent duration in ms
// For arrays: [vibrate, pause, vibrate, pause, ...]
const hapticPatterns: Record<HapticPattern, number | number[]> = {
  // Inhale: gentle pulse to signal start of breath in
  inhale: [30, 20, 40],

  // Exhale: slightly softer pulse
  exhale: [25, 15, 30],

  // Hold after inhale: subtle double tap
  hold: [20, 30, 20, 30, 20],

  // Hold after exhale: very subtle single pulse
  holdAfterExhale: [15, 20, 15],

  // Generic phase change
  phaseChange: 40,

  // Session start: distinct pattern
  sessionStart: [50, 30, 50],

  // Session complete: celebratory pattern
  sessionComplete: [100, 50, 100, 50, 150, 50, 200],

  // Button press: quick feedback
  buttonPress: 25,
}

export function supportsHaptics(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator
}

export function triggerHaptic(pattern: HapticPattern): void {
  if (!supportsHaptics()) return

  try {
    navigator.vibrate(hapticPatterns[pattern])
  } catch {
    // Haptics not available or blocked
  }
}

// Trigger haptic for a specific breathing phase
export function triggerPhaseHaptic(phase: 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale'): void {
  if (!supportsHaptics()) return

  try {
    navigator.vibrate(hapticPatterns[phase])
  } catch {
    // Haptics not available or blocked
  }
}

// Continuous gentle vibration during a phase (for optional guide mode)
let continuousHapticInterval: NodeJS.Timeout | null = null

export function startContinuousHaptic(interval: number = 1000): void {
  if (!supportsHaptics()) return

  stopContinuousHaptic()

  continuousHapticInterval = setInterval(() => {
    try {
      navigator.vibrate(15)
    } catch {
      // Haptics not available
    }
  }, interval)
}

export function stopContinuousHaptic(): void {
  if (continuousHapticInterval) {
    clearInterval(continuousHapticInterval)
    continuousHapticInterval = null
  }
}

export function stopHaptic(): void {
  if (!supportsHaptics()) return

  try {
    navigator.vibrate(0)
    stopContinuousHaptic()
  } catch {
    // Haptics not available
  }
}

// Intensity levels for different contexts
type HapticIntensity = 'light' | 'medium' | 'strong'

const intensityMultipliers: Record<HapticIntensity, number> = {
  light: 0.5,
  medium: 1,
  strong: 1.5,
}

export function triggerHapticWithIntensity(
  pattern: HapticPattern,
  intensity: HapticIntensity = 'medium'
): void {
  if (!supportsHaptics()) return

  const basePattern = hapticPatterns[pattern]
  const multiplier = intensityMultipliers[intensity]

  let scaledPattern: number | number[]

  if (typeof basePattern === 'number') {
    scaledPattern = Math.round(basePattern * multiplier)
  } else {
    scaledPattern = basePattern.map((value, index) => {
      // Only scale vibration durations (even indices), not pauses
      return index % 2 === 0 ? Math.round(value * multiplier) : value
    })
  }

  try {
    navigator.vibrate(scaledPattern)
  } catch {
    // Haptics not available or blocked
  }
}
