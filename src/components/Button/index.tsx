import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../LoadingScreen';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const ButtonVariants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger'
};

const ButtonSizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  icon: 'btn-icon'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      isFullWidth = false,
      disabled = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn';
    const variantClass = ButtonVariants[variant];
    const sizeClass = ButtonSizes[size];
    const fullWidthClass = isFullWidth ? 'btn-block' : '';
    const disabledClass = disabled || loading ? 'disabled' : '';
    
    const combinedClassName = [
      baseClasses,
      variantClass,
      sizeClass,
      fullWidthClass,
      disabledClass,
      className
    ].filter(Boolean).join(' ');

    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="btn-icon">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="btn-icon">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
