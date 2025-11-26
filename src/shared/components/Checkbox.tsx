import { InputHTMLAttributes, forwardRef } from 'react';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  checkboxSize?: CheckboxSize;
  label?: string;
  description?: string;
  error?: boolean;
  errorMessage?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checkboxSize = 'md',
      label,
      description,
      error = false,
      errorMessage,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    // Size classes for checkbox
    const sizeClasses: Record<CheckboxSize, string> = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    // Base checkbox classes
    const baseCheckboxClasses = `
      rounded border-2 transition-all duration-normal ease-out-expo
      focus:outline-none focus:ring-2 focus:ring-offset-2
      cursor-pointer
    `;

    // State classes
    const stateClasses = error
      ? `
        border-error-500 text-error-600
        focus:ring-error-500/20
        checked:bg-error-600 checked:border-error-600
        dark:border-error-400 dark:checked:bg-error-500 dark:checked:border-error-500
      `
      : disabled
      ? `
        border-neutral-300 bg-neutral-100
        dark:border-neutral-600 dark:bg-neutral-800
        cursor-not-allowed opacity-50
      `
      : `
        border-neutral-300 text-brand-600
        hover:border-brand-400 focus:ring-brand-500/20
        checked:bg-brand-600 checked:border-brand-600
        dark:border-neutral-600 dark:checked:bg-brand-500 dark:checked:border-brand-500
        dark:hover:border-brand-400
      `;

    // Label size classes
    const labelSizeClasses: Record<CheckboxSize, string> = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    // Combine checkbox classes
    const combinedCheckboxClasses = `
      ${baseCheckboxClasses}
      ${sizeClasses[checkboxSize]}
      ${stateClasses}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    const hasLabel = label || description;

    return (
      <div>
        <div className="flex items-start">
          <div className="flex items-center h-6">
            <input
              ref={ref}
              type="checkbox"
              disabled={disabled}
              className={combinedCheckboxClasses}
              aria-invalid={error}
              aria-describedby={errorMessage ? `${props.id}-error` : undefined}
              {...props}
            />
          </div>
          {hasLabel && (
            <div className="ml-3">
              {label && (
                <label
                  htmlFor={props.id}
                  className={`
                    font-medium cursor-pointer
                    ${labelSizeClasses[checkboxSize]}
                    ${disabled ? 'text-neutral-400 dark:text-neutral-500 cursor-not-allowed' : 'text-neutral-900 dark:text-neutral-50'}
                    ${error ? 'text-error-700 dark:text-error-400' : ''}
                  `.trim().replace(/\s+/g, ' ')}
                >
                  {label}
                </label>
              )}
              {description && (
                <p
                  className={`
                    text-sm mt-0.5
                    ${disabled ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-600 dark:text-neutral-400'}
                  `.trim().replace(/\s+/g, ' ')}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        {errorMessage && (
          <p
            id={props.id ? `${props.id}-error` : undefined}
            className="text-sm text-error-600 dark:text-error-400 mt-1.5 ml-8"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
