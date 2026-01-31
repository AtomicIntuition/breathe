export type Phase = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale'

export interface BreathingPhase {
  phase: Phase
  duration: number // in seconds
  instruction: string
}

export interface BreathingTechnique {
  id: string
  name: string
  tagline: string
  description: string
  pattern: string
  phases: BreathingPhase[]
  purpose: string
  useCase: string
  source: string
  icon: string
  color: 'arctic' | 'gold' | 'slate' | 'purple' | 'orange' | 'emerald' | 'rose'
  defaultCycles: number
  category: 'calm' | 'focus' | 'energy' | 'sleep' | 'recovery'
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  bodyGuidance?: Record<Phase, string>
}

export const techniques: BreathingTechnique[] = [
  // ==========================================
  // FOCUS & PERFORMANCE
  // ==========================================
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    tagline: "Navy SEAL Standard",
    description: 'The gold standard of tactical breathing. Equal parts inhale, hold, exhale, and hold create a "box" pattern that brings you to a state of alert calm. Used by Navy SEALs before missions.',
    pattern: '4-4-4-4',
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Breathe In' },
      { phase: 'hold', duration: 4, instruction: 'Hold' },
      { phase: 'exhale', duration: 4, instruction: 'Breathe Out' },
      { phase: 'holdAfterExhale', duration: 4, instruction: 'Hold' },
    ],
    purpose: 'Alert calm, mental clarity, stress inoculation',
    useCase: 'Pre-performance, daily practice, high-pressure situations',
    source: 'Navy SEAL standard, popularized by Mark Divine (SEALFIT)',
    icon: 'Square',
    color: 'arctic',
    defaultCycles: 5,
    category: 'focus',
    difficulty: 'beginner',
  },
  {
    id: 'tactical-breathing',
    name: 'Combat Breathing',
    tagline: 'Rapid Calm-Down',
    description: 'Designed for rapid calm-down in high-stress combat situations. The extended exhale activates your parasympathetic nervous system, dropping your heart rate within seconds.',
    pattern: '4-1-8',
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Breathe In' },
      { phase: 'hold', duration: 1, instruction: 'Brief Pause' },
      { phase: 'exhale', duration: 8, instruction: 'Slow Exhale' },
    ],
    purpose: 'Rapid heart rate reduction, combat stress control',
    useCase: 'Acute stress, panic moments, before confrontation',
    source: 'U.S. Military Combat Stress Control',
    icon: 'Target',
    color: 'gold',
    defaultCycles: 6,
    category: 'calm',
    difficulty: 'beginner',
  },

  // ==========================================
  // SLEEP & RELAXATION
  // ==========================================
  {
    id: 'military-sleep',
    name: 'Military Sleep Method',
    tagline: '2-Minute Sleep Technique',
    description: 'Developed for fighter pilots to fall asleep in 2 minutes under any conditions. Combines deep breathing with progressive muscle relaxation. Used by 96% of pilots after 6 weeks of practice.',
    pattern: '4-7-8 with body scan',
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Deep Breath In' },
      { phase: 'hold', duration: 7, instruction: 'Hold & Relax Face' },
      { phase: 'exhale', duration: 8, instruction: 'Release Everything' },
    ],
    purpose: 'Fall asleep in under 2 minutes',
    useCase: 'Insomnia, sleeping in difficult conditions, jet lag',
    source: 'U.S. Navy Pre-Flight School, Lloyd "Bud" Winter',
    icon: 'Moon',
    color: 'purple',
    defaultCycles: 6,
    category: 'sleep',
    difficulty: 'beginner',
  },
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    tagline: 'Natural Tranquilizer',
    description: 'A powerful relaxation technique that acts as a natural tranquilizer for the nervous system. The long hold and exhale shift your body into deep rest mode.',
    pattern: '4-7-8',
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Breathe In' },
      { phase: 'hold', duration: 7, instruction: 'Hold' },
      { phase: 'exhale', duration: 8, instruction: 'Breathe Out' },
    ],
    purpose: 'Deep relaxation, nervous system reset',
    useCase: 'Pre-sleep routine, anxiety relief, wind-down',
    source: 'Dr. Andrew Weil (based on yogic pranayama)',
    icon: 'Moon',
    color: 'purple',
    defaultCycles: 4,
    category: 'sleep',
    difficulty: 'beginner',
  },
  {
    id: 'sleep-exhale',
    name: 'Sleep Exhale',
    tagline: 'Extended Exhale Sleep',
    description: 'Emphasizes a very long exhale to maximally activate the parasympathetic "rest and digest" response. The 2:1 exhale-to-inhale ratio signals deep safety to your nervous system.',
    pattern: '4-2-8-2',
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Gentle Inhale' },
      { phase: 'hold', duration: 2, instruction: 'Soft Hold' },
      { phase: 'exhale', duration: 8, instruction: 'Long Slow Exhale' },
      { phase: 'holdAfterExhale', duration: 2, instruction: 'Rest Empty' },
    ],
    purpose: 'Maximum relaxation, parasympathetic activation',
    useCase: 'Deep insomnia, racing thoughts, nighttime anxiety',
    source: 'Clinical sleep research, parasympathetic breathing studies',
    icon: 'CloudMoon',
    color: 'purple',
    defaultCycles: 8,
    category: 'sleep',
    difficulty: 'beginner',
  },

  // ==========================================
  // STRESS & CALM
  // ==========================================
  {
    id: 'physiological-sigh',
    name: 'Physiological Sigh',
    tagline: 'Instant Calm Reset',
    description: 'The fastest scientifically-proven way to reduce stress in real-time. A double inhale reinflates collapsed lung sacs, and the long exhale offloads CO2, triggering immediate calm.',
    pattern: 'Double inhale + Long exhale',
    phases: [
      { phase: 'inhale', duration: 2, instruction: 'Inhale (Nose)' },
      { phase: 'inhale', duration: 1, instruction: 'Sip More Air' },
      { phase: 'exhale', duration: 6, instruction: 'Long Exhale (Mouth)' },
    ],
    purpose: 'Fastest real-time stress reduction',
    useCase: 'Panic attacks, immediate relief, emotional reset',
    source: 'Dr. Andrew Huberman, Stanford Neuroscience',
    icon: 'Zap',
    color: 'arctic',
    defaultCycles: 3,
    category: 'calm',
    difficulty: 'beginner',
  },
  {
    id: 'coherent-breathing',
    name: 'Coherent Breathing',
    tagline: 'Heart-Brain Sync',
    description: 'Breathing at 5 breaths per minute synchronizes your heart rate variability, creating "coherence" between heart and brain. Used by elite athletes and high performers for optimal state.',
    pattern: '6-6',
    phases: [
      { phase: 'inhale', duration: 6, instruction: 'Slow Inhale' },
      { phase: 'exhale', duration: 6, instruction: 'Slow Exhale' },
    ],
    purpose: 'Heart-brain coherence, HRV optimization',
    useCase: 'Daily practice, emotional regulation, peak performance',
    source: 'HeartMath Institute, Stephen Elliott',
    icon: 'Heart',
    color: 'rose',
    defaultCycles: 10,
    category: 'calm',
    difficulty: 'intermediate',
  },
  {
    id: 'resonant-breathing',
    name: 'Resonant Breathing',
    tagline: 'Vagal Tone Builder',
    description: 'Optimizes your vagal tone—the strength of your relaxation response. At 5-6 breaths per minute, your cardiovascular system enters resonance, maximizing stress resilience.',
    pattern: '5-5',
    phases: [
      { phase: 'inhale', duration: 5, instruction: 'Smooth Inhale' },
      { phase: 'exhale', duration: 5, instruction: 'Smooth Exhale' },
    ],
    purpose: 'Build long-term stress resilience',
    useCase: 'Daily practice, vagal toning, PTSD recovery',
    source: 'Dr. Richard Brown, Columbia University',
    icon: 'Waves',
    color: 'emerald',
    defaultCycles: 12,
    category: 'calm',
    difficulty: 'beginner',
  },

  // ==========================================
  // ENERGY & ACTIVATION
  // ==========================================
  {
    id: 'energizing-breath',
    name: 'Energizing Breath',
    tagline: 'Natural Energy Surge',
    description: 'A controlled hyperventilation technique that boosts oxygen levels and triggers adrenaline release. Creates a natural energy surge without caffeine.',
    pattern: '1-1 rapid cycles',
    phases: [
      { phase: 'inhale', duration: 1, instruction: 'Quick Inhale' },
      { phase: 'exhale', duration: 1, instruction: 'Quick Exhale' },
    ],
    purpose: 'Alertness, energy boost, wake-up',
    useCase: 'Morning activation, pre-workout, afternoon slump',
    source: 'Modified from Wim Hof Method & Kapalabhati',
    icon: 'Flame',
    color: 'orange',
    defaultCycles: 30,
    category: 'energy',
    difficulty: 'intermediate',
  },
  {
    id: 'power-breathing',
    name: 'Power Breathing',
    tagline: 'Pre-Mission Activation',
    description: 'Used by special operators before missions to achieve peak activation. Builds energy through breath holds that trigger adrenaline, then channels it with controlled exhales.',
    pattern: '4-4-4 power cycle',
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Power Inhale' },
      { phase: 'hold', duration: 4, instruction: 'Build Energy' },
      { phase: 'exhale', duration: 4, instruction: 'Channel Power' },
    ],
    purpose: 'Peak activation, mental intensity, pre-performance',
    useCase: 'Before competition, presentations, physical challenges',
    source: 'Special Operations performance protocols',
    icon: 'Zap',
    color: 'orange',
    defaultCycles: 6,
    category: 'energy',
    difficulty: 'beginner',
  },
  {
    id: 'wim-hof',
    name: 'Wim Hof Method',
    tagline: 'The Iceman Protocol',
    description: 'The famous technique from "The Iceman." 30 power breaths followed by a breath hold creates massive oxygen saturation and controlled stress exposure, building mental resilience.',
    pattern: '30 breaths + retention',
    phases: [
      { phase: 'inhale', duration: 2, instruction: 'Full Breath In' },
      { phase: 'exhale', duration: 1, instruction: 'Let Go' },
    ],
    purpose: 'Immune boost, cold tolerance, mental fortitude',
    useCase: 'Morning practice, cold exposure prep, stress inoculation',
    source: 'Wim Hof, scientific validation by Radboud University',
    icon: 'Snowflake',
    color: 'arctic',
    defaultCycles: 30,
    category: 'energy',
    difficulty: 'advanced',
  },

  // ==========================================
  // RECOVERY & HEALING
  // ==========================================
  {
    id: 'recovery-breathing',
    name: 'Recovery Breathing',
    tagline: 'Post-Stress Recovery',
    description: 'Designed for recovery after intense physical or mental stress. Longer exhales and holds after exhale maximize parasympathetic recovery and reduce cortisol levels.',
    pattern: '4-2-6-4',
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Recovery Breath' },
      { phase: 'hold', duration: 2, instruction: 'Brief Hold' },
      { phase: 'exhale', duration: 6, instruction: 'Release Tension' },
      { phase: 'holdAfterExhale', duration: 4, instruction: 'Deep Rest' },
    ],
    purpose: 'Cortisol reduction, nervous system recovery',
    useCase: 'Post-workout, after stressful events, evening wind-down',
    source: 'Sports science recovery protocols',
    icon: 'Battery',
    color: 'emerald',
    defaultCycles: 8,
    category: 'recovery',
    difficulty: 'beginner',
  },
  {
    id: 'nsdr',
    name: 'NSDR Breathing',
    tagline: 'Non-Sleep Deep Rest',
    description: 'Breathing pattern for Non-Sleep Deep Rest (NSDR), a protocol that provides recovery benefits similar to sleep. Achieves deep relaxation while maintaining awareness.',
    pattern: '4-6-6',
    phases: [
      { phase: 'inhale', duration: 4, instruction: 'Gentle Inhale' },
      { phase: 'hold', duration: 6, instruction: 'Restful Hold' },
      { phase: 'exhale', duration: 6, instruction: 'Melting Exhale' },
    ],
    purpose: 'Deep rest without sleep, recovery, focus restoration',
    useCase: 'Afternoon recharge, sleep debt recovery, mental reset',
    source: 'Dr. Andrew Huberman, Stanford protocols',
    icon: 'Sparkles',
    color: 'purple',
    defaultCycles: 10,
    category: 'recovery',
    difficulty: 'beginner',
  },
]

