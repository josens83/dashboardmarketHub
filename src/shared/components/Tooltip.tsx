import { ReactNode, useState, useRef, useEffect } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipVariant = 'dark' | 'light' | 'premium';

export interface TooltipProps {
  content: ReactNode;
  position?: TooltipPosition;
  variant?: TooltipVariant;
  delay?: number;
  children: ReactNode;
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  variant = 'dark',
  delay = 200,
  children,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = -tooltipRect.height - 8;
          left = (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.height + 8;
          left = (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = (triggerRect.height - tooltipRect.height) / 2;
          left = -tooltipRect.width - 8;
          break;
        case 'right':
          top = (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.width + 8;
          break;
      }

      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Variant styles
  const variantClasses: Record<TooltipVariant, string> = {
    dark: 'bg-neutral-900 dark:bg-neutral-800 text-white border border-neutral-700 dark:border-neutral-600',
    light: 'bg-white dark:bg-neutral-100 text-neutral-900 border border-neutral-200 dark:border-neutral-300 shadow-medium',
    premium: 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl text-neutral-900 dark:text-white border border-neutral-200/50 dark:border-neutral-700/50 shadow-strong',
  };

  // Arrow styles
  const arrowClasses: Record<TooltipVariant, string> = {
    dark: 'border-neutral-900 dark:border-neutral-800',
    light: 'border-white dark:border-neutral-100',
    premium: 'border-white/95 dark:border-neutral-900/95',
  };

  // Arrow position classes
  const arrowPositionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-[-5px] left-1/2 -translate-x-1/2 border-t border-l border-r-transparent border-b-transparent',
    bottom: 'top-[-5px] left-1/2 -translate-x-1/2 border-b border-l border-r-transparent border-t-transparent',
    left: 'right-[-5px] top-1/2 -translate-y-1/2 border-l border-t border-r-transparent border-b-transparent',
    right: 'left-[-5px] top-1/2 -translate-y-1/2 border-r border-t border-l-transparent border-b-transparent',
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && !disabled && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-3 py-2 text-sm rounded-lg
            whitespace-nowrap pointer-events-none
            animate-fade-in
            ${variantClasses[variant]}
          `.trim().replace(/\s+/g, ' ')}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <div
            className={`
              absolute w-2 h-2 rotate-45
              ${arrowClasses[variant]}
              ${arrowPositionClasses[position]}
            `.trim().replace(/\s+/g, ' ')}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
