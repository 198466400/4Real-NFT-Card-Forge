import React from 'react';
import { motion } from 'framer-motion';
import { CardPreview } from '../CardPreview';
import type { NFTCard } from '../../types';

export interface RecentCardsProps {
  cards: NFTCard[];
  onEdit?: (card: NFTCard) => void;
  onHover?: (cardId: string | null) => void;
  className?: string;
}

export const RecentCards: React.FC<RecentCardsProps> = ({
  cards,
  onEdit,
  onHover,
  className = ''
}) => {
  return (
    <motion.div
      className={`recent-cards ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      <div className="cards-grid">
        {cards.map((card, index) => (
          <motion.div
            key={card.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onHoverStart={() => onHover?.(card.id)}
            onHoverEnd={() => onHover?.(null)}
          >
            <CardPreview
              card={card}
              onClick={() => onEdit?.(card)}
              interactive={!!onEdit}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentCards;
