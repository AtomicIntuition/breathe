'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, padding = 'none', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          // Base styles
          'rounded-lg transition-all duration-200 ease-out',
          {
            // Variants
            'bg-navy-light': variant === 'default',
            'glass-card': variant === 'glass',
            'bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08]': variant === 'bordered',

            // Hover effects
            'hover:scale-[1.02] hover:border-white/[0.15] hover:shadow-elevated cursor-pointer': hover,

            // Padding
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
