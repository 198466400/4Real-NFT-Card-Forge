import React from 'react';
import { motion } from 'framer-motion';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap = {
  sm: { width: '100%', height: '12px' },
  md: { width: '100%', height: '20px' },
  lg: { width: '100%', height: '32px' },
  xl: { width: '100%', height: '48px' }
};

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  size,
  animation = true,
  className = '',
  style = {}
}) => {
  // Apply size if provided
  const sizeStyle = size ? sizeMap[size as keyof typeof sizeMap] : {};

  // Determine border radius based on variant
  const getBorderRadius = () => {
    switch (variant) {
      case 'circular':
        return '50%';
      case 'rounded':
        return 'var(--radius-lg)';
      case 'rectangular':
        return '0';
      default:
        return 'var(--radius-sm)';
    }
  };

  const skeletonStyle: React.CSSProperties = {
    width: width || sizeStyle.width,
    height: height || sizeStyle.height,
    borderRadius: getBorderRadius(),
    ...style
  };

  const skeletonClassName = [
    'skeleton',
    animation ? 'skeleton-animate' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={skeletonClassName}
      style={skeletonStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
};

// Text Skeleton component
export interface TextSkeletonProps {
  lines?: number;
  width?: string | number;
  spacing?: string | number;
  animation?: boolean;
  className?: string;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  width = '100%',
  spacing = '8px',
  animation = true,
  className = ''
}) => {
  return (
    <div className={`text-skeleton ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '75%' : width}
          animation={animation}
          style={{ marginBottom: index < lines - 1 ? spacing : 0 }}
        />
      ))}
    </div>
  );
};

// Avatar Skeleton component
export interface AvatarSkeletonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animation?: boolean;
  className?: string;
}

const avatarSizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80
};

export const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({
  size = 'md',
  animation = true,
  className = ''
}) => {
  const dimensions = avatarSizeMap[size as keyof typeof avatarSizeMap];

  return (
    <Skeleton
      variant="circular"
      width={dimensions}
      height={dimensions}
      animation={animation}
      className={className}
    />
  );
};

// Card Skeleton component
export interface CardSkeletonProps {
  lines?: number;
  showImage?: boolean;
  imageHeight?: string | number;
  animation?: boolean;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  lines = 3,
  showImage = true,
  imageHeight = '180px',
  animation = true,
  className = ''
}) => {
  return (
    <div className={`card-skeleton ${className}`}>
      {showImage && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={imageHeight}
          animation={animation}
        />
      )}
      <div className="card-skeleton-content">
        <Skeleton
          variant="text"
          width="80%"
          height="24px"
          animation={animation}
          style={{ marginBottom: '12px' }}
        />
        <TextSkeleton lines={lines} animation={animation} />
      </div>
    </div>
  );
};

// List Skeleton component
export interface ListSkeletonProps {
  count?: number;
  itemHeight?: string | number;
  spacing?: string | number;
  animation?: boolean;
  className?: string;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  count = 5,
  itemHeight = '64px',
  spacing = '8px',
  animation = true,
  className = ''
}) => {
  return (
    <div className={`list-skeleton ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width="100%"
          height={itemHeight}
          animation={animation}
          style={{ marginBottom: index < count - 1 ? spacing : 0 }}
        />
      ))}
    </div>
  );
};

// Table Skeleton component
export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  animation?: boolean;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  animation = true,
  className = ''
}) => {
  return (
    <div className={`table-skeleton ${className}`}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="table-skeleton-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              width="100%"
              height="20px"
              animation={animation}
              style={{ marginRight: colIndex < columns - 1 ? '16px' : 0 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
