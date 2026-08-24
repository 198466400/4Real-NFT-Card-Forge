import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Button';

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  ctaPrimary?: string;
  onCtaPrimary?: () => void;
  ctaSecondary?: string;
  onCtaSecondary?: () => void;
  className?: string;
  background?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaPrimary,
  onCtaPrimary,
  ctaSecondary,
  onCtaSecondary,
  className = '',
  background = 'var(--gradient-primary)'
}) => {
  return (
    <motion.section
      className={`hero-section ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ background }}
    >
      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="hero-title gradient-heading">{title}</h1>
          {subtitle && (
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {ctaPrimary && onCtaPrimary && (
            <Button 
              size="lg" 
              onClick={onCtaPrimary}
              className="hero-cta-primary"
            >
              {ctaPrimary}
            </Button>
          )}
          
          {ctaSecondary && onCtaSecondary && (
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={onCtaSecondary}
              className="hero-cta-secondary"
            >
              {ctaSecondary}
            </Button>
          )}
        </motion.div>
      </div>

      <motion.div
        className="hero-decoration"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="decoration-element decoration-1" />
        <div className="decoration-element decoration-2" />
        <div className="decoration-element decoration-3" />
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
