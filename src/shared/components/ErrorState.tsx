import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';
import Card from './Card';

export type ErrorStateVariant = 'page' | 'inline' | 'card';

export interface ErrorStateProps {
  variant?: ErrorStateVariant;
  title?: string;
  message?: string;
  error?: Error | string;
  showDetails?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  variant = 'page',
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
  error,
  showDetails = false,
  onRetry,
  retryLabel = 'Try again',
  action,
  className = '',
}) => {
  const errorMessage = error instanceof Error ? error.message : error;

  const content = (
    <>
      {/* Icon */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display text-h5 font-bold text-neutral-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-body-lg text-neutral-600 dark:text-neutral-400 max-w-md mb-6">
        {message}
      </p>

      {/* Error details */}
      {showDetails && errorMessage && (
        <div className="mb-8 max-w-2xl">
          <details className="text-left">
            <summary className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Error details
            </summary>
            <pre className="mt-3 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 overflow-x-auto">
              {errorMessage}
            </pre>
          </details>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button
            variant="primary"
            size="lg"
            onClick={onRetry}
            icon={<RefreshCw className="w-5 h-5" />}
          >
            {retryLabel}
          </Button>
        )}
        {action && (
          <Button
            variant="ghost"
            size="lg"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
    </>
  );

  // Variant rendering
  if (variant === 'card') {
    return (
      <Card variant="premium" className={`text-center ${className}`}>
        {content}
      </Card>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`py-8 text-center ${className}`}>
        {content}
      </div>
    );
  }

  // Page variant (default)
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        min-h-[400px] px-6 py-12 text-center
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {content}
    </div>
  );
};

export default ErrorState;