export function getTechniqueById(id: string): BreathingTechnique | undefined {
  return techniques.find((t) => t.id === id)
}

export function getTechniquesByCategory(category: BreathingTechnique['category']): BreathingTechnique[] {
  return techniques.filter((t) => t.category === category)
}

export function getRecommendedTechnique(goal: string): BreathingTechnique {
  const recommendations: Record<string, string> = {
    stress: 'physiological-sigh',
    sleep: 'military-sleep',
    focus: 'box-breathing',
    energy: 'power-breathing',
    calm: 'coherent-breathing',
    recovery: 'recovery-breathing',
    anxiety: 'physiological-sigh',
    performance: 'box-breathing',
  }

  const techniqueId = recommendations[goal] || 'box-breathing'
  return techniques.find((t) => t.id === techniqueId)!
}

export function calculateSessionDuration(technique: BreathingTechnique, cycles: number): number {
  const cycleDuration = technique.phases.reduce((sum, phase) => sum + phase.duration, 0)
  return cycleDuration * cycles
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs}s`
  if (secs === 0) return `${mins}m`
  return `${mins}m ${secs}s`
}

// Get all unique categories
export function getCategories(): BreathingTechnique['category'][] {
  return Array.from(new Set(techniques.map(t => t.category)))
}

// Get technique count by category
export function getTechniqueCountByCategory(): Record<string, number> {
  return techniques.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}
