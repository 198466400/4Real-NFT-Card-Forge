import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PerformanceMonitorProps {
  onPerformanceWarning?: (warning: string) => void;
  threshold?: number;
}

export interface PerformanceMetrics {
  fps: number;
  memory: number;
  cpu: number;
  frameTime: number;
  timestamp: number;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onPerformanceWarning,
  threshold = 30
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    cpu: 0,
    frameTime: 0,
    timestamp: Date.now()
  });
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  
  const frameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(0);

  // Get performance memory
  const getMemoryUsage = useCallback(() => {
    if (window.performance && window.performance.memory) {
      return window.performance.memory.usedJSHeapSize / 1048576; // MB
    }
    return 0;
  }, []);

  // Calculate FPS
  const calculateFPS = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;
    
    if (now - lastFpsUpdateRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastFpsUpdateRef.current));
      lastFpsUpdateRef.current = now;
      frameCountRef.current = 0;
      
      return fps;
    }
    
    return metrics.fps;
  }, [metrics.fps]);

  // Update metrics
  const updateMetrics = useCallback(() => {
    const now = performance.now();
    const frameTime = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;
    
    const fps = calculateFPS();
    const memory = getMemoryUsage();
    
    // Calculate CPU usage (approximate)
    // This is a simplified estimation
    const cpu = frameTime > 16.67 ? Math.min(100, (frameTime / 16.67) * 100) : 0;
    
    const newMetrics: PerformanceMetrics = {
      fps,
      memory,
      cpu: Math.round(cpu),
      frameTime: Math.round(frameTime),
      timestamp: now
    };
    
    setMetrics(newMetrics);
    
    // Add to history
    setHistory(prev => {
      const newHistory = [...prev, newMetrics];
      return newHistory.slice(-60); // Keep last 60 frames (1 second)
    });
    
    // Check for warnings
    if (fps < threshold) {
      const warning = `Low FPS: ${fps}`;
      if (!warnings.includes(warning)) {
        setWarnings(prev => [...prev, warning]);
        onPerformanceWarning?.(warning);
      }
    }
    
    frameRef.current = requestAnimationFrame(updateMetrics);
  }, [calculateFPS, getMemoryUsage, metrics.fps, threshold, warnings, onPerformanceWarning]);

  // Start monitoring
  useEffect(() => {
    lastFrameTimeRef.current = performance.now();
    lastFpsUpdateRef.current = performance.now();
    
    frameRef.current = requestAnimationFrame(updateMetrics);
    
    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [updateMetrics]);

  // Toggle visibility
  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  // Clear warnings
  const clearWarnings = useCallback(() => {
    setWarnings([]);
  }, []);

  // Calculate average metrics
  const avgFps = history.reduce((sum, m) => sum + m.fps, 0) / history.length;
  const avgFrameTime = history.reduce((sum, m) => sum + m.frameTime, 0) / history.length;

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="performance-toggle"
        onClick={toggleVisibility}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <span className="performance-icon">⚡</span>
        <span className="performance-fps">{Math.round(metrics.fps)}</span>
      </motion.button>

      {/* Performance Overlay */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="performance-overlay"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="performance-header">
              <h3>Performance Monitor</h3>
              <button className="close-button" onClick={toggleVisibility}>
                ✕
              </button>
            </div>

            <div className="performance-metrics">
              <div className="metric">
                <span className="metric-label">FPS</span>
                <span className={`metric-value ${metrics.fps < threshold ? 'warning' : ''}`}>
                  {metrics.fps}
                </span>
                <div className="metric-bar">
                  <motion.div
                    className="metric-fill"
                    style={{ width: `${(metrics.fps / 60) * 100}%` }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>

              <div className="metric">
                <span className="metric-label">Frame Time</span>
                <span className="metric-value">{metrics.frameTime}ms</span>
                <div className="metric-bar">
                  <motion.div
                    className="metric-fill"
                    style={{ width: `${(metrics.frameTime / 33.33) * 100}%` }}
                  />
                </div>
              </div>

              <div className="metric">
                <span className="metric-label">Memory</span>
                <span className="metric-value">{metrics.memory.toFixed(2)}MB</span>
                <div className="metric-bar">
                  <motion.div
                    className="metric-fill"
                    style={{ width: `${Math.min(100, (metrics.memory / 512) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="metric">
                <span className="metric-label">CPU Usage</span>
                <span className="metric-value">{metrics.cpu}%</span>
                <div className="metric-bar">
                  <motion.div
                    className="metric-fill"
                    style={{ width: `${metrics.cpu}%` }}
                  />
                </div>
              </div>
            </div>

            {warnings.length > 0 && (
              <div className="performance-warnings">
                <h4>Warnings</h4>
                <ul>
                  {warnings.map((warning, index) => (
                    <li key={index} className="warning-item">
                      {warning}
                    </li>
                  ))}
                </ul>
                <button className="clear-button" onClick={clearWarnings}>
                  Clear All
                </button>
              </div>
            )}

            <div className="performance-tips">
              <h4>Performance Tips</h4>
              <ul>
                <li>Reduce the number of particles for better FPS</li>
                <li>Lower texture resolution for better memory usage</li>
                <li>Disable shadows for better performance</li>
                <li>Use simpler shaders for better CPU usage</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Performance stats hook
export const usePerformanceStats = () => {
  const [stats, setStats] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    cpu: 0,
    frameTime: 0,
    timestamp: Date.now()
  });

  useEffect(() => {
    let frameRef: number;
    
    const update = () => {
      const now = performance.now();
      
      // This is a simplified version - in practice you'd need to track frame times
      const fps = 60; // Placeholder
      const memory = window.performance?.memory?.usedJSHeapSize ? 
        window.performance.memory.usedJSHeapSize / 1048576 : 0;
      
      setStats({
        fps,
        memory,
        cpu: 0, // Placeholder
        frameTime: 0, // Placeholder
        timestamp: now
      });
      
      frameRef = requestAnimationFrame(update);
    };
    
    frameRef = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frameRef);
  }, []);

  return stats;
};

export default PerformanceMonitor;
