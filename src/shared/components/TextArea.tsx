import { TextareaHTMLAttributes, forwardRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export type TextAreaVariant = 'outlined' | 'filled';
export type TextAreaSize = 'sm' | 'md' | 'lg';
export type TextAreaState = 'default' | 'error' | 'success' | 'disabled';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextAreaVariant;
  textAreaSize?: TextAreaSize;
  state?: TextAreaState;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  fullWidth?: boolean;
  required?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      variant = 'outlined',
      textAreaSize = 'md',
      state = 'default',
      label,
      helperText,
      errorMessage,
      successMessage,
      fullWidth = false,
      required = false,
      disabled,
      showCharCount = false,
      maxLength,
      className = '',
      value,
      ...props
    },
    ref
  ) => {
    // Determine actual state based on props
    const actualState: TextAreaState = disabled
      ? 'disabled'
      : errorMessage
      ? 'error'
      : successMessage
      ? 'success'
      : state;

    // Base textarea classes
    const baseTextAreaClasses = 'transition-all duration-normal ease-out-expo focus:outline-none resize-vertical';

    // Variant classes
    const variantClasses: Record<TextAreaVariant, string> = {
      outlined: 'bg-white dark:bg-neutral-900 border',
      filled: 'bg-neutral-50 dark:bg-neutral-800 border border-transparent',
    };

    // Size classes
    const sizeClasses: Record<TextAreaSize, string> = {
      sm: 'px-3 py-2 text-sm rounded-md min-h-[80px]',
      md: 'px-4 py-3 text-base rounded-lg min-h-[120px]',
      lg: 'px-5 py-4 text-lg rounded-lg min-h-[160px]',
    };

    // State-based border and focus classes
    const stateClasses: Record<TextAreaState, string> = {
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

    // Combine textarea classes
    const combinedTextAreaClasses = `
      ${baseTextAreaClasses}
      ${variantClasses[variant]}
      ${sizeClasses[textAreaSize]}
      ${stateClasses[actualState]}
      ${textColorClasses}
      ${placeholderClasses}
      ${widthClasses}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    // Message to display
    const message = errorMessage || successMessage || helperText;
    const messageColor = errorMessage
      ? 'text-error-600 dark:text-error-400'
      : successMessage
      ? 'text-success-600 dark:text-success-400'
      : 'text-neutral-600 dark:text-neutral-400';

    // Character count
    const currentLength = value ? String(value).length : 0;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        {/* TextArea wrapper */}
        <div className="relative">
          {/* TextArea */}
          <textarea
            ref={ref}
            disabled={disabled || actualState === 'disabled'}
            className={combinedTextAreaClasses}
            aria-invalid={actualState === 'error'}
            aria-describedby={message ? `${props.id}-message` : undefined}
            maxLength={maxLength}
            value={value}
            {...props}
          />

          {/* State icon (top right corner) */}
          {(actualState === 'error' || actualState === 'success') && (
            <div className="absolute right-3 top-3 w-5 h-5 text-current pointer-events-none">
              {actualState === 'error' ? (
                <AlertCircle className="w-5 h-5 text-error-500 dark:text-error-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-success-500 dark:text-success-400" />
              )}
            </div>
          )}
        </div>

        {/* Helper/Error/Success message and character count */}
        <div className="flex justify-between items-start mt-1.5">
          {message && (
            <p
              id={props.id ? `${props.id}-message` : undefined}
              className={`text-sm ${messageColor} flex-1`}
            >
              {message}
            </p>
          )}
          {showCharCount && maxLength && (
            <p
              className={`text-sm ml-4 ${
                currentLength > maxLength
                  ? 'text-error-600 dark:text-error-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
