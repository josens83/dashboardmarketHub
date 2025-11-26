import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  position?: DrawerPosition;
  size?: DrawerSize;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  position = 'right',
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = drawerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size classes based on position
  const sizeClasses: Record<DrawerPosition, Record<DrawerSize, string>> = {
    left: {
      sm: 'w-80',
      md: 'w-96',
      lg: 'w-[32rem]',
      xl: 'w-[40rem]',
      full: 'w-full',
    },
    right: {
      sm: 'w-80',
      md: 'w-96',
      lg: 'w-[32rem]',
      xl: 'w-[40rem]',
      full: 'w-full',
    },
    top: {
      sm: 'h-80',
      md: 'h-96',
      lg: 'h-[32rem]',
      xl: 'h-[40rem]',
      full: 'h-full',
    },
    bottom: {
      sm: 'h-80',
      md: 'h-96',
      lg: 'h-[32rem]',
      xl: 'h-[40rem]',
      full: 'h-full',
    },
  };

  // Position classes
  const positionClasses: Record<DrawerPosition, string> = {
    left: 'top-0 left-0 h-full animate-slide-in-left',
    right: 'top-0 right-0 h-full animate-slide-in-right',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const drawerContent = (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'drawer-title' : undefined}
    >
      <div
        ref={drawerRef}
        className={`
          absolute
          ${positionClasses[position]}
          ${sizeClasses[position][size]}
          bg-white dark:bg-neutral-900
          shadow-strong
          border
          ${position === 'left' ? 'border-r' : ''}
          ${position === 'right' ? 'border-l' : ''}
          ${position === 'top' ? 'border-b' : ''}
          ${position === 'bottom' ? 'border-t' : ''}
          border-neutral-200 dark:border-neutral-700
          flex flex-col
          ${className}
        `.trim().replace(/\s+/g, ' ')}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
            {title && (
              <h2
                id="drawer-title"
                className="font-display text-h5 font-bold text-neutral-900 dark:text-white"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-normal"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};

export default Drawer;
