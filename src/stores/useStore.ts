import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  NFTCard, 
  Character3D, 
  CardTemplate, 
  CardTheme,
  EditorMode,
  ExportQuality,
  AppSettings,
  UserPreferences
} from '../types';

interface AppState {
  // Data
  cards: NFTCard[];
  characters: Character3D[];
  templates: CardTemplate[];
  themes: CardTheme[];
  
  // Current selections
  currentCard: NFTCard | null;
  currentCharacter: Character3D | null;
  currentTemplate: CardTemplate | null;
  currentTheme: CardTheme | null;
  
  // UI State
  editorMode: EditorMode;
  previewMode: boolean;
  exportQuality: ExportQuality;
  
  // Settings
  settings: AppSettings;
  preferences: UserPreferences;
  
  // Status
  loading: boolean;
  error: string | null;
  
  // Actions
  setCards: (cards: NFTCard[]) => void;
  addCard: (card: NFTCard) => void;
  updateCard: (id: string, updates: Partial<NFTCard>) => void;
  deleteCard: (id: string) => void;
  setCurrentCard: (card: NFTCard | null) => void;
  
  setCharacters: (characters: Character3D[]) => void;
  addCharacter: (character: Character3D) => void;
  updateCharacter: (id: string, updates: Partial<Character3D>) => void;
  deleteCharacter: (id: string) => void;
  setCurrentCharacter: (character: Character3D | null) => void;
  
  setTemplates: (templates: CardTemplate[]) => void;
  addTemplate: (template: CardTemplate) => void;
  updateTemplate: (id: string, updates: Partial<CardTemplate>) => void;
  deleteTemplate: (id: string) => void;
  setCurrentTemplate: (template: CardTemplate | null) => void;
  
  setThemes: (themes: CardTheme[]) => void;
  addTheme: (theme: CardTheme) => void;
  updateTheme: (id: string, updates: Partial<CardTheme>) => void;
  deleteTheme: (id: string) => void;
  setCurrentTheme: (theme: CardTheme | null) => void;
  
  setEditorMode: (mode: EditorMode) => void;
  setPreviewMode: (preview: boolean) => void;
  setExportQuality: (quality: ExportQuality) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  setSettings: (settings: Partial<AppSettings>) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Derived state
  getCardById: (id: string) => NFTCard | undefined;
  getCharacterById: (id: string) => Character3D | undefined;
  getTemplateById: (id: string) => CardTemplate | undefined;
  getThemeById: (id: string) => CardTheme | undefined;
  
  // Utility actions
  reset: () => void;
  clearError: () => void;
}

const defaultSettings: AppSettings = {
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
};

const defaultPreferences: UserPreferences = {
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
};

