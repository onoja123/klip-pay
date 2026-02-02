import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, radii, spacing } from '@/constants/tokens';
import { Subscription } from '@/types';

interface SubscriptionRowProps {
  subscription: Subscription;
  onPress?: () => void;
}

export function SubscriptionRow({ subscription, onPress }: SubscriptionRowProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (subscription.icon) {
      case 'spotify':
        return 'musical-notes';
      case 'netflix':
        return 'tv';
      case 'youtube':
        return 'play-circle';
      case 'notion':
        return 'document-text';
      case 'figma':
        return 'color-palette';
      default:
        return 'apps';
    }
  };

  const formatNextBilling = (date: string) => {
    const billingDate = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((billingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 7) return `Due in ${diffDays} days`;
    
    return billingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[styles.container, !subscription.active && styles.inactive]}
    >
      <View style={[styles.iconContainer, { backgroundColor: subscription.color }]}>
        <Ionicons name={getIcon()} size={20} color="white" />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{subscription.name}</Text>
        <Text style={styles.nextBilling}>
          {formatNextBilling(subscription.nextBillingDate)}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>
          ${subscription.amount.toFixed(2)}
        </Text>
        <Text style={styles.frequency}>/{subscription.frequency}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
  },
  inactive: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.titleSmall,
    color: colors.text,
  },
  nextBilling: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    ...typography.titleSmall,
    color: colors.text,
  },
  frequency: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
