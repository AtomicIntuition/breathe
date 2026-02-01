'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  centered?: boolean
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'md', centered = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'w-full px-4',
          {
            'max-w-[640px]': size === 'sm',
            'max-w-[768px]': size === 'md',
            'max-w-[1024px]': size === 'lg',
            'max-w-[1280px]': size === 'xl',
            'mx-auto': centered,
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

Container.displayName = 'Container'
