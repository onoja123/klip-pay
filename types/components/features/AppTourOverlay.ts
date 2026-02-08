import type { LayoutRectangle } from 'react-native';

export interface AppTourOverlayProps {
  visible: boolean;
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  rect?: LayoutRectangle | null;
  screenWidth: number;
  screenHeight: number;
  onNext: () => void;
  onSkip: () => void;
  isLast: boolean;
}
