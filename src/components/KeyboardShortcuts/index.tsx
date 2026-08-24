import React, { useEffect, useCallback, useMemo } from 'react';
import { useStore } from '../../stores/useStore';
import { toast } from '../Toast';

export interface KeyboardShortcut {
  key: string;
  modifier?: 'ctrl' | 'shift' | 'alt' | 'meta';
  action: () => void;
  description: string;
  category: string;
  enabled?: boolean;
}

export interface KeyboardShortcutsProps {
  shortcuts?: KeyboardShortcut[];
  disabled?: boolean;
}

const defaultShortcuts: KeyboardShortcut[] = [
  // Global shortcuts
  {
    key: 'k',
    modifier: 'ctrl',
    action: () => {},
    description: 'Open command palette',
    category: 'Global',
    enabled: true
  },
  {
    key: 's',
    modifier: 'ctrl',
    action: () => {},
    description: 'Save current work',
    category: 'Global',
    enabled: true
  },
  {
    key: '/',
    action: () => {},
    description: 'Search',
    category: 'Global',
    enabled: true
  },
  // Editor shortcuts
  {
    key: 'z',
    modifier: 'ctrl',
    action: () => {},
    description: 'Undo',
    category: 'Editor',
    enabled: true
  },
  {
    key: 'y',
    modifier: 'ctrl',
    action: () => {},
    description: 'Redo',
    category: 'Editor',
    enabled: true
  },
  {
    key: 'c',
    modifier: 'ctrl',
    action: () => {},
    description: 'Copy selection',
    category: 'Editor',
    enabled: true
  },
  {
    key: 'v',
    modifier: 'ctrl',
    action: () => {},
    description: 'Paste',
    category: 'Editor',
    enabled: true
  },
  {
    key: 'Delete',
    action: () => {},
    description: 'Delete selection',
    category: 'Editor',
    enabled: true
  },
  // View shortcuts
  {
    key: '+',
    modifier: 'ctrl',
    action: () => {},
    description: 'Zoom in',
    category: 'View',
    enabled: true
  },
  {
    key: '-',
    modifier: 'ctrl',
    action: () => {},
    description: 'Zoom out',
    category: 'View',
    enabled: true
  },
  {
    key: '0',
    modifier: 'ctrl',
    action: () => {},
    description: 'Reset zoom',
    category: 'View',
    enabled: true
  },
  // Navigation shortcuts
  {
    key: 'ArrowLeft',
    action: () => {},
    description: 'Previous item',
    category: 'Navigation',
    enabled: true
  },
  {
    key: 'ArrowRight',
    action: () => {},
    description: 'Next item',
    category: 'Navigation',
    enabled: true
  },
  {
    key: 'Escape',
    action: () => {},
    description: 'Close current view',
    category: 'Navigation',
    enabled: true
  }
];

const modifierKeyMap: Record<string, string> = {
  ctrl: 'Ctrl',
  shift: 'Shift',
  alt: 'Alt',
  meta: 'Cmd'
};

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  shortcuts = defaultShortcuts,
  disabled = false
}) => {
  const { settings } = useStore();

  // Handle key down
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (disabled) return;
    
    // Check if user is typing in an input
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Find matching shortcut
    const matchingShortcut = shortcuts.find(shortcut => {
      if (!shortcut.enabled) return false;
      
      // Check modifier keys
      if (shortcut.modifier) {
        const modifiers = shortcut.modifier.split('+');
        const allModifiersPressed = modifiers.every(mod => {
          switch (mod) {
            case 'ctrl':
              return e.ctrlKey || e.metaKey;
            case 'shift':
              return e.shiftKey;
            case 'alt':
              return e.altKey;
            case 'meta':
              return e.metaKey;
            default:
              return false;
          }
        });
        
        if (!allModifiersPressed) return false;
      }
      
      // Check main key
      return e.key === shortcut.key || e.code === shortcut.key;
    });

    if (matchingShortcut) {
      e.preventDefault();
      e.stopPropagation();
      matchingShortcut.action();
    }
  }, [shortcuts, disabled]);

  // Register event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Group shortcuts by category
  const groupedShortcuts = useMemo(() => {
    const groups: Record<string, KeyboardShortcut[]> = {};
    
    shortcuts.forEach(shortcut => {
      if (!groups[shortcut.category]) {
        groups[shortcut.category] = [];
      }
      groups[shortcut.category].push(shortcut);
    });
    
    return groups;
  }, [shortcuts]);

  // Format key combination
  const formatShortcut = (shortcut: KeyboardShortcut): string => {
    const parts: string[] = [];
    
    if (shortcut.modifier) {
      const modifiers = shortcut.modifier.split('+');
      parts.push(...modifiers.map(mod => modifierKeyMap[mod] || mod));
    }
    
    parts.push(shortcut.key);
    
    return parts.join(' + ');
  };

  // Show help dialog
  const showHelp = useCallback(() => {
    const helpContent = (
      <div className="shortcuts-help">
        <h3>Keyboard Shortcuts</h3>
        <p>Here are the available keyboard shortcuts:</p>
        
        <div className="shortcuts-grid">
          {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
            <div key={category} className="shortcut-category">
              <h4>{category}</h4>
              <table className="shortcuts-table">
                <thead>
                  <tr>
                    <th>Shortcut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shortcuts.map((shortcut, index) => (
                    <tr key={index}>
                      <td>
                        <kbd className="shortcut-key">{formatShortcut(shortcut)}</kbd>
                      </td>
                      <td>{shortcut.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );

    // For now, just show a toast
    toast.info('Keyboard shortcuts: Ctrl+K (command), Ctrl+S (save), Ctrl+Z (undo), etc.');
  }, [groupedShortcuts]);

  // Register help shortcut
  useEffect(() => {
    const handleHelpKey = (e: KeyboardEvent) => {
      if (e.key === '?' || (e.ctrlKey && e.key === '/')) {
        e.preventDefault();
        showHelp();
      }
    };
    
    window.addEventListener('keydown', handleHelpKey);
    return () => window.removeEventListener('keydown', handleHelpKey);
  }, [showHelp]);

  return null;
};

// Hook for using keyboard shortcuts
export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  dependencies: any[] = []
) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Check if user is typing in an input
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Find matching shortcut
    const matchingShortcut = shortcuts.find(shortcut => {
      if (!shortcut.enabled) return false;
      
      // Check modifier keys
      if (shortcut.modifier) {
        const modifiers = shortcut.modifier.split('+');
        const allModifiersPressed = modifiers.every(mod => {
          switch (mod) {
            case 'ctrl':
              return e.ctrlKey || e.metaKey;
            case 'shift':
              return e.shiftKey;
            case 'alt':
              return e.altKey;
            case 'meta':
              return e.metaKey;
            default:
              return false;
          }
        });
        
        if (!allModifiersPressed) return false;
      }
      
      // Check main key
      return e.key === shortcut.key || e.code === shortcut.key;
    });

    if (matchingShortcut) {
      e.preventDefault();
      e.stopPropagation();
      matchingShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, ...dependencies]);
};

// Shortcut display component
export const ShortcutDisplay: React.FC<{ shortcut: string }> = ({ shortcut }) => {
  const parts = shortcut.split('+');
  
  return (
    <span className="shortcut-display">
      {parts.map((part, index) => (
        <kbd key={index} className="shortcut-key">
          {modifierKeyMap[part.toLowerCase()] || part}
        </kbd>
      ))}
    </span>
  );
};

export default KeyboardShortcuts;
