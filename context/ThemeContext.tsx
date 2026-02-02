import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  // Core
  background: string;
  surface: string;
  surfaceElevated: string;
  
  // Card (dark premium card)
  card: string;
  cardGradientStart: string;
  cardGradientEnd: string;
  
  // Primary (green from CTA buttons)
  primary: string;
  primaryDark: string;
  primaryLight: string;
  
  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Semantic
  success: string;
  successLight: string;
  error: string;
  errorLight: string;
  warning: string;
  warningLight: string;
  info: string;
  infoLight: string;
  
  // Borders & Overlays
  border: string;
  borderLight: string;
  overlay: string;
  overlayLight: string;
  
  // Crypto colors
  solana: string;
  ethereum: string;
  bitcoin: string;
  usdc: string;
  polygon: string;
  
  // Misc
  shimmer: string;
  shimmerHighlight: string;
}

// Light theme colors
export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F7F7F7',
  surfaceElevated: '#FFFFFF',
  
  card: '#1A1A1A',
  cardGradientStart: '#2A2A2A',
  cardGradientEnd: '#1A1A1A',
  
  primary: '#4A7C59',
  primaryDark: '#3D6B4A',
  primaryLight: '#5A9C6A',
  
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  textInverse: '#FFFFFF',
  
  success: '#22C55E',
  successLight: '#DCFCE7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  border: '#E8E8E8',
  borderLight: '#F0F0F0',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',
  
  solana: '#9945FF',
  ethereum: '#627EEA',
  bitcoin: '#F7931A',
  usdc: '#2775CA',
  polygon: '#8247E5',
  
  shimmer: '#E8E8E8',
  shimmerHighlight: '#F5F5F5',
};

// Dark theme colors - Sleek premium dark mode
export const darkColors: ThemeColors = {
  background: '#0A0A0A',
  surface: '#141414',
  surfaceElevated: '#1A1A1A',
  
  card: '#1F1F1F',
  cardGradientStart: '#2A2A2A',
  cardGradientEnd: '#1A1A1A',
  
  primary: '#5A9C6A',
  primaryDark: '#4A7C59',
  primaryLight: '#6AB87A',
  
  text: '#FAFAFA',
  textSecondary: '#A0A0A0',
  textTertiary: '#666666',
  textInverse: '#0A0A0A',
  
  success: '#34D399',
  successLight: '#064E3B',
  error: '#F87171',
  errorLight: '#7F1D1D',
  warning: '#FBBF24',
  warningLight: '#78350F',
  info: '#60A5FA',
  infoLight: '#1E3A8A',
  
  border: '#2A2A2A',
  borderLight: '#1F1F1F',
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(255, 255, 255, 0.05)',
  
  solana: '#9945FF',
  ethereum: '#627EEA',
  bitcoin: '#F7931A',
  usdc: '#2775CA',
  polygon: '#8247E5',
  
  shimmer: '#1F1F1F',
  shimmerHighlight: '#2A2A2A',
};

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@klip_theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
  };

  // Determine if dark mode should be active
  const isDark = mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');
  
  // Get the appropriate colors
  const colors = isDark ? darkColors : lightColors;

  const value: ThemeContextType = {
    mode,
    isDark,
    colors,
    setMode,
    toggleTheme,
  };

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook to get just the colors (for convenience)
export function useColors() {
  const { colors } = useTheme();
  return colors;
}
