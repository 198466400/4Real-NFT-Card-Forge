import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, useCharacterActions } from '../../stores/useStore';
import { CharacterCanvas } from '../CharacterCanvas';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
import { Slider } from '../Slider';
import { ColorPicker } from '../ColorPicker';
import { Tabs } from '../Tabs';
import { Accordion } from '../Accordion';
import { Character3D, CharacterModel, BodyType, BodyBuild, HairStyle, HairTexture, FaceShape, EyeShape, EyePattern, PupilShape, MouthShape, NoseShape, EyebrowShape, OutfitStyle, OutfitFit, OutfitItemType, NecklineType, CharacterPose, CharacterExpression, AccessoryType, AccessoryPosition, MaterialType } from '../../types';

export interface CharacterEditorProps {
  character: Character3D;
  onSave?: (character: Character3D) => void;
  onCancel?: () => void;
  className?: string;
}

const modelOptions: { value: CharacterModel; label: string }[] = [
  { value: 'humanoid', label: 'Humanoid' },
  { value: 'robot', label: 'Robot' },
  { value: 'cyborg', label: 'Cyborg' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'anime', label: 'Anime' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'realistic', label: 'Realistic' },
  { value: 'stylized', label: 'Stylized' },
  { value: 'custom', label: 'Custom' }
];

const bodyTypeOptions: { value: BodyType; label: string }[] = [
  { value: 'human', label: 'Human' },
  { value: 'android', label: 'Android' },
  { value: 'creature', label: 'Creature' },
  { value: 'custom', label: 'Custom' }
];

const bodyBuildOptions: { value: BodyBuild; label: string }[] = [
  { value: 'slim', label: 'Slim' },
  { value: 'average', label: 'Average' },
  { value: 'muscular', label: 'Muscular' },
  { value: 'stocky', label: 'Stocky' },
  { value: 'custom', label: 'Custom' }
];

const hairStyleOptions: { value: HairStyle; label: string }[] = [
  { value: 'short', label: 'Short' },
  { value: 'bob', label: 'Bob' },
  { value: 'long', label: 'Long' },
  { value: 'braided', label: 'Braided' },
  { value: 'dreadlocks', label: 'Dreadlocks' },
  { value: 'afro', label: 'Afro' },
  { value: 'ponytail', label: 'Ponytail' },
  { value: 'bun', label: 'Bun' },
  { value: 'pixie', label: 'Pixie' },
  { value: 'mohawk', label: 'Mohawk' },
  { value: 'undercut', label: 'Undercut' },
  { value: 'custom', label: 'Custom' }
];

const hairTextureOptions: { value: HairTexture; label: string }[] = [
  { value: 'straight', label: 'Straight' },
  { value: 'wavy', label: 'Wavy' },
  { value: 'curly', label: 'Curly' },
  { value: 'kinky', label: 'Kinky' },
  { value: 'frizzy', label: 'Frizzy' },
  { value: 'smooth', label: 'Smooth' }
];

const faceShapeOptions: { value: FaceShape; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'oval', label: 'Oval' },
  { value: 'square', label: 'Square' },
  { value: 'heart', label: 'Heart' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'long', label: 'Long' },
  { value: 'custom', label: 'Custom' }
];

const eyeShapeOptions: { value: EyeShape; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'almond', label: 'Almond' },
  { value: 'slanted', label: 'Slanted' },
  { value: 'wide', label: 'Wide' },
  { value: 'narrow', label: 'Narrow' },
  { value: 'custom', label: 'Custom' }
];

const eyePatternOptions: { value: EyePattern; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'striped', label: 'Striped' },
  { value: 'spiral', label: 'Spiral' },
  { value: 'galaxy', label: 'Galaxy' },
  { value: 'custom', label: 'Custom' }
];

const pupilShapeOptions: { value: PupilShape; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'slit', label: 'Slit' },
  { value: 'square', label: 'Square' },
  { value: 'star', label: 'Star' },
  { value: 'custom', label: 'Custom' }
];

const mouthShapeOptions: { value: MouthShape; label: string }[] = [
  { value: 'smile', label: 'Smile' },
  { value: 'frown', label: 'Frown' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'open', label: 'Open' },
  { value: 'pout', label: 'Pout' },
  { value: 'grimace', label: 'Grimace' },
  { value: 'custom', label: 'Custom' }
];

const noseShapeOptions: { value: NoseShape; label: string }[] = [
  { value: 'button', label: 'Button' },
  { value: 'hook', label: 'Hook' },
  { value: 'roman', label: 'Roman' },
  { value: 'flat', label: 'Flat' },
  { value: 'upturned', label: 'Upturned' },
  { value: 'custom', label: 'Custom' }
];

