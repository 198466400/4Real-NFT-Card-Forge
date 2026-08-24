import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: number | string;
}

export interface TabsProps {
  items: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'primary' | 'secondary' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  alignment?: 'left' | 'center' | 'right';
  fullWidth?: boolean;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab,
  onTabChange,
  variant = 'primary',
  size = 'md',
  alignment = 'left',
  fullWidth = false,
  className = ''
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    activeTab || (items.length > 0 ? items[0].id : '')
  );

  // Sync internal state with prop
  useEffect(() => {
    if (activeTab) {
      setInternalActiveTab(activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    if (items.find(item => item.id === tabId)?.disabled) return;
    
    setInternalActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'tabs-secondary';
      case 'pills':
        return 'tabs-pills';
      case 'underline':
        return 'tabs-underline';
      default:
        return 'tabs-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'tabs-sm';
      case 'lg':
        return 'tabs-lg';
      default:
        return 'tabs-md';
    }
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-start';
    }
  };

  const containerClassName = [
    'tabs-container',
    getVariantClass(),
    getSizeClass(),
    fullWidth ? 'full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClassName}>
      <div className={`tabs-nav ${getAlignmentClass()}`}>
        {items.map((item) => {
          const isActive = internalActiveTab === item.id;
          const isDisabled = item.disabled;

          return (
            <motion.button
              key={item.id}
              type="button"
              className={`tab ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => handleTabChange(item.id)}
              disabled={isDisabled}
              whileHover={{ scale: isDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isDisabled ? 1 : 0.98 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {item.icon && <span className="tab-icon">{item.icon}</span>}
              <span className="tab-label">{item.label}</span>
              {item.badge && (
                <span className="tab-badge">
                  {item.badge}
                </span>
              )}
              {variant === 'underline' && isActive && (
                <motion.div 
                  className="underline-indicator"
                  layoutId="underline"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// Tab Panel component for use with Tabs
export interface TabPanelProps {
  activeTab: string;
  tabId: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  activeTab,
  tabId,
  children,
  className = ''
}) => {
  const isActive = activeTab === tabId;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className={`tab-panel ${className}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tabs;
