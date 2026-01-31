import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // User preferences
  soundEnabled: boolean
  hapticEnabled: boolean

  // Session state
  isSessionActive: boolean
  isPaused: boolean
  currentTechniqueId: string | null

  // Onboarding
  onboardingComplete: boolean
  userGoal: string | null

  // Actions
  setSoundEnabled: (enabled: boolean) => void
  setHapticEnabled: (enabled: boolean) => void
  setSessionActive: (active: boolean) => void
  setPaused: (paused: boolean) => void
  setCurrentTechnique: (id: string | null) => void
  setOnboardingComplete: (complete: boolean) => void
  setUserGoal: (goal: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      soundEnabled: true,
      hapticEnabled: true,
      isSessionActive: false,
      isPaused: false,
      currentTechniqueId: null,
      onboardingComplete: false,
      userGoal: null,

      // Actions
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setHapticEnabled: (enabled) => set({ hapticEnabled: enabled }),
      setSessionActive: (active) => set({ isSessionActive: active }),
      setPaused: (paused) => set({ isPaused: paused }),
      setCurrentTechnique: (id) => set({ currentTechniqueId: id }),
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
      setUserGoal: (goal) => set({ userGoal: goal }),
    }),
    {
      name: 'breathe-spec-storage',
      partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        hapticEnabled: state.hapticEnabled,
        onboardingComplete: state.onboardingComplete,
        userGoal: state.userGoal,
      }),
    }
  )
)
