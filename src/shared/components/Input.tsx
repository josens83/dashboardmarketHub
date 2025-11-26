import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export type InputVariant = 'outlined' | 'filled';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'error' | 'success' | 'disabled';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  inputSize?: InputSize;
  state?: InputState;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'outlined',
      inputSize = 'md',
      state = 'default',
      label,
      helperText,
      errorMessage,
      successMessage,
      leftIcon,
      rightIcon,
      fullWidth = false,
      required = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    // Determine actual state based on props
    const actualState: InputState = disabled
      ? 'disabled'
      : errorMessage
      ? 'error'
      : successMessage
      ? 'success'
      : state;

    // Base input classes
    const baseInputClasses = 'transition-all duration-normal ease-out-expo focus:outline-none';

    // Variant classes
    const variantClasses: Record<InputVariant, string> = {
      outlined: 'bg-white dark:bg-neutral-900 border',
      filled: 'bg-neutral-50 dark:bg-neutral-800 border border-transparent',
    };

    // Size classes
    const sizeClasses: Record<InputSize, string> = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2.5 text-base rounded-lg',
      lg: 'px-5 py-3.5 text-lg rounded-lg',
    };

    // Icon padding adjustments
    const iconPaddingClasses = leftIcon
      ? inputSize === 'sm'
        ? 'pl-9'
        : inputSize === 'md'
        ? 'pl-11'
        : 'pl-12'
      : '';
    const rightIconPaddingClasses = rightIcon
      ? inputSize === 'sm'
        ? 'pr-9'
        : inputSize === 'md'
        ? 'pr-11'
        : 'pr-12'
      : '';

    // State-based border and focus classes
    const stateClasses: Record<InputState, string> = {
      default:
        variant === 'outlined'
          ? 'border-neutral-300 dark:border-neutral-600 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20'
          : 'focus:bg-white dark:focus:bg-neutral-900 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20',
      error:
        'border-error-500 dark:border-error-400 focus:border-error-600 dark:focus:border-error-300 focus:ring-2 focus:ring-error-500/20',
      success:
        'border-success-500 dark:border-success-400 focus:border-success-600 dark:focus:border-success-300 focus:ring-2 focus:ring-success-500/20',
      disabled:
        'border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed',
    };

    // Text color
    const textColorClasses =
      actualState === 'disabled'
        ? 'text-neutral-400 dark:text-neutral-500'
        : 'text-neutral-900 dark:text-neutral-50';

    // Placeholder color
    const placeholderClasses = 'placeholder:text-neutral-400 dark:placeholder:text-neutral-500';

    // Full width
    const widthClasses = fullWidth ? 'w-full' : '';

    // Combine input classes
    const combinedInputClasses = `
      ${baseInputClasses}
      ${variantClasses[variant]}
      ${sizeClasses[inputSize]}
      ${iconPaddingClasses}
      ${rightIconPaddingClasses}
      ${stateClasses[actualState]}
      ${textColorClasses}
      ${placeholderClasses}
      ${widthClasses}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    // Icon size classes
    const iconSizeClasses: Record<InputSize, string> = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    // Icon position classes
    const leftIconPositionClasses: Record<InputSize, string> = {
      sm: 'left-2.5',
      md: 'left-3.5',
      lg: 'left-4',
    };

    const rightIconPositionClasses: Record<InputSize, string> = {
      sm: 'right-2.5',
      md: 'right-3.5',
      lg: 'right-4',
    };

    // Icon color classes
    const iconColorClasses: Record<InputState, string> = {
      default: 'text-neutral-400 dark:text-neutral-500',
      error: 'text-error-500 dark:text-error-400',
      success: 'text-success-500 dark:text-success-400',
      disabled: 'text-neutral-300 dark:text-neutral-600',
    };

    // Message to display
    const message = errorMessage || successMessage || helperText;
    const messageColor = errorMessage
      ? 'text-error-600 dark:text-error-400'
      : successMessage
      ? 'text-success-600 dark:text-success-400'
      : 'text-neutral-600 dark:text-neutral-400';

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div
              className={`absolute ${leftIconPositionClasses[inputSize]} top-1/2 -translate-y-1/2 ${iconSizeClasses[inputSize]} ${iconColorClasses[actualState]} pointer-events-none`}
            >
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            disabled={disabled || actualState === 'disabled'}
            className={combinedInputClasses}
            aria-invalid={actualState === 'error'}
            aria-describedby={message ? `${props.id}-message` : undefined}
            {...props}
          />

          {/* Right icon or state icon */}
          {(rightIcon || actualState === 'error' || actualState === 'success') && (
            <div
              className={`absolute ${rightIconPositionClasses[inputSize]} top-1/2 -translate-y-1/2 ${iconSizeClasses[inputSize]} ${iconColorClasses[actualState]} pointer-events-none`}
            >
              {actualState === 'error' ? (
                <AlertCircle className={iconSizeClasses[inputSize]} />
              ) : actualState === 'success' ? (
                <CheckCircle2 className={iconSizeClasses[inputSize]} />
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>

        {/* Helper/Error/Success message */}
        {message && (
          <p
            id={props.id ? `${props.id}-message` : undefined}
            className={`text-sm mt-1.5 ${messageColor}`}
          >
            {message}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
