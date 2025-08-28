import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Theme, AppEvent } from '../types';

type EventColorSettings = Record<AppEvent['type'], string>;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  background: string | null;
  setBackground: (image: string | null) => void;
  eventColors: EventColorSettings;
  updateEventColor: (type: AppEvent['type'], color: string) => void;
  isBackgroundBlurred: boolean;
  toggleBackgroundBlur: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultEventColors: EventColorSettings = {
    class: '#3b82f6', // blue-500
    deadline: '#ef4444', // red-500
    exam: '#f59e0b', // amber-500
    'office-hours': '#10b981', // emerald-500
    work: '#6366f1', // indigo-500
    personal: '#8b5cf6', // violet-500
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem('chronofy-theme') as Theme;
      return storedTheme || 'light';
    } catch {
      return 'light';
    }
  });

  const [background, setBackgroundState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('chronofy-background');
    } catch {
      return null;
    }
  });

  const [eventColors, setEventColors] = useState<EventColorSettings>(() => {
    try {
      const saved = localStorage.getItem('chronofy-event-colors');
      return saved ? { ...defaultEventColors, ...JSON.parse(saved) } : defaultEventColors;
    } catch {
      return defaultEventColors;
    }
  });

  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('chronofy-bg-blur');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chronofy-theme', theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('chronofy-event-colors', JSON.stringify(eventColors));
    } catch (error) {
      console.warn('Failed to save event colors to localStorage:', error);
    }
  }, [eventColors]);

  useEffect(() => {
    try {
      localStorage.setItem('chronofy-bg-blur', JSON.stringify(isBackgroundBlurred));
    } catch (error) {
      console.warn('Failed to save background blur setting to localStorage:', error);
    }
  }, [isBackgroundBlurred]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setBackground = (image: string | null) => {
    try {
      if (image) {
        localStorage.setItem('chronofy-background', image);
      } else {
        localStorage.removeItem('chronofy-background');
      }
    } catch (error) {
      console.warn('Failed to save background to localStorage:', error);
    }
    setBackgroundState(image);
  };
  
  const updateEventColor = (type: AppEvent['type'], color: string) => {
      setEventColors(prev => ({...prev, [type]: color}));
  };

  const toggleBackgroundBlur = () => {
      setIsBackgroundBlurred(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, background, setBackground, eventColors, updateEventColor, isBackgroundBlurred, toggleBackgroundBlur }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
