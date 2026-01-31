// Audio context for generating tones
let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext && typeof window !== 'undefined') {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return audioContext!
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

  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

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
    // Audio not available
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

  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

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
    // Audio not available
  }
}

// Play a breathing guide tone (subtle rising/falling pitch during breath)
export function playBreathingGuideTone(
  phase: 'inhale' | 'exhale',
  duration: number,
  enabled: boolean
): (() => void) | undefined {
  if (!enabled || typeof window === 'undefined') return

  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

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
  // Initialize audio context on user interaction
  if (typeof window !== 'undefined') {
    getAudioContext()
  }
}
