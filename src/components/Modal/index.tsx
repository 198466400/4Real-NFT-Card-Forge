import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

// Modal context
interface ModalContextType {
  openModal: (content: ReactNode, options?: Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>) => void;
  closeModal: () => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);

// Modal Provider
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [modalOptions, setModalOptions] = useState<Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>>({});

  const openModal = useCallback((content: ReactNode, options: Omit<ModalProps, 'isOpen' | 'onClose' | 'children'> = {}) => {
    setModalContent(content);
    setModalOptions(options);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalContent(null);
    setModalOptions({});
  }, []);

  const contextValue = { openModal, closeModal };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        {...modalOptions}
      >
        {modalContent}
      </Modal>
    </>
  );
};

// useModal hook
export const useModal = (): ModalContextType => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Modal Component
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = ''
}) => {
  const [isMounted, setIsMounted] = useState(isOpen);

  // Handle mount/unmount
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Close when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Size classes
  const sizeClass = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
    full: 'modal-full'
  }[size];

  const modalClassName = [
    'modal',
    sizeClass,
    className
  ].filter(Boolean).join(' ');

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={modalClassName}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="modal-header">
                {title && <h2 className="modal-title">{title}</h2>}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="modal-close"
                    aria-label="Close"
                  >
                    ✕
                  </Button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="modal-body">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// Confirm Modal Component
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="confirm-modal">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <Button variant="ghost" onClick={onClose} size="md">
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'secondary' : 'primary'}
            onClick={onConfirm}
            size="md"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Alert Modal Component
export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title = 'Alert',
  message = 'Something went wrong',
  buttonText = 'OK'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="alert-modal">
        <p className="alert-message">{message}</p>
        <div className="alert-actions">
          <Button variant="primary" onClick={onClose} size="md">
            {buttonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;
