import React, { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
      sm: 'form-radio form-radio-sm',
      md: 'form-radio',
      lg: 'form-radio form-radio-lg'
    }[size];

    return (
      <motion.div 
        className="form-group"
        whileTap={{ scale: 0.995 }}
      >
        <label className="form-radio">
          <input
            ref={ref}
            type="radio"
            className={`${sizeClass} ${disabled ? 'disabled' : ''} ${className}`}
            disabled={disabled}
            {...props}
          />
          <span className="radio-custom" />
          {label && <span className="radio-label">{label}</span>}
        </label>
        {error && <motion.p className="form-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
        {hint && !error && <p className="form-hint">{hint}</p>}
      </motion.div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
