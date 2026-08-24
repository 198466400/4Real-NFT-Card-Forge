import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, useCardActions, useCharacterActions } from '../stores/useStore';
import { Card } from '../components/Card';
import { CharacterGrid } from '../components/CharacterPreview';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Tabs } from '../components/Tabs';
import { EmptyState } from '../components/EmptyState';
import { LoadingScreen } from '../components/LoadingScreen';
import type { NFTCard, Character3D, Rarity } from '../types';

export interface GalleryPageProps {
  cards: NFTCard[];
  characters: Character3D[];
}

const sortOptions = [
  { value: 'recent', label: 'Recently Updated' },
  { value: 'created', label: 'Recently Created' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'rarity', label: 'Rarity' }
];

const filterOptions = [
  { value: 'all', label: 'All Items' },
  { value: 'cards', label: 'Cards Only' },
  { value: 'characters', label: 'Characters Only' }
];

const rarityOptions: { value: Rarity | 'all'; label: string }[] = [
  { value: 'all', label: 'All Rarities' },
  { value: 'common', label: 'Common' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
  { value: 'epic', label: 'Epic' },
  { value: 'legendary', label: 'Legendary' },
  { value: 'mythic', label: 'Mythic' }
];

export const GalleryPage: React.FC<GalleryPageProps> = ({ cards, characters }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cards' | 'characters'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const { deleteCard } = useCardActions();
  const { deleteCharacter } = useCharacterActions();

  // Filter and sort items
  const filteredCards = cards.filter(card => {
    // Search filter
    if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Rarity filter
    if (rarityFilter !== 'all' && card.metadata.rarity !== rarityFilter) {
      return false;
    }
    
    return true;
  });

  const filteredCharacters = characters.filter(char => {
    // Search filter
    if (searchQuery && !char.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort items
  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      case 'rarity':
        const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
        return rarityOrder.indexOf(b.metadata.rarity) - rarityOrder.indexOf(a.metadata.rarity);
      default: // recent
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const sortedCharacters = [...filteredCharacters].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default: // recent
        // Sort by lighting ambient color timestamp (simplified for demo)
        return new Date(b.lighting.ambient.color).getTime() - new Date(a.lighting.ambient.color).getTime();
    }
  });

  // Selection handlers
  const toggleSelect = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (activeTab === 'cards') {
      if (selectedItems.size === sortedCards.length) {
        setSelectedItems(new Set());
      } else {
        setSelectedItems(new Set(sortedCards.map(card => card.id)));
      }
    } else {
      if (selectedItems.size === sortedCharacters.length) {
        setSelectedItems(new Set());
      } else {
        setSelectedItems(new Set(sortedCharacters.map(char => char.id)));
      }
    }
  }, [activeTab, selectedItems.size, sortedCards, sortedCharacters]);

  // Action handlers
  const handleEdit = useCallback((item: NFTCard | Character3D) => {
    if ('template' in item) {
      // It's a card
      navigate(`/editor/card/${item.id}`);
    } else {
      // It's a character
      navigate(`/creator/character/${item.id}`);
    }
  }, [navigate]);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedItems.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} selected item(s)?`)) {
      setIsLoading(true);
      
      try {
        for (const id of selectedItems) {
          const card = cards.find(c => c.id === id);
          const character = characters.find(c => c.id === id);
          
          if (card) {
            deleteCard(id);
          } else if (character) {
            deleteCharacter(id);
          }
        }
        
        setSelectedItems(new Set());
      } catch (error) {
        console.error('Failed to delete items:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedItems, cards, characters, deleteCard, deleteCharacter]);

  const handleDuplicateSelected = useCallback(() => {
    if (selectedItems.size === 0) return;
    
    // For now, just duplicate the first selected item
    const firstId = Array.from(selectedItems)[0];
    const card = cards.find(c => c.id === firstId);
    const character = characters.find(c => c.id === firstId);
    
    if (card) {
      navigate(`/editor/card/${card.id}`);
    } else if (character) {
      navigate(`/creator/character/${character.id}`);
    }
  }, [selectedItems, cards, characters, navigate]);

  const handleExportSelected = useCallback(() => {
    if (selectedItems.size === 0) return;
    navigate('/export');
  }, [selectedItems, navigate]);

  // Tab content
  const tabs = [
    { id: 'cards', label: `Cards (${cards.length})`, icon: '🃏' },
    { id: 'characters', label: `Characters (${characters.length})`, icon: '👤' }
  ];

  // Empty state
  if (activeTab === 'cards' && sortedCards.length === 0) {
    return (
      <EmptyState
        icon="🃏"
        title="No Cards Found"
        description={searchQuery ? 'No cards match your search criteria' : 'Create your first NFT card to get started'}
        actions={[
          { label: 'Create Card', onClick: () => navigate('/editor/card') },
          { label: 'Clear Filters', onClick: () => { setSearchQuery(''); setRarityFilter('all'); } }
        ]}
      />
    );
  }

  if (activeTab === 'characters' && sortedCharacters.length === 0) {
    return (
      <EmptyState
        icon="👤"
        title="No Characters Found"
        description={searchQuery ? 'No characters match your search criteria' : 'Create your first character to get started'}
        actions={[
          { label: 'Create Character', onClick: () => navigate('/creator/character') },
          { label: 'Clear Filters', onClick: () => setSearchQuery('') }
        ]}
      />
    );
  }

  return (
    <motion.div
      className="gallery-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="header-left">
          <h1 className="page-title">Gallery</h1>
          <p className="page-subtitle">
            Browse and manage your NFT cards and characters
          </p>
        </div>
        <div className="header-right">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => navigate('/editor/card')}
            leftIcon="🎨"
          >
            Create Card
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/creator/character')}
            leftIcon="👤"
          >
            Create Character
          </Button>
        </div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div 
        className="gallery-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="controls-left">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon="🔍"
            size="md"
            className="search-input"
          />
        </div>
        
        <div className="controls-center">
          <Tabs
            items={tabs.map(t => ({ id: t.id, label: t.label, icon: t.icon }))}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as 'cards' | 'characters')}
          />
        </div>
        
        <div className="controls-right">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortOptions}
            size="sm"
            className="sort-select"
          />
          
          {activeTab === 'cards' && (
            <Select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value as Rarity | 'all')}
              options={rarityOptions}
              size="sm"
              className="filter-select"
            />
          )}
        </div>
      </motion.div>

      {/* Selection Bar */}
      <AnimatePresence>
        {selectedItems.size > 0 && (
          <motion.div
            className="selection-bar"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.2 }}
          >
            <div className="selection-info">
              <span className="selection-count">{selectedItems.size} selected</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSelectAll}
              >
                {selectedItems.size === (activeTab === 'cards' ? sortedCards.length : sortedCharacters.length) 
                  ? 'Deselect All' 
                  : 'Select All'}
              </Button>
            </div>
            <div className="selection-actions">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleDuplicateSelected}
                leftIcon="📋"
              >
                Duplicate
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleExportSelected}
                leftIcon="📥"
              >
                Export
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={handleDeleteSelected}
                loading={isLoading}
                leftIcon="🗑️"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div 
        className="gallery-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'cards' ? (
              <div className="card-grid">
                {sortedCards.map((card, index) => (
                  <motion.div
                    key={card.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <Card
                      className="gallery-card"
                      onClick={() => handleEdit(card)}
                      interactive
                      hoverable
                    >
                      <Card.Image
                        src={card.image || '/placeholder-card.png'}
                        alt={card.title}
                        fit="cover"
                        position="center"
                      />
                      <Card.Body padding="md">
                        <Card.Title level={4}>{card.title}</Card.Title>
                        <p className="card-description">{card.description.substring(0, 50)}...</p>
                        <Card.Footer border={false} padding="sm">
                          <span className="card-rarity">{card.metadata.rarity}</span>
                        </Card.Footer>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <CharacterGrid
                characters={sortedCharacters}
                onEdit={handleEdit}
                size="medium"
                columns={4}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default GalleryPage;
