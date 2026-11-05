import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  applyThemePalette,
  COLORS,
  DARK_COLORS,
  LIGHT_COLORS,
  ThemeMode,
  ThemePalette,
} from '../theme/colors';

const THEME_STORAGE_KEY = '@athar/theme_mode_v2';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemePalette;
  toggleTheme: () => Promise<void>;
  setThemeMode: (nextMode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  isDark: false,
  colors: LIGHT_COLORS,
  toggleTheme: async () => {},
  setThemeMode: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') {
          applyThemePalette(saved);
          setMode(saved);
        } else {
          // Default to light mode (white background)
          applyThemePalette('light');
          setMode('light');
        }
      })
      .catch(() => {});
  }, []);

  const setThemeMode = async (nextMode: ThemeMode) => {
    applyThemePalette(nextMode);
    setMode(nextMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch {
      // Ignore storage error
    }
  };

  const toggleTheme = async () => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    await setThemeMode(next);
  };

  const palette = mode === 'light' ? LIGHT_COLORS : DARK_COLORS;
  Object.assign(COLORS, palette);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        isDark: mode === 'dark',
        colors: palette,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => useContext(ThemeContext);