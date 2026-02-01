'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          // Base styles
          'relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 ease-out',
          // Focus styles
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-arctic focus-visible:ring-offset-2 focus-visible:ring-offset-navy',
          // Disabled
          'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
          // Transform on interactions
          'active:scale-[0.98] hover:-translate-y-px',
          {
            // Primary variant - gold with subtle gradient overlay
            'bg-gradient-to-b from-gold-light to-gold text-navy font-bold shadow-subtle hover:shadow-card hover:from-gold hover:to-gold-dark': variant === 'primary',

            // Secondary variant - arctic glass
            'bg-arctic/10 text-arctic border border-arctic/20 hover:bg-arctic/20 hover:border-arctic/30 active:bg-arctic/25': variant === 'secondary',

            // Ghost variant
            'bg-transparent text-slate-light hover:text-white hover:bg-white/5 active:bg-white/10': variant === 'ghost',

            // Outline variant
            'border border-white/10 text-white/80 hover:border-white/20 hover:text-white hover:bg-white/5': variant === 'outline',

            // Sizes with refined padding
            'text-sm px-3 py-1.5 gap-1.5': size === 'sm',
            'text-base px-5 py-2.5 gap-2': size === 'md',
            'text-lg px-7 py-3.5 gap-2.5': size === 'lg',

            // Glow effects
            'shadow-glow-gold hover:shadow-glow-gold-lg': glow && variant === 'primary',
            'shadow-glow-arctic hover:shadow-glow-arctic-lg': glow && variant === 'secondary',
          },
          className
        )}
        {...props}
      >
        {/* Inner highlight for primary buttons */}
        {variant === 'primary' && (
          <span className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </span>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
