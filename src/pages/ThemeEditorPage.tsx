import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { ColorPicker } from '../components/ColorPicker';
import { Slider } from '../components/Slider';
import { Card } from '../components/Card';
import { LoadingScreen } from '../components/LoadingScreen';
import { toast } from '../components/Toast';
import type { CardTheme, ColorPalette, TypographyConfig, SpacingConfig, ShadowConfig, TransitionConfig } from '../types';

export interface ThemeEditorPageProps {
  themes: CardTheme[];
  setThemes: (themes: CardTheme[]) => void;
}

export const ThemeEditorPage: React.FC<ThemeEditorPageProps> = ({
  themes,
  setThemes
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<CardTheme | null>(null);
  const [activeTab, setActiveTab] = useState<'palette' | 'typography' | 'spacing' | 'effects'>('palette');

  // Load first theme or create new
  useEffect(() => {
    if (themes.length > 0) {
      setSelectedTheme(themes[0]);
    } else {
      const newTheme: CardTheme = {
        id: `theme-${Date.now()}`,
        name: 'New Theme',
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
      };
      setThemes([newTheme]);
      setSelectedTheme(newTheme);
    }
    setIsLoading(false);
  }, [themes, setThemes]);

  // Update theme
  const updateTheme = useCallback((updates: Partial<CardTheme>) => {
    if (!selectedTheme) return;
    
    setSelectedTheme(prev => {
      if (!prev) return null;
      const newTheme = { ...prev, ...updates };
      
      // Update in themes array
      const newThemes = themes.map(t => t.id === newTheme.id ? newTheme : t);
      setThemes(newThemes);
      
      return newTheme;
    });
  }, [selectedTheme, themes, setThemes]);

  // Create new theme
  const handleCreateNew = useCallback(() => {
    const newTheme: CardTheme = {
      id: `theme-${Date.now()}`,
      name: 'New Theme',
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
    };
    
    setThemes([...themes, newTheme]);
    setSelectedTheme(newTheme);
    toast.success('New theme created');
  }, [themes, setThemes]);

  // Delete theme
  const handleDelete = useCallback(() => {
    if (!selectedTheme) return;
    
    if (window.confirm(`Are you sure you want to delete "${selectedTheme.name}"?`)) {
      const newThemes = themes.filter(t => t.id !== selectedTheme.id);
      setThemes(newThemes);
      
      if (newThemes.length > 0) {
        setSelectedTheme(newThemes[0]);
      } else {
        setSelectedTheme(null);
      }
      
      toast.success('Theme deleted');
    }
  }, [selectedTheme, themes, setThemes]);

  // Save theme
  const handleSave = useCallback(() => {
    if (!selectedTheme) return;
    toast.success('Theme saved');
  }, [selectedTheme]);

  // Duplicate theme
  const handleDuplicate = useCallback(() => {
    if (!selectedTheme) return;
    
    const duplicated: CardTheme = {
      ...selectedTheme,
      id: `theme-${Date.now()}`,
      name: `${selectedTheme.name} (Copy)`
    };
    
    setThemes([...themes, duplicated]);
    setSelectedTheme(duplicated);
    toast.success('Theme duplicated');
  }, [selectedTheme, themes, setThemes]);

  // Tab sections
  const tabs = [
    { id: 'palette', label: 'Palette', icon: '🎨' },
    { id: 'typography', label: 'Typography', icon: '📝' },
    { id: 'spacing', label: 'Spacing', icon: '📏' },
    { id: 'effects', label: 'Effects', icon: '✨' }
  ];

  if (isLoading) {
    return <LoadingScreen message="Loading theme editor..." />;
  }

  if (!selectedTheme) {
    return (
      <div className="theme-editor-empty">
        <h3>No Themes Available</h3>
        <p>Create a new theme to get started</p>
        <Button variant="primary" onClick={handleCreateNew}>
          Create New Theme
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="theme-editor-page"
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
          <h1 className="page-title">Theme Editor</h1>
          <p className="page-subtitle">
            Create and customize color themes
          </p>
        </div>
        <div className="header-right">
          <Button variant="ghost" size="sm" onClick={handleDuplicate} leftIcon="📋">
            Duplicate
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} leftIcon="🗑️">
            Delete
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} leftIcon="💾">
            Save
          </Button>
        </div>
      </motion.div>

      {/* Theme Selection */}
      <motion.div 
        className="theme-selection"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="themes-list">
          {themes.map((theme) => (
            <motion.div
              key={theme.id}
              className={`theme-item ${selectedTheme.id === theme.id ? 'selected' : ''}`}
              onClick={() => setSelectedTheme(theme)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: theme.palette.background,
                borderColor: theme.palette.border,
                color: theme.palette.text.primary
              }}
            >
              <span className="theme-name">{theme.name}</span>
              <div 
                className="theme-preview"
                style={{
                  background: `linear-gradient(135deg, ${theme.palette.primary}, ${theme.palette.secondary})`
                }}
              />
            </motion.div>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={handleCreateNew} leftIcon="+">
          New Theme
        </Button>
      </motion.div>

      {/* Content */}
      <div className="editor-content">
        {/* Tabs */}
        <motion.div 
          className="editor-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              type="button"
              className={`editor-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          className="tab-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {activeTab === 'palette' && (
            <PaletteSettings 
              theme={selectedTheme} 
              updateTheme={updateTheme}
            />
          )}
          
          {activeTab === 'typography' && (
            <TypographySettings 
              theme={selectedTheme} 
              updateTheme={updateTheme}
            />
          )}
          
          {activeTab === 'spacing' && (
            <SpacingSettings 
              theme={selectedTheme} 
              updateTheme={updateTheme}
            />
          )}
          
          {activeTab === 'effects' && (
            <EffectsSettings 
              theme={selectedTheme} 
              updateTheme={updateTheme}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Palette Settings Component
interface ThemeSettingsProps {
  theme: CardTheme;
  updateTheme: (updates: Partial<CardTheme>) => void;
}

const PaletteSettings: React.FC<ThemeSettingsProps> = ({ theme, updateTheme }) => {
  const handlePaletteChange = (field: keyof ColorPalette, value: string) => {
    updateTheme({
      palette: {
        ...theme.palette,
        [field]: value
      }
    });
  };

  const handleTextColorChange = (field: keyof ColorPalette['text'], value: string) => {
    updateTheme({
      palette: {
        ...theme.palette,
        text: {
          ...theme.palette.text,
          [field]: value
        }
      }
    });
  };

  return (
    <Card className="settings-card">
      <Card.Header border={false} padding="lg">
        <h3>Color Palette</h3>
      </Card.Header>
      <Card.Body padding="lg">
        <div className="palette-grid">
          <div className="palette-section">
            <h4>Primary Colors</h4>
            <div className="color-grid">
              <ColorItem
                label="Primary"
                value={theme.palette.primary}
                onChange={(color) => handlePaletteChange('primary', color)}
              />
              <ColorItem
                label="Secondary"
                value={theme.palette.secondary}
                onChange={(color) => handlePaletteChange('secondary', color)}
              />
              <ColorItem
                label="Accent"
                value={theme.palette.accent}
                onChange={(color) => handlePaletteChange('accent', color)}
              />
            </div>
          </div>

          <div className="palette-section">
            <h4>Background Colors</h4>
            <div className="color-grid">
              <ColorItem
                label="Background"
                value={theme.palette.background}
                onChange={(color) => handlePaletteChange('background', color)}
              />
              <ColorItem
                label="Surface"
                value={theme.palette.surface}
                onChange={(color) => handlePaletteChange('surface', color)}
              />
            </div>
          </div>

          <div className="palette-section">
            <h4>Text Colors</h4>
            <div className="color-grid">
              <ColorItem
                label="Primary"
                value={theme.palette.text.primary}
                onChange={(color) => handleTextColorChange('primary', color)}
              />
              <ColorItem
                label="Secondary"
                value={theme.palette.text.secondary}
                onChange={(color) => handleTextColorChange('secondary', color)}
              />
              <ColorItem
                label="Disabled"
                value={theme.palette.text.disabled}
                onChange={(color) => handleTextColorChange('disabled', color)}
              />
            </div>
          </div>

          <div className="palette-section">
            <h4>Semantic Colors</h4>
            <div className="color-grid">
              <ColorItem
                label="Success"
                value={theme.palette.success}
                onChange={(color) => handlePaletteChange('success', color)}
              />
              <ColorItem
                label="Warning"
                value={theme.palette.warning}
                onChange={(color) => handlePaletteChange('warning', color)}
              />
              <ColorItem
                label="Error"
                value={theme.palette.error}
                onChange={(color) => handlePaletteChange('error', color)}
              />
              <ColorItem
                label="Info"
                value={theme.palette.info}
                onChange={(color) => handlePaletteChange('info', color)}
              />
            </div>
          </div>

          <div className="palette-section">
            <h4>Border Color</h4>
            <div className="color-grid">
              <ColorItem
                label="Border"
                value={theme.palette.border}
                onChange={(color) => handlePaletteChange('border', color)}
              />
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// Color Item Component
interface ColorItemProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorItem: React.FC<ColorItemProps> = ({ label, value, onChange }) => {
  return (
    <div className="color-item">
      <label className="color-label">{label}</label>
      <ColorPicker value={value} onChange={onChange} size="sm" />
      <span className="color-value">{value}</span>
    </div>
  );
};

// Typography Settings Component
const TypographySettings: React.FC<ThemeSettingsProps> = ({ theme, updateTheme }) => {
  const handleTypographyChange = (field: keyof TypographyConfig, value: any) => {
    updateTheme({
      typography: {
        ...theme.typography,
        [field]: value
      }
    });
  };

  return (
    <Card className="settings-card">
      <Card.Header border={false} padding="lg">
        <h3>Typography</h3>
      </Card.Header>
      <Card.Body padding="lg">
        <div className="settings-grid">
          <div className="form-group">
            <label>Font Family</label>
            <Select
              value={theme.typography.fontFamily}
              onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
              options={[
                { value: 'Inter', label: 'Inter' },
                { value: 'Space Grotesk', label: 'Space Grotesk' },
                { value: 'JetBrains Mono', label: 'JetBrains Mono' },
                { value: 'Arial', label: 'Arial' },
                { value: 'Helvetica', label: 'Helvetica' },
                { value: 'Georgia', label: 'Georgia' },
                { value: 'Times New Roman', label: 'Times New Roman' }
              ]}
              size="md"
            />
          </div>

          <div className="form-group full-width">
            <label>Font Sizes</label>
            <div className="font-size-grid">
              {(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as Array<keyof TypographyConfig['fontSize']>).map((size) => (
                <div key={size} className="font-size-item">
                  <label>{size}</label>
                  <Slider
                    value={theme.typography.fontSize[size] || 16}
                    onChange={(value) => handleTypographyChange('fontSize', {
                      ...theme.typography.fontSize,
                      [size]: value
                    })}
                    min={8}
                    max={72}
                    step={1}
                    showValue
                    valueFormatter={(v) => `${v}px`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-group full-width">
            <label>Font Weights</label>
            <div className="font-weight-grid">
              {(['light', 'normal', 'medium', 'bold', 'black'] as Array<keyof TypographyConfig['fontWeight']>).map((weight) => (
                <div key={weight} className="font-weight-item">
                  <label>{weight}</label>
                  <Select
                    value={theme.typography.fontWeight[weight]?.toString() || '400'}
                    onChange={(e) => handleTypographyChange('fontWeight', {
                      ...theme.typography.fontWeight,
                      [weight]: parseInt(e.target.value)
                    })}
                    options={[
                      { value: '300', label: '300' },
                      { value: '400', label: '400' },
                      { value: '500', label: '500' },
                      { value: '600', label: '600' },
                      { value: '700', label: '700' },
                      { value: '900', label: '900' }
                    ]}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-group full-width">
            <label>Line Heights</label>
            <div className="line-height-grid">
              {(['tight', 'normal', 'relaxed', 'loose'] as Array<keyof TypographyConfig['lineHeight']>).map((line) => (
                <div key={line} className="line-height-item">
                  <label>{line}</label>
                  <Slider
                    value={theme.typography.lineHeight[line] || 1.5}
                    onChange={(value) => handleTypographyChange('lineHeight', {
                      ...theme.typography.lineHeight,
                      [line]: value
                    })}
                    min={1}
                    max={3}
                    step={0.1}
                    showValue
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// Spacing Settings Component
const SpacingSettings: React.FC<ThemeSettingsProps> = ({ theme, updateTheme }) => {
  const handleSpacingChange = (field: keyof SpacingConfig, value: number) => {
    updateTheme({
      spacing: {
        ...theme.spacing,
        [field]: value
      }
    });
  };

  return (
    <Card className="settings-card">
      <Card.Header border={false} padding="lg">
        <h3>Spacing</h3>
      </Card.Header>
      <Card.Body padding="lg">
        <div className="spacing-grid">
          {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as Array<keyof SpacingConfig>).map((size) => (
            <div key={size} className="spacing-item">
              <label>{size}</label>
              <Slider
                value={theme.spacing[size] || 0}
                onChange={(value) => handleSpacingChange(size, value)}
                min={0}
                max={100}
                step={1}
                showValue
                valueFormatter={(v) => `${v}px`}
              />
              <div 
                className="spacing-preview"
                style={{ height: `${theme.spacing[size] || 0}px` }}
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Border Radius</label>
          <Slider
            value={theme.borderRadius || 12}
            onChange={(value) => updateTheme({ borderRadius: value })}
            min={0}
            max={50}
            step={1}
            showValue
            valueFormatter={(v) => `${v}px`}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

// Effects Settings Component
const EffectsSettings: React.FC<ThemeSettingsProps> = ({ theme, updateTheme }) => {
  const handleShadowChange = (index: number, updates: Partial<ShadowConfig>) => {
    const newShadows = [...theme.shadows];
    newShadows[index] = { ...newShadows[index], ...updates };
    updateTheme({ shadows: newShadows });
  };

  const handleAddShadow = () => {
    updateTheme({
      shadows: [...theme.shadows, {
        name: `shadow-${Date.now()}`,
        offset: { x: 0, y: 1 },
        blur: 2,
        spread: 0,
        color: 'rgba(0,0,0,0.3)',
        opacity: 1
      }]
    });
  };

  const handleDeleteShadow = (index: number) => {
    const newShadows = [...theme.shadows];
    newShadows.splice(index, 1);
    updateTheme({ shadows: newShadows });
  };

  return (
    <Card className="settings-card">
      <Card.Header border={false} padding="lg">
        <h3>Effects</h3>
      </Card.Header>
      <Card.Body padding="lg">
        <div className="settings-grid">
          <div className="form-group">
            <label>Transition Duration</label>
            <Slider
              value={theme.transitions.duration || 0.2}
              onChange={(value) => updateTheme({
                transitions: { ...theme.transitions, duration: value }
              })}
              min={0}
              max={2}
              step={0.01}
              showValue
              valueFormatter={(v) => `${v}s`}
            />
          </div>

          <div className="form-group">
            <label>Transition Timing Function</label>
            <Select
              value={theme.transitions.timingFunction || 'ease'}
              onChange={(e) => updateTheme({
                transitions: { ...theme.transitions, timingFunction: e.target.value }
              })}
              options={[
                { value: 'ease', label: 'Ease' },
                { value: 'ease-in', label: 'Ease In' },
                { value: 'ease-out', label: 'Ease Out' },
                { value: 'ease-in-out', label: 'Ease In Out' },
                { value: 'linear', label: 'Linear' }
              ]}
              size="md"
            />
          </div>

          <div className="form-group">
            <label>Transition Delay</label>
            <Slider
              value={theme.transitions.delay || 0}
              onChange={(value) => updateTheme({
                transitions: { ...theme.transitions, delay: value }
              })}
              min={0}
              max={2}
              step={0.01}
              showValue
              valueFormatter={(v) => `${v}s`}
            />
          </div>
        </div>

        <div className="shadows-section">
          <div className="shadows-header">
            <h4>Shadows</h4>
            <Button variant="ghost" size="sm" onClick={handleAddShadow} leftIcon="+">
              Add Shadow
            </Button>
          </div>
          
          {theme.shadows.length === 0 ? (
            <p className="empty-shadows">No shadows defined</p>
          ) : (
            <div className="shadows-list">
              {theme.shadows.map((shadow, index) => (
                <Card key={shadow.name || index} className="shadow-card">
                  <Card.Header border={false} padding="md">
                    <div className="shadow-header">
                      <Input
                        value={shadow.name || `Shadow ${index + 1}`}
                        onChange={(e) => handleShadowChange(index, { name: e.target.value })}
                        placeholder="Shadow name"
                        size="sm"
                        className="shadow-name-input"
                      />
                      <Button 
                        variant="danger" 
                        size="icon" 
                        onClick={() => handleDeleteShadow(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body padding="md">
                    <div className="shadow-settings">
                      <div className="form-group">
                        <label>Offset X</label>
                        <Slider
                          value={shadow.offset.x || 0}
                          onChange={(value) => handleShadowChange(index, {
                            offset: { ...shadow.offset, x: value }
                          })}
                          min={-50}
                          max={50}
                          step={1}
                          showValue
                          valueFormatter={(v) => `${v}px`}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Offset Y</label>
                        <Slider
                          value={shadow.offset.y || 0}
                          onChange={(value) => handleShadowChange(index, {
                            offset: { ...shadow.offset, y: value }
                          })}
                          min={-50}
                          max={50}
                          step={1}
                          showValue
                          valueFormatter={(v) => `${v}px`}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Blur</label>
                        <Slider
                          value={shadow.blur || 0}
                          onChange={(value) => handleShadowChange(index, { blur: value })}
                          min={0}
                          max={100}
                          step={1}
                          showValue
                          valueFormatter={(v) => `${v}px`}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Spread</label>
                        <Slider
                          value={shadow.spread || 0}
                          onChange={(value) => handleShadowChange(index, { spread: value })}
                          min={0}
                          max={100}
                          step={1}
                          showValue
                          valueFormatter={(v) => `${v}px`}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Color</label>
                        <ColorPicker
                          value={shadow.color || 'rgba(0,0,0,0.3)'}
                          onChange={(color) => handleShadowChange(index, { color })}
                          size="sm"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Opacity</label>
                        <Slider
                          value={shadow.opacity || 1}
                          onChange={(value) => handleShadowChange(index, { opacity: value })}
                          min={0}
                          max={1}
                          step={0.01}
                          showValue
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ThemeEditorPage;
