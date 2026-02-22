'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, RotateCcw, ArrowLeft, Share2, Flame, Clock, Wind, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { BreathingTechnique, formatDuration } from '@/lib/techniques'
import { getStreak, StreakData } from '@/lib/storage'
import Link from 'next/link'

interface SessionCompleteProps {
  technique: BreathingTechnique
  cycles: number
  duration: number
  onRestart: () => void
}

// Generate confetti pieces
function generateConfetti(count: number) {
  const colors = ['#C9A227', '#4A90D9', '#6BA3E0', '#D4B84A', '#ffffff']
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.5,
    rotation: Math.random() * 360,
    size: 6 + Math.random() * 8,
  }))
}

interface FeedbackOption {
  emoji: string
  label: string
  value: string
}

const feedbackOptions: FeedbackOption[] = [
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😊', label: 'Good', value: 'good' },
  { emoji: '🧘', label: 'Focused', value: 'focused' },
  { emoji: '😴', label: 'Relaxed', value: 'relaxed' },
]

export function SessionComplete({
  technique,
  cycles,
  duration,
  onRestart,
}: SessionCompleteProps) {
  const [showConfetti, setShowConfetti] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null)
  const [streakData, setStreakData] = useState<StreakData>({ currentStreak: 0, lastSessionDate: null, longestStreak: 0 })

  const confetti = useMemo(() => generateConfetti(30), [])

  useEffect(() => {
    // Hide confetti after animation
    const timeout = setTimeout(() => setShowConfetti(false), 3000)

    // Get current streak
    setStreakData(getStreak())

    return () => clearTimeout(timeout)
  }, [])

  // Calculate session stats
  const breathsTaken = technique.rounds
    ? technique.rounds.slice(0, cycles).reduce((sum, round) => sum + round.length, 0)
    : cycles * technique.phases.length
  const avgBreathDuration = duration / breathsTaken

  // Share functionality
  const handleShare = async () => {
    const shareText = `Just completed ${cycles} cycles of ${technique.name} (${formatDuration(Math.floor(duration))}) with BREATHE SPEC`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BREATHE SPEC Session Complete',
          text: shareText,
          url: window.location.href,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText)
    }
  }

  return (
    <motion.div
      className="text-center max-w-md mx-auto px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Confetti overlay */}
      <AnimatePresence>
        {showConfetti && (
          <div className="celebration-overlay">
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                className="confetti-piece"
                style={{
                  left: `${piece.x}%`,
                  backgroundColor: piece.color,
                  width: piece.size,
                  height: piece.size,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
                initial={{ y: -20, rotate: 0, opacity: 1 }}
                animate={{
                  y: '100vh',
                  rotate: piece.rotation + 720,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2.5 + Math.random(),
                  delay: piece.delay,
                  ease: 'easeIn',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Success icon with enhanced glow */}
      <motion.div
        className="relative inline-block mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="absolute inset-0 bg-gold/25 rounded-full blur-2xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-gold" />
        </div>
      </motion.div>

      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-3 tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Session Complete
      </motion.h2>

      <motion.p
        className="text-slate-light text-lg mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Great work. You completed {technique.name}.
      </motion.p>

      {/* Stats grid - refined */}
      <motion.div
        className="grid grid-cols-3 gap-4 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-arctic/10 flex items-center justify-center mx-auto mb-3">
            <Wind className="w-5 h-5 text-arctic" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{cycles}</p>
          <p className="text-xs text-slate-light mt-1">Cycles</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5 text-gold" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">
            {formatDuration(Math.floor(duration))}
          </p>
          <p className="text-xs text-slate-light mt-1">Duration</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-energy/10 flex items-center justify-center mx-auto mb-3">
            <Flame className="w-5 h-5 text-energy" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-white">{streakData.currentStreak}</p>
          <p className="text-xs text-slate-light mt-1">Day Streak</p>
        </div>
      </motion.div>

      {/* Detailed stats */}
      <motion.div
        className="flex justify-center gap-10 mb-10 text-sm text-slate-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div>
          <span className="text-white font-semibold">{breathsTaken}</span> breaths
        </div>
        <div>
          <span className="text-white font-semibold">{avgBreathDuration.toFixed(1)}s</span> avg breath
        </div>
      </motion.div>

      {/* Feedback section - refined */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-sm text-slate-light mb-4">How do you feel?</p>
        <div className="flex justify-center gap-3">
          {feedbackOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFeedback(option.value)}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-xl transition-all duration-200 ${
                selectedFeedback === option.value
                  ? 'bg-arctic/15 border border-arctic/30 scale-105'
                  : 'bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06]'
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="text-xs text-slate-light">{option.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Action buttons - refined */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button variant="primary" size="lg" onClick={onRestart} glow className="w-full sm:w-auto gap-2">
          <RotateCcw className="w-5 h-5" />
          Start Again
        </Button>

        <Link href="/breathe" className="w-full sm:w-auto">
          <Button variant="secondary" size="lg" className="w-full gap-2">
            <ArrowLeft className="w-5 h-5" />
            Choose Another
          </Button>
        </Link>
      </motion.div>

      {/* Share button - refined */}
      <motion.button
        className="mt-8 flex items-center gap-2 mx-auto text-sm text-slate-light hover:text-white transition-colors group"
        onClick={handleShare}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        Share your achievement
      </motion.button>

      {/* Recommendation - refined */}
      <motion.div
        className="mt-10 flex items-center justify-center gap-2 text-xs text-slate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Tip: Practice daily for best results. Consistency matters more than duration.</span>
      </motion.div>
    </motion.div>
  )
}
