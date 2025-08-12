import { MD3DarkTheme } from 'react-native-paper';

export const colors = {
  // Core blacks and grays
  primary: '#000000',
  secondary: '#111111',
  tertiary: '#1a1a1a',
  surface: '#222222',
  
  // Neon accents
  neonBlue: '#00ffff',
  neonGreen: '#39ff14',
  neonPink: '#ff073a',
  neonPurple: '#bf00ff',
  
  // Blue shades to complement black
  electricBlue: '#0080ff',
  deepBlue: '#001f3f',
  royalBlue: '#4169e1',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#cccccc',
  textMuted: '#888888',
  
  // Status colors
  success: '#39ff14',
  warning: '#ffff00',
  error: '#ff073a',
  
  // Gradients
  gradient: {
    primary: ['#000000', '#111111', '#1a1a1a'],
    neon: ['#00ffff', '#0080ff', '#001f3f'],
    accent: ['#bf00ff', '#ff073a', '#000000'],
  }
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.neonBlue,
    primaryContainer: colors.secondary,
    secondary: colors.electricBlue,
    secondaryContainer: colors.tertiary,
    tertiary: colors.neonPurple,
    surface: colors.secondary,
    surfaceVariant: colors.tertiary,
    background: colors.primary,
    onBackground: colors.textPrimary,
    onSurface: colors.textPrimary,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.textMuted,
    error: colors.error,
    onError: colors.textPrimary,
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    displayLarge: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    headlineLarge: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    titleLarge: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    bodyLarge: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    bodyMedium: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  },
};

export const animations = {
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  timing: {
    duration: 300,
  },
  bounce: {
    damping: 8,
    stiffness: 100,
    mass: 1,
  },
};
