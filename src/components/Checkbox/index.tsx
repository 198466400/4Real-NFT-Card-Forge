import React, { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      hint,
      size = 'md',
      fullWidth = false,
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const sizeClass = {
      sm: 'form-checkbox form-checkbox-sm',
      md: 'form-checkbox',
      lg: 'form-checkbox form-checkbox-lg'
    }[size];

    return (
      <motion.div 
        className="form-group"
        whileTap={{ scale: 0.995 }}
      >
        <label className="form-checkbox">
          <input
            ref={ref}
            type="checkbox"
            className={`${sizeClass} ${disabled ? 'disabled' : ''} ${className}`}
            disabled={disabled}
            {...props}
          />
          <span className="checkbox-custom" />
          {label && <span className="checkbox-label">{label}</span>}
        </label>
        {error && <motion.p className="form-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
        {hint && !error && <p className="form-hint">{hint}</p>}
      </motion.div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
