// =============================================================================
// NFT Card Forge - Storage Utilities
// =============================================================================

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type {
  NFTCard,
  Character3D,
  CardTemplate,
  CardTheme,
  AppSettings,
  UserPreferences
} from '../types';

// Define database schema
interface NFTForgeDB extends DBSchema {
  cards: {
    key: string;
    value: NFTCard;
    indexes: { title: string; creator: string; collection: string; createdAt: Date };
  };
  characters: {
    key: string;
    value: Character3D;
    indexes: { name: string; createdAt: Date };
  };
  templates: {
    key: string;
    value: CardTemplate;
    indexes: { name: string };
  };
  themes: {
    key: string;
    value: CardTheme;
    indexes: { name: string };
  };
  settings: {
    key: string;
    value: AppSettings;
  };
  preferences: {
    key: string;
    value: UserPreferences;
  };
}

// Database name and version
const DB_NAME = '4RealNFTForgeDB';
const DB_VERSION = 1;

// Database instance
let dbPromise: Promise<IDBPDatabase<NFTForgeDB>> | null = null;

/**
 * Initialize the database
 */
export const initDB = async (): Promise<IDBPDatabase<NFTForgeDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<NFTForgeDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // Create stores if they don't exist
        if (oldVersion < 1) {
          // Cards store
          if (!db.objectStoreNames.contains('cards')) {
            const store = db.createObjectStore('cards', { keyPath: 'id' });
            store.createIndex('title', 'title', { unique: false });
            store.createIndex('creator', 'creator', { unique: false });
            store.createIndex('collection', 'collection', { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
          }

          // Characters store
          if (!db.objectStoreNames.contains('characters')) {
            const store = db.createObjectStore('characters', { keyPath: 'id' });
            store.createIndex('name', 'name', { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
          }

          // Templates store
          if (!db.objectStoreNames.contains('templates')) {
            const store = db.createObjectStore('templates', { keyPath: 'id' });
            store.createIndex('name', 'name', { unique: false });
          }

          // Themes store
          if (!db.objectStoreNames.contains('themes')) {
            const store = db.createObjectStore('themes', { keyPath: 'id' });
            store.createIndex('name', 'name', { unique: false });
          }

          // Settings store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'id' });
          }

          // Preferences store
          if (!db.objectStoreNames.contains('preferences')) {
            db.createObjectStore('preferences', { keyPath: 'id' });
          }
        }
      }
    });
  }

  return dbPromise;
};

/**
 * Get database instance
 */
export const getDB = async (): Promise<IDBPDatabase<NFTForgeDB>> => {
  if (!dbPromise) {
    await initDB();
  }
  return dbPromise!;
};

/**
 * Default data for new installations
 */
