import { useEffect, RefObject } from 'react';

/**
 * Hook that triggers a callback when user clicks outside of the specified element
 */
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | T | null,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Get the current ref element
      const element = ref instanceof Function ? ref.current : ref;
      
      if (!element) return;

      // Check if the click is outside the element
      if (element && !element.contains(event.target as Node)) {
        handler(event);
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, handler, enabled]);
};

/**
 * Hook that triggers a callback when user presses a specific key
 */
export const useOnKeyPress = (
  targetKey: string,
  handler: (event: KeyboardEvent) => void,
  enabled: boolean = true,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean } = {}
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if the pressed key matches
      if (event.key !== targetKey) return;

      // Check modifiers
      if (modifiers.ctrl && !event.ctrlKey) return;
      if (modifiers.shift && !event.shiftKey) return;
      if (modifiers.alt && !event.altKey) return;
      if (modifiers.meta && !event.metaKey) return;

      handler(event);
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [targetKey, handler, enabled, modifiers]);
};

/**
 * Hook that tracks mouse position
 */
export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return position;
};

/**
 * Hook that tracks window scroll position
 */
export const useScrollPosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setPosition({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return position;
};

/**
 * Hook that tracks element visibility in viewport
 */
export const useInViewport = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | T | null,
  threshold: number = 0.1
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) {
      setIsVisible(false);
      return;
    }

    const element = ref instanceof Function ? ref.current : ref;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold]);

  return isVisible;
};

/**
 * Hook for debouncing values
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for throttling values
 */
export const useThrottle = <T>(value: T, delay: number = 100): T => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastExecuted.current >= delay) {
      lastExecuted.current = now;
      setThrottledValue(value);
    }
  }, [value, delay]);

  return throttledValue;
};

/**
 * Hook for managing local storage
 */
export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [value, setStoredValue];
};

/**
 * Hook for managing session storage
 */
export const useSessionStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      sessionStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  };

  return [value, setStoredValue];
};

/**
 * Hook for counting down
 */
export const useCountdown = (initialValue: number, interval: number = 1000) => {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    if (count <= 0) return;

    const timer = setInterval(() => {
      setCount(prev => Math.max(prev - 1, 0));
    }, interval);

    return () => clearInterval(timer);
  }, [count, interval]);

  const reset = (value?: number) => {
    setCount(value !== undefined ? value : initialValue);
  };

  return { count, reset };
};

/**
 * Hook for media query
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

/**
 * Hook for detecting dark mode preference
 */
export const useDarkMode = (): [boolean, (enabled: boolean) => void] => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      // Only update if not explicitly set in localStorage
      if (!localStorage.getItem('theme')) {
        setIsDark(event.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const setDarkMode = (enabled: boolean) => {
    setIsDark(enabled);
    localStorage.setItem('theme', enabled ? 'dark' : 'light');
    
    // Update document class
    if (enabled) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  return [isDark, setDarkMode];
};

export default useOnClickOutside;
