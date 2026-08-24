import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../stores/useStore';
import { CardCanvas } from '../components/CardCanvas';
import { CharacterCanvas } from '../components/CharacterCanvas';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Slider } from '../components/Slider';
import { LoadingScreen } from '../components/LoadingScreen';
import { EmptyState } from '../components/EmptyState';
import { toast } from '../components/Toast';
import type { NFTCard, Character3D, ExportFormat, ExportQuality } from '../types';

export interface ExportPageProps {
  cards: NFTCard[];
  characters: Character3D[];
}

const formatOptions: { value: ExportFormat; label: string; extension: string }[] = [
  { value: 'png', label: 'PNG', extension: '.png' },
  { value: 'jpg', label: 'JPEG', extension: '.jpg' },
  { value: 'webp', label: 'WebP', extension: '.webp' },
  { value: 'svg', label: 'SVG', extension: '.svg' },
  { value: 'pdf', label: 'PDF', extension: '.pdf' }
];

const qualityOptions: { value: ExportQuality; label: string }[] = [
  { value: 'low', label: 'Low (512px)' },
  { value: 'medium', label: 'Medium (1024px)' },
  { value: 'high', label: 'High (2048px)' },
  { value: 'ultra', label: 'Ultra (4096px)' }
];

const resolutionPresets = {
  low: { width: 512, height: 768 },
  medium: { width: 1024, height: 1536 },
  high: { width: 2048, height: 3072 },
  ultra: { width: 4096, height: 6144 }
};

