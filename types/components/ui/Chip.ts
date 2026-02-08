import type { Ionicons } from '@expo/vector-icons';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export interface ChipItem {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export interface ChipGroupProps {
  chips?: ChipItem[];
  selected?: string;
  onSelect?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
}
