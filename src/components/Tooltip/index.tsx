import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  disabled = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Handle mouse events
  const handleMouseEnter = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      if (targetRef.current) {
        setTargetRect(targetRef.current.getBoundingClientRect());
      }
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsVisible(false);
  };

  // Calculate tooltip position
  const getTooltipPosition = () => {
    if (!targetRect) {
      return { top: 0, left: 0 };
    }

    const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
    const tooltipHeight = tooltipRef.current?.offsetHeight || 0;

    switch (position) {
      case 'top':
        return {
          top: targetRect.top - tooltipHeight - 8,
          left: targetRect.left + (targetRect.width - tooltipWidth) / 2
        };
      case 'bottom':
        return {
          top: targetRect.bottom + 8,
          left: targetRect.left + (targetRect.width - tooltipWidth) / 2
        };
      case 'left':
        return {
          top: targetRect.top + (targetRect.height - tooltipHeight) / 2,
          left: targetRect.left - tooltipWidth - 8
        };
      case 'right':
        return {
          top: targetRect.top + (targetRect.height - tooltipHeight) / 2,
          left: targetRect.right + 8
        };
      default:
        return { top: 0, left: 0 };
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (targetRef.current) {
        setTargetRect(targetRef.current.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClass = `tooltip-${position}`;
  const tooltipClassName = [
    'tooltip',
    positionClass,
    isVisible ? 'visible' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleMouseLeave}
      >
        {children}
      </div>
      
      {isVisible && !disabled && (
        <div 
          ref={tooltipRef}
          className={tooltipClassName}
          style={getTooltipPosition()}
          onMouseEnter={() => clearTimeout(timeoutRef.current as number)}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="tooltip-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            {content}
            <div className={`tooltip-arrow ${position}`} />
          </motion.div>
        </div>
      )}
    </>
  );
};

// Simple tooltip component without portal
export const SimpleTooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  disabled = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClass = `tooltip-${position}`;
  const tooltipClassName = [
    'tooltip',
    positionClass,
    isVisible ? 'visible' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="tooltip-wrapper">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && !disabled && (
          <motion.div
            className={tooltipClassName}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <div className="tooltip-content">
              {content}
              <div className={`tooltip-arrow ${position}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
