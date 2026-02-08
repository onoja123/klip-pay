import type { LayoutRectangle } from 'react-native';

export interface OverlayMaskProps {
  visible: boolean;
  stepName: string;
  description?: string;
  rect: LayoutRectangle | null;
  isLast: boolean;
  onNext: () => void;
  onSkip: () => void;
}
