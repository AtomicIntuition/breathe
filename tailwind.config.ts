import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Brand colors
        navy: {
          DEFAULT: '#0A1628',
          light: '#0F172A',
          dark: '#050B14',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#D4B84A',
          dark: '#A88920',
        },
        arctic: {
          DEFAULT: '#4A90D9',
          light: '#6BA3E0',
          dark: '#3A7BC8',
        },
        slate: {
          DEFAULT: '#64748B',
          light: '#94A3B8',
          dark: '#475569',
        },
        // Technique-specific colors
        calm: {
          DEFAULT: '#8B5CF6', // Purple for calming
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        energy: {
          DEFAULT: '#F97316', // Orange for energy
          light: '#FB923C',
          dark: '#EA580C',
        },
        sleep: {
          DEFAULT: '#6366F1', // Indigo for sleep
          light: '#818CF8',
          dark: '#4F46E5',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'breathe-in': 'breatheIn 4s ease-in-out',
        'breathe-out': 'breatheOut 4s ease-in-out',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 1.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
        'ripple': 'ripple 2s ease-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'particle-float': 'particleFloat 3s ease-in-out infinite',
        'particle-in': 'particleIn 2s ease-out forwards',
        'particle-out': 'particleOut 2s ease-out forwards',
        'confetti': 'confetti 1s ease-out forwards',
        'number-pop': 'numberPop 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        breatheIn: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.5)', opacity: '1' },
        },
        breatheOut: {
          '0%': { transform: 'scale(1.5)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.6' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(74, 144, 217, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(74, 144, 217, 0.6)' },
        },
        glowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(74, 144, 217, 0.3), inset 0 0 20px rgba(74, 144, 217, 0.1)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(74, 144, 217, 0.5), inset 0 0 40px rgba(74, 144, 217, 0.2)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        particleFloat: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.6' },
          '25%': { transform: 'translateY(-10px) translateX(5px)', opacity: '0.8' },
          '50%': { transform: 'translateY(-5px) translateX(-5px)', opacity: '0.6' },
          '75%': { transform: 'translateY(-15px) translateX(3px)', opacity: '0.8' },
        },
        particleIn: {
          '0%': { transform: 'translateY(50px) scale(0)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '0' },
        },
        particleOut: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
          '100%': { transform: 'translateY(50px) scale(0)', opacity: '0' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100px) rotate(720deg)', opacity: '0' },
        },
        numberPop: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(135deg, #0A1628 0%, #0F172A 50%, #0A1628 100%)',
        'gradient-breathing': 'radial-gradient(circle at center, rgba(74, 144, 217, 0.1) 0%, transparent 70%)',
        'gradient-gold': 'linear-gradient(135deg, #C9A227 0%, #D4B84A 50%, #C9A227 100%)',
        'gradient-arctic': 'linear-gradient(135deg, #4A90D9 0%, #6BA3E0 50%, #4A90D9 100%)',
        'gradient-calm': 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #8B5CF6 100%)',
        'gradient-energy': 'linear-gradient(135deg, #F97316 0%, #FB923C 50%, #F97316 100%)',
        'gradient-sleep': 'linear-gradient(135deg, #6366F1 0%, #818CF8 50%, #6366F1 100%)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'breath': 'cubic-bezier(0.45, 0, 0.55, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
}

export default config