const eyebrowShapeOptions: { value: EyebrowShape; label: string }[] = [
  { value: 'straight', label: 'Straight' },
  { value: 'curved', label: 'Curved' },
  { value: 'angled', label: 'Angled' },
  { value: 'thick', label: 'Thick' },
  { value: 'thin', label: 'Thin' },
  { value: 'custom', label: 'Custom' }
];

const poseOptions: { value: CharacterPose; label: string }[] = [
  { value: 'standing', label: 'Standing' },
  { value: 'sitting', label: 'Sitting' },
  { value: 'kneeling', label: 'Kneeling' },
  { value: 'lying', label: 'Lying' },
  { value: 'flying', label: 'Flying' },
  { value: 'fighting', label: 'Fighting' },
  { value: 'dancing', label: 'Dancing' },
  { value: 'running', label: 'Running' },
  { value: 'jumping', label: 'Jumping' },
  { value: 'custom', label: 'Custom' }
];

const expressionOptions: { value: CharacterExpression; label: string }[] = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'happy', label: 'Happy' },
  { value: 'angry', label: 'Angry' },
  { value: 'sad', label: 'Sad' },
  { value: 'surprised', label: 'Surprised' },
  { value: 'scared', label: 'Scared' },
  { value: 'disgusted', label: 'Disgusted' },
  { value: 'confident', label: 'Confident' },
  { value: 'shy', label: 'Shy' },
  { value: 'determined', label: 'Determined' },
  { value: 'mysterious', label: 'Mysterious' },
  { value: 'custom', label: 'Custom' }
];

