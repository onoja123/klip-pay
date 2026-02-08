import type { Ionicons } from '@expo/vector-icons';

export interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

export interface QuickActionsRowProps {
  actions: QuickActionProps[];
}
