import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CardCanvas } from '../CardCanvas';
import type { NFTCard, Character3D } from '../../types';

export interface CardPreviewProps {
  card: NFTCard;
  character?: Character3D;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  interactive?: boolean;
  showTitle?: boolean;
  className?: string;
}

const sizeMap = {
  small: { width: 200, height: 300 },
  medium: { width: 280, height: 420 },
  large: { width: 400, height: 600 }
};

export const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  character,
  size = 'medium',
  onClick,
  interactive = false,
  showTitle = true,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dimensions = sizeMap[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`card-preview ${size} ${interactive ? 'interactive' : ''} ${className}`}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={interactive ? { scale: 1.02, y: -4 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Canvas */}
      <div className="preview-canvas" style={{ width: dimensions.width, height: dimensions.height }}>
        <CardCanvas
          card={card}
          character={character}
          showControls={false}
          showGrid={false}
          quality="medium"
        />
      </div>

      {/* Title overlay */}
      {showTitle && card.title && (
        <motion.div 
          className="card-title-overlay"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="title">{card.title}</h4>
          {card.description && (
            <p className="description">{card.description.substring(0, 50)}...</p>
          )}
        </motion.div>
      )}

      {/* Hover overlay for interactive previews */}
      {interactive && (
        <motion.div 
          className="hover-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="hover-text">Edit Card</span>
        </motion.div>
      )}

      {/* Selection indicator */}
      {interactive && (
        <motion.div 
          className="selection-indicator"
          initial={{ scale: 0 }}
          animate={{ scale: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Rarity badge */}
      {card.metadata.rarity && (
        <motion.div 
          className={`rarity-badge ${card.metadata.rarity}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {card.metadata.rarity}
        </motion.div>
      )}
    </motion.div>
  );
};

// Card grid component
export interface CardGridProps {
  cards: NFTCard[];
  onEdit?: (card: NFTCard) => void;
  size?: 'small' | 'medium' | 'large';
  columns?: number;
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onEdit,
  size = 'medium',
  columns = 4,
  className = ''
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '20px',
    width: '100%'
  };

  return (
    <div className={`card-grid ${className}`} style={gridStyle}>
      {cards.map((card, index) => (
        <CardPreview
          key={card.id || index}
          card={card}
          size={size}
          onClick={() => onEdit?.(card)}
          interactive={!!onEdit}
          showTitle
        />
      ))}
    </div>
  );
};

export default CardPreview;
