import Skeleton from './Skeleton';
import Card from './Card';

export type LoadingStateVariant = 'page' | 'card' | 'table' | 'list';

export interface LoadingStateProps {
  variant?: LoadingStateVariant;
  rows?: number;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'page',
  rows = 3,
  className = '',
}) => {
  // Table loading skeleton
  if (variant === 'table') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Table header */}
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((col) => (
            <Skeleton key={col} width="25%" height="40px" variant="rectangular" />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {[1, 2, 3, 4].map((col) => (
              <Skeleton key={col} width="25%" height="48px" variant="rectangular" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // List loading skeleton
  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton variant="circular" width="48px" height="48px" />
            <div className="flex-1 space-y-2">
              <Skeleton width="60%" height="20px" />
              <Skeleton width="40%" height="16px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Card loading skeleton
  if (variant === 'card') {
    return (
      <Card variant="premium" className={className}>
        <div className="space-y-4">
          <Skeleton width="60%" height="28px" />
          <Skeleton width="100%" height="20px" />
          <Skeleton width="90%" height="20px" />
          <Skeleton width="70%" height="20px" />
          <div className="flex gap-3 mt-6">
            <Skeleton width="120px" height="40px" variant="rectangular" />
            <Skeleton width="100px" height="40px" variant="rectangular" />
          </div>
        </div>
      </Card>
    );
  }

  // Page loading skeleton (default)
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-3">
        <Skeleton width="40%" height="36px" />
        <Skeleton width="60%" height="24px" />
      </div>

      {/* Content cards */}
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i} variant="premium">
          <div className="space-y-3">
            <Skeleton width="50%" height="24px" />
            <Skeleton width="100%" height="16px" />
            <Skeleton width="80%" height="16px" />
            <Skeleton width="90%" height="16px" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LoadingState;
