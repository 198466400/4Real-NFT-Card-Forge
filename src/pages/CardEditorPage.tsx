import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore, useCardActions, useCharacterActions } from '../stores/useStore';
import { CardCanvas } from '../components/CardCanvas';
import { CharacterPreview } from '../components/CharacterPreview';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { ColorPicker } from '../components/ColorPicker';
import { Slider } from '../components/Slider';
import { Tabs } from '../components/Tabs';
import { LoadingScreen } from '../components/LoadingScreen';
import { EmptyState } from '../components/EmptyState';
import { toast } from '../components/Toast';
import type { NFTCard, Character3D, CardTemplate, CardTheme, Rarity, BlockchainType } from '../types';

export interface CardEditorPageProps {
  cards: NFTCard[];
  templates: CardTemplate[];
  themes: CardTheme[];
  characters: Character3D[];
}

const rarityOptions: { value: Rarity; label: string; color: string }[] = [
  { value: 'common', label: 'Common', color: '#808080' },
  { value: 'uncommon', label: 'Uncommon', color: '#10b981' },
  { value: 'rare', label: 'Rare', color: '#3b82f6' },
  { value: 'epic', label: 'Epic', color: '#8b5cf6' },
  { value: 'legendary', label: 'Legendary', color: '#f59e0b' },
  { value: 'mythic', label: 'Mythic', color: '#ef4444' }
];

const blockchainOptions: { value: BlockchainType; label: string }[] = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'solana', label: 'Solana' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'base', label: 'Base' },
  { value: 'arbitrum', label: 'Arbitrum' }
];

