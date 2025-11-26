import { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  dot?: boolean;
  pill?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  dot = false,
  pill = false,
  className = '',
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center font-medium transition-all duration-normal';

  // Variant classes
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700',
    primary: 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700',
    success: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 border border-success-200 dark:border-success-700',
    warning: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 border border-warning-200 dark:border-warning-700',
    error: 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300 border border-error-200 dark:border-error-700',
    info: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-700',
  };

  // Size classes
  const sizeClasses: Record<BadgeSize, string> = {
    sm: pill ? 'px-2 py-0.5 text-xs gap-1' : 'px-2 py-0.5 text-xs gap-1',
    md: pill ? 'px-2.5 py-1 text-sm gap-1.5' : 'px-2.5 py-1 text-sm gap-1.5',
    lg: pill ? 'px-3 py-1.5 text-base gap-2' : 'px-3 py-1.5 text-base gap-2',
  };

  // Dot size classes
  const dotSizeClasses: Record<BadgeSize, string> = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  // Dot color classes
  const dotColorClasses: Record<BadgeVariant, string> = {
    default: 'bg-neutral-500 dark:bg-neutral-400',
    primary: 'bg-brand-600 dark:bg-brand-400',
    success: 'bg-success-600 dark:bg-success-400',
    warning: 'bg-warning-600 dark:bg-warning-400',
    error: 'bg-error-600 dark:bg-error-400',
    info: 'bg-cyan-600 dark:bg-cyan-400',
  };

  // Border radius
  const borderRadiusClasses = pill ? 'rounded-full' : 'rounded-md';

  // Combine classes
  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${borderRadiusClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={combinedClasses}>
      {dot && (
        <span
          className={`
            rounded-full animate-pulse
            ${dotSizeClasses[size]}
            ${dotColorClasses[variant]}
          `.trim().replace(/\s+/g, ' ')}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
