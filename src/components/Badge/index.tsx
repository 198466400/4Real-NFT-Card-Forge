import React from 'react';
import { motion } from 'framer-motion';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const sizeClass = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg'
  }[size];

  const variantClass = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info'
  }[variant];

  const badgeClassName = [
    'badge',
    sizeClass,
    variantClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.span
      className={badgeClassName}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {dot && <span className="badge-dot" />}
      {children}
    </motion.span>
  );
};

// Status Badge component
export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'error' | 'warning' | 'success';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  size = 'md',
  className = ''
}) => {
  const statusConfig: Record<string, { variant: BadgeProps['variant']; text: string }> = {
    active: { variant: 'success', text: 'Active' },
    inactive: { variant: 'secondary', text: 'Inactive' },
    pending: { variant: 'warning', text: 'Pending' },
    completed: { variant: 'success', text: 'Completed' },
    error: { variant: 'error', text: 'Error' },
    warning: { variant: 'warning', text: 'Warning' },
    success: { variant: 'success', text: 'Success' }
  };

  const config = statusConfig[status] || statusConfig.active;
  const displayText = text || config.text;

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {displayText}
    </Badge>
  );
};

// Count Badge component
export interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeProps['variant'];
  size?: BadgeProps['size'];
  showZero?: boolean;
  className?: string;
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max,
  variant = 'primary',
  size = 'md',
  showZero = false,
  className = ''
}) => {
  const displayCount = max !== undefined ? Math.min(count, max) : count;
  const showPlus = max !== undefined && count > max;

  if (!showZero && count === 0) {
    return null;
  }

  return (
    <Badge variant={variant} size={size} className={className}>
      {displayCount}{showPlus && '+'}
    </Badge>
  );
};

export default Badge;
