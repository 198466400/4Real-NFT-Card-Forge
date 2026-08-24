import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../Button';
import { useStore } from '../../stores/useStore';

export interface SidebarProps {
  className?: string;
}

const sidebarItems = [
  {
    section: 'Create',
    items: [
      { path: '/editor/card', label: 'Card Editor', icon: '🎨' },
      { path: '/creator/character', label: 'Character Creator', icon: '👤' }
    ]
  },
  {
    section: 'Customize',
    items: [
      { path: '/editor/template', label: 'Templates', icon: '📄' },
      { path: '/editor/theme', label: 'Themes', icon: '🎭' },
      { path: '/editor/effects', label: 'Effects', icon: '✨' }
    ]
  },
  {
    section: 'Library',
    items: [
      { path: '/gallery', label: 'Gallery', icon: '📁' },
      { path: '/gallery/characters', label: 'Characters', icon: '👥' },
      { path: '/gallery/cards', label: 'Cards', icon: '🃏' }
    ]
  },
  {
    section: 'Tools',
    items: [
      { path: '/export', label: 'Export', icon: '📥' },
      { path: '/settings', label: 'Settings', icon: '⚙️' }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  const { settings } = useStore();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <motion.aside 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${className}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ width: isCollapsed && !hovered ? '64px' : '280px' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="sidebar-header">
        {!isCollapsed && (
          <motion.h3 
            className="sidebar-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Navigation
          </motion.h3>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapse}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? '➡️' : '⬅️'}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {sidebarItems.map((section) => (
          <div key={section.section} className="sidebar-nav-section">
            {!isCollapsed && (
              <motion.div 
                className="sidebar-nav-section-title"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {section.section}
              </motion.div>
            )}
            <div className="sidebar-nav-items">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <motion.div 
                    key={item.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      to={item.path}
                      className={`sidebar-link ${active ? 'active' : ''}`}
                      data-tooltip={isCollapsed ? item.label : undefined}
                      data-tooltip-position="right"
                    >
                      <span className="icon">{item.icon}</span>
                      {!isCollapsed && <span className="label">{item.label}</span>}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="footer-content"
          >
            <div className="version">v{import.meta.env.VITE_APP_VERSION || '2.0.0'}</div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
