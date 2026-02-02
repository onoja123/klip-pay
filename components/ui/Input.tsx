import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/context';
import { radii, spacing, fonts } from '@/constants/tokens';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  prefix,
  suffix,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && { borderColor: colors.error }]}>
        {prefix && <View style={styles.prefix}>{prefix}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textTertiary}
          {...props}
        />
        {suffix && <View style={styles.suffix}>{suffix}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  prefix: {
    marginRight: spacing.sm,
  },
  suffix: {
    marginLeft: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.sansRegular,
    color: colors.text,
    paddingVertical: spacing.lg,
  },
  error: {
    fontSize: 12,
    fontFamily: fonts.sansRegular,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
