export type SkeletonVariant = 'text' | 'circular' | 'rectangular';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  animation = 'pulse',
  width,
  height,
  className = '',
}) => {
  // Base classes
  const baseClasses = 'bg-neutral-200 dark:bg-neutral-800';

  // Variant classes
  const variantClasses: Record<SkeletonVariant, string> = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  // Animation classes
  const animationClasses: Record<SkeletonAnimation, string> = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 bg-[length:200%_100%]',
    none: '',
  };

  // Combine classes
  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${animationClasses[animation]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Width and height styles
  const styles: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  return <div className={combinedClasses} style={styles} />;
};

export default Skeleton;
