import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Button';

export interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
  action: () => void;
  color?: string;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  loading?: boolean;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  loading = false,
  className = ''
}) => {
  return (
    <motion.div
      className={`quick-actions ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      <div className="actions-grid">
        {actions.map((action, index) => (
          <motion.div
            key={action.label || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={action.action}
              disabled={loading}
              className="quick-action-button"
              style={{ borderColor: action.color || 'var(--border-primary)' }}
            >
              <motion.span 
                className="action-icon"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                style={{ color: action.color || 'var(--color-primary-500)' }}
              >
                {action.icon}
              </motion.span>
              <div className="action-content">
                <h4 className="action-label">{action.label}</h4>
                <p className="action-description">{action.description}</p>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;
