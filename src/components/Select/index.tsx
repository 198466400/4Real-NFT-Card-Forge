import React, { forwardRef, SelectHTMLAttributes, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  value?: string;
  onChange?: (option: SelectOption) => void;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  searchable?: boolean;
  multiple?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      label,
      error,
      hint,
      placeholder = 'Select an option',
      size = 'md',
      disabled = false,
      fullWidth = true,
      searchable = false,
      multiple = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
      options.find(opt => opt.value === value) || null
    );
    const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);
    const selectRef = useRef<HTMLDivElement>(null);

    // Handle click outside
    useOnClickOutside(selectRef, () => setIsOpen(false));

    // Update selected option when value prop changes
    useEffect(() => {
      if (value) {
        const option = options.find(opt => opt.value === value);
        if (option) {
          setSelectedOption(option);
        }
      }
    }, [value, options]);

    // Handle multiple selection
    useEffect(() => {
      if (multiple && value) {
        const values = Array.isArray(value) ? value : [value];
        const selected = options.filter(opt => values.includes(opt.value));
        setSelectedOptions(selected);
      }
    }, [multiple, value, options]);

    const handleToggle = () => {
      if (disabled) return;
      setIsOpen(!isOpen);
      setSearchTerm('');
    };

    const handleSelect = (option: SelectOption) => {
      if (disabled || option.disabled) return;

      if (multiple) {
        const newSelected = selectedOptions.some(opt => opt.value === option.value)
          ? selectedOptions.filter(opt => opt.value !== option.value)
          : [...selectedOptions, option];
        setSelectedOptions(newSelected);
        onChange?.({ ...option, value: newSelected.map(opt => opt.value).join(',') } as any);
      } else {
        setSelectedOption(option);
        setIsOpen(false);
        onChange?.(option);
      }
    };

    const handleClear = () => {
      if (multiple) {
        setSelectedOptions([]);
        onChange?.({ value: '', label: '' } as any);
      } else {
        setSelectedOption(null);
        onChange?.({ value: '', label: '' } as any);
      }
    };

    const filteredOptions = searchable
      ? options.filter(opt => 
          opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opt.value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    const sizeClass = {
      sm: 'form-select form-select-sm',
      md: 'form-select',
      lg: 'form-select form-select-lg'
    }[size];

    const wrapperClassName = [
      'form-group',
      className
    ].filter(Boolean).join(' ');

    const selectClassName = [
      sizeClass,
      error ? 'error' : '',
      disabled ? 'disabled' : '',
      fullWidth ? 'full-width' : '',
      isOpen ? 'open' : ''
    ].filter(Boolean).join(' ');

    return (
      <div className={wrapperClassName} ref={selectRef}>
        {label && (
          <label className="form-label">
            {label}
            {props.required && <span className="required">*</span>}
          </label>
        )}

        <div className="select-wrapper">
          <motion.div
            className={selectClassName}
            onClick={handleToggle}
            whileHover={{ scale: disabled ? 1 : 1.01 }}
            whileTap={{ scale: disabled ? 1 : 0.995 }}
            animate={{
              borderColor: error ? 'var(--color-error-500)' : isOpen ? 'var(--color-primary-500)' : ''
            }}
          >
            <div className="select-value">
              {multiple && selectedOptions.length > 0 ? (
                <div className="selected-tags">
                  {selectedOptions.slice(0, 3).map(opt => (
                    <span key={opt.value} className="tag">
                      {opt.label}
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(opt);
                        }}
                        className="tag-remove"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {selectedOptions.length > 3 && (
                    <span className="tag tag-count">+{selectedOptions.length - 3}</span>
                  )}
                </div>
              ) : (
                selectedOption?.label || placeholder
              )}
            </div>
            
            <div className="select-arrow">
              {isOpen ? '▲' : '▼'}
            </div>
            
            {multiple && selectedOptions.length > 0 && (
              <button 
                type="button" 
                className="select-clear" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                ✕
              </button>
            )}
          </motion.div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="select-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                {searchable && filteredOptions.length > 5 && (
                  <div className="select-search">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      autoFocus
                    />
                  </div>
                )}

                <div className="select-options">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <motion.div
                        key={option.value}
                        className={`select-option ${
                          (multiple ? selectedOptions.some(opt => opt.value === option.value) : selectedOption?.value === option.value) ? 'selected' : ''
                        } ${option.disabled ? 'disabled' : ''}`}
                        onClick={() => handleSelect(option)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}
                      >
                        <span className="option-label">{option.label}</span>
                        {multiple && selectedOptions.some(opt => opt.value === option.value) && (
                          <span className="option-check">✓</span>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="select-empty">No options found</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && <motion.p className="form-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
        {hint && !error && <p className="form-hint">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
