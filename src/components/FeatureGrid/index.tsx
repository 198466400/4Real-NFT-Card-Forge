import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../Card';

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

export interface FeatureGridProps {
  features: FeatureItem[];
  columns?: number;
  className?: string;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  columns = 3,
  className = ''
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '24px'
  };

  return (
    <motion.div
      className={`feature-grid ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      style={gridStyle}
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
        >
          <Card
            className="feature-card"
            onClick={() => feature.link && window.open(feature.link, '_blank')}
            interactive={!!feature.link}
          >
            <motion.div 
              className="feature-icon"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {feature.icon}
            </motion.div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeatureGrid;
