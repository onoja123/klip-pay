import type React from 'react';
import type { Ionicons } from '@expo/vector-icons';
import type { BannerVariant } from '@/types';

export interface BannerProps {
  variant?: BannerVariant;
  title?: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  action?: React.ReactNode;
}
