import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  labelFormatter?: (value: number, max: number) => string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  labelFormatter = (v, m) => `${Math.round((v / m) * 100)}%`,
  animated = false,
  striped = false,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClass = {
    sm: 'progress-sm',
    md: 'progress-md',
    lg: 'progress-lg'
  }[size];

  const variantClass = {
    primary: 'progress-primary',
    secondary: 'progress-secondary',
    success: 'progress-success',
    warning: 'progress-warning',
    error: 'progress-error',
    info: 'progress-info'
  }[variant];

  const progressClassName = [
    'progress',
    sizeClass,
    variantClass,
    striped ? 'progress-striped' : '',
    animated ? 'progress-animated' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="progress-container">
      {showLabel && (
        <span className="progress-label">
          {labelFormatter(value, max)}
        </span>
      )}
      <div className={progressClassName}>
        <motion.div
          className="progress-bar"
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {striped && (
            <div className="progress-stripes" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Circular Progress component
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: ProgressProps['variant'];
  showLabel?: boolean;
  labelFormatter?: (value: number, max: number) => string;
  animated?: boolean;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 48,
  strokeWidth = 4,
  variant = 'primary',
  showLabel = false,
  labelFormatter = (v, m) => `${Math.round((v / m) * 100)}%`,
  animated = false,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const variantClass = {
    primary: 'progress-primary',
    secondary: 'progress-secondary',
    success: 'progress-success',
    warning: 'progress-warning',
    error: 'progress-error',
    info: 'progress-info'
  }[variant];

  return (
    <div className={`circular-progress ${className}`} style={{ width: size, height: size }}>
      <svg
        className="circular-progress-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="circular-progress-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          className={`circular-progress-bar ${variantClass}`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      {showLabel && (
        <div className="circular-progress-label">
          {labelFormatter(value, max)}
        </div>
      )}
    </div>
  );
};

// Progress with steps
export interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: ProgressProps['variant'];
  showLabels?: boolean;
  stepLabels?: string[];
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  size = 'md',
  variant = 'primary',
  showLabels = false,
  stepLabels = [],
  className = ''
}) => {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={`step-progress ${className}`}>
      <Progress value={currentStep - 1} max={totalSteps - 1} variant={variant} size={size} />
      
      <div className="step-indicators">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index === currentStep - 1;
          const isCompleted = index < currentStep - 1;
          const isLast = index === totalSteps - 1;

          return (
            <div
              key={index}
              className={`step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${variant}`}
            >
              <div className="step-dot" />
              {showLabels && (
                <span className="step-label">
                  {stepLabels[index] || `Step ${index + 1}`}
                </span>
              )}
              {!isLast && <div className="step-line" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Progress;
