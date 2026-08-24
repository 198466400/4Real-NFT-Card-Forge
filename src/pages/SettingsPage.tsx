import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore, useUIActions } from '../stores/useStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Switch } from '../components/Switch';
import { Slider } from '../components/Slider';
import { Card } from '../components/Card';
import { toast } from '../components/Toast';

export interface SettingsPageProps {}

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System Preference' }
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' }
];

const qualityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'ultra', label: 'Ultra' }
];

export const SettingsPage: React.FC<SettingsPageProps> = () => {
  const { settings, preferences, setSettings, setPreferences } = useStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'editor' | 'performance' | 'features'>('general');

  // Sync with store
  useEffect(() => {
    setLocalSettings(settings);
    setLocalPreferences(preferences);
  }, [settings, preferences]);

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      setSettings(localSettings);
      setPreferences(localPreferences);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset settings
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setLocalSettings({
        language: 'en',
        theme: 'dark',
        performance: {
          maxTextureSize: 2048,
          maxParticles: 1000,
          quality: 'high'
        },
        storage: {
          autoSave: true,
          saveInterval: 30,
          localStorage: true
        },
        features: {
          experimental: false,
          analytics: false,
          updates: true
        }
      });
      setLocalPreferences({
        editor: {
          theme: 'dark',
          layout: 'grid',
          snapToGrid: true,
          gridSize: 8,
          showGuides: true
        },
        rendering: {
          quality: 'high',
          format: 'png',
          resolution: { width: 1000, height: 1500 }
        }
      });
    }
  };

  // Section navigation
  const sections = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'editor', label: 'Editor', icon: '🎨' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'features', label: 'Features', icon: '🚀' }
  ];

  return (
    <motion.div
      className="settings-page"
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
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Configure your NFT Card Forge experience
          </p>
        </div>
        <div className="header-right">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
          >
            Reset to Defaults
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSave}
            loading={isSaving}
          >
            Save Settings
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="settings-content">
        {/* Sidebar Navigation */}
        <motion.div 
          className="settings-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Configuration</h3>
          <nav className="settings-nav">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                type="button"
                className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.label}</span>
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="settings-main"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* General Settings */}
              {activeSection === 'general' && (
                <Card className="settings-section">
                  <Card.Header border={false} padding="lg">
                    <h2>General Settings</h2>
                    <p className="section-description">
                      Configure basic application settings
                    </p>
                  </Card.Header>
                  
                  <Card.Body padding="lg">
                    <div className="settings-grid">
                      <div className="form-group">
                        <label>Language</label>
                        <Select
                          value={localSettings.language}
                          onChange={(e) => setLocalSettings(prev => ({ ...prev, language: e.target.value }))}
                          options={languageOptions}
                          size="md"
                        />
                      </div>

                      <div className="form-group">
                        <label>Theme</label>
                        <Select
                          value={localSettings.theme}
                          onChange={(e) => setLocalSettings(prev => ({ ...prev, theme: e.target.value as any }))}
                          options={themeOptions}
                          size="md"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <Switch
                            checked={localSettings.storage.autoSave}
                            onChange={(checked) => setLocalSettings(prev => ({
                              ...prev,
                              storage: { ...prev.storage, autoSave: checked }
                            }))}
                          />
                          <span>Auto-save changes</span>
                        </label>
                        <p className="form-hint">
                          Automatically save your work as you make changes
                        </p>
                      </div>

                      <div className="form-group">
                        <label>Auto-save Interval (seconds)</label>
                        <Slider
                          value={localSettings.storage.saveInterval}
                          onChange={(value) => setLocalSettings(prev => ({
                            ...prev,
                            storage: { ...prev.storage, saveInterval: value }
                          }))}
                          min={10}
                          max={300}
                          step={10}
                          showValue
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Editor Settings */}
              {activeSection === 'editor' && (
                <Card className="settings-section">
                  <Card.Header border={false} padding="lg">
                    <h2>Editor Settings</h2>
                    <p className="section-description">
                      Customize your editing experience
                    </p>
                  </Card.Header>
                  
                  <Card.Body padding="lg">
                    <div className="settings-grid">
                      <div className="form-group">
                        <label>Editor Theme</label>
                        <Select
                          value={localPreferences.editor.theme}
                          onChange={(e) => setLocalPreferences(prev => ({
                            ...prev,
                            editor: { ...prev.editor, theme: e.target.value as any }
                          }))}
                          options={themeOptions}
                          size="md"
                        />
                      </div>

                      <div className="form-group">
                        <label>Layout</label>
                        <Select
                          value={localPreferences.editor.layout}
                          onChange={(e) => setLocalPreferences(prev => ({
                            ...prev,
                            editor: { ...prev.editor, layout: e.target.value as any }
                          }))}
                          options={[
                            { value: 'grid', label: 'Grid' },
                            { value: 'list', label: 'List' },
                            { value: 'compact', label: 'Compact' }
                          ]}
                          size="md"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <Switch
                            checked={localPreferences.editor.snapToGrid}
                            onChange={(checked) => setLocalPreferences(prev => ({
                              ...prev,
                              editor: { ...prev.editor, snapToGrid: checked }
                            }))}
                          />
                          <span>Snap to Grid</span>
                        </label>
                        <p className="form-hint">
                          Snap elements to the grid for precise alignment
                        </p>
                      </div>

                      <div className="form-group">
                        <label>Grid Size</label>
                        <Slider
                          value={localPreferences.editor.gridSize}
                          onChange={(value) => setLocalPreferences(prev => ({
                            ...prev,
                            editor: { ...prev.editor, gridSize: value }
                          }))}
                          min={4}
                          max={32}
                          step={1}
                          showValue
                          valueFormatter={(v) => `${v}px`}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <Switch
                            checked={localPreferences.editor.showGuides}
                            onChange={(checked) => setLocalPreferences(prev => ({
                              ...prev,
                              editor: { ...prev.editor, showGuides: checked }
                            }))}
                          />
                          <span>Show Guides</span>
                        </label>
                        <p className="form-hint">
                          Display alignment guides when moving elements
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Performance Settings */}
              {activeSection === 'performance' && (
                <Card className="settings-section">
                  <Card.Header border={false} padding="lg">
                    <h2>Performance Settings</h2>
                    <p className="section-description">
                      Optimize for your device's capabilities
                    </p>
                  </Card.Header>
                  
                  <Card.Body padding="lg">
                    <div className="settings-grid">
                      <div className="form-group">
                        <label>Rendering Quality</label>
                        <Select
                          value={localSettings.performance.quality}
                          onChange={(e) => setLocalSettings(prev => ({
                            ...prev,
                            performance: { ...prev.performance, quality: e.target.value as any }
                          }))}
                          options={qualityOptions}
                          size="md"
                        />
                      </div>

                      <div className="form-group">
                        <label>Max Texture Size</label>
                        <Select
                          value={localSettings.performance.maxTextureSize.toString()}
                          onChange={(e) => setLocalSettings(prev => ({
                            ...prev,
                            performance: { ...prev.performance, maxTextureSize: parseInt(e.target.value) }
                          }))}
                          options={[
                            { value: '512', label: '512px' },
                            { value: '1024', label: '1024px' },
                            { value: '2048', label: '2048px' },
                            { value: '4096', label: '4096px' },
                            { value: '8192', label: '8192px' }
                          ]}
                          size="md"
                        />
                      </div>

                      <div className="form-group">
                        <label>Max Particles</label>
                        <Slider
                          value={localSettings.performance.maxParticles}
                          onChange={(value) => setLocalSettings(prev => ({
                            ...prev,
                            performance: { ...prev.performance, maxParticles: value }
                          }))}
                          min={100}
                          max={5000}
                          step={100}
                          showValue
                        />
                      </div>

                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <Switch
                            checked={localSettings.storage.localStorage}
                            onChange={(checked) => setLocalSettings(prev => ({
                              ...prev,
                              storage: { ...prev.storage, localStorage: checked }
                            }))}
                          />
                          <span>Use Local Storage</span>
                        </label>
                        <p className="form-hint">
                          Store data in browser's local storage for persistence
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Features Settings */}
              {activeSection === 'features' && (
                <Card className="settings-section">
                  <Card.Header border={false} padding="lg">
                    <h2>Feature Flags</h2>
                    <p className="section-description">
                      Enable or disable experimental features
                    </p>
                  </Card.Header>
                  
                  <Card.Body padding="lg">
                    <div className="settings-grid">
                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <Switch
                            checked={localSettings.features.experimental}
                            onChange={(checked) => setLocalSettings(prev => ({
                              ...prev,
                              features: { ...prev.features, experimental: checked }
                            }))}
                          />
                          <span>Experimental Features</span>
                        </label>
                        <p className="form-hint">
                          Enable experimental features that may be unstable
                        </p>
                      </div>

                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <Switch
                            checked={localSettings.features.analytics}
                            onChange={(checked) => setLocalSettings(prev => ({
                              ...prev,
                              features: { ...prev.features, analytics: checked }
                            }))}
                          />
                          <span>Usage Analytics</span>
                        </label>
                        <p className="form-hint">
                          Help improve the application by sending anonymous usage data
                        </p>
                      </div>

                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <Switch
                            checked={localSettings.features.updates}
                            onChange={(checked) => setLocalSettings(prev => ({
                              ...prev,
                              features: { ...prev.features, updates: checked }
                            }))}
                          />
                          <span>Automatic Updates</span>
                        </label>
                        <p className="form-hint">
                          Automatically check for and install updates
                        </p>
                      </div>

                      <div className="form-group full-width">
                        <label className="checkbox-label">
                          <Switch
                            checked={false}
                            onChange={() => {}}
                            disabled
                          />
                          <span>Agent System (Coming Soon)</span>
                        </label>
                        <p className="form-hint">
                          Enable the AI-powered agent system for smart assistance
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
