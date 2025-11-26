import { SelectHTMLAttributes, forwardRef } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

export type SelectVariant = 'outlined' | 'filled';
export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectState = 'default' | 'error' | 'success' | 'disabled';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: SelectVariant;
  selectSize?: SelectSize;
  state?: SelectState;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  options?: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  required?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      variant = 'outlined',
      selectSize = 'md',
      state = 'default',
      label,
      helperText,
      errorMessage,
      successMessage,
      options = [],
      placeholder,
      fullWidth = false,
      required = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Determine actual state based on props
    const actualState: SelectState = disabled
      ? 'disabled'
      : errorMessage
      ? 'error'
      : successMessage
      ? 'success'
      : state;

    // Base select classes
    const baseSelectClasses = 'transition-all duration-normal ease-out-expo focus:outline-none appearance-none cursor-pointer';

    // Variant classes
    const variantClasses: Record<SelectVariant, string> = {
      outlined: 'bg-white dark:bg-neutral-900 border',
      filled: 'bg-neutral-50 dark:bg-neutral-800 border border-transparent',
    };

    // Size classes
    const sizeClasses: Record<SelectSize, string> = {
      sm: 'px-3 py-1.5 pr-9 text-sm rounded-md',
      md: 'px-4 py-2.5 pr-11 text-base rounded-lg',
      lg: 'px-5 py-3.5 pr-12 text-lg rounded-lg',
    };

    // State-based border and focus classes
    const stateClasses: Record<SelectState, string> = {
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

    // Full width
    const widthClasses = fullWidth ? 'w-full' : '';

    // Combine select classes
    const combinedSelectClasses = `
      ${baseSelectClasses}
      ${variantClasses[variant]}
      ${sizeClasses[selectSize]}
      ${stateClasses[actualState]}
      ${textColorClasses}
      ${widthClasses}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    // Icon size classes
    const iconSizeClasses: Record<SelectSize, string> = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    // Icon position classes
    const iconPositionClasses: Record<SelectSize, string> = {
      sm: 'right-2.5',
      md: 'right-3.5',
      lg: 'right-4',
    };

    // Icon color classes
    const iconColorClasses: Record<SelectState, string> = {
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

        {/* Select wrapper */}
        <div className="relative">
          {/* Select */}
          <select
            ref={ref}
            disabled={disabled || actualState === 'disabled'}
            className={combinedSelectClasses}
            aria-invalid={actualState === 'error'}
            aria-describedby={message ? `${props.id}-message` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
            {children}
          </select>

          {/* Chevron icon (always shown on right) */}
          <div
            className={`absolute ${iconPositionClasses[selectSize]} top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1`}
          >
            {/* State icon */}
            {actualState === 'error' && (
              <AlertCircle className={`${iconSizeClasses[selectSize]} ${iconColorClasses[actualState]}`} />
            )}
            {actualState === 'success' && (
              <CheckCircle2 className={`${iconSizeClasses[selectSize]} ${iconColorClasses[actualState]}`} />
            )}
            {/* Chevron */}
            <ChevronDown
              className={`${iconSizeClasses[selectSize]} ${iconColorClasses[actualState]}`}
            />
          </div>
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

Select.displayName = 'Select';

export default Select;
