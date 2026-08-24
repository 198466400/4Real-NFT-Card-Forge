import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
import { ColorPicker } from '../ColorPicker';
import { Slider } from '../Slider';
import { Card } from '../Card';
import { LoadingScreen } from '../LoadingScreen';
import { toast } from '../Toast';
import type { CardTemplate, CardLayout, BackgroundConfig, BorderConfig, TextStyles, CardLayer } from '../../types';

export interface TemplateEditorProps {
  templates: CardTemplate[];
  setTemplates: (templates: CardTemplate[]) => void;
  onClose?: () => void;
  className?: string;
}

const layoutOptions: { value: CardLayout; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'wide', label: 'Wide' },
  { value: 'tall', label: 'Tall' }
];

const backgroundTypeOptions: { value: BackgroundConfig['type']; label: string }[] = [
  { value: 'solid', label: 'Solid Color' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'image', label: 'Image' },
  { value: 'pattern', label: 'Pattern' }
];

const borderTypeOptions: { value: BorderConfig['type']; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'image', label: 'Image' },
  { value: 'glow', label: 'Glow' }
];

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  templates,
  setTemplates,
  onClose,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'background' | 'border' | 'text' | 'layers'>('basic');

  // Load first template or create new
  useEffect(() => {
    if (templates.length > 0) {
      setSelectedTemplate(templates[0]);
    } else {
      const newTemplate: CardTemplate = {
        id: `template-${Date.now()}`,
        name: 'New Template',
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
      };
      setTemplates([newTemplate]);
      setSelectedTemplate(newTemplate);
    }
    setIsLoading(false);
  }, [templates, setTemplates]);

  // Update template
  const updateTemplate = useCallback((updates: Partial<CardTemplate>) => {
    if (!selectedTemplate) return;
    
    setSelectedTemplate(prev => {
      if (!prev) return null;
      const newTemplate = { ...prev, ...updates };
      
      // Update in templates array
      const newTemplates = templates.map(t => t.id === newTemplate.id ? newTemplate : t);
      setTemplates(newTemplates);
      
      return newTemplate;
    });
  }, [selectedTemplate, templates, setTemplates]);

  // Create new template
  const handleCreateNew = useCallback(() => {
    const newTemplate: CardTemplate = {
      id: `template-${Date.now()}`,
      name: 'New Template',
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
    };
    
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
    toast.success('New template created');
  }, [templates, setTemplates]);

  // Delete template
  const handleDelete = useCallback(() => {
    if (!selectedTemplate) return;
    
    if (window.confirm(`Are you sure you want to delete "${selectedTemplate.name}"?`)) {
      const newTemplates = templates.filter(t => t.id !== selectedTemplate.id);
      setTemplates(newTemplates);
      
      if (newTemplates.length > 0) {
        setSelectedTemplate(newTemplates[0]);
      } else {
        setSelectedTemplate(null);
      }
      
      toast.success('Template deleted');
    }
  }, [selectedTemplate, templates, setTemplates]);

  // Save template
  const handleSave = useCallback(() => {
    if (!selectedTemplate) return;
    toast.success('Template saved');
  }, [selectedTemplate]);

  // Duplicate template
  const handleDuplicate = useCallback(() => {
    if (!selectedTemplate) return;
    
    const duplicated: CardTemplate = {
      ...selectedTemplate,
      id: `template-${Date.now()}`,
      name: `${selectedTemplate.name} (Copy)`
    };
    
    setTemplates([...templates, duplicated]);
    setSelectedTemplate(duplicated);
    toast.success('Template duplicated');
  }, [selectedTemplate, templates, setTemplates]);

  // Add layer
  const handleAddLayer = useCallback(() => {
    if (!selectedTemplate) return;
    
    const newLayer: CardLayer = {
      id: `layer-${Date.now()}`,
      type: 'image',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      zIndex: selectedTemplate.layers.length,
      visible: true,
      opacity: 1
    };
    
    updateTemplate({
      layers: [...selectedTemplate.layers, newLayer]
    });
    
    toast.success('Layer added');
  }, [selectedTemplate, updateTemplate]);

  // Tab sections
  const tabs = [
    { id: 'basic', label: 'Basic', icon: '⚙️' },
    { id: 'background', label: 'Background', icon: '🎨' },
    { id: 'border', label: 'Border', icon: '🟫' },
    { id: 'text', label: 'Text Styles', icon: '📝' },
    { id: 'layers', label: 'Layers', icon: '📄' }
  ];

  if (isLoading) {
    return <LoadingScreen message="Loading template editor..." />;
  }

  if (!selectedTemplate) {
    return (
      <div className="template-editor-empty">
        <h3>No Templates Available</h3>
        <p>Create a new template to get started</p>
        <Button variant="primary" onClick={handleCreateNew}>
          Create New Template
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className={`template-editor ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div 
        className="editor-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="header-left">
          <Input
            value={selectedTemplate.name}
            onChange={(e) => updateTemplate({ name: e.target.value })}
            placeholder="Template Name"
            className="template-name-input"
            size="lg"
          />
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

      {/* Template Selection */}
      <motion.div 
        className="template-selection"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="templates-list">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              className={`template-item ${selectedTemplate.id === template.id ? 'selected' : ''}`}
              onClick={() => setSelectedTemplate(template)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="template-name">{template.name}</span>
              <span className="template-layout">{template.layout}</span>
            </motion.div>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={handleCreateNew} leftIcon="+">
          New Template
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
          {activeTab === 'basic' && (
            <BasicSettings 
              template={selectedTemplate} 
              updateTemplate={updateTemplate}
            />
          )}
          
          {activeTab === 'background' && (
            <BackgroundSettings 
              template={selectedTemplate} 
              updateTemplate={updateTemplate}
            />
          )}
          
          {activeTab === 'border' && (
            <BorderSettings 
              template={selectedTemplate} 
              updateTemplate={updateTemplate}
            />
          )}
          
          {activeTab === 'text' && (
            <TextSettings 
              template={selectedTemplate} 
              updateTemplate={updateTemplate}
            />
          )}
          
          {activeTab === 'layers' && (
            <LayersSettings 
              template={selectedTemplate} 
              updateTemplate={updateTemplate}
              onAddLayer={handleAddLayer}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Basic Settings Component
interface SettingsProps {
  template: CardTemplate;
  updateTemplate: (updates: Partial<CardTemplate>) => void;
}

const BasicSettings: React.FC<SettingsProps> = ({ template, updateTemplate }) => {
  return (
    <Card className="settings-card">
      <Card.Header border={false} padding="lg">
        <h3>Basic Settings</h3>
      </Card.Header>
      <Card.Body padding="lg">
        <div className="settings-grid">
          <div className="form-group">
            <label>Layout</label>
            <Select
              value={template.layout}
              onChange={(e) => updateTemplate({ layout: e.target.value as CardLayout })}
              options={layoutOptions}
              size="md"
            />
          </div>
          
          <div className="form-group">
            <label>Width (px)</label>
            <Slider
              value={template.dimensions.width}
              onChange={(value) => updateTemplate({
                dimensions: { ...template.dimensions, width: value }
              })}
              min={500}
              max={5000}
              step={10}
              showValue
            />
          </div>
          
          <div className="form-group">
            <label>Height (px)</label>
            <Slider
              value={template.dimensions.height}
              onChange={(value) => updateTemplate({
                dimensions: { ...template.dimensions, height: value }
              })}
              min={500}
              max={5000}
              step={10}
              showValue
            />
          </div>
          
          <div className="form-group full-width">
            <label>Description</label>
            <Input
              value={template.name}
              onChange={(e) => updateTemplate({ name: e.target.value })}
              placeholder="Template description"
              multiline
              rows={3}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// Background Settings Component
const BackgroundSettings: React.FC<SettingsProps> = ({ template, updateTemplate }) => {
  return (
    <Card className="settings-card">
      <Card.Header border={false} padding="lg">
        <h3>Background Settings</h3>
      </Card.Header>
      <Card.Body padding="lg">
        <div className="settings-grid">
          <div className="form-group">
            <label>Background Type</label>
            <Select
              value={template.background.type}
              onChange={(e) => updateTemplate({
                background: { ...template.background, type: e.target.value as BackgroundConfig['type'] }
              })}
              options={backgroundTypeOptions}
              size="md"
            />
          </div>
          
          {template.background.type === 'solid' && (
            <div className="form-group full-width">
              <label>Background Color</label>
              <ColorPicker
                value={template.background.color || '#000000'}
                onChange={(color) => updateTemplate({
                  background: { ...template.background, color }
                })}
              />
            </div>
          )}
          
          {template.background.type === 'gradient' && (
            <>
              <div className="form-group full-width">
                <label>Gradient Colors</label>
                <div className="color-picker-grid">
                  {(template.background.colors || ['#6366f1', '#8b5cf6']).map((color, index) => (
                    <ColorPicker
                      key={index}
                      value={color}
                      onChange={(newColor) => {
                        const colors = [...(template.background.colors || ['#6366f1', '#8b5cf6'])];
                        colors[index] = newColor;
                        updateTemplate({ background: { ...template.background, colors } });
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Opacity</label>
                <Slider
                  value={template.background.opacity ?? 1}
                  onChange={(value) => updateTemplate({
                    background: { ...template.background, opacity: value }
                  })}
                  min={0}
                  max={1}
                  step={0.01}
                  showValue
                />
              </div>
            </>
          )}
          
          {template.background.type === 'image' && (
            <div className="form-group full-width">
              <label>Background Image URL</label>
              <Input
                value={template.background.image || ''}
                onChange={(e) => updateTemplate({
                  background: { ...template.background, image: e.target.value }
                })}
                placeholder="Enter image URL"
              />
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

// Border Settings Component
const BorderSettings: React.FC<SettingsProps> = ({ template, updateTemplate }) => {
  return (
    <Card className="settings-card">
      <Card.Header border={false} padding="lg">
        <h3>Border Settings</h3>
      </Card.Header>
      <Card.Body padding="lg">
        <div className="settings-grid">
          <div className="form-group">
            <label>Border Type</label>
            <Select
              value={template.border.type}
              onChange={(e) => updateTemplate({
                border: { ...template.border, type: e.target.value as BorderConfig['type'] }
              })}
              options={borderTypeOptions}
              size="md"
            />
          </div>
          
          <div className="form-group">
            <label>Border Color</label>
            <ColorPicker
              value={template.border.color || '#6366f1'}
              onChange={(color) => updateTemplate({
                border: { ...template.border, color }
              })}
            />
          </div>
          
          <div className="form-group">
            <label>Border Width</label>
            <Slider
              value={template.border.width || 4}
              onChange={(value) => updateTemplate({
                border: { ...template.border, width: value }
              })}
              min={0}
              max={50}
              step={1}
              showValue
              valueFormatter={(v) => `${v}px`}
            />
          </div>
          
          <div className="form-group">
            <label>Border Radius</label>
            <Slider
              value={template.border.radius || 12}
              onChange={(value) => updateTemplate({
                border: { ...template.border, radius: value }
              })}
              min={0}
              max={100}
              step={1}
              showValue
              valueFormatter={(v) => `${v}px`}
            />
          </div>
          
          {template.border.type === 'glow' && (
            <>
              <div className="form-group">
                <label>Glow Color</label>
                <ColorPicker
                  value={template.border.glow?.color || '#6366f1'}
                  onChange={(color) => updateTemplate({
                    border: {
                      ...template.border,
                      glow: { ...template.border.glow, color }
                    }
                  })}
                />
              </div>
              <div className="form-group">
                <label>Glow Intensity</label>
                <Slider
                  value={template.border.glow?.intensity || 0.5}
                  onChange={(value) => updateTemplate({
                    border: {
                      ...template.border,
                      glow: { ...template.border.glow, intensity: value }
                    }
                  })}
                  min={0}
                  max={2}
                  step={0.01}
                  showValue
                />
              </div>
              <div className="form-group">
                <label>Glow Spread</label>
                <Slider
                  value={template.border.glow?.spread || 10}
                  onChange={(value) => updateTemplate({
                    border: {
                      ...template.border,
                      glow: { ...template.border.glow, spread: value }
                    }
                  })}
                  min={0}
                  max={100}
                  step={1}
                  showValue
                  valueFormatter={(v) => `${v}px`}
                />
              </div>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

// Text Settings Component
const TextSettings: React.FC<SettingsProps> = ({ template, updateTemplate }) => {
  const handleTextStyleChange = (field: keyof TextStyles, property: keyof TextStyles[string], value: any) => {
    updateTemplate({
      textStyles: {
        ...template.textStyles,
        [field]: {
          ...template.textStyles[field],
          [property]: value
        }
      }
    });
  };

  return (
    <Card className="settings-card">
      <Card.Header border={false} padding="lg">
        <h3>Text Styles</h3>
      </Card.Header>
      <Card.Body padding="lg">
        <div className="text-styles-grid">
          {(['title', 'subtitle', 'description', 'stats', 'label', 'value'] as Array<keyof TextStyles>).map((field) => (
            <Card key={field} className="text-style-card">
              <Card.Header border={false} padding="md">
                <h4>{field.charAt(0).toUpperCase() + field.slice(1)}</h4>
              </Card.Header>
              <Card.Body padding="md">
                <div className="form-group">
                  <label>Font Family</label>
                  <Select
                    value={template.textStyles[field].fontFamily}
                    onChange={(e) => handleTextStyleChange(field, 'fontFamily', e.target.value)}
                    options={[
                      { value: 'Inter', label: 'Inter' },
                      { value: 'Space Grotesk', label: 'Space Grotesk' },
                      { value: 'JetBrains Mono', label: 'JetBrains Mono' },
                      { value: 'Arial', label: 'Arial' },
                      { value: 'Helvetica', label: 'Helvetica' }
                    ]}
                    size="sm"
                  />
                </div>
                
                <div className="form-group">
                  <label>Font Size</label>
                  <Slider
                    value={template.textStyles[field].fontSize || 16}
                    onChange={(value) => handleTextStyleChange(field, 'fontSize', value)}
                    min={8}
                    max={72}
                    step={1}
                    showValue
                    valueFormatter={(v) => `${v}px`}
                  />
                </div>
                
                <div className="form-group">
                  <label>Font Weight</label>
                  <Select
                    value={template.textStyles[field].fontWeight?.toString() || '400'}
                    onChange={(e) => handleTextStyleChange(field, 'fontWeight', parseInt(e.target.value))}
                    options={[
                      { value: '300', label: 'Light' },
                      { value: '400', label: 'Normal' },
                      { value: '500', label: 'Medium' },
                      { value: '600', label: 'SemiBold' },
                      { value: '700', label: 'Bold' },
                      { value: '900', label: 'Black' }
                    ]}
                    size="sm"
                  />
                </div>
                
                <div className="form-group">
                  <label>Color</label>
                  <ColorPicker
                    value={template.textStyles[field].color || '#ffffff'}
                    onChange={(color) => handleTextStyleChange(field, 'color', color)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Text Align</label>
                  <Select
                    value={template.textStyles[field].textAlign || 'center'}
                    onChange={(e) => handleTextStyleChange(field, 'textAlign', e.target.value as 'left' | 'center' | 'right')}
                    options={[
                      { value: 'left', label: 'Left' },
                      { value: 'center', label: 'Center' },
                      { value: 'right', label: 'Right' }
                    ]}
                    size="sm"
                  />
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

// Layers Settings Component
interface LayersSettingsProps extends SettingsProps {
  onAddLayer: () => void;
}

const LayersSettings: React.FC<LayersSettingsProps> = ({ template, updateTemplate, onAddLayer }) => {
  const handleLayerUpdate = (index: number, updates: Partial<CardLayer>) => {
    const newLayers = [...template.layers];
    newLayers[index] = { ...newLayers[index], ...updates };
    updateTemplate({ layers: newLayers });
  };

  const handleLayerDelete = (index: number) => {
    const newLayers = [...template.layers];
    newLayers.splice(index, 1);
    updateTemplate({ layers: newLayers });
  };

  const handleLayerMove = (index: number, direction: 'up' | 'down') => {
    const newLayers = [...template.layers];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newLayers.length) {
      // Swap layers
      [newLayers[index], newLayers[newIndex]] = [newLayers[newIndex], newLayers[index]];
      
      // Update zIndex
      newLayers[index].zIndex = newIndex;
      newLayers[newIndex].zIndex = index;
      
      updateTemplate({ layers: newLayers });
    }
  };

  return (
    <Card className="settings-card">
      <Card.Header border={false} padding="lg">
        <h3>Layers</h3>
        <Button variant="secondary" size="sm" onClick={onAddLayer} leftIcon="+">
          Add Layer
        </Button>
      </Card.Header>
      <Card.Body padding="lg">
        {template.layers.length === 0 ? (
          <div className="empty-layers">
            <p>No layers yet. Add a layer to get started.</p>
          </div>
        ) : (
          <div className="layers-list">
            {template.layers.map((layer, index) => (
              <Card key={layer.id} className="layer-card">
                <Card.Header border={false} padding="md">
                  <div className="layer-header">
                    <div className="layer-info">
                      <span className="layer-index">{index + 1}</span>
                      <Select
                        value={layer.type}
                        onChange={(e) => handleLayerUpdate(index, { type: e.target.value as CardLayer['type'] })}
                        options={[
                          { value: 'image', label: 'Image' },
                          { value: 'text', label: 'Text' },
                          { value: 'shape', label: 'Shape' },
                          { value: 'effect', label: 'Effect' },
                          { value: 'character', label: 'Character' }
                        ]}
                        size="sm"
                      />
                      <Input
                        value={layer.id}
                        onChange={(e) => handleLayerUpdate(index, { id: e.target.value })}
                        placeholder="Layer ID"
                        size="sm"
                        className="layer-id-input"
                      />
                    </div>
                    <div className="layer-actions">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleLayerMove(index, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleLayerMove(index, 'down')}
                        disabled={index === template.layers.length - 1}
                      >
                        ↓
                      </Button>
                      <Button 
                        variant="danger" 
                        size="icon" 
                        onClick={() => handleLayerDelete(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body padding="md">
                  <div className="layer-settings">
                    <div className="form-group">
                      <label>Position X</label>
                      <Slider
                        value={layer.position.x}
                        onChange={(value) => handleLayerUpdate(index, { position: { ...layer.position, x: value } })}
                        min={0}
                        max={template.dimensions.width}
                        step={1}
                        showValue
                        valueFormatter={(v) => `${v}px`}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Position Y</label>
                      <Slider
                        value={layer.position.y}
                        onChange={(value) => handleLayerUpdate(index, { position: { ...layer.position, y: value } })}
                        min={0}
                        max={template.dimensions.height}
                        step={1}
                        showValue
                        valueFormatter={(v) => `${v}px`}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Width</label>
                      <Slider
                        value={layer.size.width}
                        onChange={(value) => handleLayerUpdate(index, { size: { ...layer.size, width: value } })}
                        min={1}
                        max={template.dimensions.width}
                        step={1}
                        showValue
                        valueFormatter={(v) => `${v}px`}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Height</label>
                      <Slider
                        value={layer.size.height}
                        onChange={(value) => handleLayerUpdate(index, { size: { ...layer.size, height: value } })}
                        min={1}
                        max={template.dimensions.height}
                        step={1}
                        showValue
                        valueFormatter={(v) => `${v}px`}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Rotation</label>
                      <Slider
                        value={layer.rotation || 0}
                        onChange={(value) => handleLayerUpdate(index, { rotation: value })}
                        min={0}
                        max={360}
                        step={1}
                        showValue
                        valueFormatter={(v) => `${v}°`}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Opacity</label>
                      <Slider
                        value={layer.opacity ?? 1}
                        onChange={(value) => handleLayerUpdate(index, { opacity: value })}
                        min={0}
                        max={1}
                        step={0.01}
                        showValue
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Z-Index</label>
                      <Slider
                        value={layer.zIndex}
                        onChange={(value) => handleLayerUpdate(index, { zIndex: value })}
                        min={0}
                        max={template.layers.length}
                        step={1}
                        showValue
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={layer.visible}
                          onChange={(e) => handleLayerUpdate(index, { visible: e.target.checked })}
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TemplateEditor;