const initialState = {
  cards: [],
  characters: [],
  templates: [],
  themes: [],
  currentCard: null,
  currentCharacter: null,
  currentTemplate: null,
  currentTheme: null,
  editorMode: 'card',
  previewMode: false,
  exportQuality: 'high',
  settings: defaultSettings,
  preferences: defaultPreferences,
  loading: false,
  error: null
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Card actions
      setCards: (cards) => set({ cards }),
      addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
      updateCard: (id, updates) => set((state) => ({
        cards: state.cards.map(card => card.id === id ? { ...card, ...updates, updatedAt: new Date() } : card)
      })),
      deleteCard: (id) => set((state) => ({
        cards: state.cards.filter(card => card.id !== id),
        currentCard: state.currentCard?.id === id ? null : state.currentCard
      })),
      setCurrentCard: (card) => set({ currentCard: card }),
      
      // Character actions
      setCharacters: (characters) => set({ characters }),
      addCharacter: (character) => set((state) => ({ characters: [...state.characters, character] })),
      updateCharacter: (id, updates) => set((state) => ({
        characters: state.characters.map(char => char.id === id ? { ...char, ...updates } : char)
      })),
      deleteCharacter: (id) => set((state) => ({
        characters: state.characters.filter(char => char.id !== id),
        currentCharacter: state.currentCharacter?.id === id ? null : state.currentCharacter
      })),
      setCurrentCharacter: (character) => set({ currentCharacter: character }),
      
      // Template actions
      setTemplates: (templates) => set({ templates }),
      addTemplate: (template) => set((state) => ({ templates: [...state.templates, template] })),
      updateTemplate: (id, updates) => set((state) => ({
        templates: state.templates.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTemplate: (id) => set((state) => ({
        templates: state.templates.filter(t => t.id !== id),
        currentTemplate: state.currentTemplate?.id === id ? null : state.currentTemplate
      })),
      setCurrentTemplate: (template) => set({ currentTemplate: template }),
      
      // Theme actions
      setThemes: (themes) => set({ themes }),
      addTheme: (theme) => set((state) => ({ themes: [...state.themes, theme] })),
      updateTheme: (id, updates) => set((state) => ({
        themes: state.themes.map(theme => theme.id === id ? { ...theme, ...updates } : theme)
      })),
      deleteTheme: (id) => set((state) => ({
        themes: state.themes.filter(theme => theme.id !== id),
        currentTheme: state.currentTheme?.id === id ? null : state.currentTheme
      })),
      setCurrentTheme: (theme) => set({ currentTheme: theme }),
      
      // UI State actions
      setEditorMode: (mode) => set({ editorMode: mode }),
      setPreviewMode: (preview) => set({ previewMode: preview }),
      setExportQuality: (quality) => set({ exportQuality: quality }),
      
      // Status actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Settings actions
      setSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      setPreferences: (updates) => set((state) => ({
        preferences: { ...state.preferences, ...updates }
      })),
      
      // Derived state
      getCardById: (id) => get().cards.find(card => card.id === id),
      getCharacterById: (id) => get().characters.find(char => char.id === id),
      getTemplateById: (id) => get().templates.find(t => t.id === id),
      getThemeById: (id) => get().themes.find(theme => theme.id === id),
      
      // Utility actions
      reset: () => set(initialState),
      clearError: () => set({ error: null })
    }),
    {
      name: '4real-nft-forge-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Save these to localStorage
        cards: state.cards,
        characters: state.characters,
        templates: state.templates,
        themes: state.themes,
        settings: state.settings,
        preferences: state.preferences
      })
    }
  )
);

// Selector hooks for better performance
export const useCards = () => useStore((state) => state.cards);
export const useCharacters = () => useStore((state) => state.characters);
export const useTemplates = () => useStore((state) => state.templates);
export const useThemes = () => useStore((state) => state.themes);
export const useCurrentCard = () => useStore((state) => state.currentCard);
export const useCurrentCharacter = () => useStore((state) => state.currentCharacter);
export const useEditorMode = () => useStore((state) => state.editorMode);
export const usePreviewMode = () => useStore((state) => state.previewMode);
export const useSettings = () => useStore((state) => state.settings);
export const usePreferences = () => useStore((state) => state.preferences);
export const useLoading = () => useStore((state) => state.loading);
export const useError = () => useStore((state) => state.error);

// Action hooks
export const useCardActions = () => useStore((state) => ({
  setCards: state.setCards,
  addCard: state.addCard,
  updateCard: state.updateCard,
  deleteCard: state.deleteCard,
  setCurrentCard: state.setCurrentCard
}));

export const useCharacterActions = () => useStore((state) => ({
  setCharacters: state.setCharacters,
  addCharacter: state.addCharacter,
  updateCharacter: state.updateCharacter,
  deleteCharacter: state.deleteCharacter,
  setCurrentCharacter: state.setCurrentCharacter
}));

export const useUIActions = () => useStore((state) => ({
  setEditorMode: state.setEditorMode,
  setPreviewMode: state.setPreviewMode,
  setExportQuality: state.setExportQuality,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError
}));
