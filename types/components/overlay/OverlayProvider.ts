import type React from 'react';
import type { TouchableOpacity } from 'react-native';

export type OverlayStepName = 'Home' | 'Card' | 'DeFi' | 'Activity' | 'Profile';

export interface OverlayStep {
  name: OverlayStepName;
  description: string;
}

export interface OverlayContextValue {
  isOpen: boolean;
  steps: OverlayStep[];
  activeIndex: number;
  start: (steps: OverlayStep[]) => void;
  next: () => void;
  skip: () => void;
  finish: () => void;
  registerTabRef: (name: OverlayStepName, ref: React.RefObject<TouchableOpacity>) => void;
}
