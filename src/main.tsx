import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

// Remove loading overlay when app is ready
const removeLoadingOverlay = () => {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 500);
  }
};

// Add fade-out animation
const style = document.createElement('style');
style.textContent = `
  .loading-overlay.fade-out {
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }
`;
document.head.appendChild(style);

// Initialize performance monitoring
const initPerformance = () => {
  if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    const startTime = performance.now();
    
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime;
      console.log(`[Performance] Page loaded in ${loadTime.toFixed(2)}ms`);
    });
  }
};

// Initialize WebGL detection
const checkWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.warn('WebGL not supported - 3D features will be limited');
      document.body.classList.add('no-webgl');
    } else {
      document.body.classList.add('webgl');
    }
  } catch (e) {
    console.error('WebGL detection error:', e);
    document.body.classList.add('no-webgl');
  }
};

// Run initialization
initPerformance();
checkWebGL();

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App onReady={removeLoadingOverlay} />
    </BrowserRouter>
  </React.StrictMode>
);
