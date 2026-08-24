import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../Card';

export interface StatsBarProps {
  totalCards: number;
  totalCharacters: number;
  lastUpdated?: number;
  className?: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalCards,
  totalCharacters,
  lastUpdated,
  className = ''
}) => {
  // Format last updated date
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    
    const date = new Date(lastUpdated);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    
    // Less than a week
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }
    
    // Format as date
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className={`stats-bar ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="stats-grid">
        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="stat-card">
            <motion.div 
              className="stat-icon"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              🃏
            </motion.div>
            <div className="stat-content">
              <h4 className="stat-value">{totalCards}</h4>
              <p className="stat-label">Cards</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="stat-card">
            <motion.div 
              className="stat-icon"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              👤
            </motion.div>
            <div className="stat-content">
              <h4 className="stat-value">{totalCharacters}</h4>
              <p className="stat-label">Characters</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="stat-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="stat-card">
            <motion.div 
              className="stat-icon"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              ⏰
            </motion.div>
            <div className="stat-content">
              <h4 className="stat-value">{formatLastUpdated()}</h4>
              <p className="stat-label">Last Updated</p>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatsBar;
