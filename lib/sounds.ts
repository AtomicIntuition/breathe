// Sound system using HTML5 Audio for maximum iOS compatibility

type SoundName = 'phase-change' | 'session-start' | 'session-complete' | 'inhale' | 'exhale' | 'hold'

// Audio elements cache
const audioElements: Map<SoundName, HTMLAudioElement> = new Map()
let isUnlocked = false
let isInitialized = false

// Sound file paths
const soundPaths: Record<SoundName, string> = {
  'phase-change': '/sounds/phase-change.wav',
  'session-start': '/sounds/session-start.wav',
  'session-complete': '/sounds/session-complete.wav',
  'inhale': '/sounds/inhale.wav',
  'exhale': '/sounds/exhale.wav',
  'hold': '/sounds/hold.wav',
}

// Initialize audio elements
function initAudioElements(): void {
  if (isInitialized || typeof window === 'undefined') return

  for (const [name, path] of Object.entries(soundPaths)) {
    const audio = new Audio(path)
    audio.preload = 'auto'
    audio.volume = 0.5
    audioElements.set(name as SoundName, audio)
  }

  isInitialized = true
}

// Force unlock - MUST be called during user gesture (tap/click)
// This is critical for iOS Safari
export function forceUnlock(): void {
  if (typeof window === 'undefined') return
  if (isUnlocked) return

  // Initialize if needed
  initAudioElements()

  // On iOS, we need to play each audio element briefly during a user gesture
  // This "unlocks" them for future programmatic playback
  audioElements.forEach((audio) => {
    // Save current state
    const wasPlaying = !audio.paused

    // Play and immediately pause to unlock
    audio.muted = true
    const playPromise = audio.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          audio.pause()
          audio.currentTime = 0
          audio.muted = false
        })
        .catch(() => {
          // Ignore errors - some browsers don't support this
          audio.muted = false
        })
    } else {
      audio.pause()
      audio.currentTime = 0
      audio.muted = false
    }
  })

  isUnlocked = true
}

// Play a sound by name
function playSound(name: SoundName): void {
  if (typeof window === 'undefined') return

  // Initialize if needed
  if (!isInitialized) {
    initAudioElements()
  }

  const audio = audioElements.get(name)
  if (!audio) return

  // Clone the audio to allow overlapping sounds
  // Reset and play
  audio.currentTime = 0
  audio.volume = 0.5

  const playPromise = audio.play()
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Audio play failed - likely not unlocked yet
      // This is expected if user hasn't interacted yet
    })
  }
}

// Public API matching the old interface

export function playChime(type: 'phaseChange' | 'sessionStart' | 'sessionComplete' | 'inhaleStart' | 'exhaleStart' | 'holdStart'): void {
  switch (type) {
    case 'phaseChange':
      playSound('phase-change')
      break
    case 'sessionStart':
      playSound('session-start')
      break
    case 'sessionComplete':
      playSound('session-complete')
      break
    case 'inhaleStart':
      playSound('inhale')
      break
    case 'exhaleStart':
      playSound('exhale')
      break
    case 'holdStart':
      playSound('hold')
      break
  }
}

export function playPhaseChime(phase: 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale'): void {
  switch (phase) {
    case 'inhale':
      playSound('inhale')
      break
    case 'exhale':
      playSound('exhale')
      break
    case 'hold':
    case 'holdAfterExhale':
      playSound('hold')
      break
  }
}

export function playSessionComplete(): void {
  playSound('session-complete')
}

// Unlock audio - async version for compatibility
export function unlockAudio(): Promise<boolean> {
  return new Promise((resolve) => {
    forceUnlock()
    // Give iOS a moment to process
    setTimeout(() => {
      resolve(isUnlocked)
    }, 100)
  })
}

// Check if audio is available
export function isAudioAvailable(): boolean {
  return isUnlocked && isInitialized
}

// Initialize audio system
export function initAudio(): void {
  initAudioElements()
}

// Volume control
let globalVolume = 0.5

export function setVolume(volume: number): void {
  globalVolume = Math.max(0, Math.min(1, volume))
  audioElements.forEach((audio) => {
    audio.volume = globalVolume
  })
}

export function getVolume(): number {
  return globalVolume
}

// Breathing guide tone - simplified version using existing sounds
export function playBreathingGuideTone(
  phase: 'inhale' | 'exhale',
  duration: number,
  enabled: boolean
): (() => void) | undefined {
  // Not implemented for audio file approach - would need continuous audio
  // Return undefined to indicate no cleanup needed
  return undefined
}
