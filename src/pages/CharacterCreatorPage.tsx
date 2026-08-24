import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore, useCharacterActions } from '../stores/useStore';
import { CharacterEditor } from '../components/CharacterEditor';
import { CharacterCanvas } from '../components/CharacterCanvas';
import { Button } from '../components/Button';
import { LoadingScreen } from '../components/LoadingScreen';
import { EmptyState } from '../components/EmptyState';
import type { Character3D } from '../types';

export interface CharacterCreatorPageProps {
  characters: Character3D[];
}

export const CharacterCreatorPage: React.FC<CharacterCreatorPageProps> = ({ characters }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [character, setCharacter] = useState<Character3D | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { getCharacterById, addCharacter, updateCharacter, setCurrentCharacter } = useCharacterActions();

  // Load character
  useEffect(() => {
    const loadCharacter = () => {
      setIsLoading(true);
      setError(null);

      try {
        if (id) {
          // Edit existing character
          const existing = getCharacterById(id);
          if (existing) {
            setCharacter(existing);
            setCurrentCharacter(existing);
          } else {
            setError('Character not found');
            navigate('/creator/character');
          }
        } else {
          // Create new character
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
          setCharacter(newCharacter);
          setCurrentCharacter(newCharacter);
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load character');
        setIsLoading(false);
        console.error(err);
      }
    };

    loadCharacter();
  }, [id, getCharacterById, setCurrentCharacter, navigate]);

  // Save character
  const handleSave = useCallback((updatedCharacter: Character3D) => {
    setIsLoading(true);
    
    try {
      if (id && getCharacterById(id)) {
        // Update existing
        updateCharacter(id, updatedCharacter);
      } else {
        // Add new
        addCharacter(updatedCharacter);
      }
      
      setCharacter(updatedCharacter);
      setCurrentCharacter(updatedCharacter);
      
      // Navigate to gallery or stay in editor
      navigate('/gallery');
    } catch (err) {
      setError('Failed to save character');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id, getCharacterById, updateCharacter, addCharacter, setCurrentCharacter, navigate]);

  // Cancel handler
  const handleCancel = useCallback(() => {
    navigate('/gallery');
  }, [navigate]);

  // Duplicate character
  const handleDuplicate = useCallback(() => {
    if (!character) return;
    
    const duplicated: Character3D = {
      ...character,
      id: `char-${Date.now()}`,
      name: `${character.name} (Copy)`
    };
    
    addCharacter(duplicated);
    setCurrentCharacter(duplicated);
    navigate(`/creator/character/${duplicated.id}`);
  }, [character, addCharacter, setCurrentCharacter, navigate]);

  // Delete character
  const handleDelete = useCallback(() => {
    if (!character || !id) return;
    
    // Confirm deletion
    if (window.confirm(`Are you sure you want to delete "${character.name}"?`)) {
      // Delete logic would go here
      navigate('/gallery');
    }
  }, [character, id, navigate]);

  if (isLoading) {
    return <LoadingScreen message="Loading character editor..." />;
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

  if (!character) {
    return <LoadingScreen message="Character not found" />;
  }

  return (
    <motion.div
      className="character-creator-page"
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
            onClick={handleCancel}
            leftIcon="←"
          >
            Back to Gallery
          </Button>
        </div>
        <div className="header-center">
          <h1 className="page-title">Character Creator</h1>
          <p className="page-subtitle">
            Design and customize your 3D character with maximum options
          </p>
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
            variant="danger" 
            size="sm" 
            onClick={handleDelete}
            leftIcon="🗑️"
          >
            Delete
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="page-content">
        <CharacterEditor
          character={character}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>

      {/* Preview Sidebar */}
      <motion.div 
        className="preview-sidebar"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3>Live Preview</h3>
        <div className="preview-canvas">
          <CharacterCanvas
            character={character}
            showControls
            showGrid
          />
        </div>
        <div className="preview-actions">
          <Button variant="secondary" size="sm" isFullWidth>
            Export Character
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CharacterCreatorPage;