export const ExportPage: React.FC<ExportPageProps> = ({ cards, characters }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'card' | 'character'>('card');
  const [selectedCard, setSelectedCard] = useState<NFTCard | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character3D | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [exportQuality, setExportQuality] = useState<ExportQuality>('high');
  const [customResolution, setCustomResolution] = useState({ width: 2048, height: 3072 });
  const [filename, setFilename] = useState('');
  const [transparentBackground, setTransparentBackground] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get default selections
  const defaultCard = cards.length > 0 ? cards[0] : null;
  const defaultCharacter = characters.length > 0 ? characters[0] : null;

  // Initialize selections
  React.useEffect(() => {
    if (defaultCard) {
      setSelectedCard(defaultCard);
      setFilename(`${defaultCard.title.replace(/\s+/g, '_').toLowerCase()}_nft_card`);
    } else if (defaultCharacter) {
      setSelectedCharacter(defaultCharacter);
      setFilename(`${defaultCharacter.name.replace(/\s+/g, '_').toLowerCase()}_character`);
    }
  }, [defaultCard, defaultCharacter]);

  // Update filename when selection changes
  React.useEffect(() => {
    if (selectedCard) {
      setFilename(`${selectedCard.title.replace(/\s+/g, '_').toLowerCase()}_nft_card`);
    } else if (selectedCharacter) {
      setFilename(`${selectedCharacter.name.replace(/\s+/g, '_').toLowerCase()}_character`);
    }
  }, [selectedCard, selectedCharacter]);

  // Update resolution when quality changes
  React.useEffect(() => {
    setCustomResolution(resolutionPresets[exportQuality]);
  }, [exportQuality]);

  // Export handlers
  const handleExport = useCallback(async () => {
    if (!selectedCard && !selectedCharacter) {
      toast.error('Please select a card or character to export');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportProgress(i);
      }

      // Generate filename with extension
      const extension = formatOptions.find(f => f.value === exportFormat)?.extension || '.png';
      const finalFilename = `${filename}${extension}`;

      // In a real implementation, this would capture the canvas and download
      // For now, we'll just simulate it
      toast.success(`Export completed: ${finalFilename}`);
      
      // Reset progress after a delay
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    } catch (error) {
      toast.error('Export failed');
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [selectedCard, selectedCharacter, exportFormat, filename]);

  const handleExportAll = useCallback(() => {
    if (cards.length === 0 && characters.length === 0) {
      toast.error('No items to export');
      return;
    }

    // For now, just show a message
    toast.info(`Exporting ${cards.length + characters.length} items...`);
  }, [cards.length, characters.length]);

  // Tab change handler
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as 'card' | 'character');
    if (tab === 'card' && defaultCard) {
      setSelectedCard(defaultCard);
    } else if (tab === 'character' && defaultCharacter) {
      setSelectedCharacter(defaultCharacter);
    }
  }, [defaultCard, defaultCharacter]);

  // Selection handlers
  const handleCardSelect = useCallback((card: NFTCard) => {
    setSelectedCard(card);
    setSelectedCharacter(null);
    setActiveTab('card');
  }, []);

  const handleCharacterSelect = useCallback((character: Character3D) => {
    setSelectedCharacter(character);
    setSelectedCard(null);
    setActiveTab('character');
  }, []);

  // Empty state
  if (cards.length === 0 && characters.length === 0) {
    return (
      <EmptyState
        icon="📥"
        title="Nothing to Export"
        description="Create a card or character first to export it"
        actions={[
          { label: 'Create Card', onClick: () => navigate('/editor/card') },
          { label: 'Create Character', onClick: () => navigate('/creator/character') }
        ]}
      />
    );
  }

  return (
    <motion.div
      className="export-page"
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/gallery')}
            leftIcon="←"
          >
            Back to Gallery
          </Button>
        </div>
        <div className="header-center">
          <h1 className="page-title">Export</h1>
          <p className="page-subtitle">
            Export your NFT cards and characters in various formats
          </p>
        </div>
        <div className="header-right">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleExport}
            loading={isExporting}
            leftIcon="📥"
          >
            Export
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="export-content">
        {/* Left Sidebar - Selection */}
        <motion.div 
          className="export-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Select Item</h3>
          
          <Tabs
            items={[
              { id: 'card', label: `Cards (${cards.length})`, icon: '🃏' },
              { id: 'character', label: `Characters (${characters.length})`, icon: '👤' }
            ]}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            variant="pills"
            fullWidth
          />

          <div className="selection-list">
            {activeTab === 'card' ? (
              <div className="card-selection">
                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    className={`selection-item ${selectedCard?.id === card.id ? 'selected' : ''}`}
                    onClick={() => handleCardSelect(card)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="item-thumbnail">
                      <img 
                        src={card.image || '/placeholder-card.png'} 
                        alt={card.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-card.png';
                        }}
                      />
                    </div>
                    <div className="item-info">
                      <h4 className="item-title">{card.title}</h4>
                      <p className="item-meta">{card.metadata.rarity}</p>
                    </div>
                    {selectedCard?.id === card.id && (
                      <motion.div 
                        className="selection-check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="character-selection">
                {characters.map((character) => (
                  <motion.div
                    key={character.id}
                    className={`selection-item ${selectedCharacter?.id === character.id ? 'selected' : ''}`}
                    onClick={() => handleCharacterSelect(character)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="item-thumbnail character">
                      <CharacterCanvas
                        character={character}
                        showControls={false}
                        showGrid={false}
                        style={{ width: 60, height: 80 }}
                      />
                    </div>
                    <div className="item-info">
                      <h4 className="item-title">{character.name}</h4>
                      <p className="item-meta">{character.base.model}</p>
                    </div>
                    {selectedCharacter?.id === character.id && (
                      <motion.div 
                        className="selection-check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleExportAll}
            isFullWidth
            leftIcon="📦"
          >
            Export All
          </Button>
        </motion.div>

        {/* Main Content - Preview */}
        <motion.div 
          className="export-main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Preview</h3>
          
          <div className="export-preview">
            <AnimatePresence mode="wait">
              {activeTab === 'card' && selectedCard ? (
                <motion.div
                  key="card-preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardCanvas
                    card={selectedCard}
                    character={selectedCharacter}
                    showControls
                    showGrid
                    quality={exportQuality}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="character-preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <CharacterCanvas
                    character={selectedCharacter!}
                    showControls
                    showGrid
                    style={{ height: '100%' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Export Progress */}
          <AnimatePresence>
            {isExporting && (
              <motion.div
                className="export-progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${exportProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <span className="progress-text">{exportProgress}%</span>
                <p className="progress-message">Preparing your export...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Sidebar - Export Options */}
        <motion.div 
          className="export-sidebar right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Export Options</h3>
          
          <div className="export-options">
            <div className="form-group">
              <label>Format</label>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                options={formatOptions.map(f => ({ value: f.value, label: f.label }))}
                size="md"
              />
            </div>

            <div className="form-group">
              <label>Quality</label>
              <Select
                value={exportQuality}
                onChange={(e) => setExportQuality(e.target.value as ExportQuality)}
                options={qualityOptions}
                size="md"
              />
            </div>

            <div className="form-group">
              <label>Resolution</label>
              <div className="resolution-inputs">
                <Input
                  type="number"
                  value={customResolution.width}
                  onChange={(e) => setCustomResolution(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                  placeholder="Width"
                  size="sm"
                />
                <span className="resolution-separator">×</span>
                <Input
                  type="number"
                  value={customResolution.height}
                  onChange={(e) => setCustomResolution(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                  placeholder="Height"
                  size="sm"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Filename</label>
              <Input
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
                size="md"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={transparentBackground}
                  onChange={(e) => setTransparentBackground(e.target.checked)}
                />
                <span>Transparent Background</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                />
                <span>Include Metadata</span>
              </label>
            </div>
          </div>

          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleExport}
            loading={isExporting}
            isFullWidth
            leftIcon="📥"
          >
            Export {activeTab === 'card' ? 'Card' : 'Character'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExportPage;
