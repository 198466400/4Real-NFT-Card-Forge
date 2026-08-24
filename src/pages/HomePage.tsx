import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, useCardActions, useCharacterActions, useUIActions } from '../stores/useStore';
import { CardPreview } from '../components/CardPreview';
import { CharacterPreview } from '../components/CharacterPreview';
import { Button } from '../components/Button';
import { HeroSection } from '../components/HeroSection';
import { FeatureGrid } from '../components/FeatureGrid';
import { RecentCards } from '../components/RecentCards';
import { QuickActions } from '../components/QuickActions';
import { StatsBar } from '../components/StatsBar';
import type { NFTCard, Character3D } from '../types';

interface HomePageProps {
  cards: NFTCard[];
  characters: Character3D[];
}

export const HomePage: React.FC<HomePageProps> = ({ cards, characters }) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [featuredCards, setFeaturedCards] = useState<NFTCard[]>([]);
  const [featuredCharacters, setFeaturedCharacters] = useState<Character3D[]>([]);

  const { setCurrentCard, setCurrentCharacter } = useCardActions();
  const { setEditorMode } = useUIActions();

  // Get recent items
  useEffect(() => {
    // Get last 6 cards
    const recentCards = [...cards].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ).slice(0, 6);
    setFeaturedCards(recentCards);
    
    // Get last 4 characters
    const recentChars = [...characters].sort((a, b) => 
      new Date(b.lighting.ambient.color).getTime() - new Date(a.lighting.ambient.color).getTime()
    ).slice(0, 4);
    setFeaturedCharacters(recentChars);
  }, [cards, characters]);

  const handleCreateCard = useCallback(() => {
    setIsLoading(true);
    const newCard: NFTCard = {
      id: `card-${Date.now()}`,
      title: 'Untitled Card',
      description: '',
      image: '',
      template: {
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
      theme: {
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
    
    setCurrentCard(newCard);
    setEditorMode('card');
    setIsLoading(false);
    navigate('/editor/card');
  }, [navigate, setCurrentCard, setEditorMode]);

  const handleCreateCharacter = useCallback(() => {
    setIsLoading(true);
    const newCharacter: Character3D = {
      id: `char-${Date.now()}`,
      name: 'New Character',
      base: { model: 'humanoid', height: 1.75, scale: { x: 1, y: 1, z: 1 }, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
      body: { type: 'human', build: 'average', skin: { color: '#ffccaa', roughness: 0.3, metallic: 0, glow: 0 }, proportions: { head: 1, torso: 1.2, arms: 1, legs: 1.1, hands: 0.8, feet: 0.9 } },
      face: {
        shape: 'oval',
        features: { symmetry: 0.95, masculinity: 0.5, age: 25, uniqueness: 0.7 },
        eyes: { shape: 'almond', color: '#4a90e2', size: 0.15, spacing: 0.1, iris: { color: '#2563eb', pattern: 'solid', size: 0.08 }, pupil: { color: '#000000', size: 0.04, shape: 'round' } },
        mouth: { shape: 'neutral', size: 0.1, position: 0.5, color: '#ff6b6b' },
        nose: { shape: 'button', size: 0.08, width: 0.06, position: 0.4 },
        eyebrows: { shape: 'curved', thickness: 0.02, color: '#333333', arch: 0.3, spacing: 0.05 }
      },
      hair: { style: 'long', color: '#333333', length: 0.4, thickness: 0.05, curliness: 0.3, texture: 'wavy', accessories: [] },
      outfit: {
        base: { style: 'casual', color: '#333333', fit: 'regular' },
        top: { type: 'shirt', color: '#444444', neckline: 'crew', sleeves: 0.5, visible: true },
        bottom: { type: 'pants', color: '#333333', visible: true },
        footwear: { type: 'shoes', color: '#222222', visible: true },
        accessories: [],
        materials: { fabric: 'cotton', trim: 'leather' }
      },
      accessories: [],
      pose: 'standing',
      expression: 'neutral',
      customDesigns: [],
      animations: [],
      materials: {
        skin: { type: 'cotton', color: '#ffccaa', roughness: 0.3, metallic: 0, reflectivity: 0.1, emission: 0, emissionColor: '#000000', transparent: false, opacity: 1 },
        hair: { type: 'cotton', color: '#333333', roughness: 0.5, metallic: 0, reflectivity: 0.2, emission: 0, emissionColor: '#000000', transparent: false, opacity: 1 },
        outfit: { type: 'cotton', color: '#444444', roughness: 0.4, metallic: 0, reflectivity: 0.15, emission: 0, emissionColor: '#000000', transparent: false, opacity: 1 },
        accessories: { type: 'metal', color: '#cccccc', roughness: 0.2, metallic: 0.8, reflectivity: 0.9, emission: 0, emissionColor: '#000000', transparent: false, opacity: 1 },
        eyes: { type: 'glass', color: '#4a90e2', roughness: 0.1, metallic: 0, reflectivity: 0.8, emission: 0.3, emissionColor: '#ffffff', transparent: true, opacity: 0.8 }
      },
      lighting: {
        ambient: { color: '#ffffff', intensity: 0.4 },
        directional: [{ color: '#ffffff', intensity: 0.6, position: { x: 5, y: 5, z: 5 }, direction: { x: -1, y: -1, z: -1 }, castShadow: true }],
        point: [],
        spot: [],
        shadows: true
      }
    };
    
    setCurrentCharacter(newCharacter);
    setIsLoading(false);
    navigate('/creator/character');
  }, [navigate, setCurrentCharacter]);

  const handleEditCard = useCallback((card: NFTCard) => {
    setCurrentCard(card);
    setEditorMode('card');
    navigate(`/editor/card/${card.id}`);
  }, [navigate, setCurrentCard, setEditorMode]);

  const handleEditCharacter = useCallback((character: Character3D) => {
    setCurrentCharacter(character);
    navigate(`/creator/character/${character.id}`);
  }, [navigate, setCurrentCharacter]);

  const quickActions = [
    {
      icon: '🎨',
      label: 'Create Card',
      description: 'Start with a blank card',
      action: handleCreateCard,
      color: '#6366f1'
    },
    {
      icon: '👤',
      label: 'Create Character',
      description: 'Design a 3D character',
      action: handleCreateCharacter,
      color: '#8b5cf6'
    },
    {
      icon: '📁',
      label: 'Templates',
      description: 'Browse card templates',
      action: () => navigate('/editor/template'),
      color: '#ec4899'
    },
    {
      icon: '🎭',
      label: 'Themes',
      description: 'Customize color themes',
      action: () => navigate('/editor/theme'),
      color: '#10b981'
    }
  ];

  const features = [
    {
      icon: '✨',
      title: '3D Character Maker',
      description: 'Create fully customizable 3D characters with unlimited options',
      link: '/creator/character'
    },
    {
      icon: '🎨',
      title: 'Advanced Card Design',
      description: 'Design stunning NFT cards with professional templates',
      link: '/editor/card'
    },
    {
      icon: '🖼️',
      title: 'Image Upload',
      description: 'Upload your own images or use AI-generated art',
      link: '/editor/card'
    },
    {
      icon: '🎭',
      title: 'Custom Themes',
      description: 'Create and save custom color themes and styles',
      link: '/editor/theme'
    },
    {
      icon: '💎',
      title: 'Rarity System',
      description: 'Assign rarity levels and attributes to your NFTs',
      link: '/editor/card'
    },
    {
      icon: '⚡',
      title: 'Real-time Preview',
      description: 'See changes instantly with real-time rendering',
      link: '/editor/card'
    }
  ];

  const stats = {
    totalCards: cards.length,
    totalCharacters: characters.length,
    recentActivity: [...cards, ...characters].length > 0 
      ? Math.max(
          ...cards.map(c => new Date(c.updatedAt).getTime()),
          ...characters.map(c => new Date(c.lighting.ambient.color).getTime())
        )
      : 0
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <HeroSection 
        title="4Real NFT Card Forge" 
        subtitle="Create stunning custom NFT cards with advanced 3D character maker and professional rendering" 
        ctaPrimary="Create Card" 
        onCtaPrimary={handleCreateCard}
        ctaSecondary="Create Character" 
        onCtaSecondary={handleCreateCharacter}
      />

      {/* Stats Bar */}
      <StatsBar 
        totalCards={stats.totalCards}
        totalCharacters={stats.totalCharacters}
        lastUpdated={stats.recentActivity}
      />

      {/* Quick Actions */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Quick Actions</h2>
          <QuickActions actions={quickActions} loading={isLoading} />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <FeatureGrid features={features} />
        </div>
      </section>

      {/* Recent Cards */}
      {featuredCards.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Recent Cards</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/gallery')}>
                View All
              </Button>
            </div>
            <RecentCards 
              cards={featuredCards} 
              onEdit={handleEditCard}
              onHover={setHoveredCard}
            />
          </div>
        </section>
      )}

      {/* Featured Characters */}
      {featuredCharacters.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Characters</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/gallery')}>
                View All
              </Button>
            </div>
            <div className="character-grid">
              <AnimatePresence>
                {featuredCharacters.map((character) => (
                  <motion.div
                    key={character.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="character-item"
                  >
                    <CharacterPreview 
                      character={character} 
                      size="medium"
                      onClick={() => handleEditCharacter(character)}
                      interactive
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="cta-content"
          >
            <h2 className="cta-title">Ready to create your masterpiece?</h2>
            <p className="cta-description">
              Join thousands of creators using 4Real NFT Card Forge to create 
              stunning NFT cards with full customization and control.
            </p>
            <div className="cta-actions">
              <Button size="lg" onClick={handleCreateCard} loading={isLoading}>
                Create Card
              </Button>
              <Button variant="secondary" size="lg" onClick={handleCreateCharacter}>
                Create Character
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
