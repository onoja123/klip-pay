import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context';
import { radii, spacing, fonts } from '@/constants/tokens';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Chip({ label, selected = false, onPress, icon }: ChipProps) {
  const { colors } = useTheme();
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        styles.container,
        { backgroundColor: selected ? colors.card : colors.surface },
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={selected ? '#FFFFFF' : colors.text}
          style={styles.icon}
        />
      )}
      <Text style={[
        styles.label, 
        { color: selected ? '#FFFFFF' : colors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// Support both "chips" format and "options" format for flexibility
interface ChipItem {
  label: string;
  value: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface ChipGroupProps {
  // New format with chips array
  chips?: ChipItem[];
  selected?: string;
  onSelect?: (value: string) => void;
  // Alternative format with options
  options?: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
}

export function ChipGroup({ 
  chips, 
  selected, 
  onSelect,
  options,
  value,
  onChange,
}: ChipGroupProps) {
  // Normalize props to support both formats
  const items: ChipItem[] = chips || (options?.map(o => ({ ...o })) || []);
  const selectedValue = selected || value || '';
  const handleSelect = onSelect || onChange || (() => {});

  return (
    <View style={styles.group}>
      {items.map((item) => (
        <Chip
          key={item.value}
          label={item.label}
          icon={item.icon}
          selected={selectedValue === item.value}
          onPress={() => handleSelect(item.value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.full,
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
  },
  group: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
