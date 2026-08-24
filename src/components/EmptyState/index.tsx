import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Button';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actions?: EmptyStateAction[];
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actions = [],
  className = ''
}) => {
  return (
    <motion.div
      className={`empty-state ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="empty-state-icon"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {icon}
      </motion.div>
      
      <motion.h2 
        className="empty-state-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {title}
      </motion.h2>
      
      {description && (
        <motion.p 
          className="empty-state-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {description}
        </motion.p>
      )}
      
      {actions.length > 0 && (
        <motion.div 
          className="empty-state-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'primary'}
              size={action.size || 'md'}
              onClick={action.onClick}
              leftIcon={action.leftIcon}
            >
              {action.label}
            </Button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
