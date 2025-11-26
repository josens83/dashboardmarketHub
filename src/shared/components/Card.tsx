import React, { HTMLAttributes, ReactNode } from 'react';

export type CardVariant = 'elevated' | 'flat' | 'outlined' | 'glass' | 'premium';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  glowOnHover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'premium',
      interactive = false,
      glowOnHover = false,
      padding = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = 'rounded-xl transition-all duration-normal ease-out-expo';

    // Variant classes
    const variantClasses: Record<CardVariant, string> = {
      premium: 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-soft dark:shadow-none',
      elevated: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-medium-lg',
      flat: 'bg-white dark:bg-neutral-800',
      outlined: 'bg-transparent border-2 border-neutral-300 dark:border-neutral-600',
      glass: 'bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]',
    };

    // Interactive classes
    const interactiveClasses = interactive
      ? `cursor-pointer hover:border-neutral-300/50 dark:hover:border-neutral-600/50 ${
          variant === 'premium' || variant === 'elevated'
            ? 'hover:shadow-strong hover:-translate-y-1'
            : 'hover:scale-[1.02]'
        }`
      : '';

    // Glow on hover
    const glowClasses = glowOnHover && interactive
      ? 'hover:shadow-glow-brand'
      : '';

    // Padding classes
    const paddingClasses: Record<typeof padding, string> = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    // Combine all classes
    const combinedClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${interactiveClasses}
      ${glowClasses}
      ${paddingClasses[padding]}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
