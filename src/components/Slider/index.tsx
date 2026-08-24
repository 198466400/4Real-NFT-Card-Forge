import React, { forwardRef, InputHTMLAttributes, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  size?: 'sm' | 'md' | 'lg';
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      step = 1,
      label,
      disabled = false,
      showValue = true,
      valueFormatter = (v) => v.toString(),
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value);
    const [isDragging, setIsDragging] = useState(false);

    // Sync internal value with prop value
    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      setInternalValue(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onChange(internalValue);
    };

    const handleMouseDown = () => {
      setIsDragging(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onChange(internalValue);
      }
    };

    // Calculate percentage for visual display
    const percentage = ((internalValue - min) / (max - min)) * 100;

    const sizeClass = {
      sm: 'slider-sm',
      md: 'slider-md',
      lg: 'slider-lg'
    }[size];

    return (
      <motion.div 
        className={`slider-wrapper ${sizeClass} ${disabled ? 'disabled' : ''} ${className}`}
        whileHover={{ scale: disabled ? 1 : 1.01 }}
      >
        {label && (
          <label className="form-label">
            {label}
            {props.required && <span className="required">*</span>}
          </label>
        )}

        <div className="slider-container">
          <input
            ref={ref}
            type="range"
            value={internalValue}
            onChange={handleChange}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onKeyDown={handleKeyDown}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className="form-range"
            {...props}
          />

          <div 
            className="slider-track"
            style={{ width: `${percentage}%` }}
          />

          {showValue && (
            <motion.div 
              className="slider-value"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
            >
              {valueFormatter(internalValue)}
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }
);

Slider.displayName = 'Slider';

export default Slider;
