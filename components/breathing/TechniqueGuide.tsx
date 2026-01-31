'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Clock,
  Target,
  Brain,
  Heart,
  Zap,
  Shield,
  TrendingUp,
  Info,
  Star,
} from 'lucide-react'
import { BreathingTechnique, formatDuration, calculateSessionDuration } from '@/lib/techniques'

interface TechniqueGuideProps {
  technique: BreathingTechnique
  cycles: number
}

interface GuideContent {
  overview: string
  steps: {
    instruction: string
    detail: string
    duration?: string
  }[]
  bodyPosition: {
    primary: string
    alternatives: string[]
    tips: string[]
  }
  proTips: string[]
  science: string
  whenToUse: string[]
  whenToAvoid: string[]
  commonMistakes: {
    mistake: string
    correction: string
  }[]
  benefits: {
    benefit: string
    explanation: string
  }[]
  progression: string
  expertNote?: string
}

// ============================================
// COMPREHENSIVE TECHNIQUE GUIDES
// ============================================

const techniqueGuides: Record<string, GuideContent> = {
  // ==========================================
  // BOX BREATHING - Navy SEAL Standard
  // ==========================================
  'box-breathing': {
    overview: 'Box Breathing is the foundational technique used by Navy SEALs to maintain calm under extreme pressure. The four equal phases create a "box" pattern that balances your nervous system, bringing you to a state of alert readiness without anxiety.',
    steps: [
      {
        instruction: 'Inhale through your nose',
        detail: 'Draw breath deep into your belly, not just your chest. Feel your diaphragm expand downward as your lungs fill completely.',
        duration: '4 seconds',
      },
      {
        instruction: 'Hold at the top',
        detail: 'Maintain the breath without tension. Keep your throat open, shoulders relaxed. This pause allows oxygen to fully saturate your blood.',
        duration: '4 seconds',
      },
      {
        instruction: 'Exhale through your nose',
        detail: 'Release the breath slowly and steadily. Control the flow—don\'t let it rush out. Empty your lungs completely.',
        duration: '4 seconds',
      },
      {
        instruction: 'Hold at the bottom',
        detail: 'Rest in the emptiness without gasping for air. This is where the parasympathetic activation deepens. Stay relaxed.',
        duration: '4 seconds',
      },
    ],
    bodyPosition: {
      primary: 'Sit upright in a chair with feet flat on the floor, spine naturally straight but not rigid. Rest hands on thighs, palms down.',
      alternatives: [
        'Cross-legged on the floor with cushion support',
        'Standing with feet shoulder-width apart',
        'Lying flat with arms at sides (less ideal for alertness)',
      ],
      tips: [
        'Drop your shoulders away from your ears',
        'Soften your jaw and unclench your teeth',
        'Close your eyes or maintain a soft downward gaze',
      ],
    },
    proTips: [
      'Start with 4-second intervals, progress to 6 or 8 seconds as you advance',
      'Place one hand on your belly to ensure diaphragmatic breathing',
      'Practice at the same time daily to build a reliable anchor',
      'Use before high-stakes situations: meetings, competitions, difficult conversations',
    ],
    science: 'Box breathing activates the parasympathetic nervous system through vagal stimulation, reducing cortisol and adrenaline. The equal ratios create cardiorespiratory coherence—your heart rate variability synchronizes with your breath, optimizing autonomic function.',
    whenToUse: [
      'Before high-pressure situations or important decisions',
      'When feeling overwhelmed or anxious',
      'As a daily practice for stress resilience',
      'During transitions between tasks to reset focus',
      'Before sleep to shift from active to rest mode',
    ],
    whenToAvoid: [
      'While driving or operating machinery',
      'If you have untreated respiratory conditions (consult physician)',
      'During acute panic attacks (use Physiological Sigh instead)',
    ],
    commonMistakes: [
      {
        mistake: 'Chest breathing instead of belly breathing',
        correction: 'Place hand on belly—it should rise before your chest. Think "breathe into your belly button."',
      },
      {
        mistake: 'Tensing up during breath holds',
        correction: 'The holds should feel like a gentle pause, not straining. If you\'re tense, shorten the duration.',
      },
      {
        mistake: 'Rushing to get through cycles',
        correction: 'Quality over quantity. 5 perfect cycles beats 10 rushed ones. Maintain steady rhythm.',
      },
      {
        mistake: 'Inconsistent timing between phases',
        correction: 'Use a mental count or the app\'s timer. All four phases should be equal.',
      },
    ],
    benefits: [
      {
        benefit: 'Reduces stress hormones',
        explanation: 'Lowers cortisol and adrenaline within minutes, measurable via saliva tests.',
      },
      {
        benefit: 'Improves focus and clarity',
        explanation: 'Optimal oxygen/CO2 balance enhances prefrontal cortex function for better decision-making.',
      },
      {
        benefit: 'Lowers heart rate and blood pressure',
        explanation: 'Vagal activation slows heart rate; effects last beyond the practice session.',
      },
      {
        benefit: 'Builds stress resilience over time',
        explanation: 'Regular practice increases baseline HRV, making you more resilient to future stressors.',
      },
    ],
    progression: 'Master 4-4-4-4 for two weeks, then progress to 5-5-5-5, eventually reaching 6-6-6-6 or 8-8-8-8. Navy SEALs often practice at 8-second intervals.',
    expertNote: '"Box breathing is the most reliable tool I teach. When everything else fails, this works." — Mark Divine, former Navy SEAL Commander',
  },

  // ==========================================
  // COMBAT BREATHING - Tactical Calm-Down
  // ==========================================
  'tactical-breathing': {
    overview: 'Combat Breathing (also called Tactical Breathing) was developed for military and law enforcement to rapidly reduce heart rate in high-stress situations. The extended exhale is the key—it\'s twice as long as the inhale, which powerfully activates your calming response.',
    steps: [
      {
        instruction: 'Inhale through your nose',
        detail: 'Take a full, deep breath. Fill your lungs completely from bottom to top. Feel your ribs expand.',
        duration: '4 seconds',
      },
      {
        instruction: 'Brief pause',
        detail: 'Just a momentary pause at the top. Don\'t hold long—this isn\'t the focus of this technique.',
        duration: '1 second',
      },
      {
        instruction: 'Extended exhale through mouth',
        detail: 'Slowly release through pursed lips or slightly open mouth. This is the critical phase—make it last the full 8 seconds. Control the flow.',
        duration: '8 seconds',
      },
    ],
    bodyPosition: {
      primary: 'Any position works—this technique is designed for real-world conditions. Standing, sitting, or even moving slowly.',
      alternatives: [
        'Seated with hands on knees if possible',
        'Standing with one hand on your chest to feel the breath',
        'Walking slowly if standing still isn\'t possible',
      ],
      tips: [
        'You can do this with eyes open in active situations',
        'Focus on making the exhale smooth and controlled',
        'Even in chaos, find a point to softly focus your gaze',
      ],
    },
    proTips: [
      'Practice the 8-second exhale regularly so it becomes automatic under stress',
      'Pursed lips help control exhale speed—like blowing through a straw',
      'Count mentally: "out-2-3-4-5-6-7-8" to maintain timing',
      'Can be done covertly in any situation without anyone noticing',
    ],
    science: 'The extended exhale stimulates the vagus nerve more powerfully than equal-ratio breathing. This triggers the "rest and digest" parasympathetic response, rapidly lowering heart rate. The 2:1 exhale-to-inhale ratio is optimal for quick autonomic shift.',
    whenToUse: [
      'Immediately after a stressful event or confrontation',
      'When heart is racing from adrenaline',
      'Before entering a difficult situation',
      'During moments of acute anxiety or panic',
      'When you need to calm down quickly without full meditation',
    ],
    whenToAvoid: [
      'This technique is safe in almost all situations',
      'If hyperventilating, slow down and normalize first',
    ],
    commonMistakes: [
      {
        mistake: 'Exhale too short—not reaching 8 seconds',
        correction: 'This is the most important part. If 8 seconds is hard, start with 6 and build up.',
      },
      {
        mistake: 'Inhaling through mouth',
        correction: 'Always inhale through nose—it filters, warms, and triggers nasal-vagal responses.',
      },
      {
        mistake: 'Creating tension during exhale',
        correction: 'The exhale should feel like releasing, not pushing. Let gravity help empty your lungs.',
      },
    ],
    benefits: [
      {
        benefit: 'Rapid heart rate reduction',
        explanation: 'Can drop heart rate 10-20 BPM within 60 seconds in trained practitioners.',
      },
      {
        benefit: 'Works under pressure',
        explanation: 'Designed for real-world chaos—doesn\'t require quiet or perfect conditions.',
      },
      {
        benefit: 'Clears adrenaline effects',
        explanation: 'Helps metabolize stress hormones faster, reducing post-stress shakiness.',
      },
      {
        benefit: 'Quick to perform',
        explanation: 'Just 3-6 breaths can shift your state—perfect for time-critical situations.',
      },
    ],
    progression: 'Start with 4-1-6 if 8 seconds is too long, then progress to 4-1-8, eventually 4-1-10 for maximum effect.',
    expertNote: '"In combat, you can\'t always sit and meditate. This gives you a tool that works in seconds, standing up, eyes open." — Lt. Col. Dave Grossman',
  },

  // ==========================================
  // MILITARY SLEEP METHOD
  // ==========================================
  'military-sleep': {
    overview: 'Developed by the U.S. Navy Pre-Flight School to help pilots fall asleep in 2 minutes or less, even sitting up in a chair or in combat conditions. After 6 weeks of practice, 96% of pilots could fall asleep within 2 minutes. This combines breathing with progressive relaxation.',
    steps: [
      {
        instruction: 'Deep breath in through nose',
        detail: 'Fill your lungs completely. As you breathe in, consciously relax your face—forehead, eyes, cheeks, jaw. Let your face go slack.',
        duration: '4 seconds',
      },
      {
        instruction: 'Hold and relax your body',
        detail: 'During the hold, drop your shoulders as low as they\'ll go. Relax one arm, then the other—let them feel heavy and limp.',
        duration: '7 seconds',
      },
      {
        instruction: 'Long exhale, release everything',
        detail: 'As you exhale, relax your chest, then your legs. Feel your whole body sink into the surface beneath you. Let go completely.',
        duration: '8 seconds',
      },
    ],
    bodyPosition: {
      primary: 'Lying on your back in bed, arms at sides, palms up. If on your side, keep spine aligned with pillow supporting head.',
      alternatives: [
        'Reclined in a chair or airplane seat',
        'Any position you\'ll actually be sleeping in',
        'Pilots learned to do this sitting upright',
      ],
      tips: [
        'Start at the top of your body and relax downward',
        'Imagine each body part becoming heavy and warm',
        'If a thought arises, return to body relaxation',
      ],
    },
    proTips: [
      'After body relaxation, clear your mind with one of two images: lying in a canoe on calm water with clear blue sky, or lying in a black velvet hammock in a dark room',
      'If images don\'t work, repeat "don\'t think, don\'t think" for 10 seconds',
      'Practice daily for 6 weeks—this is a skill that improves dramatically with repetition',
      'The breathing is the vehicle; the relaxation is the destination',
    ],
    science: 'This technique works by systematically deactivating the body\'s arousal systems. Progressive muscle relaxation combined with controlled breathing reduces cortisol and muscle tension, signaling to the brain that it\'s safe to sleep.',
    whenToUse: [
      'At bedtime when having trouble falling asleep',
      'For naps when time is limited',
      'When sleeping in unfamiliar or uncomfortable places',
      'After stressful days when mind is racing',
      'During travel across time zones',
    ],
    whenToAvoid: [
      'No contraindications—safe for everyone',
      'If you have sleep apnea, still use CPAP as prescribed',
    ],
    commonMistakes: [
      {
        mistake: 'Skipping the body relaxation component',
        correction: 'The breathing alone isn\'t enough. You must systematically relax face, shoulders, arms, chest, legs.',
      },
      {
        mistake: 'Getting frustrated when it doesn\'t work immediately',
        correction: 'This takes 6 weeks to master. Pilots didn\'t get it on day one. Trust the process.',
      },
      {
        mistake: 'Trying too hard to fall asleep',
        correction: 'Focus on relaxation, not sleep. Sleep is the byproduct of deep relaxation.',
      },
      {
        mistake: 'Using screens right before',
        correction: 'Blue light disrupts melatonin. Put devices away 30 minutes before using this technique.',
      },
    ],
    benefits: [
      {
        benefit: 'Fall asleep in under 2 minutes',
        explanation: '96% success rate after 6 weeks of consistent practice.',
      },
      {
        benefit: 'Works in any environment',
        explanation: 'Designed for cockpits and combat—works in beds, planes, hotels.',
      },
      {
        benefit: 'Improves overall sleep quality',
        explanation: 'The relaxation skills transfer to better sleep throughout the night.',
      },
      {
        benefit: 'Reduces pre-sleep anxiety',
        explanation: 'Gives you a reliable protocol instead of lying awake worrying.',
      },
    ],
    progression: 'Week 1-2: Learn the sequence. Week 3-4: Begin seeing faster sleep onset. Week 5-6: Achieve consistent 2-minute sleep. After mastery, many can fall asleep in under 60 seconds.',
    expertNote: '"The pilots who mastered this had an unfair advantage—they could rest anywhere, anytime, and wake up refreshed when others were still tossing and turning." — Lloyd "Bud" Winter, Naval researcher',
  },

  // ==========================================
  // 4-7-8 BREATHING
  // ==========================================
  '4-7-8-breathing': {
    overview: 'Dr. Andrew Weil calls this "a natural tranquilizer for the nervous system." Based on ancient yogic pranayama, this technique uses specific ratios that shift your autonomic nervous system toward rest. With regular practice, it becomes increasingly powerful.',
    steps: [
      {
        instruction: 'Quiet inhale through nose',
        detail: 'Breathe in silently and smoothly. Fill your lungs but don\'t force it. Keep the inhale gentle and controlled.',
        duration: '4 seconds',
      },
      {
        instruction: 'Hold your breath',
        detail: 'This is the longest phase. Stay relaxed—don\'t clamp down. The extended hold allows oxygen to fully saturate your bloodstream.',
        duration: '7 seconds',
      },
      {
        instruction: 'Complete exhale through mouth',
        detail: 'Exhale completely through your mouth, making a soft "whoosh" sound. Empty your lungs fully. The audible exhale helps release tension.',
        duration: '8 seconds',
      },
    ],
    bodyPosition: {
      primary: 'Seated with back supported, or lying down. Place tongue tip against the ridge behind upper front teeth throughout the exercise.',
      alternatives: [
        'In bed before sleep (ideal position)',
        'Seated in a quiet space',
        'During meditation practice',
      ],
      tips: [
        'Keep tongue position throughout all phases',
        'The exhale "whoosh" sound is part of the technique',
        'Eyes closed helps deepen relaxation',
      ],
    },
    proTips: [
      'Start with only 4 breath cycles—this technique is potent',
      'Practice twice daily: morning and evening',
      'After a month, you can increase to 8 breath cycles',
      'The technique gets stronger with regular practice—Dr. Weil calls it "compound interest"',
    ],
    science: 'The 4-7-8 ratio forces a longer exhale relative to inhale, strongly activating parasympathetic response. The 7-second hold increases CO2 tolerance and allows full oxygen exchange. Combined effects create profound nervous system reset.',
    whenToUse: [
      'Before sleep—the ideal use case',
      'When experiencing anxiety or stress',
      'To help manage food cravings',
      'During moments of anger or emotional reactivity',
      'As a daily practice for cumulative benefits',
    ],
    whenToAvoid: [
      'When you need to stay alert (this technique is sedating)',
      'Before driving or operating machinery',
      'If you feel lightheaded, stop and breathe normally',
    ],
    commonMistakes: [
      {
        mistake: 'Doing too many cycles at first',
        correction: 'Start with 4 cycles maximum. The technique is powerful—more isn\'t better initially.',
      },
      {
        mistake: 'Speeding up the counts',
        correction: 'The ratios matter more than speed. Keep 4:7:8 ratio even if you count faster.',
      },
      {
        mistake: 'Only practicing when stressed',
        correction: 'The technique works best with regular practice. Daily use builds its effectiveness.',
      },
      {
        mistake: 'Forgetting tongue position',
        correction: 'Tongue tip stays behind upper front teeth throughout. This activates calming meridians.',
      },
    ],
    benefits: [
      {
        benefit: 'Natural sleep aid',
        explanation: 'The sedating effect helps with falling and staying asleep naturally.',
      },
      {
        benefit: 'Cumulative calming effect',
        explanation: 'Regular practice lowers baseline anxiety over time.',
      },
      {
        benefit: 'Helps manage cravings',
        explanation: 'The technique disrupts craving patterns when used during urges.',
      },
      {
        benefit: 'Portable stress relief',
        explanation: 'Can be done anywhere without anyone knowing—just the breath portion.',
      },
    ],
    progression: 'Month 1: 4 cycles, twice daily. Month 2: 6 cycles, twice daily. Month 3+: Up to 8 cycles. Effects strengthen dramatically with consistent practice.',
    expertNote: '"Unlike drugs, which lose effectiveness over time, this technique gains effectiveness with practice. It\'s the opposite of tolerance—it\'s sensitization." — Dr. Andrew Weil',
  },

  // ==========================================
  // SLEEP EXHALE
  // ==========================================
  'sleep-exhale': {
    overview: 'Sleep Exhale technique maximizes parasympathetic activation through an extended exhale phase. The 2:1 exhale-to-inhale ratio combined with gentle holds creates the deepest possible relaxation response, ideal for those who struggle with racing thoughts at night.',
    steps: [
      {
        instruction: 'Gentle inhale through nose',
        detail: 'A soft, natural breath—don\'t force fullness. About 70% lung capacity is ideal. Keep it effortless.',
        duration: '4 seconds',
      },
      {
        instruction: 'Soft hold',
        detail: 'A brief, tension-free pause. Like a comma in a sentence, not a period.',
        duration: '2 seconds',
      },
      {
        instruction: 'Long, slow exhale',
        detail: 'The key phase. Release breath slowly and completely through nose or slightly parted lips. Imagine tension draining out with the air.',
        duration: '8 seconds',
      },
      {
        instruction: 'Rest in emptiness',
        detail: 'Remain empty without urgency to inhale. Let the next breath arise naturally when your body is ready.',
        duration: '2 seconds',
      },
    ],
    bodyPosition: {
      primary: 'Lying on your back in bed, one hand on belly, one on chest. Only the belly hand should rise noticeably.',
      alternatives: [
        'On your side with pillow between knees',
        'Reclined at 30-45 degrees if lying flat is uncomfortable',
      ],
      tips: [
        'Darkness and cool temperature enhance effectiveness',
        'A weighted blanket can deepen relaxation',
        'Use earplugs if environment is noisy',
      ],
    },
    proTips: [
      'Focus on making the exhale as smooth and slow as possible',
      'Imagine breathing out through the soles of your feet',
      'Each exhale, consciously relax a different body part',
      'If thoughts arise, gently return focus to the exhale',
    ],
    science: 'Extended exhales directly stimulate the vagus nerve, triggering parasympathetic dominance. The brief holds allow CO2 to build slightly, which paradoxically relaxes smooth muscle and blood vessels. This creates ideal physiological conditions for sleep.',
    whenToUse: [
      'At bedtime as your sleep initiation practice',
      'When waking in the middle of the night',
      'For deep relaxation without falling asleep',
      'During afternoon rest periods',
    ],
    whenToAvoid: [
      'When you need to stay alert',
      'This technique is specifically for rest—not for daytime stress relief',
    ],
    commonMistakes: [
      {
        mistake: 'Inhaling too deeply',
        correction: 'The inhale should be gentle, not maximal. Save your effort for the exhale.',
      },
      {
        mistake: 'Tensing to hold breath empty',
        correction: 'The empty hold should feel restful, not strained. Shorten it if you\'re straining.',
      },
      {
        mistake: 'Letting mind wander during exhale',
        correction: 'The exhale is your anchor. Count it, feel it, follow it to the end.',
      },
    ],
    benefits: [
      {
        benefit: 'Maximum relaxation response',
        explanation: 'The 2:1 ratio creates deeper parasympathetic activation than equal breathing.',
      },
      {
        benefit: 'Quiets racing thoughts',
        explanation: 'The focus on extended exhale gives the mind a simple task, reducing rumination.',
      },
      {
        benefit: 'Reduces nighttime anxiety',
        explanation: 'Physiologically incompatible with anxiety—your body can\'t be anxious while deeply exhaling.',
      },
    ],
    progression: 'Start with 4-2-6-2 if 8-second exhale is difficult. Progress to 4-2-8-2, then 4-2-10-2 for deepest effect.',
  },

  // ==========================================
  // PHYSIOLOGICAL SIGH
  // ==========================================
  'physiological-sigh': {
    overview: 'The Physiological Sigh is your body\'s natural reset button—discovered by Stanford researchers as the fastest way to reduce stress in real-time. A single breath cycle can shift your state. It\'s what your body does naturally when crying or before sleep.',
    steps: [
      {
        instruction: 'Full inhale through nose',
        detail: 'Take a deep breath in through your nose, filling your lungs substantially.',
        duration: '2 seconds',
      },
      {
        instruction: 'Second short inhale (the "sip")',
        detail: 'At the top of your breath, take a second, shorter inhale—like sipping air. This reinflates the tiny air sacs (alveoli) in your lungs.',
        duration: '1 second',
      },
      {
        instruction: 'Long exhale through mouth',
        detail: 'Release slowly and completely through your mouth. Make it last. This offloads the excess CO2 that accumulated during stress.',
        duration: '6+ seconds',
      },
    ],
    bodyPosition: {
      primary: 'Any position works. This is designed for real-world use—standing, sitting, walking, anytime.',
      alternatives: [
        'Can be done eyes open or closed',
        'Works while walking or moving',
        'No special posture required',
      ],
      tips: [
        'Can be done covertly in any situation',
        'The double inhale is what makes it powerful',
        'One cycle is often enough—don\'t overdo it',
      ],
    },
    proTips: [
      'Use it in real-time when you feel stress rising—don\'t wait',
      'One to three sighs is usually enough to shift state',
      'Notice how your body naturally does this before sleep or after crying',
      'Can be combined with other techniques for deeper practice',
    ],
    science: 'The double inhale reinflates collapsed alveoli (tiny lung air sacs that collapse during shallow stress breathing). This maximizes surface area for gas exchange. The long exhale then rapidly offloads CO2, which directly signals your brain to reduce stress response.',
    whenToUse: [
      'The moment you feel stress or anxiety rising',
      'During acute panic or overwhelm',
      'After a stressful interaction',
      'Before something anxiety-provoking',
      'Anytime, anywhere—no setup needed',
    ],
    whenToAvoid: [
      'No contraindications—this is your body\'s natural mechanism',
      'Safe for everyone, anytime',
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting the second inhale',
        correction: 'The "sip" after the main breath is what makes this technique special. Don\'t skip it.',
      },
      {
        mistake: 'Rushing the exhale',
        correction: 'The exhale should be slow and complete. This is where the CO2 offloading happens.',
      },
      {
        mistake: 'Doing too many in a row',
        correction: 'One to three is usually enough. More can cause lightheadedness.',
      },
    ],
    benefits: [
      {
        benefit: 'Fastest known real-time stress relief',
        explanation: 'Stanford research shows it outperforms other techniques for immediate effect.',
      },
      {
        benefit: 'Single breath can shift state',
        explanation: 'Unlike techniques requiring minutes, one sigh can work immediately.',
      },
      {
        benefit: 'Body\'s natural mechanism',
        explanation: 'You\'re using a system your body already knows—you\'re just doing it consciously.',
      },
      {
        benefit: 'No learning curve',
        explanation: 'Effective from the first try. No weeks of practice needed.',
      },
    ],
    progression: 'This technique doesn\'t require progression—it works immediately. Focus on recognizing when to use it and building the habit.',
    expertNote: '"This is the fastest way we know of to reduce stress in real-time. It\'s not a metaphor—it\'s physiology." — Dr. Andrew Huberman, Stanford Neuroscientist',
  },

  // ==========================================
  // COHERENT BREATHING
  // ==========================================
  'coherent-breathing': {
    overview: 'Coherent Breathing synchronizes your heart, brain, and respiratory system at an optimal frequency of 5 breaths per minute. This creates "coherence"—a measurable state where your heart rate variability reaches optimal patterns, associated with peak performance and emotional regulation.',
    steps: [
      {
        instruction: 'Slow inhale through nose',
        detail: 'Begin a slow, steady breath in. Fill from belly to chest in one smooth motion. No pauses or catches.',
        duration: '6 seconds',
      },
      {
        instruction: 'Slow exhale through nose',
        detail: 'Immediately begin exhaling at the same steady pace. No hold at the top—smooth transition from in to out.',
        duration: '6 seconds',
      },
    ],
    bodyPosition: {
      primary: 'Seated comfortably with spine upright but relaxed. Heart rate monitors can track your coherence if available.',
      alternatives: [
        'Standing with relaxed posture',
        'Walking slowly in rhythm with breath',
        'Lying down for deep relaxation',
      ],
      tips: [
        'Imagine breathing in and out through your heart center',
        'Keep the transition between inhale and exhale smooth',
        'Focus on making inhale and exhale exactly equal',
      ],
    },
    proTips: [
      'Use a pacer app or the built-in timer to maintain exact 6-second phases',
      'Heart rate monitors can show you reaching "coherence" state',
      'Practice for 10-20 minutes for cumulative HRV benefits',
      'Morning practice sets a calm baseline for the day',
    ],
    science: 'At 5 breaths per minute (6 seconds in, 6 seconds out), respiratory and cardiovascular rhythms synchronize, creating "resonance." Heart rate variability shifts to optimal coherence patterns. This state is associated with enhanced emotional regulation, cognitive performance, and immune function.',
    whenToUse: [
      'As a daily practice for HRV optimization',
      'Before important meetings or performances',
      'For emotional regulation during difficult situations',
      'During meditation practice',
      'Athletes use this for recovery and pre-performance states',
    ],
    whenToAvoid: [
      'When rapid calming is needed (use Physiological Sigh instead)',
      'This requires time—not ideal for acute stress moments',
    ],
    commonMistakes: [
      {
        mistake: 'Holding breath between phases',
        correction: 'Coherent breathing has no holds—smooth, continuous flow in and out.',
      },
      {
        mistake: 'Inconsistent timing',
        correction: 'Use a pacer. Coherence requires precise 6-6 timing to hit the resonant frequency.',
      },
      {
        mistake: 'Breathing too deeply',
        correction: 'Moderate breath volume. This is about rhythm, not deep breathing.',
      },
      {
        mistake: 'Only doing a few cycles',
        correction: 'Benefits compound with longer sessions. Aim for 10+ minutes.',
      },
    ],
    benefits: [
      {
        benefit: 'Optimizes heart rate variability',
        explanation: 'High HRV is the #1 biomarker of health, resilience, and longevity.',
      },
      {
        benefit: 'Heart-brain synchronization',
        explanation: 'Creates measurable coherence between heart and brain electrical activity.',
      },
      {
        benefit: 'Enhanced emotional regulation',
        explanation: 'Regular practice builds capacity to remain calm under pressure.',
      },
      {
        benefit: 'Improved cognitive function',
        explanation: 'Coherence state associated with better focus, creativity, and decision-making.',
      },
    ],
    progression: 'Start with 5 minutes daily. Build to 10 minutes, then 20 minutes. HeartMath research shows cumulative benefits increase over 6-8 weeks.',
    expertNote: '"Coherence is not relaxation—it\'s optimal function. You\'re training your nervous system to find its best operating frequency." — HeartMath Institute',
  },

  // ==========================================
  // RESONANT BREATHING
  // ==========================================
  'resonant-breathing': {
    overview: 'Resonant Breathing builds your vagal tone—the strength of your relaxation response. By breathing at your body\'s resonant frequency (typically 5-6 breaths per minute), you train your vagus nerve like a muscle, building long-term stress resilience.',
    steps: [
      {
        instruction: 'Smooth inhale through nose',
        detail: 'Breathe in steadily for 5 seconds. No rushing, no pausing. Like pouring water into a glass at a constant rate.',
        duration: '5 seconds',
      },
      {
        instruction: 'Smooth exhale through nose',
        detail: 'Exhale for 5 seconds at the same steady pace. The transition from in to out should be seamless.',
        duration: '5 seconds',
      },
    ],
    bodyPosition: {
      primary: 'Seated comfortably in a quiet space. This practice benefits from a dedicated practice environment.',
      alternatives: [
        'Lying down with support under knees',
        'Any comfortable position where you can focus',
      ],
      tips: [
        'Close your eyes to enhance internal focus',
        'Let breath be natural—not forced full or empty',
        'Consistency of rhythm is more important than depth',
      ],
    },
    proTips: [
      'Daily practice for 20 minutes produces the strongest vagal toning',
      'Morning practice has compounding effects throughout the day',
      'Track progress with HRV apps—you\'ll see measurable improvement',
      'Used therapeutically for PTSD, anxiety disorders, and depression',
    ],
    science: 'Regular practice at resonant frequency increases vagal tone—your vagus nerve\'s ability to activate the parasympathetic system. Higher vagal tone means faster recovery from stress, better emotional regulation, and improved physical health markers.',
    whenToUse: [
      'As a dedicated daily practice for building resilience',
      'During meditation or contemplative practice',
      'As part of a therapeutic protocol for anxiety/PTSD',
      'For recovery after intense training or work',
    ],
    whenToAvoid: [
      'This is a practice technique, not an emergency tool',
      'For acute stress, use faster-acting techniques first',
    ],
    commonMistakes: [
      {
        mistake: 'Irregular practice—skipping days',
        correction: 'Vagal tone builds with consistent daily practice. Sporadic practice yields sporadic results.',
      },
      {
        mistake: 'Sessions too short',
        correction: 'Aim for 10-20 minutes. Shorter sessions have limited toning effect.',
      },
      {
        mistake: 'Treating it as a relaxation technique only',
        correction: 'This is training, not just relaxation. You\'re building capacity.',
      },
    ],
    benefits: [
      {
        benefit: 'Increases baseline vagal tone',
        explanation: 'Measurable increase in HRV over weeks of practice—a biomarker of health.',
      },
      {
        benefit: 'Builds long-term stress resilience',
        explanation: 'Higher vagal tone means you recover from stress faster and get less stressed in the first place.',
      },
      {
        benefit: 'Used clinically for PTSD',
        explanation: 'Research-backed therapeutic tool for trauma recovery and anxiety disorders.',
      },
      {
        benefit: 'Anti-inflammatory effects',
        explanation: 'Vagal activation reduces inflammatory markers throughout the body.',
      },
    ],
    progression: 'Week 1-2: Establish daily 10-minute practice. Week 3-6: Extend to 15-20 minutes. Month 2+: Notice increased stress resilience in daily life.',
    expertNote: '"Think of this as physical therapy for your nervous system. The vagus nerve is a muscle—it gets stronger with training." — Dr. Richard Brown, Columbia University',
  },

  // ==========================================
  // ENERGIZING BREATH
  // ==========================================
  'energizing-breath': {
    overview: 'A controlled hyperventilation technique that boosts oxygen levels and triggers an adrenaline release, creating natural energy without caffeine. This practice temporarily shifts blood pH and creates alertness. Use with awareness—it\'s powerful.',
    steps: [
      {
        instruction: 'Quick, full inhale',
        detail: 'Breathe in quickly and fully through your nose (or mouth if needed). Pull air actively into your lungs.',
        duration: '1 second',
      },
      {
        instruction: 'Relaxed exhale',
        detail: 'Let the exhale be passive—just release. Don\'t push, don\'t control. Let it fall out naturally.',
        duration: '1 second',
      },
    ],
    bodyPosition: {
      primary: 'Seated with spine straight, in a safe location. Never practice while driving, swimming, or in water.',
      alternatives: [
        'Standing with feet grounded',
        'Never lying down—stay upright',
      ],
      tips: [
        'Keep shoulders relaxed despite the rapid breathing',
        'Focus on the inhale being active, exhale passive',
        'Stop if lightheaded—take a few normal breaths, then continue',
      ],
    },
    proTips: [
      'Practice on an empty stomach—not after meals',
      'Tingling in hands/face is normal—it\'s changing blood pH',
      'After 30 breaths, you can optionally hold on empty lungs',
      'Great as a pre-workout or morning wake-up practice',
    ],
    science: 'Rapid breathing temporarily lowers CO2 and raises blood pH (respiratory alkalosis). This triggers adrenaline release and increases perceived energy. The tingling sensation is caused by temporary changes in blood calcium binding.',
    whenToUse: [
      'Morning activation instead of coffee',
      'Pre-workout for natural energy boost',
      'Afternoon energy slump recovery',
      'Before cold exposure (Wim Hof style)',
    ],
    whenToAvoid: [
      'Never while driving or in/near water',
      'If you have uncontrolled high blood pressure',
      'During pregnancy',
      'If prone to seizures',
      'On a full stomach',
    ],
    commonMistakes: [
      {
        mistake: 'Forcing the exhale',
        correction: 'Exhale should be passive, relaxed. Only the inhale is active.',
      },
      {
        mistake: 'Breathing too slowly',
        correction: 'This needs to be brisk—about 1 breath per 2 seconds at minimum.',
      },
      {
        mistake: 'Continuing despite dizziness',
        correction: 'If lightheaded, stop and breathe normally. Resume when stabilized.',
      },
      {
        mistake: 'Practicing in unsafe locations',
        correction: 'This can cause lightheadedness. Always practice somewhere safe to sit.',
      },
    ],
    benefits: [
      {
        benefit: 'Natural energy boost',
        explanation: 'Adrenaline release without caffeine. Effects last 30-60 minutes.',
      },
      {
        benefit: 'Increased alertness and focus',
        explanation: 'The heightened state enhances cognitive performance.',
      },
      {
        benefit: 'Mood elevation',
        explanation: 'Adrenaline combined with endorphins creates positive mood shift.',
      },
      {
        benefit: 'Enhanced cold tolerance',
        explanation: 'Prepares the body for cold exposure by increasing metabolic heat.',
      },
    ],
    progression: 'Start with 20 breaths, progress to 30. Advanced practitioners can add a breath hold after the 30 breaths.',
    expertNote: '"This is like an espresso for your nervous system—powerful, immediate, should be used wisely." — Wim Hof',
  },

  // ==========================================
  // POWER BREATHING
  // ==========================================
  'power-breathing': {
    overview: 'Power Breathing activates your sympathetic nervous system intentionally, creating peak mental and physical readiness. Special operators use this before missions. It\'s about controlled activation—not anxiety, but focused power.',
    steps: [
      {
        instruction: 'Strong inhale through nose',
        detail: 'Breathe in forcefully but not aggressively. Fill your lungs completely. Feel your core engage.',
        duration: '4 seconds',
      },
      {
        instruction: 'Hold with energy',
        detail: 'Hold the breath with a sense of contained power—not tension. Like an athlete ready to explode into action.',
        duration: '4 seconds',
      },
      {
        instruction: 'Controlled powerful exhale',
        detail: 'Release with force and control—like powering through resistance. Complete exhale.',
        duration: '4 seconds',
      },
    ],
    bodyPosition: {
      primary: 'Standing with feet shoulder-width apart, knees slightly bent. Power stance.',
      alternatives: [
        'Seated upright with strong posture',
        'Any position that allows full breathing',
      ],
      tips: [
        'Engage your core throughout the practice',
        'Shoulders back, chest open',
        'Eyes can be open, focused on a point ahead',
      ],
    },
    proTips: [
      'Combine with visualization of your upcoming challenge',
      'Use just before the moment of action—not too far ahead',
      'Clench fists on the holds to enhance activation',
      'Follow with 2-3 calming breaths if you feel over-activated',
    ],
    science: 'The forceful breathing pattern with holds activates the sympathetic nervous system in a controlled way, releasing adrenaline and noradrenaline. The equal phases keep it regulated—you\'re accessing fight-or-flight energy without losing control.',
    whenToUse: [
      'Immediately before competition or performance',
      'Before a difficult conversation or negotiation',
      'Pre-workout for maximum output',
      'When you need to access courage and confidence',
    ],
    whenToAvoid: [
      'When you\'re already over-activated or anxious',
      'Late evening when trying to wind down',
      'During calm situations that don\'t require high energy',
    ],
    commonMistakes: [
      {
        mistake: 'Turning it into hyperventilation',
        correction: 'Maintain the 4-4-4 timing. This is controlled power, not panic.',
      },
      {
        mistake: 'Using it to manage anxiety',
        correction: 'This is for activation, not calming. Use calming techniques for anxiety.',
      },
      {
        mistake: 'Not following with action',
        correction: 'This creates readiness—use it before something. Don\'t just sit with activation energy.',
      },
    ],
    benefits: [
      {
        benefit: 'Controlled activation',
        explanation: 'Access adrenaline\'s benefits without anxiety\'s downsides.',
      },
      {
        benefit: 'Peak performance state',
        explanation: 'Reaches optimal arousal for physical and mental challenges.',
      },
      {
        benefit: 'Confidence boost',
        explanation: 'The physical sensation of power transfers to mental state.',
      },
      {
        benefit: 'Preparation for challenges',
        explanation: 'Creates readiness—body and mind aligned for action.',
      },
    ],
    progression: 'Start with 4-4-4 pattern, 6 cycles. Advanced practitioners can increase to 5-5-5 or extend cycles.',
    expertNote: '"This is about channeled aggression. You\'re accessing your peak state intentionally, not accidentally." — Special Operations trainer',
  },

  // ==========================================
  // WIM HOF METHOD
  // ==========================================
  'wim-hof': {
    overview: 'The Wim Hof Method combines powerful breathing with cold exposure to create remarkable physical and mental effects. The breathing portion involves 30+ deep breaths followed by a breath hold, creating an altered state and significant physiological changes. Advanced technique—approach with respect.',
    steps: [
      {
        instruction: 'Full deep breath in',
        detail: 'Inhale fully through nose or mouth—fill belly, chest, then head. Pull in maximum air without straining.',
        duration: '2 seconds',
      },
      {
        instruction: 'Let go (passive exhale)',
        detail: 'Don\'t push the exhale—just let go. Relax and let the air fall out. Don\'t fully empty—about 70% out.',
        duration: '1 second',
      },
    ],
    bodyPosition: {
      primary: 'Seated or lying down in a safe location. Never in water, never while driving. Somewhere you can safely lose consciousness (though unlikely with proper practice).',
      alternatives: [
        'Lying flat on back (if safe)',
        'Seated in a meditative posture',
        'Never standing—risk of falling',
      ],
      tips: [
        'After 30 breaths, exhale and hold on empty lungs',
        'Hold until you feel the urge to breathe (1-3 minutes)',
        'Take a recovery breath and hold for 15 seconds',
        'Repeat for 3-4 rounds',
      ],
    },
    proTips: [
      'The breath hold after 30 breaths is where the magic happens',
      'Tingling, lightheadedness, and visual changes are normal',
      'Can be followed by cold exposure for full protocol',
      'Morning practice on empty stomach is ideal',
    ],
    science: 'The hyperventilation phase increases blood oxygen and decreases CO2, temporarily creating alkaline blood. This allows remarkably long breath holds. Studies show this method influences the immune system, reduces inflammation markers, and provides voluntary influence over the autonomic nervous system.',
    whenToUse: [
      'Morning practice for energy and immunity',
      'Before cold exposure',
      'For building mental resilience',
      'As part of a complete Wim Hof Method practice',
    ],
    whenToAvoid: [
      'In or near water—drowning risk during holds',
      'While driving or operating equipment',
      'During pregnancy',
      'With uncontrolled epilepsy or cardiovascular conditions',
      'Do not do this casually—respect the technique',
    ],
    commonMistakes: [
      {
        mistake: 'Rushing through the 30 breaths',
        correction: 'Take full, complete breaths each time. Quality over speed.',
      },
      {
        mistake: 'Forcing the breath hold too long',
        correction: 'Listen to your body. The hold should be challenging but not tortuous.',
      },
      {
        mistake: 'Practicing in water',
        correction: 'NEVER practice near water. Shallow water blackout is a real risk.',
      },
      {
        mistake: 'Skipping the retention phase',
        correction: 'The breath hold after 30 breaths is crucial to the method\'s effects.',
      },
    ],
    benefits: [
      {
        benefit: 'Enhanced immune function',
        explanation: 'Radboud University research showed voluntary influence over immune response.',
      },
      {
        benefit: 'Reduced inflammation',
        explanation: 'Studies show decrease in inflammatory markers after practice.',
      },
      {
        benefit: 'Mental resilience',
        explanation: 'Voluntary exposure to controlled stress builds mental toughness.',
      },
      {
        benefit: 'Increased energy',
        explanation: 'Many practitioners report sustained energy improvements.',
      },
    ],
    progression: '30 breaths with 1-minute hold → 30 breaths with 2-minute hold → 3-4 rounds. Add cold exposure as you advance.',
    expertNote: '"The breathing is the foundation. Get comfortable with it before adding cold. And never, ever practice in water." — Wim Hof',
  },

  // ==========================================
  // RECOVERY BREATHING
  // ==========================================
  'recovery-breathing': {
    overview: 'Recovery Breathing is optimized for the parasympathetic recovery state—after workouts, stressful events, or intense mental work. The pattern emphasizes exhale and empty holds to maximize rest-and-digest activation and accelerate cortisol clearing.',
    steps: [
      {
        instruction: 'Recovery inhale',
        detail: 'Breathe in through nose at a moderate pace. Not forced, not shallow—just full.',
        duration: '4 seconds',
      },
      {
        instruction: 'Brief hold',
        detail: 'Short pause at the top. Just a comma, not a stop.',
        duration: '2 seconds',
      },
      {
        instruction: 'Extended exhale',
        detail: 'Slow, controlled exhale through nose. Feel tension releasing with the breath.',
        duration: '6 seconds',
      },
      {
        instruction: 'Rest in emptiness',
        detail: 'Remain empty and relaxed. No urgency. Let the next breath arise when ready.',
        duration: '4 seconds',
      },
    ],
    bodyPosition: {
      primary: 'Lying down with legs elevated (on wall or chair) increases recovery effect. Arms at sides, palms up.',
      alternatives: [
        'Seated reclined with legs supported',
        'Lying flat if legs up isn\'t possible',
        'Any comfortable rest position',
      ],
      tips: [
        'Legs elevated promotes venous return and recovery',
        'Dim lighting enhances parasympathetic state',
        'Cool-to-neutral temperature is ideal',
      ],
    },
    proTips: [
      'Perfect for post-workout: start within 10 minutes of finishing',
      'Combine with progressive muscle relaxation for deeper recovery',
      'The empty hold at the bottom is where deep recovery happens',
      '10-15 minutes of practice can accelerate recovery significantly',
    ],
    science: 'The extended exhale and empty hold maximize vagal stimulation. The 4:6 inhale-to-exhale ratio plus the bottom hold creates sustained parasympathetic dominance, accelerating the clearing of cortisol and adrenaline. Blood pressure drops, heart rate slows, and recovery processes engage.',
    whenToUse: [
      'Immediately after exercise (within 30 minutes)',
      'After stressful work periods',
      'Evening wind-down to clear the day\'s stress',
      'After travel to reset from flight/drive stress',
      'Any time you need to shift from stressed to recovered',
    ],
    whenToAvoid: [
      'When you need to stay alert and active',
      'This induces a rest state—schedule it for rest time',
    ],
    commonMistakes: [
      {
        mistake: 'Skipping the empty hold',
        correction: 'The 4-second hold on empty is key to this technique\'s power. Don\'t rush past it.',
      },
      {
        mistake: 'Doing it standing up',
        correction: 'Recovery requires a rest position. Lie down or recline.',
      },
      {
        mistake: 'Too few cycles',
        correction: 'Aim for 8-10+ cycles. The recovery effect builds with duration.',
      },
    ],
    benefits: [
      {
        benefit: 'Accelerates physical recovery',
        explanation: 'Shifts body from stress state to recovery state, enhancing repair processes.',
      },
      {
        benefit: 'Clears cortisol faster',
        explanation: 'Parasympathetic activation speeds the metabolizing of stress hormones.',
      },
      {
        benefit: 'Reduces post-stress symptoms',
        explanation: 'Less lingering tension, faster return to baseline.',
      },
      {
        benefit: 'Improves sleep quality',
        explanation: 'Evening practice clears accumulated stress, improving sleep.',
      },
    ],
    progression: 'Start with 8 cycles post-workout. Extend to 15+ minutes for deeper recovery sessions.',
    expertNote: '"Recovery is where gains happen—in training and in life. This breathing accelerates that process." — Sports science researcher',
  },

  // ==========================================
  // NSDR BREATHING
  // ==========================================
  'nsdr': {
    overview: 'NSDR (Non-Sleep Deep Rest) Breathing supports the NSDR protocol developed at Stanford. This state provides many benefits of sleep—memory consolidation, nervous system restoration, energy replenishment—without actually sleeping. The breathing pattern helps achieve and maintain this unique state.',
    steps: [
      {
        instruction: 'Gentle inhale',
        detail: 'Soft breath in through nose. Not full capacity—about 70%. Effortless.',
        duration: '4 seconds',
      },
      {
        instruction: 'Restful hold',
        detail: 'Hold with complete relaxation. No tension anywhere. Like floating.',
        duration: '6 seconds',
      },
      {
        instruction: 'Melting exhale',
        detail: 'Let breath release as if melting. Slow, passive, complete. Feel yourself sinking deeper.',
        duration: '6 seconds',
      },
    ],
    bodyPosition: {
      primary: 'Lying flat on back (Savasana). Arms at sides with palms up. Legs slightly apart. Comfortable temperature.',
      alternatives: [
        'Reclined at slight angle if flat is uncomfortable',
        'Bolster under knees for lower back support',
      ],
      tips: [
        'Use an eye mask for darkness',
        'Keep room cool but not cold',
        'A light blanket adds comfort without overheating',
        'Set a timer—you may drift toward sleep',
      ],
    },
    proTips: [
      'NSDR is typically done with a guided track (Yoga Nidra style)',
      'This breathing can be the foundation as you listen',
      '10-20 minutes provides significant restoration',
      'Ideal for afternoon energy dips or sleep debt recovery',
    ],
    science: 'NSDR engages the brain in a unique state between waking and sleeping. Brain wave activity shifts toward theta and delta patterns while maintaining some conscious awareness. This state enables memory consolidation, creativity enhancement, and neural restoration without full sleep.',
    whenToUse: [
      'Afternoon recharge (ideal time: 2-4pm)',
      'When you have sleep debt but can\'t nap',
      'After intense learning to consolidate memory',
      'For creativity and problem-solving (many insights arise in NSDR)',
      'As a meditation alternative',
    ],
    whenToAvoid: [
      'When you actually need to sleep (just sleep)',
      'Right before needing peak alertness (allow 10min transition)',
    ],
    commonMistakes: [
      {
        mistake: 'Trying too hard to stay awake',
        correction: 'If you fall asleep, you needed sleep. Let it happen. NSDR state is effortless.',
      },
      {
        mistake: 'Sessions too short',
        correction: 'Minimum 10 minutes for effect. 20-30 minutes is optimal.',
      },
      {
        mistake: 'Uncomfortable position',
        correction: 'Physical discomfort prevents deep rest. Get comfortable first.',
      },
      {
        mistake: 'Expecting instant mastery',
        correction: 'The ability to access this state deepens with practice. Be patient.',
      },
    ],
    benefits: [
      {
        benefit: 'Restores energy without sleep',
        explanation: 'Many benefits of a nap without the groggy sleep inertia.',
      },
      {
        benefit: 'Memory consolidation',
        explanation: 'Theta brain states support learning and memory integration.',
      },
      {
        benefit: 'Creativity enhancement',
        explanation: 'The liminal state between wake and sleep sparks insights.',
      },
      {
        benefit: 'Nervous system restoration',
        explanation: 'Deeply activates rest-and-restore processes.',
      },
    ],
    progression: 'Start with 10-minute sessions, progress to 20-30 minutes. Daily practice at the same time builds the skill.',
    expertNote: '"NSDR may be one of the most underutilized tools we have for restoration and learning enhancement." — Dr. Andrew Huberman, Stanford Neuroscientist',
  },
}

