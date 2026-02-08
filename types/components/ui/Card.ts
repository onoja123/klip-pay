import type React from 'react';
import type { ViewStyle } from 'react-native';
import type { CardVariant } from '@/types';

export type SpacingKey = keyof typeof import('@/constants/tokens').spacing;

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: SpacingKey;
}
