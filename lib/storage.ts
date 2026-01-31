const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: 'breathe_onboarding_complete',
  USER_GOAL: 'breathe_user_goal',
  LAST_TECHNIQUE: 'breathe_last_technique',
  SESSION_HISTORY: 'breathe_session_history',
  PREFERENCES: 'breathe_preferences',
  STREAK: 'breathe_streak',
} as const

export interface SessionRecord {
  techniqueId: string
  cycles: number
  duration: number
  completedAt: string
}

export interface UserPreferences {
  soundEnabled: boolean
  hapticEnabled: boolean
  defaultCycles: number
}

export interface StreakData {
  currentStreak: number
  lastSessionDate: string | null
  longestStreak: number
}

const defaultPreferences: UserPreferences = {
  soundEnabled: true,
  hapticEnabled: true,
  defaultCycles: 5,
}

const defaultStreak: StreakData = {
  currentStreak: 0,
  lastSessionDate: null,
  longestStreak: 0,
}

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.warn('Failed to save to localStorage')
  }
}

// Onboarding
export function isOnboardingComplete(): boolean {
  return getItem(STORAGE_KEYS.ONBOARDING_COMPLETE, false)
}

export function setOnboardingComplete(complete: boolean): void {
  setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, complete)
}

// User Goal
export function getUserGoal(): string | null {
  return getItem(STORAGE_KEYS.USER_GOAL, null)
}

export function setUserGoal(goal: string): void {
  setItem(STORAGE_KEYS.USER_GOAL, goal)
}

// Last Technique
export function getLastTechnique(): string | null {
  return getItem(STORAGE_KEYS.LAST_TECHNIQUE, null)
}

export function setLastTechnique(techniqueId: string): void {
  setItem(STORAGE_KEYS.LAST_TECHNIQUE, techniqueId)
}

// Session History
export function getSessionHistory(): SessionRecord[] {
  return getItem(STORAGE_KEYS.SESSION_HISTORY, [])
}

export function addSessionRecord(record: SessionRecord): void {
  const history = getSessionHistory()
  history.push(record)
  // Keep only last 100 sessions
  if (history.length > 100) {
    history.shift()
  }
  setItem(STORAGE_KEYS.SESSION_HISTORY, history)
}

export function getTotalSessions(): number {
  return getSessionHistory().length
}

export function getTotalBreathingTime(): number {
  return getSessionHistory().reduce((sum, record) => sum + record.duration, 0)
}

// Preferences
export function getPreferences(): UserPreferences {
  return getItem(STORAGE_KEYS.PREFERENCES, defaultPreferences)
}

export function setPreferences(preferences: Partial<UserPreferences>): void {
  const current = getPreferences()
  setItem(STORAGE_KEYS.PREFERENCES, { ...current, ...preferences })
}

// Streak
export function getStreak(): StreakData {
  return getItem(STORAGE_KEYS.STREAK, defaultStreak)
}

export function updateStreak(): StreakData {
  const streak = getStreak()
  const today = new Date().toISOString().split('T')[0]
  const lastDate = streak.lastSessionDate

  if (lastDate === today) {
    // Already practiced today
    return streak
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak: StreakData

  if (lastDate === yesterdayStr) {
    // Continuing streak
    newStreak = {
      currentStreak: streak.currentStreak + 1,
      lastSessionDate: today,
      longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
    }
  } else {
    // Streak broken or first session
    newStreak = {
      currentStreak: 1,
      lastSessionDate: today,
      longestStreak: Math.max(streak.longestStreak, 1),
    }
  }

  setItem(STORAGE_KEYS.STREAK, newStreak)
  return newStreak
}

// Clear all data
export function clearAllData(): void {
  if (typeof window === 'undefined') return
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
}
