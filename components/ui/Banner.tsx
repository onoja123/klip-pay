import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context';
import { radii, spacing, fonts } from '@/constants/tokens';
import { BannerVariant } from '@/types';

interface BannerProps {
  variant?: BannerVariant;
  title?: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  action?: React.ReactNode;
}

export function Banner({
  variant = 'info',
  title,
  message,
  icon,
  action,
}: BannerProps) {
  const { colors } = useTheme();
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: colors.successLight,
          iconColor: colors.success,
          textColor: colors.success,
        };
      case 'warning':
        return {
          backgroundColor: colors.warningLight,
          iconColor: colors.warning,
          textColor: colors.warning,
        };
      case 'error':
        return {
          backgroundColor: colors.errorLight,
          iconColor: colors.error,
          textColor: colors.error,
        };
      case 'info':
      default:
        return {
          backgroundColor: colors.infoLight,
          iconColor: colors.info,
          textColor: colors.info,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const defaultIcon = variant === 'success' 
    ? 'checkmark-circle' 
    : variant === 'warning' 
    ? 'warning' 
    : variant === 'error' 
    ? 'close-circle' 
    : 'information-circle';

  return (
    <View style={[styles.container, { backgroundColor: variantStyles.backgroundColor }]}>
      <Ionicons
        name={icon || defaultIcon}
        size={20}
        color={variantStyles.iconColor}
        style={styles.icon}
      />
      <View style={styles.content}>
        {title && (
          <Text style={[styles.title, { color: variantStyles.textColor }]}>
            {title}
          </Text>
        )}
        <Text style={[styles.message, { color: variantStyles.textColor }]}>
          {message}
        </Text>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderRadius: radii.lg,
  },
  icon: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.sansRegular,
  },
});
