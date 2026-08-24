import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './stores/useStore';
import { HomePage } from './pages/HomePage';
import { CardEditorPage } from './pages/CardEditorPage';
import { CharacterCreatorPage } from './pages/CharacterCreatorPage';
import { TemplateEditorPage } from './pages/TemplateEditorPage';
import { ThemeEditorPage } from './pages/ThemeEditorPage';
import { GalleryPage } from './pages/GalleryPage';
import { SettingsPage } from './pages/SettingsPage';
import { ExportPage } from './pages/ExportPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { ModalProvider } from './components/Modal';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { initDB, loadInitialData } from './utils/storage';
import { FusedAgentSystem } from './utils/fusedAgentSystem';
import type { NFTCard, Character3D, CardTemplate, CardTheme } from './types';

interface AppProps {
  onReady?: () => void;
}

const App: React.FC<AppProps> = ({ onReady }) => {
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  const [agentSystem, setAgentSystem] = useState<any>(null);
  const [agentRunning, setAgentRunning] = useState(false);
  
  // Initialize stores
  const { 
    cards, 
    characters, 
    templates, 
    themes,
    setCards, 
    setCharacters, 
    setTemplates, 
    setThemes,
    setCurrentCard,
    setCurrentCharacter,
    setEditorMode,
    settings
  } = useStore();

  // Initialize database and load data
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize IndexedDB
        await initDB();
        
        // Load initial data
        const { cards: loadedCards, characters: loadedCharacters, templates: loadedTemplates, themes: loadedThemes } = await loadInitialData();
        
        // Set data in store
        if (loadedCards.length > 0) setCards(loadedCards);
        if (loadedCharacters.length > 0) setCharacters(loadedCharacters);
        if (loadedTemplates.length > 0) setTemplates(loadedTemplates);
        if (loadedThemes.length > 0) setThemes(loadedThemes);
        
        // Initialize fused agent system
        const config = {
          arbiter: { merge_threshold: 0.62 },
          classifier: { commitment: 'Maximize NFT card quality and performance' },
          hooks: { monitor_home: './.monster' },
          max_recursion: 5
        };
        
        const system = new FusedAgentSystem(config);
        setAgentSystem(system);
        
        // Start agent system in watch mode (optional, can be toggled in settings)
        if (settings.enableAgentSystem) {
          startAgentSystem(system);
        }
        
        setInitialized(true);
        onReady?.();
        
      } catch (error) {
        console.error('Initialization error:', error);
        setInitialized(true);
        onReady?.();
      }
    };
    
    initialize();
    
    return () => {
      // Cleanup agent system if running
      if (agentRunning && agentSystem) {
        agentSystem.running = false;
      }
    };
  }, [onReady, settings.enableAgentSystem]);

  const startAgentSystem = useCallback((system: any) => {
    if (agentRunning) return;
    
    setAgentRunning(true);
    // Run in background thread (using setInterval for simplicity)
    const interval = setInterval(() => {
      try {
        const result = system.run_once();
        // Process agent results if needed
        if (result.classification?.urgency === 'NOW') {
          console.log('[Agent] Urgent action required:', result.classification.imperative);
        }
      } catch (error) {
        console.error('[Agent] Error:', error);
      }
    }, 30000); // Run every 30 seconds
    
    return () => clearInterval(interval);
  }, [agentRunning]);

  const stopAgentSystem = useCallback(() => {
    if (!agentRunning) return;
    setAgentRunning(false);
    if (agentSystem) {
      agentSystem.running = false;
    }
  }, [agentRunning, agentSystem]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl/Cmd + K: Quick create
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      navigate('/create');
    }
    
    // Ctrl/Cmd + N: New card
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
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
      setCurrentCard(newCard);
      setEditorMode('card');
      navigate('/editor/card');
    }
    
    // Ctrl/Cmd + C: New character
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault();
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
      navigate('/creator/character');
    }
  }, [navigate, templates, themes, setCurrentCard, setCurrentCharacter, setEditorMode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!initialized) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="content-wrapper">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="page-content"
              >
                <Routes>
                  <Route path="/" element={<HomePage cards={cards} characters={characters} />} />
                  <Route path="/gallery" element={<GalleryPage cards={cards} characters={characters} />} />
                  <Route 
                    path="/editor/card" 
                    element={
                      <CardEditorPage 
                        cards={cards} 
                        templates={templates} 
                        themes={themes} 
                        characters={characters}
                      />
                    }
                  />
                  <Route 
                    path="/editor/card/:id" 
                    element={
                      <CardEditorPage 
                        cards={cards} 
                        templates={templates} 
                        themes={themes} 
                        characters={characters}
                      />
                    }
                  />
                  <Route 
                    path="/creator/character" 
                    element={<CharacterCreatorPage characters={characters} />} 
                  />
                  <Route 
                    path="/creator/character/:id" 
                    element={<CharacterCreatorPage characters={characters} />} 
                  />
                  <Route 
                    path="/editor/template" 
                    element={<TemplateEditorPage templates={templates} setTemplates={setTemplates} />} 
                  />
                  <Route 
                    path="/editor/theme" 
                    element={<ThemeEditorPage themes={themes} setThemes={setThemes} />} 
                  />
                  <Route 
                    path="/export" 
                    element={<ExportPage cards={cards} characters={characters} />} 
                  />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Global Components */}
        <ToastContainer />
        <ModalProvider />
        <KeyboardShortcuts />
        {import.meta.env.VITE_ENABLE_ANALYTICS === 'true' && <PerformanceMonitor />}
      </div>
    </ErrorBoundary>
  );
};

export default App;
