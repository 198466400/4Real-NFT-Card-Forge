import React, { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked,
      onChange,
      label,
      size = 'md',
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange(e.target.checked);
    };

    const sizeClass = {
      sm: 'switch-sm',
      md: 'switch-md',
      lg: 'switch-lg'
    }[size];

    const trackClassName = [
      'form-switch',
      sizeClass,
      checked ? 'checked' : '',
      disabled ? 'disabled' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <motion.label
        className="switch-wrapper"
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={trackClassName}
          {...props}
        />
        {label && <span className="switch-label">{label}</span>}
      </motion.label>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
