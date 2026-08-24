import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '../Button';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
}

// Toast types with icons
const toastIcons: Record<string, string> = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ'
};

// Toast colors
const toastColors: Record<string, string> = {
  success: 'var(--color-success-500)',
  error: 'var(--color-error-500)',
  warning: 'var(--color-warning-500)',
  info: 'var(--color-info-500)'
};

// Toast component
const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 5000,
  action,
  onDismiss
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss?.();
      }, duration);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress > 0 ? newProgress : 0;
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [duration, onDismiss]);

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  const icon = toastIcons[type] || toastIcons.info;
  const color = toastColors[type] || toastColors.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`toast ${type}`}
      style={{ borderLeftColor: color }}
    >
      <span className="toast-icon" style={{ color }}>{icon}</span>
      <span className="toast-message">{message}</span>
      {action && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={action.onClick}
          className="toast-action"
        >
          {action.label}
        </Button>
      )}
      <button 
        className="toast-close" 
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        ✕
      </button>
      {duration > 0 && (
        <div className="toast-progress" style={{ width: `${progress}%` }} />
      )}
    </motion.div>
  );
};

// Toast Container component
let toastId = 0;

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const ToastContainerComponent: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  maxToasts = 5
}) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Add toast function
  const addToast = useCallback((toast: Omit<ToastState, 'id'>) => {
    const id = String(++toastId);
    setToasts((prev) => [...prev.slice(-maxToasts + 1), { id, ...toast }]);
    return id;
  }, [maxToasts]);

  // Dismiss toast function
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Position classes
  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'toast-container top-left';
      case 'bottom-right':
        return 'toast-container bottom-right';
      case 'bottom-left':
        return 'toast-container bottom-left';
      default:
        return 'toast-container top-right';
    }
  };

  return (
    <div className={getPositionClass()}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            action={toast.action}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast hooks and utilities
let toastContainer: { addToast: (toast: Omit<ToastState, 'id'>) => string; clearToasts: () => void } | null = null;

export const useToast = () => {
  if (!toastContainer) {
    throw new Error('ToastContainer must be rendered before using useToast');
  }
  return toastContainer;
};

export const toast = {
  success: (message: string, options?: Omit<ToastState, 'id' | 'message' | 'type'>) => {
    if (toastContainer) {
      return toastContainer.addToast({ message, type: 'success', ...options });
    }
    return '';
  },
  error: (message: string, options?: Omit<ToastState, 'id' | 'message' | 'type'>) => {
    if (toastContainer) {
      return toastContainer.addToast({ message, type: 'error', ...options });
    }
    return '';
  },
  warning: (message: string, options?: Omit<ToastState, 'id' | 'message' | 'type'>) => {
    if (toastContainer) {
      return toastContainer.addToast({ message, type: 'warning', ...options });
    }
    return '';
  },
  info: (message: string, options?: Omit<ToastState, 'id' | 'message' | 'type'>) => {
    if (toastContainer) {
      return toastContainer.addToast({ message, type: 'info', ...options });
    }
    return '';
  },
  clear: () => {
    toastContainer?.clearToasts();
  }
};

// Toast Provider component
interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position,
  maxToasts
}) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (container) {
      toastContainer = {
        addToast: (toast: Omit<ToastState, 'id'>) => {
          const id = String(++toastId);
          const event = new CustomEvent('addToast', { detail: { id, ...toast } });
          container.dispatchEvent(event);
          return id;
        },
        clearToasts: () => {
          const event = new CustomEvent('clearToasts');
          container.dispatchEvent(event);
        }
      };
    }
    
    return () => {
      toastContainer = null;
    };
  }, [container]);

  return (
    <>
      {children}
      {createPortal(
        <ToastContainerComponent ref={(el) => setContainer(el as HTMLElement)} position={position} maxToasts={maxToasts} />,
        document.body
      )}
    </>
  );
};

// Toast Container (standalone)
export const ToastContainer: React.FC<ToastContainerProps> = (props) => {
  return <ToastContainerComponent {...props} />;
};

export default Toast;
