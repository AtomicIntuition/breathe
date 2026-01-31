'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, RotateCcw, ArrowLeft, Share2, Flame, Clock, Wind } from 'lucide-react'
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
  const breathsTaken = cycles * technique.phases.length
  const avgBreathDuration = duration / breathsTaken

  // Share functionality
  const handleShare = async () => {
    const shareText = `Just completed ${cycles} cycles of ${technique.name} (${formatDuration(Math.floor(duration))}) with BREATHE SPEC 🧘`

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

      {/* Success icon with glow */}
      <motion.div
        className="relative inline-block mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="absolute inset-0 bg-gold/20 rounded-full blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <CheckCircle className="w-20 h-20 text-gold relative z-10" />
      </motion.div>

      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Session Complete
      </motion.h2>

      <motion.p
        className="text-slate-light text-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Great work. You completed {technique.name}.
      </motion.p>

      {/* Stats grid */}
      <motion.div
        className="grid grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-white/5 rounded-xl p-4">
          <Wind className="w-5 h-5 text-arctic mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{cycles}</p>
          <p className="text-xs text-slate-light">Cycles</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <Clock className="w-5 h-5 text-gold mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">
            {formatDuration(Math.floor(duration))}
          </p>
          <p className="text-xs text-slate-light">Duration</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <Flame className="w-5 h-5 text-energy mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{streakData.currentStreak}</p>
          <p className="text-xs text-slate-light">Day Streak</p>
        </div>
      </motion.div>

      {/* Detailed stats */}
      <motion.div
        className="flex justify-center gap-8 mb-8 text-sm text-slate-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div>
          <span className="text-white font-medium">{breathsTaken}</span> breaths
        </div>
        <div>
          <span className="text-white font-medium">{avgBreathDuration.toFixed(1)}s</span> avg breath
        </div>
      </motion.div>

      {/* Feedback section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-sm text-slate-light mb-3">How do you feel?</p>
        <div className="flex justify-center gap-3">
          {feedbackOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFeedback(option.value)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                selectedFeedback === option.value
                  ? 'bg-arctic/20 ring-1 ring-arctic'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{option.emoji}</span>
              <span className="text-xs text-slate-light">{option.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button variant="primary" size="lg" onClick={onRestart} glow className="w-full sm:w-auto">
          <RotateCcw className="w-5 h-5 mr-2" />
          Start Again
        </Button>

        <Link href="/breathe" className="w-full sm:w-auto">
          <Button variant="secondary" size="lg" className="w-full">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Choose Another
          </Button>
        </Link>
      </motion.div>

      {/* Share button */}
      <motion.button
        className="mt-6 flex items-center gap-2 mx-auto text-sm text-slate-light hover:text-white transition-colors"
        onClick={handleShare}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Share2 className="w-4 h-4" />
        Share your achievement
      </motion.button>

      {/* Recommendation */}
      <motion.p
        className="mt-8 text-xs text-slate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Tip: Practice daily for best results. Consistency matters more than duration.
      </motion.p>
    </motion.div>
  )
}