const getDefaultTemplates = (): CardTemplate[] => [
  {
    id: 'default',
    name: 'Default',
    layout: 'standard',
    dimensions: { width: 1000, height: 1500 },
    layers: [
      {
        id: 'background',
        type: 'image',
        position: { x: 0, y: 0 },
        size: { width: 1000, height: 1500 },
        zIndex: 0,
        visible: true,
        content: '',
        opacity: 1
      },
      {
        id: 'title',
        type: 'text',
        position: { x: 500, y: 1300 },
        size: { width: 900, height: 100 },
        zIndex: 2,
        visible: true,
        content: 'Card Title',
        style: {
          fontFamily: 'Inter',
          fontSize: 32,
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center' as const,
          letterSpacing: 1
        },
        opacity: 1
      },
      {
        id: 'subtitle',
        type: 'text',
        position: { x: 500, y: 1250 },
        size: { width: 900, height: 50 },
        zIndex: 2,
        visible: true,
        content: 'Card Subtitle',
        style: {
          fontFamily: 'Inter',
          fontSize: 18,
          fontWeight: 400,
          color: '#a0a0a0',
          textAlign: 'center' as const
        },
        opacity: 1
      },
      {
        id: 'description',
        type: 'text',
        position: { x: 500, y: 1100 },
        size: { width: 900, height: 200 },
        zIndex: 2,
        visible: true,
        content: 'This is a description of the NFT card. It can contain multiple lines of text.',
        style: {
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: 400,
          color: '#808080',
          textAlign: 'center' as const,
          lineHeight: 1.5
        },
        opacity: 1
      }
    ],
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
  {
    id: 'minimal',
    name: 'Minimal',
    layout: 'standard',
    dimensions: { width: 1000, height: 1500 },
    layers: [
      {
        id: 'background',
        type: 'image',
        position: { x: 0, y: 0 },
        size: { width: 1000, height: 1500 },
        zIndex: 0,
        visible: true,
        content: '',
        opacity: 1
      },
      {
        id: 'title',
        type: 'text',
        position: { x: 500, y: 1400 },
        size: { width: 900, height: 50 },
        zIndex: 2,
        visible: true,
        content: 'Card Title',
        style: {
          fontFamily: 'Space Grotesk',
          fontSize: 28,
          fontWeight: 600,
          color: '#000000',
          textAlign: 'center' as const
        },
        opacity: 1
      }
    ],
    background: { type: 'solid', color: '#ffffff', opacity: 1 },
    border: { type: 'solid', color: '#e2e8f0', width: 1, radius: 0 },
    textStyles: {
      title: { fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 600, color: '#000000', textAlign: 'center' },
      subtitle: { fontFamily: 'Inter', fontSize: 16, fontWeight: 400, color: '#666666', textAlign: 'center' },
      description: { fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#888888', textAlign: 'center', lineHeight: 1.5 },
      stats: { fontFamily: 'Inter', fontSize: 16, fontWeight: 600, color: '#000000', textAlign: 'center' },
      label: { fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: '#666666', textAlign: 'center', textTransform: 'uppercase' },
      value: { fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#000000', textAlign: 'center' }
    }
  },
  {
    id: 'gradient',
    name: 'Gradient',
    layout: 'standard',
    dimensions: { width: 1000, height: 1500 },
    layers: [
      {
        id: 'background',
        type: 'image',
        position: { x: 0, y: 0 },
        size: { width: 1000, height: 1500 },
        zIndex: 0,
        visible: true,
        content: '',
        opacity: 1
      },
      {
        id: 'title',
        type: 'text',
        position: { x: 500, y: 1300 },
        size: { width: 900, height: 100 },
        zIndex: 2,
        visible: true,
        content: 'Card Title',
        style: {
          fontFamily: 'Inter',
          fontSize: 36,
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center' as const,
          letterSpacing: 2,
          textTransform: 'uppercase' as const
        },
        opacity: 1
      }
    ],
    background: { type: 'gradient', colors: ['#6366f1', '#8b5cf6', '#ec4899'], opacity: 1 },
    border: { type: 'glow', color: '#ffffff', width: 0, radius: 16, glow: { color: '#ffffff', intensity: 0.5, spread: 10 } },
    textStyles: {
      title: { fontFamily: 'Inter', fontSize: 36, fontWeight: 800, color: '#ffffff', textAlign: 'center', letterSpacing: 2, textTransform: 'uppercase' },
      subtitle: { fontFamily: 'Inter', fontSize: 18, fontWeight: 400, color: '#e0e0e0', textAlign: 'center' },
      description: { fontFamily: 'Inter', fontSize: 14, fontWeight: 400, color: '#c0c0c0', textAlign: 'center', lineHeight: 1.5 },
      stats: { fontFamily: 'Inter', fontSize: 16, fontWeight: 600, color: '#ffffff', textAlign: 'center' },
      label: { fontFamily: 'Inter', fontSize: 12, fontWeight: 500, color: '#a0a0a0', textAlign: 'center', textTransform: 'uppercase' },
      value: { fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#ffffff', textAlign: 'center' }
    }
  }
];

const getDefaultThemes = (): CardTheme[] => [
  {
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
  {
    id: 'light',
    name: 'Light Theme',
    palette: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#ffffff',
      surface: '#f8fafc',
      text: { primary: '#0a0a0f', secondary: '#404040', disabled: '#808080' },
      border: '#e2e8f0',
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
    shadows: [{ name: 'sm', offset: { x: 0, y: 1 }, blur: 2, spread: 0, color: 'rgba(0,0,0,0.1)', opacity: 1 }],
    transitions: { duration: 0.2, timingFunction: 'ease', delay: 0 }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    palette: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      background: '#0a0a0f',
      surface: '#1a1a2e',
      text: { primary: '#ffffff', secondary: '#a0a0a0', disabled: '#606060' },
      border: '#00ffff',
      success: '#00ff00',
      warning: '#ffaa00',
      error: '#ff0000',
      info: '#00ffff'
    },
    typography: {
      fontFamily: 'Space Grotesk',
      fontSize: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
      fontWeight: { light: 300, normal: 400, medium: 500, bold: 700, black: 900 },
      lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.75, loose: 2 }
    },
    spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32 },
    borderRadius: 4,
    shadows: [
      { name: 'sm', offset: { x: 0, y: 1 }, blur: 2, spread: 0, color: 'rgba(0, 255, 255, 0.3)', opacity: 1 },
      { name: 'glow', offset: { x: 0, y: 0 }, blur: 20, spread: 0, color: 'rgba(0, 255, 255, 0.2)', opacity: 1 }
    ],
    transitions: { duration: 0.3, timingFunction: 'ease', delay: 0 }
  }
];

/**
 * Load initial data (templates, themes, etc.)
 */
export const loadInitialData = async (): Promise<{
  cards: NFTCard[];
  characters: Character3D[];
  templates: CardTemplate[];
  themes: CardTheme[];
}> => {
  try {
    const db = await getDB();
    
    // Check if templates exist
    const templates = await db.getAll('templates');
    if (templates.length === 0) {
      // Seed default templates
      const defaultTemplates = getDefaultTemplates();
      for (const template of defaultTemplates) {
        await db.add('templates', template);
      }
    }
    
    // Check if themes exist
    const themes = await db.getAll('themes');
    if (themes.length === 0) {
      // Seed default themes
      const defaultThemes = getDefaultThemes();
      for (const theme of defaultThemes) {
        await db.add('themes', theme);
      }
    }
    
    // Load all data
    const [loadedCards, loadedCharacters, loadedTemplates, loadedThemes] = await Promise.all([
      db.getAll('cards'),
      db.getAll('characters'),
      db.getAll('templates'),
      db.getAll('themes')
    ]);
    
    return {
      cards: loadedCards,
      characters: loadedCharacters,
      templates: loadedTemplates,
      themes: loadedThemes
    };
  } catch (error) {
    console.error('Failed to load initial data:', error);
    return {
      cards: [],
      characters: [],
      templates: getDefaultTemplates(),
      themes: getDefaultThemes()
    };
  }
};

/**
 * Card CRUD operations
 */
export const cardStorage = {
  getAll: async (): Promise<NFTCard[]> => {
    const db = await getDB();
    return db.getAll('cards');
  },

  getById: async (id: string): Promise<NFTCard | undefined> => {
    const db = await getDB();
    return db.get('cards', id);
  },

  create: async (card: NFTCard): Promise<string> => {
    const db = await getDB();
    await db.add('cards', card);
    return card.id;
  },

  update: async (id: string, updates: Partial<NFTCard>): Promise<void> => {
    const db = await getDB();
    const card = await db.get('cards', id);
    if (card) {
      await db.put('cards', { ...card, ...updates, updatedAt: new Date() });
    }
  },

  delete: async (id: string): Promise<void> => {
    const db = await getDB();
    await db.delete('cards', id);
  },

  // Search operations
  searchByTitle: async (query: string): Promise<NFTCard[]> => {
    const db = await getDB();
    return db.getAllFromIndex('cards', 'title', IDBKeyRange.bound(query, query + '\uffff'));
  },

  searchByCreator: async (creator: string): Promise<NFTCard[]> => {
    const db = await getDB();
    return db.getAllFromIndex('cards', 'creator', creator);
  },

  searchByCollection: async (collection: string): Promise<NFTCard[]> => {
    const db = await getDB();
    return db.getAllFromIndex('cards', 'collection', collection);
  }
};

/**
 * Character CRUD operations
 */
export const characterStorage = {
  getAll: async (): Promise<Character3D[]> => {
    const db = await getDB();
    return db.getAll('characters');
  },

  getById: async (id: string): Promise<Character3D | undefined> => {
    const db = await getDB();
    return db.get('characters', id);
  },

  create: async (character: Character3D): Promise<string> => {
    const db = await getDB();
    await db.add('characters', character);
    return character.id;
  },

  update: async (id: string, updates: Partial<Character3D>): Promise<void> => {
    const db = await getDB();
    const character = await db.get('characters', id);
    if (character) {
      await db.put('characters', { ...character, ...updates });
    }
  },

  delete: async (id: string): Promise<void> => {
    const db = await getDB();
    await db.delete('characters', id);
  },

  searchByName: async (query: string): Promise<Character3D[]> => {
    const db = await getDB();
    return db.getAllFromIndex('characters', 'name', IDBKeyRange.bound(query, query + '\uffff'));
  }
};

/**
 * Template CRUD operations
 */
export const templateStorage = {
  getAll: async (): Promise<CardTemplate[]> => {
    const db = await getDB();
    return db.getAll('templates');
  },

  getById: async (id: string): Promise<CardTemplate | undefined> => {
    const db = await getDB();
    return db.get('templates', id);
  },

  create: async (template: CardTemplate): Promise<string> => {
    const db = await getDB();
    await db.add('templates', template);
    return template.id;
  },

  update: async (id: string, updates: Partial<CardTemplate>): Promise<void> => {
    const db = await getDB();
    const template = await db.get('templates', id);
    if (template) {
      await db.put('templates', { ...template, ...updates });
    }
  },

  delete: async (id: string): Promise<void> => {
    const db = await getDB();
    await db.delete('templates', id);
  }
};

/**
 * Theme CRUD operations
 */
export const themeStorage = {
  getAll: async (): Promise<CardTheme[]> => {
    const db = await getDB();
    return db.getAll('themes');
  },

  getById: async (id: string): Promise<CardTheme | undefined> => {
    const db = await getDB();
    return db.get('themes', id);
  },

  create: async (theme: CardTheme): Promise<string> => {
    const db = await getDB();
    await db.add('themes', theme);
    return theme.id;
  },

  update: async (id: string, updates: Partial<CardTheme>): Promise<void> => {
    const db = await getDB();
    const theme = await db.get('themes', id);
    if (theme) {
      await db.put('themes', { ...theme, ...updates });
    }
  },

  delete: async (id: string): Promise<void> => {
    const db = await getDB();
    await db.delete('themes', id);
  }
};

/**
 * Settings operations
 */
export const settingsStorage = {
  get: async (): Promise<AppSettings | null> => {
    const db = await getDB();
    try {
      return await db.get('settings', 'app');
    } catch {
      return null;
    }
  },

  set: async (settings: AppSettings): Promise<void> => {
    const db = await getDB();
    await db.put('settings', settings, 'app');
  }
};

/**
 * Preferences operations
 */
export const preferencesStorage = {
  get: async (): Promise<UserPreferences | null> => {
    const db = await getDB();
    try {
      return await db.get('preferences', 'user');
    } catch {
      return null;
    }
  },

  set: async (preferences: UserPreferences): Promise<void> => {
    const db = await getDB();
    await db.put('preferences', preferences, 'user');
  }
};

/**
 * Export all data as JSON
 */
export const exportAllData = async (): Promise<string> => {
  const db = await getDB();
  
  const [cards, characters, templates, themes, settings, preferences] = await Promise.all([
    db.getAll('cards'),
    db.getAll('characters'),
    db.getAll('templates'),
    db.getAll('themes'),
    db.get('settings', 'app').catch(() => null),
    db.get('preferences', 'user').catch(() => null)
  ]);
  
  return JSON.stringify({
    version: DB_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      cards,
      characters,
      templates,
      themes,
      settings,
      preferences
    }
  }, null, 2);
};

/**
 * Import data from JSON
 */
export const importData = async (jsonString: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const data = JSON.parse(jsonString);
    
    if (!data.version || !data.data) {
      return { success: false, error: 'Invalid import format' };
    }
    
    const db = await getDB();
    const transaction = db.transaction(['cards', 'characters', 'templates', 'themes', 'settings', 'preferences'], 'readwrite');
    
    // Clear existing data if needed or merge
    // For now, we'll just add new items
    
    // Import cards
    if (data.data.cards && Array.isArray(data.data.cards)) {
      for (const card of data.data.cards) {
        if (!card.id) card.id = `imported-card-${Date.now()}`;
        await transaction.store.add(card);
      }
    }
    
    // Import characters
    if (data.data.characters && Array.isArray(data.data.characters)) {
      for (const character of data.data.characters) {
        if (!character.id) character.id = `imported-char-${Date.now()}`;
        await transaction.store.add(character);
      }
    }
    
    // Import templates
    if (data.data.templates && Array.isArray(data.data.templates)) {
      for (const template of data.data.templates) {
        if (!template.id) template.id = `imported-template-${Date.now()}`;
        await transaction.store.add(template);
      }
    }
    
    // Import themes
    if (data.data.themes && Array.isArray(data.data.themes)) {
      for (const theme of data.data.themes) {
        if (!theme.id) theme.id = `imported-theme-${Date.now()}`;
        await transaction.store.add(theme);
      }
    }
    
    // Import settings
    if (data.data.settings) {
      await transaction.store.put(data.data.settings, 'app');
    }
    
    // Import preferences
    if (data.data.preferences) {
      await transaction.store.put(data.data.preferences, 'user');
    }
    
    await transaction.done;
    
    return { success: true };
  } catch (error) {
    console.error('Import failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Import failed' };
  }
};

/**
 * Clear all data
 */
export const clearAllData = async (): Promise<void> => {
  const db = await getDB();
  await db.clear('cards');
  await db.clear('characters');
  await db.clear('templates');
  await db.clear('themes');
  await db.clear('settings');
  await db.clear('preferences');
};

export default {
  initDB,
  getDB,
  loadInitialData,
  cardStorage,
  characterStorage,
  templateStorage,
  themeStorage,
  settingsStorage,
  preferencesStorage,
  exportAllData,
  importData,
  clearAllData
};