export const CharacterEditor: React.FC<CharacterEditorProps> = ({
  character,
  onSave,
  onCancel,
  className = ''
}) => {
  const [localCharacter, setLocalCharacter] = useState<Character3D>(character);
  const [activeTab, setActiveTab] = useState<'body' | 'face' | 'hair' | 'outfit' | 'accessories' | 'pose'>('body');
  const [isSaving, setIsSaving] = useState(false);

  const { updateCharacter } = useCharacterActions();

  // Update local state when prop changes
  useEffect(() => {
    setLocalCharacter(character);
  }, [character]);

  // Save handler
  const handleSave = useCallback(() => {
    setIsSaving(true);
    try {
      onSave?.(localCharacter);
      updateCharacter(localCharacter.id, localCharacter);
    } catch (error) {
      console.error('Failed to save character:', error);
    } finally {
      setIsSaving(false);
    }
  }, [localCharacter, onSave, updateCharacter]);

  // Update character property
  const updateProperty = useCallback((path: string, value: any) => {
    setLocalCharacter(prev => {
      const newChar = { ...prev };
      // Handle nested property updates
      const keys = path.split('.');
      let current: any = newChar;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newChar;
    });
  }, []);

  // Tab sections
  const tabs = [
    { id: 'body', label: 'Body', icon: '🧍' },
    { id: 'face', label: 'Face', icon: '😊' },
    { id: 'hair', label: 'Hair', icon: '💇' },
    { id: 'outfit', label: 'Outfit', icon: '👕' },
    { id: 'accessories', label: 'Accessories', icon: '💎' },
    { id: 'pose', label: 'Pose', icon: '🎭' }
  ];

  return (
    <div className={`character-editor ${className}`}>
      <div className="editor-header">
        <div className="header-left">
          <Input
            value={localCharacter.name}
            onChange={(e) => updateProperty('name', e.target.value)}
            placeholder="Character Name"
            className="character-name-input"
          />
        </div>
        <div className="header-actions">
          <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={isSaving}>
            Save Character
          </Button>
        </div>
      </div>

      <div className="editor-content">
        {/* Preview Canvas */}
        <div className="preview-section">
          <div className="canvas-container">
            <CharacterCanvas
              character={localCharacter}
              showControls
              showGrid
            />
          </div>
          <div className="preview-actions">
            <Button variant="ghost" size="sm" leftIcon="🔄">
              Reset View
            </Button>
            <Button variant="ghost" size="sm" leftIcon="🎯">
              Focus
            </Button>
          </div>
        </div>

        {/* Editor Panels */}
        <div className="editor-panels">
          {/* Tabs */}
          <Tabs
            items={tabs.map(t => ({ id: t.id, label: t.label, icon: t.icon }))}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as any)}
          />

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="tab-content"
            >
              {activeTab === 'body' && (
                <BodyEditor 
                  character={localCharacter} 
                  updateProperty={updateProperty}
                />
              )}
              
              {activeTab === 'face' && (
                <FaceEditor 
                  character={localCharacter} 
                  updateProperty={updateProperty}
                />
              )}
              
              {activeTab === 'hair' && (
                <HairEditor 
                  character={localCharacter} 
                  updateProperty={updateProperty}
                />
              )}
              
              {activeTab === 'outfit' && (
                <OutfitEditor 
                  character={localCharacter} 
                  updateProperty={updateProperty}
                />
              )}
              
              {activeTab === 'accessories' && (
                <AccessoriesEditor 
                  character={localCharacter} 
                  updateProperty={updateProperty}
                />
              )}
              
              {activeTab === 'pose' && (
                <PoseEditor 
                  character={localCharacter} 
                  updateProperty={updateProperty}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Body Editor Component
interface BodyEditorProps {
  character: Character3D;
  updateProperty: (path: string, value: any) => void;
}

const BodyEditor: React.FC<BodyEditorProps> = ({ character, updateProperty }) => {
  return (
    <div className="editor-section">
      <h3>Body Configuration</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Model Type</label>
          <Select
            value={character.base.model}
            onChange={(e) => updateProperty('base.model', e.target.value)}
            options={modelOptions}
          />
        </div>
        
        <div className="form-group">
          <label>Body Type</label>
          <Select
            value={character.body.type}
            onChange={(e) => updateProperty('body.type', e.target.value)}
            options={bodyTypeOptions}
          />
        </div>
        
        <div className="form-group">
          <label>Body Build</label>
          <Select
            value={character.body.build}
            onChange={(e) => updateProperty('body.build', e.target.value)}
            options={bodyBuildOptions}
          />
        </div>
        
        <div className="form-group full-width">
          <label>Skin Color</label>
          <ColorPicker
            value={character.body.skin.color}
            onChange={(color) => updateProperty('body.skin.color', color)}
          />
        </div>
        
        <div className="form-group">
          <label>Height</label>
          <Slider
            value={character.base.height}
            onChange={(value) => updateProperty('base.height', value)}
            min={1}
            max={2.5}
            step={0.01}
          />
          <span className="value">{character.base.height.toFixed(2)}m</span>
        </div>
        
        <div className="form-group">
          <label>Skin Roughness</label>
          <Slider
            value={character.body.skin.roughness}
            onChange={(value) => updateProperty('body.skin.roughness', value)}
            min={0}
            max={1}
            step={0.01}
          />
          <span className="value">{character.body.skin.roughness.toFixed(2)}</span>
        </div>
        
        <div className="form-group">
          <label>Skin Metallic</label>
          <Slider
            value={character.body.skin.metallic}
            onChange={(value) => updateProperty('body.skin.metallic', value)}
            min={0}
            max={1}
            step={0.01}
          />
          <span className="value">{character.body.skin.metallic.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// Face Editor Component
const FaceEditor: React.FC<BodyEditorProps> = ({ character, updateProperty }) => {
  return (
    <div className="editor-section">
      <h3>Face Configuration</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Face Shape</label>
          <Select
            value={character.face.shape}
            onChange={(e) => updateProperty('face.shape', e.target.value)}
            options={faceShapeOptions}
          />
        </div>
        
        <div className="form-group">
          <label>Eye Shape</label>
          <Select
            value={character.face.eyes.shape}
            onChange={(e) => updateProperty('face.eyes.shape', e.target.value)}
            options={eyeShapeOptions}
          />
        </div>
        
        <div className="form-group">
          <label>Eye Color</label>
          <ColorPicker
            value={character.face.eyes.color}
            onChange={(color) => updateProperty('face.eyes.color', color)}
          />
        </div>
        
        <div className="form-group">
          <label>Iris Pattern</label>
          <Select
            value={character.face.eyes.iris.pattern}
            onChange={(e) => updateProperty('face.eyes.iris.pattern', e.target.value)}
            options={eyePatternOptions}
          />
        </div>
        
        <div className="form-group">
          <label>Mouth Shape</label>
          <Select
            value={character.face.mouth.shape}
            onChange={(e) => updateProperty('face.mouth.shape', e.target.value)}
            options={mouthShapeOptions}
          />
        </div>
        
        <div className="form-group">
          <label>Nose Shape</label>
          <Select
            value={character.face.nose.shape}
            onChange={(e) => updateProperty('face.nose.shape', e.target.value)}
            options={noseShapeOptions}
          />
        </div>
        
        <div className="form-group">
          <label>Eyebrow Shape</label>
          <Select
            value={character.face.eyebrows.shape}
            onChange={(e) => updateProperty('face.eyebrows.shape', e.target.value)}
            options={eyebrowShapeOptions}
          />
        </div>
        
        <div className="form-group">
          <label>Expression</label>
          <Select
            value={character.expression}
            onChange={(e) => updateProperty('expression', e.target.value)}
            options={expressionOptions}
          />
        </div>
      </div>
    </div>
  );
};

// Hair Editor Component
const HairEditor: React.FC<BodyEditorProps> = ({ character, updateProperty }) => {
  return (
    <div className="editor-section">
      <h3>Hair Configuration</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Hair Style</label>
          <Select
            value={character.hair.style}
            onChange={(e) => updateProperty('hair.style', e.target.value)}
            options={hairStyleOptions}
          />
        </div>
        
        <div className="form-group">
          <label>Hair Texture</label>
          <Select
            value={character.hair.texture}
            onChange={(e) => updateProperty('hair.texture', e.target.value)}
            options={hairTextureOptions}
          />
        </div>
        
        <div className="form-group full-width">
          <label>Hair Color</label>
          <ColorPicker
            value={character.hair.color}
            onChange={(color) => updateProperty('hair.color', color)}
          />
        </div>
        
        <div className="form-group">
          <label>Hair Length</label>
          <Slider
            value={character.hair.length}
            onChange={(value) => updateProperty('hair.length', value)}
            min={0}
            max={1}
            step={0.01}
          />
          <span className="value">{character.hair.length.toFixed(2)}</span>
        </div>
        
        <div className="form-group">
          <label>Hair Thickness</label>
          <Slider
            value={character.hair.thickness}
            onChange={(value) => updateProperty('hair.thickness', value)}
            min={0}
            max={0.2}
            step={0.01}
          />
          <span className="value">{character.hair.thickness.toFixed(2)}</span>
        </div>
        
        <div className="form-group">
          <label>Curliness</label>
          <Slider
            value={character.hair.curliness}
            onChange={(value) => updateProperty('hair.curliness', value)}
            min={0}
            max={1}
            step={0.01}
          />
          <span className="value">{character.hair.curliness.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// Outfit Editor Component
const OutfitEditor: React.FC<BodyEditorProps> = ({ character, updateProperty }) => {
  return (
    <div className="editor-section">
      <h3>Outfit Configuration</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Outfit Style</label>
          <Select
            value={character.outfit.base.style}
            onChange={(e) => updateProperty('outfit.base.style', e.target.value)}
            options={[
              { value: 'casual', label: 'Casual' },
              { value: 'formal', label: 'Formal' },
              { value: 'sporty', label: 'Sporty' },
              { value: 'futuristic', label: 'Futuristic' },
              { value: 'fantasy', label: 'Fantasy' },
              { value: 'cyberpunk', label: 'Cyberpunk' },
              { value: 'gothic', label: 'Gothic' },
              { value: 'retro', label: 'Retro' },
              { value: 'military', label: 'Military' },
              { value: 'custom', label: 'Custom' }
            ]}
          />
        </div>
        
        <div className="form-group">
          <label>Outfit Fit</label>
          <Select
            value={character.outfit.base.fit}
            onChange={(e) => updateProperty('outfit.base.fit', e.target.value)}
            options={[
              { value: 'tight', label: 'Tight' },
              { value: 'loose', label: 'Loose' },
              { value: 'regular', label: 'Regular' },
              { value: 'oversized', label: 'Oversized' }
            ]}
          />
        </div>
        
        <div className="form-group full-width">
          <label>Outfit Color</label>
          <ColorPicker
            value={character.outfit.base.color}
            onChange={(color) => updateProperty('outfit.base.color', color)}
          />
        </div>
        
        <div className="form-group">
          <label>Top Type</label>
          <Select
            value={character.outfit.top.type}
            onChange={(e) => updateProperty('outfit.top.type', e.target.value)}
            options={[
              { value: 'shirt', label: 'Shirt' },
              { value: 'hoodie', label: 'Hoodie' },
              { value: 'jacket', label: 'Jacket' },
              { value: 'coat', label: 'Coat' },
              { value: 'vest', label: 'Vest' },
              { value: 'dress', label: 'Dress' },
              { value: 'custom', label: 'Custom' }
            ]}
          />
        </div>
        
        <div className="form-group">
          <label>Top Color</label>
          <ColorPicker
            value={character.outfit.top.color}
            onChange={(color) => updateProperty('outfit.top.color', color)}
          />
        </div>
        
        <div className="form-group">
          <label>Bottom Type</label>
          <Select
            value={character.outfit.bottom.type}
            onChange={(e) => updateProperty('outfit.bottom.type', e.target.value)}
            options={[
              { value: 'pants', label: 'Pants' },
              { value: 'shorts', label: 'Shorts' },
              { value: 'skirt', label: 'Skirt' },
              { value: 'robe', label: 'Robe' },
              { value: 'custom', label: 'Custom' }
            ]}
          />
        </div>
        
        <div className="form-group">
          <label>Bottom Color</label>
          <ColorPicker
            value={character.outfit.bottom.color}
            onChange={(color) => updateProperty('outfit.bottom.color', color)}
          />
        </div>
      </div>
    </div>
  );
};

// Accessories Editor Component
const AccessoriesEditor: React.FC<BodyEditorProps> = ({ character, updateProperty }) => {
  return (
    <div className="editor-section">
      <h3>Accessories</h3>
      <p>Customize character accessories and special features.</p>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Add Accessory</label>
          <Select
            value=""
            onChange={(e) => {
              // Add new accessory logic
              const newAccessory = {
                id: `acc-${Date.now()}`,
                type: e.target.value as AccessoryType,
                position: 'head' as AccessoryPosition,
                size: 1,
                rotation: { x: 0, y: 0, z: 0 },
                color: '#ffffff',
                material: 'metal' as MaterialType
              };
              updateProperty('accessories', [...character.accessories, newAccessory]);
            }}
            options={[
              { value: 'glasses', label: 'Glasses' },
              { value: 'hat', label: 'Hat' },
              { value: 'jewelry', label: 'Jewelry' },
              { value: 'mask', label: 'Mask' },
              { value: 'weapon', label: 'Weapon' },
              { value: 'shield', label: 'Shield' },
              { value: 'wings', label: 'Wings' },
              { value: 'tail', label: 'Tail' },
              { value: 'horns', label: 'Horns' },
              { value: 'custom', label: 'Custom' }
            ]}
          />
        </div>
        
        {character.accessories.length > 0 && (
          <div className="accessories-list">
            {character.accessories.map((accessory, index) => (
              <div key={accessory.id} className="accessory-item">
                <div className="accessory-info">
                  <span className="accessory-type">{accessory.type}</span>
                  <span className="accessory-position">{accessory.position}</span>
                </div>
                <div className="accessory-actions">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      const newAccessories = [...character.accessories];
                      newAccessories.splice(index, 1);
                      updateProperty('accessories', newAccessories);
                    }}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Pose Editor Component
const PoseEditor: React.FC<BodyEditorProps> = ({ character, updateProperty }) => {
  return (
    <div className="editor-section">
      <h3>Pose & Animation</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Pose</label>
          <Select
            value={character.pose}
            onChange={(e) => updateProperty('pose', e.target.value)}
            options={poseOptions}
          />
        </div>
        
        <div className="form-group">
          <label>Position X</label>
          <Slider
            value={character.base.position.x}
            onChange={(value) => updateProperty('base.position.x', value)}
            min={-5}
            max={5}
            step={0.01}
          />
          <span className="value">{character.base.position.x.toFixed(2)}</span>
        </div>
        
        <div className="form-group">
          <label>Position Y</label>
          <Slider
            value={character.base.position.y}
            onChange={(value) => updateProperty('base.position.y', value)}
            min={-5}
            max={5}
            step={0.01}
          />
          <span className="value">{character.base.position.y.toFixed(2)}</span>
        </div>
        
        <div className="form-group">
          <label>Position Z</label>
          <Slider
            value={character.base.position.z}
            onChange={(value) => updateProperty('base.position.z', value)}
            min={-5}
            max={5}
            step={0.01}
          />
          <span className="value">{character.base.position.z.toFixed(2)}</span>
        </div>
        
        <div className="form-group">
          <label>Rotation X</label>
          <Slider
            value={character.base.rotation.x}
            onChange={(value) => updateProperty('base.rotation.x', value)}
            min={-180}
            max={180}
            step={1}
          />
          <span className="value">{character.base.rotation.x}°</span>
        </div>
        
        <div className="form-group">
          <label>Rotation Y</label>
          <Slider
            value={character.base.rotation.y}
            onChange={(value) => updateProperty('base.rotation.y', value)}
            min={-180}
            max={180}
            step={1}
          />
          <span className="value">{character.base.rotation.y}°</span>
        </div>
        
        <div className="form-group">
          <label>Rotation Z</label>
          <Slider
            value={character.base.rotation.z}
            onChange={(value) => updateProperty('base.rotation.z', value)}
            min={-180}
            max={180}
            step={1}
          />
          <span className="value">{character.base.rotation.z}°</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterEditor;
