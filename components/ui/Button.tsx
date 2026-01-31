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
          'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-arctic focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:opacity-50 disabled:pointer-events-none',
          {
            // Variants
            'bg-gold text-navy hover:bg-gold-light active:bg-gold-dark': variant === 'primary',
            'bg-arctic/10 text-arctic hover:bg-arctic/20 active:bg-arctic/30': variant === 'secondary',
            'bg-transparent text-slate-light hover:text-white hover:bg-white/5': variant === 'ghost',
            'border-2 border-arctic/30 text-arctic hover:border-arctic hover:bg-arctic/10': variant === 'outline',

            // Sizes
            'text-sm px-4 py-2': size === 'sm',
            'text-base px-6 py-3': size === 'md',
            'text-lg px-8 py-4': size === 'lg',

            // Glow effect
            'shadow-lg shadow-gold/25 hover:shadow-xl hover:shadow-gold/40': glow && variant === 'primary',
            'shadow-lg shadow-arctic/25 hover:shadow-xl hover:shadow-arctic/40': glow && variant === 'secondary',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
