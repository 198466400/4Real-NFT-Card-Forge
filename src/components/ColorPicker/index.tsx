import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChromePicker, ColorResult } from 'react-color';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showAlpha?: boolean;
  presetColors?: string[];
  placement?: 'bottom' | 'top' | 'left' | 'right';
}

const presetColors = [
  '#000000',
  '#ffffff',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#00ffff',
  '#ff00ff',
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#96ceb4',
  '#ffeaa7',
  '#dda0dd',
  '#98d8c8',
  '#6366f1',
  '#8b5cf6',
  '#ec4899'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  size = 'md',
  disabled = false,
  showAlpha = true,
  presetColors: customPresets,
  placement = 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useOnClickOutside(colorPickerRef, () => setIsOpen(false));

  // Sync internal value with prop value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleColorChange = useCallback((color: ColorResult) => {
    setInternalValue(color.hex);
  }, []);

  const handleColorSelect = useCallback(() => {
    onChange(internalValue);
    setIsOpen(false);
  }, [internalValue, onChange]);

  const handlePresetSelect = useCallback((color: string) => {
    setInternalValue(color);
    onChange(color);
    setIsOpen(false);
  }, [onChange]);

  const togglePicker = useCallback(() => {
    if (disabled) return;
    setIsOpen(!isOpen);
  }, [disabled, isOpen]);

  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48
  };

  const swatchSize = sizeMap[size];

  // Calculate popover position
  const getPopoverPosition = () => {
    switch (placement) {
      case 'top':
        return { bottom: `${swatchSize + 8}px` };
      case 'left':
        return { right: `${swatchSize + 8}px` };
      case 'right':
        return { left: `${swatchSize + 8}px` };
      default:
        return { top: `${swatchSize + 8}px` };
    }
  };

  return (
    <div className="color-picker-wrapper" ref={colorPickerRef}>
      {label && <label className="form-label">{label}</label>}
      
      <motion.div
        className={`color-swatch ${disabled ? 'disabled' : ''}`}
        style={{ width: swatchSize, height: swatchSize }}
        onClick={togglePicker}
        whileHover={{ scale: disabled ? 1 : 1.05, cursor: disabled ? 'not-allowed' : 'pointer' }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <div 
          className="swatch-color"
          style={{ backgroundColor: internalValue }}
        />
        {showAlpha && internalValue.includes('rgba') && (
          <div className="alpha-checkerboard" />
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            className="color-picker-popover"
            style={getPopoverPosition()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <ChromePicker
              color={internalValue}
              onChange={handleColorChange}
              onChangeComplete={handleColorSelect}
              disableAlpha={!showAlpha}
              width="240px"
            />
            
            {customPresets && customPresets.length > 0 && (
              <div className="preset-colors">
                {customPresets.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="preset-color"
                    style={{ backgroundColor: color }}
                    onClick={() => handlePresetSelect(color)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;