// ============================================
// COMPONENT
// ============================================

export function TechniqueGuide({ technique, cycles }: TechniqueGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('steps')
  const guide = techniqueGuides[technique.id]
  const totalDuration = calculateSessionDuration(technique, cycles)

  if (!guide) {
    // Fallback for any techniques without guides
    return null
  }

  const sections = [
    { id: 'steps', label: 'Steps', icon: Target },
    { id: 'body', label: 'Position', icon: Heart },
    { id: 'tips', label: 'Pro Tips', icon: Star },
    { id: 'science', label: 'Science', icon: Brain },
    { id: 'mistakes', label: 'Avoid', icon: AlertTriangle },
    { id: 'benefits', label: 'Benefits', icon: Zap },
  ]

  return (
    <div className="w-full max-w-lg mx-auto mb-6">
      {/* Header Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group border border-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gold/20">
            <Lightbulb className="w-5 h-5 text-gold" />
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold text-white">How to Practice</span>
            <p className="text-xs text-slate-light">Complete guide & expert tips</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-light group-hover:text-white transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-6">
              {/* Quick Stats Bar */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-light" />
                  <span className="text-white font-medium">{formatDuration(totalDuration)}</span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div className="text-slate-light">
                  <span className="text-white font-medium">{cycles}</span> cycles
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div className="text-slate-light font-mono">{technique.pattern}</div>
              </div>

              {/* Overview */}
              <div className="px-1">
                <p className="text-sm text-slate-light leading-relaxed">
                  {guide.overview}
                </p>
              </div>

              {/* Section Tabs */}
              <div className="flex gap-1 p-1 rounded-xl bg-white/5 overflow-x-auto">
                {sections.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      activeSection === id
                        ? 'bg-white/10 text-white'
                        : 'text-slate-light hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Section Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[200px]"
                >
                  {activeSection === 'steps' && (
                    <div className="space-y-4">
                      {guide.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4 p-4 rounded-xl bg-white/5"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-arctic/20 flex items-center justify-center">
                            <span className="text-sm font-bold text-arctic">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-white text-sm">
                                {step.instruction}
                              </h4>
                              {step.duration && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-arctic/20 text-arctic font-mono">
                                  {step.duration}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-light leading-relaxed">
                              {step.detail}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeSection === 'body' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/5">
                        <h4 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-emerald-400" />
                          Primary Position
                        </h4>
                        <p className="text-sm text-slate-light">{guide.bodyPosition.primary}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-white/5">
                        <h4 className="font-semibold text-white text-sm mb-3">Alternatives</h4>
                        <ul className="space-y-2">
                          {guide.bodyPosition.alternatives.map((alt, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-light">
                              <span className="text-arctic mt-0.5">•</span>
                              {alt}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-white/5">
                        <h4 className="font-semibold text-white text-sm mb-3">Position Tips</h4>
                        <ul className="space-y-2">
                          {guide.bodyPosition.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-light">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeSection === 'tips' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
                        <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4 text-gold" />
                          Expert Pro Tips
                        </h4>
                        <ul className="space-y-3">
                          {guide.proTips.map((tip, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-2 text-sm text-slate-light"
                            >
                              <span className="text-gold">→</span>
                              {tip}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {guide.expertNote && (
                        <div className="p-4 rounded-xl bg-white/5 border-l-2 border-gold">
                          <p className="text-sm text-slate-light italic">
                            {guide.expertNote}
                          </p>
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-white/5">
                        <h4 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-arctic" />
                          Progression
                        </h4>
                        <p className="text-sm text-slate-light">{guide.progression}</p>
                      </div>
                    </div>
                  )}

                  {activeSection === 'science' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/5">
                        <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-400" />
                          The Science
                        </h4>
                        <p className="text-sm text-slate-light leading-relaxed">
                          {guide.science}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <h4 className="font-semibold text-white text-xs mb-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            When to Use
                          </h4>
                          <ul className="space-y-1.5">
                            {guide.whenToUse.slice(0, 3).map((use, i) => (
                              <li key={i} className="text-xs text-slate-light">
                                • {use}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                          <h4 className="font-semibold text-white text-xs mb-2 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            Avoid When
                          </h4>
                          <ul className="space-y-1.5">
                            {guide.whenToAvoid.slice(0, 3).map((avoid, i) => (
                              <li key={i} className="text-xs text-slate-light">
                                • {avoid}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 text-center">
                        <p className="text-xs text-slate">
                          Source: {technique.source}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSection === 'mistakes' && (
                    <div className="space-y-3">
                      {guide.commonMistakes.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 rounded-xl bg-white/5"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <div className="p-1.5 rounded-lg bg-red-500/20">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            </div>
                            <p className="text-sm font-medium text-white">{item.mistake}</p>
                          </div>
                          <div className="flex items-start gap-3 ml-8">
                            <div className="p-1.5 rounded-lg bg-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                            <p className="text-sm text-slate-light">{item.correction}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeSection === 'benefits' && (
                    <div className="space-y-3">
                      {guide.benefits.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 rounded-xl bg-white/5"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-4 h-4 text-arctic" />
                            <h4 className="font-semibold text-white text-sm">{item.benefit}</h4>
                          </div>
                          <p className="text-xs text-slate-light ml-6">
                            {item.explanation}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
