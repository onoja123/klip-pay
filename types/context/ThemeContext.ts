export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
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

export interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}
