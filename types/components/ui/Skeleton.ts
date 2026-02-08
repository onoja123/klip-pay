import type React from 'react';
import type { ViewStyle } from 'react-native';

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export interface SkeletonGroupProps {
  count?: number;
  gap?: number;
  children?: React.ReactNode;
}
