import React from 'react';
import { motion } from 'framer-motion';
import './styles.css';

export interface LoadingScreenProps {
  message?: string;
  spinner?: boolean;
}

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 16,
    md: 32,
    lg: 48
  };
  
  const borderWidthMap = {
    sm: 2,
    md: 3,
    lg: 4
  };

  return (
    <motion.div
      className="loading-spinner"
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        borderWidth: borderWidthMap[size]
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  spinner = true
}) => {
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="loading-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {spinner && <LoadingSpinner size="lg" />}
        {message && (
          <motion.p
            className="loading-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

// Skeleton loading components
export const Skeleton: React.FC<{
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: boolean;
}> = ({
  className = '',
  width = '100%',
  height = '1em',
  variant = 'text',
  animation = true
}) => {
  const style: React.CSSProperties = {
    width,
    height,
    borderRadius: variant === 'circular' ? '50%' : variant === 'rectangular' ? '4px' : '4px',
    background: animation ? 'linear-gradient(90deg, var(--bg-tertiary) 25%, var(--border-primary) 50%, var(--bg-tertiary) 75%)' : 'var(--bg-tertiary)',
    backgroundSize: '200% 100%'
  };

  return (
    <motion.div
      className={`skeleton ${className}`}
      style={style}
      animate={animation ? { backgroundPosition: ['200% 0', '-200% 0'] } : {}}
      transition={animation ? { duration: 1.5, repeat: Infinity, ease: 'linear' } : {}}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`skeleton-text ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          width={i === 0 ? '80%' : i === lines - 1 ? '60%' : '100%'} 
          height="1em"
          variant="text"
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      className={`skeleton-card ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Skeleton width="100%" height="180px" variant="rectangular" />
      <div className="skeleton-card-content">
        <Skeleton width="80%" height="1.5em" variant="text" />
        <Skeleton width="60%" height="1em" variant="text" />
        <Skeleton width="40%" height="1em" variant="text" />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
