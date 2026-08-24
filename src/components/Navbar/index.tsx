import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../Button';
import { useStore } from '../../stores/useStore';

export interface NavbarProps {
  className?: string;
}

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/gallery', label: 'Gallery', icon: '📁' },
  { path: '/editor/card', label: 'Card Editor', icon: '🎨' },
  { path: '/creator/character', label: 'Character Creator', icon: '👤' },
  { path: '/editor/template', label: 'Templates', icon: '📄' },
  { path: '/editor/theme', label: 'Themes', icon: '🎭' },
];

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { settings } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLink: React.FC<{ to: string; label: string; icon: string }> = ({ to, label, icon }) => {
    const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
    
    return (
      <Link 
        to={to} 
        className={`navbar-link ${isActive ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <span className="icon">{icon}</span>
        <span className="label">{label}</span>
      </Link>
    );
  };

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''} ${className}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="navbar-content">
        {/* Logo / Brand */}
        <Link to="/" className="navbar-brand">
          <div className="logo">4</div>
          <span>4Real NFT Forge</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav desktop">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              label={item.label} 
              icon={item.icon}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/settings')}
            aria-label="Settings"
          >
            ⚙️
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => navigate('/export')}
            leftIcon="📥"
          >
            Export
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="navbar-nav mobile open"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  label={item.label} 
                  icon={item.icon}
                />
              ))}
              <div className="mobile-actions">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/settings');
                  }}
                  isFullWidth
                >
                  ⚙️ Settings
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/export');
                  }}
                  isFullWidth
                >
                  📥 Export
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
