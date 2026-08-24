import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  onChange?: (openItems: string[]) => void;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
  onChange,
  className = ''
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = useCallback((id: string) => {
    if (allowMultiple) {
      setOpenItems(prev => {
        const newOpenItems = prev.includes(id)
          ? prev.filter(itemId => itemId !== id)
          : [...prev, id];
        onChange?.(newOpenItems);
        return newOpenItems;
      });
    } else {
      setOpenItems(prev => {
        const newOpenItems = prev.includes(id) ? [] : [id];
        onChange?.(newOpenItems);
        return newOpenItems;
      });
    }
  }, [allowMultiple, onChange]);

  const isOpen = useCallback((id: string) => openItems.includes(id), [openItems]);

  return (
    <div className={`accordion ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={item.id || index}
          className={`accordion-item ${item.disabled ? 'disabled' : ''} ${isOpen(item.id) ? 'open' : ''}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <motion.div
            className="accordion-header"
            onClick={() => !item.disabled && toggleItem(item.id)}
            whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}
            whileTap={{ scale: 0.995 }}
          >
            <div className="accordion-title">{item.title}</div>
            <motion.div
              className="accordion-icon"
              animate={{ rotate: isOpen(item.id) ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.div>
          </motion.div>
          
          <AnimatePresence>
            {isOpen(item.id) && (
              <motion.div
                className="accordion-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="accordion-body">{item.content}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

// Simplified Accordion for single item
export interface SimpleAccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SimpleAccordion: React.FC<SimpleAccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
    }
  }, [disabled]);

  return (
    <div className={`accordion ${className}`}>
      <motion.div
        className={`accordion-item ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
      >
        <motion.div
          className="accordion-header"
          onClick={toggle}
          whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}
          whileTap={{ scale: 0.995 }}
        >
          <div className="accordion-title">{title}</div>
          <motion.div
            className="accordion-icon"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.div>
        </motion.div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="accordion-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="accordion-body">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Expandable section component
export interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  className?: string;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  defaultExpanded = false,
  onToggle,
  className = ''
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = useCallback(() => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggle?.(newExpanded);
  }, [expanded, onToggle]);

  return (
    <div className={`expandable-section ${className}`}>
      <motion.button
        type="button"
        className="expandable-header"
        onClick={toggle}
        whileHover={{ backgroundColor: 'var(--bg-tertiary)' }}
        whileTap={{ scale: 0.995 }}
      >
        <motion.span
          className="expandable-icon"
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▶
        </motion.span>
        <span className="expandable-title">{title}</span>
      </motion.button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="expandable-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
