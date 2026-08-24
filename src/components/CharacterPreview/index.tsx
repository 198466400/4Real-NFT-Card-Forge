import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CharacterCanvas } from '../CharacterCanvas';
import { Character3D } from '../../types';

export interface CharacterPreviewProps {
  character: Character3D;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  interactive?: boolean;
  showName?: boolean;
  className?: string;
}

const sizeMap = {
  small: { width: 120, height: 160 },
  medium: { width: 200, height: 280 },
  large: { width: 300, height: 400 }
};

export const CharacterPreview: React.FC<CharacterPreviewProps> = ({
  character,
  size = 'medium',
  onClick,
  interactive = false,
  showName = false,
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
      className={`character-preview ${size} ${interactive ? 'interactive' : ''} ${className}`}
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
        <CharacterCanvas
          character={character}
          showControls={false}
          showGrid={false}
          background="transparent"
        />
      </div>

      {/* Name overlay */}
      {showName && character.name && (
        <motion.div 
          className="character-name-overlay"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="name">{character.name}</span>
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
          <span className="hover-text">Edit Character</span>
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
    </motion.div>
  );
};

// Character grid component
export interface CharacterGridProps {
  characters: Character3D[];
  onEdit?: (character: Character3D) => void;
  size?: 'small' | 'medium' | 'large';
  columns?: number;
  className?: string;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({
  characters,
  onEdit,
  size = 'medium',
  columns = 4,
  className = ''
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '16px',
    width: '100%'
  };

  return (
    <div className={`character-grid ${className}`} style={gridStyle}>
      {characters.map((character, index) => (
        <CharacterPreview
          key={character.id || index}
          character={character}
          size={size}
          onClick={() => onEdit?.(character)}
          interactive={!!onEdit}
          showName
        />
      ))}
    </div>
  );
};

export default CharacterPreview;
