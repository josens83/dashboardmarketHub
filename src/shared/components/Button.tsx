import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-normal ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant classes
    const variantClasses: Record<ButtonVariant, string> = {
      primary: 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-soft hover:shadow-medium focus-visible:ring-brand-500',
      secondary: 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-soft hover:shadow-medium focus-visible:ring-brand-500',
      ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus-visible:ring-brand-500',
      outline: 'bg-transparent border-2 border-brand-600 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950 focus-visible:ring-brand-500',
      danger: 'bg-error-600 hover:bg-error-700 active:bg-error-800 text-white shadow-soft hover:shadow-medium focus-visible:ring-error-500',
      success: 'bg-success-600 hover:bg-success-700 active:bg-success-800 text-white shadow-soft hover:shadow-medium focus-visible:ring-success-500',
    };

    // Size classes
    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
      xl: 'px-8 py-4 text-xl gap-3',
    };

    // Hover effect classes
    const hoverEffectClasses = !disabled && !loading
      ? 'hover:-translate-y-0.5 active:translate-y-0'
      : '';

    // Full width
    const widthClasses = fullWidth ? 'w-full' : '';

    // Combine all classes
    const combinedClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${hoverEffectClasses}
      ${widthClasses}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={combinedClasses}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
