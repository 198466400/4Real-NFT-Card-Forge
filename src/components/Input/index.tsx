import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
}

const InputSizes = {
  sm: 'form-input form-input-sm',
  md: 'form-input',
  lg: 'form-input form-input-lg'
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      size = 'md',
      fullWidth = true,
      multiline = false,
      rows = 3,
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const inputClassName = [
      InputSizes[size],
      error ? 'error' : '',
      disabled ? 'disabled' : '',
      fullWidth ? 'full-width' : '',
      className
    ].filter(Boolean).join(' ');

    if (multiline) {
      return (
        <motion.div 
          className="form-group"
          whileTap={{ scale: 0.995 }}
        >
          {label && (
            <label className="form-label">
              {label}
              {props.required && <span className="required">*</span>}
            </label>
          )}
          <div className="input-wrapper">
            {leftIcon && <span className="input-icon left">{leftIcon}</span>}
            <textarea
              ref={ref as any}
              className={inputClassName}
              disabled={disabled}
              rows={rows}
              {...props as any}
            />
            {rightIcon && <span className="input-icon right">{rightIcon}</span>}
          </div>
          {error && <motion.p className="form-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
          {hint && !error && <p className="form-hint">{hint}</p>}
        </motion.div>
      );
    }

    return (
      <motion.div 
        className="form-group"
        whileTap={{ scale: 0.995 }}
      >
        {label && (
          <label className="form-label">
            {label}
            {props.required && <span className="required">*</span>}
          </label>
        )}
        <div className="input-wrapper">
          {leftIcon && <span className="input-icon left">{leftIcon}</span>}
          <input
            ref={ref}
            className={inputClassName}
            disabled={disabled}
            {...props}
          />
          {rightIcon && <span className="input-icon right">{rightIcon}</span>}
        </div>
        {error && <motion.p className="form-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
        {hint && !error && <p className="form-hint">{hint}</p>}
      </motion.div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