export const CardEditorPage: React.FC<CardEditorPageProps> = ({
  cards,
  templates,
  themes,
  characters
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [card, setCard] = useState<NFTCard | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character3D | null>(null);
  const [activeTab, setActiveTab] = useState<'design' | 'metadata' | 'effects'>('design');
  const [error, setError] = useState<string | null>(null);

  const { getCardById, addCard, updateCard, setCurrentCard } = useCardActions();
  const { setCurrentCharacter } = useCharacterActions();

  // Load card
  useEffect(() => {
    const loadCard = () => {
      setIsLoading(true);
      setError(null);

      try {
        if (id) {
          // Edit existing card
          const existing = getCardById(id);
          if (existing) {
            setCard(existing);
            setCurrentCard(existing);
            
            // Load character if card has one
            if (existing.character) {
              const char = characters.find(c => c.id === existing.character?.id);
              if (char) {
                setSelectedCharacter(char);
              }
            }
          } else {
            setError('Card not found');
            navigate('/editor/card');
          }
        } else {
          // Create new card
          const newCard: NFTCard = {
            id: `card-${Date.now()}`,
            title: 'Untitled Card',
            description: '',
            image: '',
            template: templates[0] || {
              id: 'default',
              name: 'Default',
              layout: 'standard',
              dimensions: { width: 1000, height: 1500 },
              layers: [],
              background: { type: 'solid', color: '#0a0a0f', opacity: 1 },
              border: { type: 'solid', color: '#6366f1', width: 4, radius: 12 },
              textStyles: {
                title: { fontFamily: 'Inter', fontSize: 32, fontWeight: 700, color: '#ffffff', textAlign: 'center', letterSpacing: 1 },
                subtitle: { fontFamily: 'Inter', fontSize: 18, fontWeight: 400, color: '#a0a0a0', textAlign: 'center' },
                description: { fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#808080', textAlign: 'center', lineHeight: 1.5 },
                stats: { fontFamily: 'Inter', fontSize: 16, fontWeight: 600, color: '#ffffff', textAlign: 'center' },
                label: { fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: '#a0a0a0', textAlign: 'center', textTransform: 'uppercase' },
                value: { fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#ffffff', textAlign: 'center' }
              }
            },
            theme: themes[0] || {
              id: 'default',
              name: 'Default',
              palette: {
                primary: '#6366f1',
                secondary: '#8b5cf6',
                accent: '#ec4899',
                background: '#0a0a0f',
                surface: '#14141a',
                text: { primary: '#ffffff', secondary: '#a0a0a0', disabled: '#606060' },
                border: '#2a2a3a',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6'
              },
              typography: {
                fontFamily: 'Inter',
                fontSize: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
                fontWeight: { light: 300, normal: 400, medium: 500, bold: 700, black: 900 },
                lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.75, loose: 2 }
              },
              spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32 },
              borderRadius: 12,
              shadows: [{ name: 'sm', offset: { x: 0, y: 1 }, blur: 2, spread: 0, color: 'rgba(0,0,0,0.3)', opacity: 1 }],
              transitions: { duration: 0.2, timingFunction: 'ease', delay: 0 }
            },
            effects: [],
            metadata: {
              name: 'Untitled Card',
              creator: '4Real NFT Forge',
              collection: 'My Collection',
              attributes: [],
              rarity: 'common',
              edition: 1,
              blockchain: 'ethereum'
            },
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          setCard(newCard);
          setCurrentCard(newCard);
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load card editor');
        setIsLoading(false);
        console.error(err);
      }
    };

    loadCard();
  }, [id, getCardById, templates, themes, characters, setCurrentCard, navigate]);

  // Save card
  const handleSave = useCallback(() => {
    if (!card) return;
    
    setIsLoading(true);
    
    try {
      const updatedCard = {
        ...card,
        updatedAt: new Date()
      };
      
      if (id && getCardById(id)) {
        // Update existing
        updateCard(id, updatedCard);
        toast.success('Card updated successfully');
      } else {
        // Add new
        addCard(updatedCard);
        toast.success('Card created successfully');
      }
      
      setCard(updatedCard);
      setCurrentCard(updatedCard);
      
      // Navigate to gallery or stay in editor
      // navigate('/gallery');
    } catch (err) {
      toast.error('Failed to save card');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [card, id, getCardById, updateCard, addCard, setCurrentCard]);

  // Update card property
  const updateProperty = useCallback((path: string, value: any) => {
    if (!card) return;
    
    setCard(prev => {
      if (!prev) return null;
      const newCard = { ...prev };
      const keys = path.split('.');
      let current: any = newCard;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newCard;
    });
  }, [card]);

  // Select template
  const handleSelectTemplate = useCallback((template: CardTemplate) => {
    if (!card) return;
    updateProperty('template', template);
    toast.info(`Template changed to ${template.name}`);
  }, [card, updateProperty]);

  // Select theme
  const handleSelectTheme = useCallback((theme: CardTheme) => {
    if (!card) return;
    updateProperty('theme', theme);
    toast.info(`Theme changed to ${theme.name}`);
  }, [card, updateProperty]);

  // Select character
  const handleSelectCharacter = useCallback((character: Character3D | null) => {
    setSelectedCharacter(character);
    if (card) {
      updateProperty('character', character);
    }
    setCurrentCharacter(character);
  }, [card, updateProperty, setCurrentCharacter]);

  // Duplicate card
  const handleDuplicate = useCallback(() => {
    if (!card) return;
    
    const duplicated: NFTCard = {
      ...card,
      id: `card-${Date.now()}`,
      title: `${card.title} (Copy)`,
      updatedAt: new Date()
    };
    
    addCard(duplicated);
    setCurrentCard(duplicated);
    navigate(`/editor/card/${duplicated.id}`);
  }, [card, addCard, setCurrentCard, navigate]);

  // Delete card
  const handleDelete = useCallback(() => {
    if (!card || !id) return;
    
    if (window.confirm(`Are you sure you want to delete "${card.title}"?`)) {
      // Delete logic would go here
      navigate('/gallery');
    }
  }, [card, id, navigate]);

  // Export card
  const handleExport = useCallback(() => {
    if (!card) return;
    navigate('/export');
  }, [card, navigate]);

  if (isLoading) {
    return <LoadingScreen message="Loading card editor..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Error"
        description={error}
        actions={[
          { label: 'Go Back', onClick: () => navigate('/gallery') },
          { label: 'Try Again', onClick: () => window.location.reload() }
        ]}
      />
    );
  }

  if (!card) {
    return <LoadingScreen message="Card not found" />;
  }

  // Tab sections
  const tabs = [
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'metadata', label: 'Metadata', icon: '📋' },
    { id: 'effects', label: 'Effects', icon: '✨' }
  ];

  return (
    <motion.div
      className="card-editor-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
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
          <Input
            value={card.title}
            onChange={(e) => updateProperty('title', e.target.value)}
            placeholder="Card Title"
            className="card-title-input"
            size="lg"
          />
        </div>
        <div className="header-right">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDuplicate}
            leftIcon="📋"
          >
            Duplicate
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSave}
            loading={isLoading}
            leftIcon="💾"
          >
            Save
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="page-content">
        <div className="editor-layout">
          {/* Left Sidebar - Templates & Themes */}
          <motion.div 
            className="editor-sidebar left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sidebar-section">
              <h3>Templates</h3>
              <Select
                value={card.template.id}
                onChange={(e) => {
                  const template = templates.find(t => t.id === e.target.value);
                  if (template) handleSelectTemplate(template);
                }}
                options={templates.map(t => ({ value: t.id, label: t.name }))}
              />
            </div>
            
            <div className="sidebar-section">
              <h3>Themes</h3>
              <Select
                value={card.theme.id}
                onChange={(e) => {
                  const theme = themes.find(t => t.id === e.target.value);
                  if (theme) handleSelectTheme(theme);
                }}
                options={themes.map(t => ({ value: t.id, label: t.name }))}
              />
            </div>
            
            <div className="sidebar-section">
              <h3>Characters</h3>
              <div className="character-select-grid">
                {characters.map(char => (
                  <CharacterPreview
                    key={char.id}
                    character={char}
                    size="small"
                    onClick={() => handleSelectCharacter(char)}
                    interactive
                    className={selectedCharacter?.id === char.id ? 'selected' : ''}
                  />
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSelectCharacter(null)}
                  isFullWidth
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main Content - Tabs */}
          <motion.div 
            className="editor-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Tabs */}
            <Tabs
              items={tabs.map(t => ({ id: t.id, label: t.label, icon: t.icon }))}
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab as any)}
            />

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="tab-content"
            >
              {activeTab === 'design' && (
                <DesignTab 
                  card={card} 
                  updateProperty={updateProperty}
                  templates={templates}
                />
              )}
              
              {activeTab === 'metadata' && (
                <MetadataTab 
                  card={card} 
                  updateProperty={updateProperty}
                />
              )}
              
              {activeTab === 'effects' && (
                <EffectsTab 
                  card={card} 
                  updateProperty={updateProperty}
                />
              )}
            </motion.div>
          </motion.div>

          {/* Right Sidebar - Preview */}
          <motion.div 
            className="editor-sidebar right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3>Live Preview</h3>
            <div className="preview-canvas">
              <CardCanvas
                card={card}
                character={selectedCharacter}
                showControls
                showGrid
              />
            </div>
            <div className="preview-actions">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleExport}
                isFullWidth
                leftIcon="📥"
              >
                Export Card
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Design Tab Component
interface DesignTabProps {
  card: NFTCard;
  updateProperty: (path: string, value: any) => void;
  templates: CardTemplate[];
}

const DesignTab: React.FC<DesignTabProps> = ({ card, updateProperty, templates }) => {
  return (
    <div className="design-tab">
      <div className="form-section">
        <h4>Description</h4>
        <Input
          value={card.description}
          onChange={(e) => updateProperty('description', e.target.value)}
          placeholder="Describe your NFT card..."
          multiline
          rows={4}
        />
      </div>

      <div className="form-section">
        <h4>Image</h4>
        <div className="image-upload-section">
          <Input
            value={card.image}
            onChange={(e) => updateProperty('image', e.target.value)}
            placeholder="Enter image URL or upload file"
          />
          <Button variant="secondary" size="sm">
            Upload Image
          </Button>
        </div>
      </div>

      <div className="form-section">
        <h4>Background</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Background Type</label>
            <Select
              value={card.template.background.type}
              onChange={(e) => updateProperty('template.background.type', e.target.value)}
              options={[
                { value: 'solid', label: 'Solid Color' },
                { value: 'gradient', label: 'Gradient' },
                { value: 'image', label: 'Image' },
                { value: 'pattern', label: 'Pattern' }
              ]}
            />
          </div>
          
          {card.template.background.type === 'solid' && (
            <div className="form-group">
              <label>Background Color</label>
              <ColorPicker
                value={card.template.background.color || '#000000'}
                onChange={(color) => updateProperty('template.background.color', color)}
              />
            </div>
          )}
          
          {card.template.background.type === 'gradient' && (
            <div className="form-group">
              <label>Gradient Colors</label>
              <div className="color-picker-grid">
                {(card.template.background.colors || ['#6366f1', '#8b5cf6']).map((color, index) => (
                  <ColorPicker
                    key={index}
                    value={color}
                    onChange={(newColor) => {
                      const colors = [...(card.template.background.colors || ['#6366f1', '#8b5cf6'])];
                      colors[index] = newColor;
                      updateProperty('template.background.colors', colors);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="form-section">
        <h4>Border</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Border Type</label>
            <Select
              value={card.template.border.type}
              onChange={(e) => updateProperty('template.border.type', e.target.value)}
              options={[
                { value: 'solid', label: 'Solid' },
                { value: 'gradient', label: 'Gradient' },
                { value: 'glow', label: 'Glow' }
              ]}
            />
          </div>
          
          <div className="form-group">
            <label>Border Color</label>
            <ColorPicker
              value={card.template.border.color || '#6366f1'}
              onChange={(color) => updateProperty('template.border.color', color)}
            />
          </div>
          
          <div className="form-group">
            <label>Border Width</label>
            <Slider
              value={card.template.border.width || 4}
              onChange={(value) => updateProperty('template.border.width', value)}
              min={0}
              max={20}
              step={1}
            />
            <span className="value">{card.template.border.width || 4}px</span>
          </div>
          
          <div className="form-group">
            <label>Border Radius</label>
            <Slider
              value={card.template.border.radius || 12}
              onChange={(value) => updateProperty('template.border.radius', value)}
              min={0}
              max={50}
              step={1}
            />
            <span className="value">{card.template.border.radius || 12}px</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Metadata Tab Component
const MetadataTab: React.FC<DesignTabProps> = ({ card, updateProperty }) => {
  return (
    <div className="metadata-tab">
      <div className="form-section">
        <h4>Basic Information</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <Input
              value={card.metadata.name}
              onChange={(e) => updateProperty('metadata.name', e.target.value)}
              placeholder="NFT Name"
            />
          </div>
          
          <div className="form-group">
            <label>Creator</label>
            <Input
              value={card.metadata.creator}
              onChange={(e) => updateProperty('metadata.creator', e.target.value)}
              placeholder="Creator Name"
            />
          </div>
          
          <div className="form-group">
            <label>Collection</label>
            <Input
              value={card.metadata.collection}
              onChange={(e) => updateProperty('metadata.collection', e.target.value)}
              placeholder="Collection Name"
            />
          </div>
          
          <div className="form-group">
            <label>Rarity</label>
            <Select
              value={card.metadata.rarity}
              onChange={(e) => updateProperty('metadata.rarity', e.target.value)}
              options={rarityOptions.map(r => ({ value: r.value, label: r.label }))}
            />
          </div>
          
          <div className="form-group">
            <label>Edition</label>
            <Input
              type="number"
              value={card.metadata.edition}
              onChange={(e) => updateProperty('metadata.edition', parseInt(e.target.value) || 1)}
              placeholder="Edition Number"
            />
          </div>
          
          <div className="form-group">
            <label>Blockchain</label>
            <Select
              value={card.metadata.blockchain}
              onChange={(e) => updateProperty('metadata.blockchain', e.target.value)}
              options={blockchainOptions}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Attributes</h4>
        <div className="attributes-editor">
          {card.metadata.attributes.map((attr, index) => (
            <div key={attr.id || index} className="attribute-item">
              <div className="attribute-grid">
                <div className="form-group">
                  <label>Trait Type</label>
                  <Input
                    value={attr.traitType}
                    onChange={(e) => {
                      const attributes = [...card.metadata.attributes];
                      attributes[index] = { ...attributes[index], traitType: e.target.value };
                      updateProperty('metadata.attributes', attributes);
                    }}
                    placeholder="Trait Type"
                  />
                </div>
                
                <div className="form-group">
                  <label>Value</label>
                  <Input
                    value={attr.value}
                    onChange={(e) => {
                      const attributes = [...card.metadata.attributes];
                      attributes[index] = { ...attributes[index], value: e.target.value };
                      updateProperty('metadata.attributes', attributes);
                    }}
                    placeholder="Value"
                  />
                </div>
                
                <div className="form-group">
                  <label>Rarity</label>
                  <Select
                    value={attr.rarity || 'common'}
                    onChange={(e) => {
                      const attributes = [...card.metadata.attributes];
                      attributes[index] = { ...attributes[index], rarity: e.target.value as Rarity };
                      updateProperty('metadata.attributes', attributes);
                    }}
                    options={rarityOptions.map(r => ({ value: r.value, label: r.label }))}
                  />
                </div>
              </div>
              
              <Button 
                variant="danger" 
                size="icon" 
                onClick={() => {
                  const attributes = [...card.metadata.attributes];
                  attributes.splice(index, 1);
                  updateProperty('metadata.attributes', attributes);
                }}
              >
                ✕
              </Button>
            </div>
          ))}
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => {
              const attributes = [...card.metadata.attributes];
              attributes.push({
                id: `attr-${Date.now()}`,
                traitType: '',
                value: ''
              });
              updateProperty('metadata.attributes', attributes);
            }}
            leftIcon="+"
          >
            Add Attribute
          </Button>
        </div>
      </div>

      <div className="form-section">
        <h4>Smart Contract (Optional)</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Contract Address</label>
            <Input
              value={card.metadata.smartContract || ''}
              onChange={(e) => updateProperty('metadata.smartContract', e.target.value)}
              placeholder="0x..."
            />
          </div>
          
          <div className="form-group">
            <label>Token ID</label>
            <Input
              value={card.metadata.tokenId || ''}
              onChange={(e) => updateProperty('metadata.tokenId', e.target.value)}
              placeholder="Token ID"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Effects Tab Component
const EffectsTab: React.FC<DesignTabProps> = ({ card, updateProperty }) => {
  return (
    <div className="effects-tab">
      <div className="form-section">
        <h4>Add Effects</h4>
        <div className="effects-grid">
          {[
            { type: 'glow' as EffectType, label: 'Glow', description: 'Add a glowing effect to the card' },
            { type: 'shadow' as EffectType, label: 'Shadow', description: 'Add drop shadows to elements' },
            { type: 'blur' as EffectType, label: 'Blur', description: 'Apply blur effects' },
            { type: 'sharpen' as EffectType, label: 'Sharpen', description: 'Sharpen the card image' },
            { type: 'neon' as EffectType, label: 'Neon', description: 'Neon glow effects' },
            { type: 'holographic' as EffectType, label: 'Holographic', description: 'Holographic shimmer effect' },
            { type: 'particles' as EffectType, label: 'Particles', description: 'Add floating particles' },
            { type: 'animation' as EffectType, label: 'Animation', description: 'Add subtle animations' }
          ].map((effectType) => (
            <div key={effectType.type} className="effect-card">
              <h5>{effectType.label}</h5>
              <p>{effectType.description}</p>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => {
                  const effects = [...card.effects];
                  effects.push({
                    id: `effect-${Date.now()}`,
                    type: effectType.type,
                    name: effectType.label,
                    enabled: true,
                    intensity: 0.5,
                    config: {}
                  });
                  updateProperty('effects', effects);
                }}
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      </div>

      {card.effects.length > 0 && (
        <div className="form-section">
          <h4>Active Effects</h4>
          <div className="active-effects-list">
            {card.effects.map((effect, index) => (
              <div key={effect.id || index} className="effect-item">
                <div className="effect-info">
                  <span className="effect-name">{effect.name}</span>
                  <span className="effect-type">{effect.type}</span>
                </div>
                <div className="effect-controls">
                  <Slider
                    value={effect.intensity}
                    onChange={(value) => {
                      const effects = [...card.effects];
                      effects[index] = { ...effects[index], intensity: value };
                      updateProperty('effects', effects);
                    }}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                  <Button 
                    variant="danger" 
                    size="icon" 
                    onClick={() => {
                      const effects = [...card.effects];
                      effects.splice(index, 1);
                      updateProperty('effects', effects);
                    }}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardEditorPage;
