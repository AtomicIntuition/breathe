// Audio context for generating tones
let audioContext: AudioContext | null = null
let isAudioUnlocked = false

// Get or create AudioContext - on iOS, this should ideally happen during user gesture
function getAudioContext(): AudioContext {
  if (!audioContext && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioContext = new AudioContextClass()
  }
  return audioContext!
}

// Create a fresh AudioContext during user gesture (iOS requirement for some versions)
function createFreshContext(): AudioContext {
  if (typeof window === 'undefined') return audioContext!

  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

  // Close old context if exists
  if (audioContext && audioContext.state !== 'closed') {
    try {
      audioContext.close()
    } catch {
      // Ignore close errors
    }
  }

  audioContext = new AudioContextClass()
  return audioContext
}

// Force unlock - call this synchronously during button clicks
// This is the CRITICAL function for iOS - must happen during user gesture
export function forceUnlock(): void {
  if (typeof window === 'undefined') return
  if (isAudioUnlocked && audioContext?.state === 'running') return

  try {
    // If no context or context is broken, create fresh one during gesture
    if (!audioContext || audioContext.state === 'closed') {
      createFreshContext()
    }

    const ctx = audioContext!

    // Resume must happen during gesture
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    // Play a real oscillator at near-zero volume (more reliable than silent buffer on iOS)
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(440, ctx.currentTime)
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime) // Nearly silent

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)

    isAudioUnlocked = true
  } catch (e) {
    console.warn('Audio unlock failed:', e)
  }
}

// Unlock audio for iOS/mobile browsers - must be called during user gesture
export function unlockAudio(): Promise<boolean> {
  return new Promise((resolve) => {
    if (isAudioUnlocked && audioContext?.state === 'running') {
      resolve(true)
      return
    }

    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    // Do the sync unlock first (critical for iOS)
    forceUnlock()

    // Then wait for context to be running
    const ctx = audioContext
    if (!ctx) {
      resolve(false)
      return
    }

    if (ctx.state === 'running') {
      resolve(true)
      return
    }

    // Poll for running state
    let attempts = 0
    const maxAttempts = 20
    const checkState = () => {
      attempts++
      if (ctx.state === 'running') {
        isAudioUnlocked = true
        resolve(true)
      } else if (attempts < maxAttempts) {
        setTimeout(checkState, 50)
      } else {
        resolve(false)
      }
    }

    setTimeout(checkState, 50)
  })
}

// Check if audio is available and unlocked
export function isAudioAvailable(): boolean {
  return isAudioUnlocked && audioContext !== null && audioContext.state === 'running'
}

type ChimeType = 'phaseChange' | 'sessionStart' | 'sessionComplete' | 'inhaleStart' | 'exhaleStart' | 'holdStart'

interface ChimeConfig {
  frequency: number
  duration: number
  type: OscillatorType
  attack?: number
  release?: number
  volume?: number
}

const chimeConfigs: Record<ChimeType, ChimeConfig> = {
  phaseChange: {
    frequency: 528,
    duration: 0.15,
    type: 'sine',
    attack: 0.01,
    release: 0.1,
    volume: 0.25,
  },
  sessionStart: {
    frequency: 440,
    duration: 0.25,
    type: 'sine',
    attack: 0.02,
    release: 0.15,
    volume: 0.3,
  },
  sessionComplete: {
    frequency: 660,
    duration: 0.4,
    type: 'sine',
    attack: 0.02,
    release: 0.3,
    volume: 0.3,
  },
  inhaleStart: {
    frequency: 396, // G4 - uplifting tone
    duration: 0.2,
    type: 'sine',
    attack: 0.02,
    release: 0.15,
    volume: 0.2,
  },
  exhaleStart: {
    frequency: 264, // C4 - grounding tone
    duration: 0.2,
    type: 'sine',
    attack: 0.02,
    release: 0.15,
    volume: 0.2,
  },
  holdStart: {
    frequency: 330, // E4 - neutral, calming
    duration: 0.15,
    type: 'sine',
    attack: 0.01,
    release: 0.12,
    volume: 0.15,
  },
}

export function playChime(type: ChimeType): void {
  if (typeof window === 'undefined') return
  if (!audioContext) return

  const ctx = audioContext

  // If context isn't running, try to resume
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  // Don't try to play if context is closed
  if (ctx.state === 'closed') return

  const playSound = () => {
    try {
      if (ctx.state !== 'running') return

      const config = chimeConfigs[type]
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = config.type
      oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime)

      const attack = config.attack ?? 0.01
      const release = config.release ?? config.duration * 0.7
      const volume = config.volume ?? 0.3

      // Smooth envelope for less abrupt sounds
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack)
      gainNode.gain.setValueAtTime(volume, ctx.currentTime + config.duration - release)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + config.duration)
    } catch {
      // Silent fail
    }
  }

  // If context is running, play immediately
  if (ctx.state === 'running') {
    playSound()
  } else {
    // Wait for context to resume, then try to play
    setTimeout(() => playSound(), 150)
  }
}

// Play a phase-specific chime based on the phase type
export function playPhaseChime(phase: 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale'): void {
  switch (phase) {
    case 'inhale':
      playChime('inhaleStart')
      break
    case 'exhale':
      playChime('exhaleStart')
      break
    case 'hold':
    case 'holdAfterExhale':
      playChime('holdStart')
      break
    default:
      playChime('phaseChange')
  }
}

export function playSessionComplete(): void {
  if (typeof window === 'undefined') return
  if (!audioContext) return

  const ctx = audioContext

  // If context isn't running, try to resume
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  // Don't try to play if context is closed
  if (ctx.state === 'closed') return

  const playChord = () => {
    try {
      if (ctx.state !== 'running') return

      // Play a pleasant ascending chord (C major arpeggio)
      const frequencies = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      const duration = 1.2

      frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime)

        const startTime = ctx.currentTime + index * 0.1
        const noteVolume = 0.15 - index * 0.02 // Slightly quieter for higher notes

        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(noteVolume, startTime + 0.03)
        gainNode.gain.setValueAtTime(noteVolume, startTime + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
      })
    } catch {
      // Silent fail
    }
  }

  // If context is running, play immediately
  if (ctx.state === 'running') {
    playChord()
  } else {
    // Wait for context to resume
    setTimeout(() => playChord(), 150)
  }
}

// Play a breathing guide tone (subtle rising/falling pitch during breath)
export function playBreathingGuideTone(
  phase: 'inhale' | 'exhale',
  duration: number,
  enabled: boolean
): (() => void) | undefined {
  if (!enabled || typeof window === 'undefined') return
  if (!audioContext || audioContext.state !== 'running') return

  try {
    const ctx = audioContext

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'

    const startFreq = phase === 'inhale' ? 220 : 330
    const endFreq = phase === 'inhale' ? 330 : 220

    oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime)
    oscillator.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + duration)

    // Very subtle volume
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.5)
    gainNode.gain.setValueAtTime(0.05, ctx.currentTime + duration - 0.5)
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)

    // Return a cleanup function
    return () => {
      try {
        oscillator.stop()
      } catch {
        // Already stopped
      }
    }
  } catch {
    // Audio not available
  }
}

// Volume control
let globalVolume = 0.5

export function setVolume(volume: number): void {
  globalVolume = Math.max(0, Math.min(1, volume))
}

export function getVolume(): number {
  return globalVolume
}

export function initAudio(): void {
  // Initialize and unlock audio context on user interaction
  // This MUST be called during a user gesture (click/touch)
  if (typeof window === 'undefined') return
  forceUnlock()
}
