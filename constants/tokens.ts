// Design Tokens - Based on reference image (Klip wallet design)

// Font Families - Premium, sleek typography
export const fonts = {
  // Elegant display font for headlines
  displayRegular: 'PlayfairDisplay_400Regular',
  displayMedium: 'PlayfairDisplay_500Medium',
  displaySemiBold: 'PlayfairDisplay_600SemiBold',
  displayBold: 'PlayfairDisplay_700Bold',
  displayItalic: 'PlayfairDisplay_400Regular_Italic',
  displayBoldItalic: 'PlayfairDisplay_700Bold_Italic',
  
  // Elegant serif for special text
  serifRegular: 'CormorantGaramond_400Regular',
  serifMedium: 'CormorantGaramond_500Medium',
  serifSemiBold: 'CormorantGaramond_600SemiBold',
  serifBold: 'CormorantGaramond_700Bold',
  serifItalic: 'CormorantGaramond_400Regular_Italic',
  
  // Clean sans-serif for body
  sansRegular: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansSemiBold: 'DMSans_600SemiBold',
  sansBold: 'DMSans_700Bold',
} as const;

export const colors = {
  // Core
  background: '#FFFFFF',
  surface: '#F7F7F7',
  surfaceElevated: '#FFFFFF',
  
  // Card (dark premium card)
  card: '#1A1A1A',
  cardGradientStart: '#2A2A2A',
  cardGradientEnd: '#1A1A1A',
  
  // Primary (green from CTA buttons)
  primary: '#4A7C59',
  primaryDark: '#3D6B4A',
  primaryLight: '#5A9C6A',
  
  // Text
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9E9E9E',
  textInverse: '#FFFFFF',
  
  // Semantic
  success: '#22C55E',
  successLight: '#DCFCE7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  // Borders & Overlays
  border: '#E8E8E8',
  borderLight: '#F0F0F0',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',
  
  // Crypto colors
  solana: '#9945FF',
  ethereum: '#627EEA',
  bitcoin: '#F7931A',
  usdc: '#2775CA',
  polygon: '#8247E5',
  
  // Misc
  shimmer: '#E8E8E8',
  shimmerHighlight: '#F5F5F5',
} as const;

export const typography = {
  // Display - Playfair for elegance
  displayLarge: {
    fontSize: 44,
    fontFamily: fonts.displayBold,
    letterSpacing: -1,
    lineHeight: 52,
  },
  displayMedium: {
    fontSize: 36,
    fontFamily: fonts.displaySemiBold,
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  displaySmall: {
    fontSize: 28,
    fontFamily: fonts.displayMedium,
    letterSpacing: -0.3,
    lineHeight: 36,
  },
  
  // Headlines - Elegant serif
  headline: {
    fontSize: 24,
    fontFamily: fonts.serifSemiBold,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  headlineSmall: {
    fontSize: 20,
    fontFamily: fonts.serifMedium,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  
  // Titles - Clean DM Sans
  title: {
    fontSize: 18,
    fontFamily: fonts.sansSemiBold,
    letterSpacing: 0,
    lineHeight: 24,
  },
  titleSmall: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    letterSpacing: 0,
    lineHeight: 22,
  },
  
  // Body - DM Sans for readability
  body: {
    fontSize: 16,
    fontFamily: fonts.sansRegular,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    letterSpacing: 0,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: fonts.sansRegular,
    letterSpacing: 0,
    lineHeight: 20,
  },
  
  // Caption & Labels
  caption: {
    fontSize: 12,
    fontFamily: fonts.sansRegular,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  captionMedium: {
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.sansSemiBold,
    letterSpacing: 0.5,
    lineHeight: 14,
    textTransform: 'uppercase' as const,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

export const animations = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: {
    damping: 15,
    stiffness: 150,
  },
} as const;
