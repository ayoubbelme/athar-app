export type ThemeMode = 'dark' | 'light';

export interface ThemePalette {
  background: string;
  surface: string;
  surfaceLight: string;
  primary: string;
  primaryDark: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  errorBg: string;
  white: string;
}

export const DARK_COLORS: ThemePalette = {
  background: '#0B1310',     // Deep forest dark green background
  surface: '#14221C',        // Elevated dark card surface
  surfaceLight: '#1E332A',   // Input / secondary button background
  primary: '#00BA66',        // ATHAR signature emerald green
  primaryDark: '#009952',
  text: '#F3F7F5',           // Crisp off-white
  textSecondary: '#9BB0A5',  // Muted sage grey
  border: '#263E34',
  error: '#FF5A5F',
  errorBg: 'rgba(255, 90, 95, 0.12)',
  white: '#FFFFFF',
};

export const LIGHT_COLORS: ThemePalette = {
  background: '#FFFFFF',     // Clean pure white background
  surface: '#F8FAFC',        // Light elevated card surface
  surfaceLight: '#EDF2F7',   // Input / secondary button background
  primary: '#059669',        // Professional emerald green for white mode
  primaryDark: '#047857',
  text: '#0F172A',           // Dark slate black for high readability
  textSecondary: '#64748B',  // Slate grey secondary text
  border: '#E2E8F0',         // Clean light grey border
  error: '#EF4444',
  errorBg: 'rgba(239, 68, 68, 0.08)',
  white: '#FFFFFF',
};

export const COLORS: ThemePalette = { ...DARK_COLORS };

export function applyThemePalette(mode: ThemeMode): void {
  const source = mode === 'light' ? LIGHT_COLORS : DARK_COLORS;
  Object.assign(COLORS, source);
}