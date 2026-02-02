import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context';
import { radii, spacing, fonts } from '@/constants/tokens';
import { Transaction } from '@/types';

interface TransactionRowProps {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionRow({ transaction, onPress }: TransactionRowProps) {
  const { colors } = useTheme();
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (transaction.type) {
      case 'send':
        return 'arrow-up-circle';
      case 'receive':
        return 'arrow-down-circle';
      case 'swap':
        return 'swap-horizontal-outline';
      case 'subscription':
        return 'repeat';
      case 'card_payment':
        return 'card-outline';
      default:
        return 'cash-outline';
    }
  };

  const getIconColor = () => {
    switch (transaction.type) {
      case 'send':
      case 'subscription':
      case 'card_payment':
        return colors.error;
      case 'receive':
        return colors.success;
      case 'swap':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getAmountPrefix = () => {
    switch (transaction.type) {
      case 'send':
      case 'subscription':
      case 'card_payment':
        return '-';
      case 'receive':
        return '+';
      default:
        return '';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatAmount = (amount: number, symbol: string) => {
    return `${getAmountPrefix()}${amount.toLocaleString()} ${symbol}`;
  };

  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${getIconColor()}15` }]}>
        <Ionicons name={getIcon()} size={24} color={getIconColor()} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{transaction.asset}</Text>
        <Text style={styles.subtitle}>
          {formatDate(transaction.timestamp)}
          {transaction.to && ` • To ${transaction.to}`}
          {transaction.from && ` • From ${transaction.from}`}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: getIconColor() }]}>
          {formatAmount(transaction.amount, transaction.assetSymbol)}
        </Text>
        {transaction.status === 'pending' && (
          <Text style={[styles.pending, { color: colors.warning }]}>Pending</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontFamily: fonts.sansSemiBold,
  },
  pending: {
    fontSize: 12,
    fontFamily: fonts.sansRegular,
    marginTop: 2,
  },
});
